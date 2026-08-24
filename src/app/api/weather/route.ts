import { NextResponse } from "next/server";

export async function GET() {
    try {
        const apiKey = process.env.OPENWEATHER_API_KEY;

        console.log(
            "OPENWEATHER_API_KEY postoji:",
            Boolean(apiKey)
        );

        if (!apiKey) {
            return NextResponse.json(
                {
                    error: "OPENWEATHER_API_KEY nije pronađen",
                },
                {
                    status: 500,
                }
            );
        }

        const url =
            `https://api.openweathermap.org/data/2.5/weather` +
            `?q=Belgrade,RS` +
            `&units=metric` +
            `&lang=sr` +
            `&appid=${apiKey}`;

        const response = await fetch(url, {
            cache: "no-store",
        });

        const data = await response.json();

        console.log("OpenWeather status:", response.status);
        console.log("OpenWeather response:", data);

        if (!response.ok) {
            return NextResponse.json(
                {
                    error: "OpenWeather API greška",
                    details: data,
                },
                {
                    status: response.status,
                }
            );
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error("Weather route error:", error);

        return NextResponse.json(
            {
                error: "Greška pri pozivanju OpenWeather API-ja",
            },
            {
                status: 500,
            }
        );
    }
}