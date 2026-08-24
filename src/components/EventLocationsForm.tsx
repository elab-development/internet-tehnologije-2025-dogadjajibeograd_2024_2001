"use client";

import Image from "next/image";
import { FullEventLocationDto } from "@/shared/types";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";


type Props = {
    locations?: FullEventLocationDto[];
};

const locationTypes = [
    { value: "", label: "Sva mesta", icon: "location" },
    { value: "pozoriste", label: "Pozorišta", icon: "theatre" },
    { value: "bioskop", label: "Bioskopi", icon: "cinema" },
    { value: "koncertna_dvorana", label: "Koncertne dvorane", icon: "music" },
    { value: "centar_za_kulturu", label: "Centri za kulturu", icon: "building" },
    { value: "drugo", label: "Drugo", icon: "other" },
];

function LocationIcon({
    type,
    active = false,
}: {
    type: string;
    active?: boolean;
}) {
    const className = `h-5 w-5 shrink-0 ${active ? "text-white" : "text-[#52677D]"
        }`;

    switch (type) {
        case "theatre":
            return (
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={className}
                >
                    <path d="M4 5h7v6c0 4-3.5 6-3.5 6S4 15 4 11V5Z" />
                    <path d="M6 8h1M9 8h1M6.5 12c.7-.6 1.3-.6 2 0" />
                    <path d="M13 7h7v6c0 4-3.5 6-3.5 6S13 17 13 13V7Z" />
                    <path d="M15 10h1M18 10h1M15.5 14c.7.6 1.3.6 2 0" />
                </svg>
            );

        case "cinema":
            return (
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={className}
                >
                    <rect
                        x="3"
                        y="6"
                        width="18"
                        height="13"
                        rx="2"
                    />
                    <path d="M3 10h18M7 6l3 4M13 6l3 4" />
                </svg>
            );

        case "music":
            return (
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={className}
                >
                    <path d="M9 18V5l10-2v13" />
                    <circle cx="6" cy="18" r="3" />
                    <circle cx="16" cy="16" r="3" />
                </svg>
            );

        case "building":
            return (
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={className}
                >
                    <path d="M3 21h18M5 21V9h14v12M4 9l8-5 8 5" />
                    <path d="M9 13v4M15 13v4" />
                </svg>
            );

        case "other":
            return (
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className={className}
                >
                    <circle
                        cx="5"
                        cy="12"
                        r="1.5"
                        fill="currentColor"
                    />
                    <circle
                        cx="12"
                        cy="12"
                        r="1.5"
                        fill="currentColor"
                    />
                    <circle
                        cx="19"
                        cy="12"
                        r="1.5"
                        fill="currentColor"
                    />
                </svg>
            );

        default:
            return (
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={className}
                >
                    <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
                    <circle cx="12" cy="10" r="2.5" />
                </svg>
            );
    }
}

export default function EventLocationsForm({
    locations: locationsProp,
}: Props) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [type, setType] = useState<string>(
        searchParams.get("type") ?? ""
    );

    const [locations, setLocations] = useState<FullEventLocationDto[]>(
        locationsProp ?? []
    );

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const changeType = (newType: string) => {
        setType(newType);

        if (newType) {
            router.push(
                `/eventLocations?type=${encodeURIComponent(newType)}`
            );
        } else {
            router.push("/eventLocations");
        }
    };

    useEffect(() => {
        const fetchLocations = async () => {
            setLoading(true);
            setError(null);

            try {
                const params = new URLSearchParams();

                if (type) {
                    params.set("type", type);
                }

                const url = params.toString()
                    ? `/api/eventLocations?${params.toString()}`
                    : "/api/eventLocations";

                const res = await fetch(url);

                if (!res.ok) {
                    throw new Error("Greška pri učitavanju mesta");
                }

                const data: FullEventLocationDto[] = await res.json();

                setLocations(data);
            } catch (e: unknown) {
                setLocations([]);

                setError(
                    e instanceof Error
                        ? e.message
                        : "Neuspešno učitavanje"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchLocations();
    }, [type]);

    return (
        <main className="min-h-screen bg-[#EDFAF9]">
            <div className="mx-auto max-w-7xl px-6 py-10 sm:px-8 lg:px-10">

                <div className="flex flex-col gap-8 lg:flex-row lg:items-start">

                    {/* Filter */}
                    <aside className="w-full lg:sticky lg:top-24 lg:w-72 lg:shrink-0">
                        <div className="rounded-3xl border border-[#008C95]/10 bg-white p-5 shadow-md">
                            <h2 className="mb-4 text-center text-lg font-bold text-[#163536]">
                                Tip mesta
                            </h2>

                            <div className="flex flex-col gap-2">
                                {locationTypes.map((item) => {
                                    const active = type === item.value;

                                    return (
                                        <button
                                            key={item.value}
                                            onClick={() => changeType(item.value)}
                                            className={`flex w-full items-center gap-4 rounded-2xl border px-6 py-4 text-left text-base font-medium transition-all ${active
                                                ? "border-[#008C95] bg-[#008C95] text-white shadow-sm"
                                                : "border-[#008C95]/20 bg-white text-[#52677D] hover:border-[#008C95]/40 hover:bg-[#F5FCFB]"
                                                }`}
                                        >
                                            <span
                                                className={
                                                    active
                                                        ? "text-white"
                                                        : "text-[#008C95]"
                                                }
                                            >
                                                <LocationIcon type={item.icon} />
                                            </span>

                                            <span>{item.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </aside>

                    {/* Desni deo */}
                    <div className="min-w-0 flex-1">

                        {/* Header */}
                        <section className="mb-8 text-center">
                            <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#163536] sm:text-4xl">
                                Mesta održavanja događaja
                            </h1>

                            <p className="mx-auto mt-3 max-w-2xl text-base leading-7 text-[#52677D]">
                                Pronađi pozorišta, bioskope, koncertne dvorane i druga
                                mesta na kojima se održavaju kulturni događaji.
                            </p>
                        </section>

                        {/* Error */}
                        {error && (
                            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                                {error}
                            </div>
                        )}

                        {/* Loading */}
                        {loading ? (
                            <div className="flex min-h-[300px] items-center justify-center">
                                <div className="text-center">
                                    <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-[#DDF4F2] border-t-[#008C95]" />

                                    <p className="text-sm font-medium text-[#52677D]">
                                        Učitavanje mesta...
                                    </p>
                                </div>
                            </div>
                        ) : locations.length === 0 ? (

                            /* Empty */
                            <div className="rounded-2xl border border-[#008C95]/10 bg-white px-6 py-14 text-center shadow-sm">
                                <h2 className="text-lg font-semibold text-[#163536]">
                                    Nema pronađenih mesta
                                </h2>

                                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#52677D]">
                                    Trenutno nema mesta za izabrani tip.
                                    Izaberi drugi filter da vidiš dostupne lokacije.
                                </p>

                            </div>

                        ) : (

                            /* Cards */
                            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                                {locations.map((location) => (
                                    <Link
                                        key={location.id}
                                        href={`/eventLocations/${location.id}`}
                                        className="group"
                                    >
                                        <article className="h-full overflow-hidden rounded-2xl border border-[#008C95]/10 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#008C95]/25 hover:shadow-md">

                                            {/* Image */}
                                            <div className="relative h-52 w-full overflow-hidden bg-[#DDF4F2]">
                                                {location.imageUrl ? (
                                                    <Image
                                                        src={location.imageUrl}
                                                        alt={location.name}
                                                        fill
                                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                                    />
                                                ) : (
                                                    <div className="flex h-full items-center justify-center text-sm font-medium text-[#008C95]">
                                                        Nema slike
                                                    </div>
                                                )}
                                            </div>

                                            {/* Text */}
                                            <div className="flex min-h-[145px] flex-col p-5">

                                                <h2 className="line-clamp-2 text-lg font-bold text-[#163536] transition-colors group-hover:text-[#006D77]">
                                                    {location.name}
                                                </h2>

                                                <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#52677D]">
                                                    {location.address}
                                                </p>

                                            </div>
                                        </article>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}