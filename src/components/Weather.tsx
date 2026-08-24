"use client";

import { useEffect, useState } from "react";

type WeatherData = {
    main: {
        temp: number;
        feels_like: number;
        humidity: number;
    };

    weather: {
        description: string;
        icon: string;
    }[];
};

export default function Weather() {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const response = await fetch("/api/weather");

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data?.details?.message ||
                        data?.error ||
                        `Greška: ${response.status}`
                    );
                }

                setWeather(data);
            } catch (error) {
                console.error("Weather error:", error);

                setError(
                    error instanceof Error
                        ? error.message
                        : "Vremenska prognoza trenutno nije dostupna."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchWeather();
    }, []);

    if (loading || error || !weather || !weather.weather?.[0]) {
        return null;
    }

    return (
        <div className="flex items-center gap-2 px-3">
            <img
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
                alt={weather.weather[0].description}
                className="h-10 w-10"
            />

            <div className="flex items-center gap-3">
                <p className="text-2xl font-bold text-[#0284C7]">
                    {Math.round(weather.main.temp)}°C
                </p>

                <div className="flex items-center gap-1 text-sm">
                    <span className="text-[#52677D]">
                        Osećaj
                    </span>

                    <span className="font-semibold text-[#0F2942]">
                        {Math.round(weather.main.feels_like)}°C
                    </span>
                </div>

                <div className="flex items-center gap-1 text-sm">
                    <span className="text-[#52677D]">
                        Vlažnost
                    </span>

                    <span className="font-semibold text-[#0F2942]">
                        {weather.main.humidity}%
                    </span>
                </div>
            </div>
        </div>
    );
}