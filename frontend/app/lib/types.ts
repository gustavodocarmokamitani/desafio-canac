export interface CurrentWeather {
    time: string;
    temperature: number;
    windspeed: number;
    winddirection: number;
    is_day: number;
    weathercode: number;
    relative_humidity: number;
    precipitation: number;
    shortwave_radiation: number;
}

export interface CurrentWeatherUnits {
    temperature: string;
    windspeed: string;
    winddirection: string;
    is_day: string;
    weathercode: string;
    relative_humidity: string;
    precipitation: string;
    shortwave_radiation: string; 
}

export interface WeatherData {
    latitude: number;
    longitude: number;
    generationtime_ms: number;
    utc_offset_seconds: number;
    timezone: string;
    elevation: number;
    current_weather_units: CurrentWeatherUnits;
    current_weather: CurrentWeather; 
}

export interface WeatherResponse {
    city_name: string;
    latitude: number;
    longitude: number;
    weather: WeatherData;
}