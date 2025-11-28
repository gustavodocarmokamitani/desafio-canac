"use client";

import React from "react";
import type { WeatherResponse } from "../lib/types";
 
interface WeatherCardProps {
  data: WeatherResponse | null;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ data }) => { 
  if (!data || !data.weather) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-8 font-sans">
        <div className="p-8 bg-gray-100 border-l-4 border-gray-400 rounded-lg shadow-md">
          <h3 className="text-xl font-bold text-gray-800">
            Carregando Dados Climáticos...
          </h3>
          <p className="text-gray-600 mt-2">
            Aguardando dados da cidade. Se esta mensagem persistir, verifique o
            carregamento de dados no componente pai.
          </p>
        </div>
      </div>
    );
  }

  const { city_name, weather } = data;
  const currentWeather = weather.current_weather;
  const units = weather.current_weather_units;
 
  const getWeatherDescription = (code: number): string => {
    const weatherCodes: Record<number, string> = {
      0: "Céu limpo",
      1: "Principalmente céu limpo",
      2: "Parcialmente nublado",
      3: "Nublado",
      45: "Nebuloso",
      48: "Nebuloso com depósito de gelo",
      51: "Chuvisco leve",
      53: "Chuvisco moderado",
      55: "Chuvisco intenso",
      61: "Chuva fraca",
      63: "Chuva moderada",
      65: "Chuva intensa",
      71: "Neve fraca",
      73: "Neve moderada",
      75: "Neve intensa",
      77: "Grãos de neve",
      80: "Aguaceiros fracos",
      81: "Aguaceiros moderados",
      82: "Aguaceiros intensos",
      85: "Chuva com neve fraca",
      86: "Chuva com neve intensa",
      95: "Tempestade",
      96: "Tempestade com granizo fraco",
      99: "Tempestade com granizo intenso",
    };
    return weatherCodes[code] || "Desconhecido";
  };
 
  const formatTime = (isoTime: string): string => {
    const date = new Date(isoTime);
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 font-sans"> 
      <div className="mb-8 p-4 bg-white rounded-xl shadow-lg">
        <h2 className="text-4xl font-bold text-gray-900 mb-2">{city_name}</h2>
        <p className="text-gray-600 flex items-center gap-4 flex-wrap">
          Condições atuais para monitoramento do canavial 
          <span
            className={`px-3 py-1 text-xs font-semibold rounded-full shadow-inner ${
              currentWeather.is_day === 1
                ? "bg-yellow-200 text-yellow-800"
                : "bg-indigo-200 text-indigo-800"
            }`}
          >
            {currentWeather.is_day === 1 ? "☀️ Dia" : "🌙 Noite"}
          </span> 
          <span className="text-sm text-gray-500">
            Atualizado às:{" "}
            <span className="font-medium text-gray-700">
              {formatTime(currentWeather.time)}
            </span>{" "}
            ({weather.timezone.split("/")[1].replace("_", " ")})
          </span>
        </p>
      </div>
 
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6 mb-8"> 
        <div className="bg-orange-50 rounded-lg p-6 border-l-4 border-orange-400 shadow-md hover:shadow-xl transition duration-300">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">🌡️</span>
            <h3 className="text-lg font-semibold text-gray-700">Temperatura</h3>
          </div>
          <div className="text-4xl font-bold text-gray-900 mb-2">
            {currentWeather.temperature}
            <span className="text-xl">{units.temperature}</span>
          </div>
          <p className="text-sm text-gray-600">
            Ideal: 20-32°C para crescimento.
          </p>
        </div>
 
        <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-400 shadow-md hover:shadow-xl transition duration-300">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">💧</span>
            <h3 className="text-lg font-semibold text-gray-700">
              Umidade Relativa
            </h3>
          </div> 
          <div className="text-4xl font-bold text-gray-900 mb-2">
            {currentWeather.relative_humidity}
            <span className="text-xl">{units.relative_humidity}</span>
          </div>
          <p className="text-sm text-gray-600">
            Ideal: 60-80% para desenvolvimento.
          </p>
        </div>
 
        <div className="bg-gray-100 rounded-lg p-6 border-l-4 border-gray-600 shadow-md hover:shadow-xl transition duration-300">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">💨</span>
            <h3 className="text-lg font-semibold text-gray-700">
              Velocidade do Vento
            </h3>
          </div>
          <div className="text-4xl font-bold text-gray-900 mb-2">
            {currentWeather.windspeed}
            <span className="text-xl">{units.windspeed}</span>
          </div>
          <p className="text-sm text-gray-600">
            Monitorar ventos fortes ({">"} 30 km/h).
          </p>
        </div>
 
        <div className="bg-green-50 rounded-lg p-6 border-l-4 border-green-400 shadow-md hover:shadow-xl transition duration-300">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">🌧️</span>
            <h3 className="text-lg font-semibold text-gray-700">
              Precipitação Atual
            </h3>
          </div> 
          <div className="text-4xl font-bold text-gray-900 mb-2">
            {currentWeather.precipitation}
            <span className="text-xl">{units.precipitation}</span>
          </div>
          <p className="text-sm text-gray-600">Valor diário (acumulado).</p>
        </div>
 
        <div className="bg-yellow-50 rounded-lg p-6 border-l-4 border-yellow-400 shadow-md hover:shadow-xl transition duration-300">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">🔆</span>
            <h3 className="text-lg font-semibold text-gray-700">
              Radiação Solar
            </h3>
          </div>
          <div className="text-4xl font-bold text-gray-900 mb-2">
            {currentWeather.shortwave_radiation}
            <span className="text-xl">{units.shortwave_radiation}</span>
          </div>
          <p className="text-sm text-gray-600">Crucial para a fotossíntese.</p>
        </div>
 
        <div className="bg-indigo-50 rounded-lg p-6 border-l-4 border-indigo-400 shadow-md hover:shadow-xl transition duration-300">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">☁️</span>
            <h3 className="text-lg font-semibold text-gray-700">
              Condição do Tempo
            </h3>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {getWeatherDescription(currentWeather.weathercode)}
          </div>
          <div className="mt-4 space-y-1">
            <p className="text-sm text-gray-600">
              Direção do vento:{" "}
              <span className="font-semibold text-gray-900">
                {currentWeather.winddirection}°
              </span>
            </p>
            <p className="text-sm text-gray-600">
              Elevação:{" "}
              <span className="font-semibold text-gray-900">
                {weather.elevation}m
              </span>
            </p>
          </div>
        </div>
      </div>
 
      <div className="bg-white rounded-lg p-6 border-l-4 border-lime-500 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl text-lime-600">🌿</span>
          <h3 className="text-lg font-bold text-gray-900">
            Dicas Agrometeorológicas para o Canavial
          </h3>
        </div>
        <ul className="space-y-2 text-gray-700">
          <li className="flex gap-2">
            <span className="text-lime-600 font-bold">»</span>
            <span>
              Temperatura ({currentWeather.temperature}
              {units.temperature}): Cana-de-açúcar prospera entre 20°C e 32°C. A
              temperatura atual está ideal para o crescimento vegetativo.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-lime-600 font-bold">»</span>
            <span>
              Radiação Solar ({currentWeather.shortwave_radiation}
              {units.shortwave_radiation}): Alta radiação é excelente, pois a
              cana-de-açúcar é uma planta C4, altamente eficiente em luz
              intensa.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-lime-600 font-bold">»</span>
            <span>
              Umidade ({currentWeather.relative_humidity}
              {units.relative_humidity}): Se a umidade estiver baixa (abaixo de
              50%), monitore a necessidade de irrigação para evitar estresse
              hídrico.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-lime-600 font-bold">»</span>
            <span>
              Precipitação ({currentWeather.precipitation}
              {units.precipitation}): Cana exige bastante água
              (1500-2000mm/ano). Se o valor estiver baixo por vários dias,
              planeje a irrigação.
            </span>
          </li>
        </ul>
      </div>
 
      <div className="mt-6 text-right text-xs text-gray-500">
        <p>
          Localização: Latitude {data.latitude.toFixed(4)}°N, Longitude{" "}
          {data.longitude.toFixed(4)}°E
        </p>
      </div>
    </div>
  );
};

export default WeatherCard;
