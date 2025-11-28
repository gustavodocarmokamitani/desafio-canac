import httpx
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, Any
from datetime import datetime 

app = FastAPI(title="Weather Wrapper API")

origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://127.0.0.1:8000" 
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Função assíncrona para buscar as coordenadas geográficas (latitude e longitude) de uma cidade
async def get_geocode(city_name: str) -> Dict[str, Any]:
    GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search"
    
    params = {
        "name": city_name,
        "count": 1,
        "language": "pt",
        "format": "json"
    }

    async with httpx.AsyncClient() as client:
        response = await client.get(GEOCODING_URL, params=params, timeout=10)
        
    # Verifica falhas na conexão com a API
    if response.status_code != 200: 
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Falha ao buscar coordenadas da cidade."
        )
    
    data = response.json()
    
    # Verifica se a cidade foi encontrada na resposta
    if not data.get("results"): 
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Cidade '{city_name}' não encontrada."
        )

    # Extrai latitude, longitude e nome da cidade
    city_info = data["results"][0]
    return {
        "latitude": city_info["latitude"],
        "longitude": city_info["longitude"],
        "name": city_info["name"]
    }


# Função assíncrona para buscar os dados de clima usando latitude e longitude
async def get_weather_data(latitude: float, longitude: float) -> Dict[str, Any]: 
    WEATHER_URL = "https://api.open-meteo.com/v1/forecast" 
    
    params = {
        "latitude": latitude,
        "longitude": longitude,
        "current_weather": "true", 
        "hourly": ",".join([
            "relativehumidity_2m",
            "precipitation",
            "shortwave_radiation",
            "precipitation_probability",
            "windgusts_10m",
        ]),
        "temperature_unit": "celsius",
        "windspeed_unit": "kmh",
        "timezone": "auto",
    }

    async with httpx.AsyncClient() as client:
        response = await client.get(WEATHER_URL, params=params, timeout=10)

    # Verifica falhas na conexão com a API
    if response.status_code != 200:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Falha ao consultar a API de clima Open-Meteo. Erro: {response.text}"
        )

    return response.json()


# Endpoint principal para buscar o clima de uma cidade
@app.get("/weather/{city_name}", response_model=Dict[str, Any])
async def get_city_weather(city_name: str) -> Dict[str, Any]: 
    print(f"Buscando clima para: {city_name}")
      
    # 1. Busca coordenadas
    geo_data = await get_geocode(city_name)
    lat = geo_data["latitude"]
    lon = geo_data["longitude"]
        
    # 2. Busca dados de clima
    weather_data = await get_weather_data(lat, lon)
 
    current = weather_data.get("current_weather", {})
    hourly = weather_data.get("hourly", {})
    hourly_units = weather_data.get("hourly_units", {})

    # Validação básica
    if not current:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Não foi possível extrair dados atuais do clima."
        )
  
    # Função auxiliar: Encontra o índice na lista de tempos horários (hourly.time)
    # que corresponde ao valor de tempo mais próximo do 'current_weather'.
    def find_nearest_index(times_list, target_iso):
        if not times_list:
            return -1
        try: 
            # Tenta encontrar correspondência exata
            return times_list.index(target_iso)
        except ValueError:

            # Se não houver correspondência exata, busca o índice com a hora mais próxima
            try:
                target = datetime.fromisoformat(target_iso)
            except Exception:
                return -1

            best_idx = -1
            best_diff = None
            for i, t in enumerate(times_list):
                try:
                    dt = datetime.fromisoformat(t)
                except Exception:
                    continue
                diff = abs((dt - target).total_seconds())
                if best_diff is None or diff < best_diff:
                    best_diff = diff
                    best_idx = i
            return best_idx

    times = hourly.get("time", [])
    # Encontra o índice da hora atual nos horários
    idx = find_nearest_index(times, current.get("time"))

    # Função auxiliar para pegar o horário correspondente ao índice
    def hourly_get(name):
        arr = hourly.get(name, [])
        if idx is not None and idx >= 0 and idx < len(arr):
            return arr[idx]
        return None
 
    # Mapeia os valores atuais do clima, incluindo dados horários (extraídos por idx)
    current_weather_mapped = {
        "time": current.get("time"),
        "interval": 900,
        "temperature": current.get("temperature"),
        "windspeed": current.get("windspeed"),
        "winddirection": current.get("winddirection"),
        "is_day": current.get("is_day"),
        "weathercode": current.get("weathercode"),
        "relative_humidity": hourly_get("relativehumidity_2m"),
        "precipitation": hourly_get("precipitation"),
        "shortwave_radiation": hourly_get("shortwave_radiation"),
    }
 
    # Mapeia as unidades de medida, usando as unidades horárias fornecidas pela API ou padrões
    current_weather_units_mapped = {
        "time": "iso8601",
        "interval": "seconds",
        "temperature": "°C",
        "windspeed": "km/h",
        "winddirection": "°",
        "is_day": "",
        "weathercode": "wmo code",
        "relative_humidity": hourly_units.get("relativehumidity_2m") or "%",
        "precipitation": hourly_units.get("precipitation") or "mm",
        "shortwave_radiation": hourly_units.get("shortwave_radiation") or "W/m²",
    }

    # 3. Retorna a resposta final no formato esperado pelo Frontend
    return {
        "city_name": geo_data["name"],
        "latitude": lat,
        "longitude": lon,
        "weather": {
            "latitude": weather_data.get("latitude"),
            "longitude": weather_data.get("longitude"),
            "generationtime_ms": weather_data.get("generationtime_ms"),
            "utc_offset_seconds": weather_data.get("utc_offset_seconds"),
            "timezone": weather_data.get("timezone"),
            "elevation": weather_data.get("elevation"),
            "current_weather_units": current_weather_units_mapped,
            "current_weather": current_weather_mapped,
        },
    }

# Endpoint simples para checagem de saúde 
@app.get("/")
def health_check():
    return {"status": "ok", "message": "Weather API Wrapper is running."}