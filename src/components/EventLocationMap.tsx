"use client";

import { useEffect, useRef, useState } from "react";
import {
    importLibrary,
    setOptions,
} from "@googlemaps/js-api-loader";

type Props = {
    name: string;
    latitude: number;
    longitude: number;
};

export default function EventLocationMap({
    name,
    latitude,
    longitude,
}: Props) {
    const mapRef = useRef<HTMLDivElement | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const initMap = async () => {
            try {
                if (!mapRef.current) return;

                const apiKey =
                    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

                if (!apiKey) {
                    setError(
                        "Google Maps API ključ nije podešen."
                    );
                    return;
                }

                setOptions({
                    key: apiKey,
                    v: "weekly",
                });

                const mapsLibrary =
                    await importLibrary("maps");

                const markerLibrary =
                    await importLibrary("marker");

                const {
                    Map,
                    Circle,
                    TransitLayer,
                } = mapsLibrary;

                const {
                    AdvancedMarkerElement,
                } = markerLibrary;

                const position = {
                    lat: Number(latitude),
                    lng: Number(longitude),
                };

                console.log("Google Maps lokacija:", position);

                const map = new Map(mapRef.current, {
                    center: position,
                    zoom: 15,
                    mapId: "DEMO_MAP_ID",

                    mapTypeControl: true,
                    streetViewControl: false,
                    fullscreenControl: true,
                    zoomControl: true,
                    gestureHandling: "cooperative",
                });

                new AdvancedMarkerElement({
                    map,
                    position,
                    title: name,
                });

                new Circle({
                    map,
                    center: position,
                    radius: 120,

                    fillColor: "#2EC4B6",
                    fillOpacity: 0.12,

                    strokeColor: "#006D77",
                    strokeOpacity: 0.7,
                    strokeWeight: 2,
                });

                const transitLayer =
                    new TransitLayer();

                transitLayer.setMap(map);

            } catch (err) {
                console.error(
                    "Greška pri učitavanju Google Maps:",
                    err
                );

                setError(
                    "Mapa trenutno ne može da se učita."
                );
            }
        };

        initMap();

    }, [latitude, longitude, name]);

    return (
        <div className="overflow-hidden rounded-2xl border border-[#008C95]/15 bg-white shadow-sm">

            <div className="border-b border-[#008C95]/10 px-6 py-4">

                <h2 className="text-xl font-semibold text-[#163536]">
                    Lokacija na mapi
                </h2>

                <p className="mt-1 text-sm text-[#52677D]">
                    {name}
                </p>

            </div>

            {error ? (
                <div className="flex h-[420px] items-center justify-center bg-[#EDFAF9]">
                    <p className="text-[#52677D]">
                        {error}
                    </p>
                </div>
            ) : (
                <div
                    ref={mapRef}
                    className="h-[420px] w-full"
                />
            )}

        </div>
    );
}