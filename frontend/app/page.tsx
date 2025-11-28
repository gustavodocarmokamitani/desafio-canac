"use client";

import React, { useState } from "react";
import SearchForm from "@/app/components/SearchForm";
import WeatherCard from "@/app/components/WeatherCard";
import { WeatherResponse } from "@/app/lib/types";
import { fetchWeather } from "@/app/lib/api";
import LeafIcon from "./components/ui/LeafIcon";

export default function Home() {
  const [weatherResult, setWeatherResult] = useState<WeatherResponse | null>(
    null
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (city: string) => {
    setError(null);
    setLoading(true);
    setWeatherResult(null);
    try {
      const data = await fetchWeather(city);
      setWeatherResult(data);
    } catch (err: any) {
      setError(err.message || "Erro ao buscar dados do clima.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-gray-50 min-h-screen pb-16">
      <header className="bg-white mb-10 py-4 px-8 border-b shadow-sm">
        <div className="container mx-auto flex items-center space-x-3">
          <div>
            <LeafIcon width={35} height={35} className="mt-1 text-green-600" />
          </div>

          <div className="flex flex-col">
            <h1 className="text-2xl font-medium text-gray-800">
              Monitoramento Climático
            </h1>
            <p className="text-gray-500 text-md font-light">
              Sistema de acompanhamento para canaviais
            </p>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 md:px-8">
        <SearchForm onSearch={handleSearch} disabled={loading} />

        {error && (
          <div className="max-w-2xl mx-auto mb-6 p-4 bg-red-50 border border-red-300 rounded-lg text-red-700 text-center">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center gap-4 p-4">
            <div
              className="mt-10 w-16 h-16 border-4 border-t-4 border-gray-200 rounded-full animate-spin"
              style={{ borderTopColor: "#16a34a" }}
              aria-hidden
            />
            <p className="text-gray-700 font-medium">
              Buscando dados climático...
            </p>
          </div>
        ) : weatherResult ? (
          <WeatherCard data={weatherResult} />
        ) : (
          <div className="flex flex-col items-center gap-4 p-4 ">
            <LeafIcon
              width={65}
              height={65}
              className="mt-8 text-green-300 flex-shrink-0"
            />

            <div className="flex flex-col text-center">
              <p className="font-medium text-lg text-gray-800">
                Bem-vindo ao Sistema de Monitoramento Climático
              </p>

              <p className="text-sm text-gray-600 mt-2">
                Digite o nome de uma cidade para visualizar as condições
                climáticas relevantes para o cultivo de cana-de-açúcar.
              </p>
            </div>
          </div>
        )}
      </div>

      <footer className="fixed bottom-0 w-full shadow-lg">
        <div className="bg-white border-t py-2 px-8 text-center text-sm text-gray-600">
          <div className="container mx-auto">
            <p className="font-light">
              &copy; {new Date().getFullYear()} Sistema de Monitoramento
            </p>
            <p className="text-xs mt-1">
              Desenvolvido para Produtores de Cana-de-Açúcar
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
