"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FullEventDto } from "@/shared/types";
import { useAuth } from "./AuthProvider";

interface FavoriteEventDto {
    eventId: string;
}

export default function FavoritesPage() {
    const [favoriteEvents, setFavoriteEvents] = useState<FullEventDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const { status } = useAuth();

    const isLogin = status === "admin" || status === "user";

    useEffect(() => {
        if (status === "loading") {
            return;
        }

        if (!isLogin) {
            setLoading(false);
            return;
        }

        const loadFavorites = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch("/api/favorites/user", {
                    method: "GET",
                    credentials: "include",
                    cache: "no-store",
                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(
                        result?.message ||
                            "Greška pri učitavanju omiljenih događaja."
                    );
                }

                const favorites: FavoriteEventDto[] = result.data;

                const events = await Promise.all(
                    favorites.map(async (favorite) => {
                        const eventResponse = await fetch(
                            `/api/events/${favorite.eventId}`,
                            {
                                cache: "no-store",
                            }
                        );

                        const eventData = await eventResponse.json();

                        if (!eventResponse.ok) {
                            throw new Error(
                                eventData?.message ||
                                    "Greška pri učitavanju događaja."
                            );
                        }

                        return eventData as FullEventDto;
                    })
                );

                setFavoriteEvents(events);
            } catch (error) {
                console.error(error);

                setError(
                    error instanceof Error
                        ? error.message
                        : "Greška pri učitavanju omiljenih događaja."
                );
            } finally {
                setLoading(false);
            }
        };

        loadFavorites();
    }, [status, isLogin]);

    if (!isLogin) {
        return (
            <main className="min-h-[calc(100vh-80px)] bg-[#EDFAF9] px-4 py-14 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-2xl">
                    <div className="rounded-3xl border border-[#006D77]/10 bg-white p-8 text-center shadow-[0_16px_45px_rgba(0,109,119,0.08)]">
                        <h1 className="text-2xl font-bold text-[#163536]">
                            Niste prijavljeni
                        </h1>

                        <p className="mt-3 text-sm text-[#607D7E]">
                            Morate biti prijavljeni da biste pristupili svojim
                            omiljenim događajima.
                        </p>

                        <Link
                            href="/login"
                            className="mt-6 inline-flex items-center justify-center rounded-xl bg-[#006D77] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#005A63]"
                        >
                            Prijavi se
                        </Link>
                    </div>
                </div>
            </main>
        );
    }


    return (
        <main className="min-h-screen bg-[#F7FAFB]">
            <section className=" bg-gradient-to-b from-[#F0FAFA] to-[#F7FAFB]">
                <div className="mx-auto max-w-5xl px-5 pb-12 pt-14 sm:px-6 sm:pb-14 sm:pt-16 lg:px-8">
                    <div className="flex items-start gap-5">
                        <div
                            className="
                                flex h-14 w-14 shrink-0
                                items-center justify-center
                                rounded-2xl
                                bg-[#008C95]/10
                                text-[#008C95]
                            "
                        >
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.7"
                                className="h-7 w-7"
                            >
                                <path
                                    d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </div>

                        <div>
                            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#008C95]">
                                Sačuvani događaji
                            </p>

                            <h1 className="text-3xl font-bold tracking-tight text-[#52677D] sm:text-4xl">
                                Omiljeni događaji
                            </h1>

                            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#52677D]/70 sm:text-base">
                                Svi događaji koje ste sačuvali nalaze se na jednom
                                mestu. Kliknite na naziv događaja da biste otvorili
                                detalje.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-5xl px-5 py-10 sm:px-6 sm:py-12 lg:px-8">
                {loading && (
                    <div className="flex items-center gap-3 py-10 text-[#52677D]">
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#008C95]/20 border-t-[#008C95]" />

                        <span className="text-sm font-medium">
                            Učitavanje omiljenih događaja...
                        </span>
                    </div>
                )}

                {!loading && error && (
                    <div className="border-l-4 border-red-400 py-2 pl-4">
                        <p className="font-medium text-red-600">
                            {error}
                        </p>
                    </div>
                )}

                {!loading &&
                    !error &&
                    favoriteEvents.length === 0 && (
                        <div className="py-12 text-center">
                            <div
                                className="
                                    mx-auto mb-5
                                    flex h-14 w-14
                                    items-center justify-center
                                    rounded-2xl
                                    bg-[#008C95]/10
                                    text-[#008C95]
                                "
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.7"
                                    className="h-7 w-7"
                                >
                                    <path
                                        d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </div>

                            <h2 className="text-xl font-semibold text-[#52677D]">
                                Nemate omiljene događaje
                            </h2>

                            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-[#52677D]/65">
                                Dodajte događaje koji vam se dopadaju u omiljene
                                i oni će se pojaviti na ovoj stranici.
                            </p>

                            <Link
                                href="/"
                                className="
                                    mt-6 inline-flex
                                    items-center gap-2
                                    rounded-xl
                                    bg-[#008C95]
                                    px-5 py-2.5
                                    text-sm font-semibold
                                    text-white
                                    shadow-sm
                                    transition-all duration-200
                                    hover:-translate-y-0.5
                                    hover:bg-[#006D77]
                                    hover:shadow-md
                                "
                            >
                                Pogledaj događaje
                            </Link>
                        </div>
                    )}

                {!loading &&
                    !error &&
                    favoriteEvents.length > 0 && (
                        <div>
                            <div className="mb-5 flex items-center justify-between">
                                <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-[#52677D]/65">
                                    Vaša lista
                                </h2>

                                <span className="text-sm text-[#52677D]/55">
                                    {favoriteEvents.length}{" "}
                                    {favoriteEvents.length === 1
                                        ? "događaj"
                                        : "događaja"}
                                </span>
                            </div>

                            <div className="space-y-3">
                                {favoriteEvents.map((event, index) => (
                                    <Link
                                        key={event.id}
                                        href={`/events/${event.id}`}
                                        className="
                                            group
                                            flex w-full
                                            items-center
                                            gap-4
                                            rounded-2xl
                                            border border-[#008C95]/10
                                            bg-[#F0FAFA]
                                            px-5 py-4
                                            transition-all duration-200
                                            hover:-translate-y-0.5
                                            hover:border-[#008C95]/25
                                            hover:bg-[#E6F6F6]
                                            hover:shadow-sm
                                        "
                                    >
                                        <span
                                            className="
                                                flex h-9 w-9 shrink-0
                                                items-center justify-center
                                                rounded-xl
                                                bg-[#008C95]/10
                                                text-sm font-semibold
                                                text-[#008C95]
                                                transition-all duration-200
                                                group-hover:bg-[#008C95]
                                                group-hover:text-white
                                            "
                                        >
                                            {index + 1}
                                        </span>

                                        <span
                                            className="
                                            text-base font-semibold
                                            text-[#52677D]
                                            transition-colors duration-200
                                            group-hover:text-[#008C95]
                                            sm:text-lg
                                        "
                                        >
                                            {event.name}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
            </section>
        </main>
    );
}