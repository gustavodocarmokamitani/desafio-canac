import { WeatherResponse } from './types';
 
const API_BASE_URL = 'http://localhost:8000';

export async function fetchWeather(city: string): Promise<WeatherResponse> {
    const encodedCity = encodeURIComponent(city.trim());
    const url = `${API_BASE_URL}/weather/${encodedCity}`;
    
    const response = await fetch(url);

    if (!response.ok) { 
        const errorData = await response.json();
        throw new Error(errorData.detail || `Erro ao buscar clima: ${response.statusText}`);
    }

    const data: WeatherResponse = await response.json();
    return data;
}