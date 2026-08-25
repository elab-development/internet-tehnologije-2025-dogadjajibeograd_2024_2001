"use client";

import { useEffect, useMemo, useState } from "react";
import { UpcomingEventDto } from "@/shared/types";
import { RiCalendarLine } from "@remixicon/react";

export default function UpcomingEventsForm() {
    const [events, setEvents] = useState<UpcomingEventDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [searchName, setSearchName] = useState("");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");


    useEffect(() => {
        const loadEvents = async () => {
            try {
                setLoading(true);
                setError("");

                await Promise.all([
                    fetch("/api/scrape/savaCentar", {
                        method: "POST",
                        cache: "no-store",
                    }),
                    fetch("/api/scrape/mtsDvorana", {
                        method: "POST",
                        cache: "no-store",
                    }),
                    fetch("/api/scrape/domOmladine", {
                        method: "POST",
                        cache: "no-store",
                    }),
                ]);

                const response = await fetch("/api/upcomingEvents", {
                    cache: "no-store",
                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(
                        result?.message ||
                        "Greška pri učitavanju događaja."
                    );
                }

                setEvents(result.data);
            } catch (error) {
                setError(
                    error instanceof Error
                        ? error.message
                        : "Došlo je do greške."
                );
            } finally {
                setLoading(false);
            }
        };

        loadEvents();
    }, []);

    const filteredEvents = useMemo(() => {
        return events.filter((event) => {
            const matchesName = event.name
                .toLowerCase()
                .includes(searchName.trim().toLowerCase());

            const matchesDateFrom =
                !dateFrom || event.eventDate >= dateFrom;

            const matchesDateTo =
                !dateTo || event.eventDate <= dateTo;

            return matchesName && matchesDateFrom && matchesDateTo;
        });
    }, [events, searchName, dateFrom, dateTo]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#EAF7F7]">
                <div className="flex min-h-[60vh] items-center justify-center">
                    <p className="text-[#52677D]">
                        Učitavanje događaja...
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#EAF7F7]">
                <div className="flex min-h-[60vh] items-center justify-center">
                    <p className="text-red-500">
                        {error}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[#EAF7F7] px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">

                {/* Header */}
                <div className="mb-10 text-center">
                    <h1 className="text-4xl font-bold text-[#07828D] md:text-5xl">
                        Predstojeći događaji
                    </h1>

                    <p className="mt-4 text-lg text-[#52677D]">
                        Pogledajte događaje koji uskoro počinju u Beogradu.
                    </p>
                </div>

                {/* Filter */}
                <div className="mb-10 rounded-2xl border border-[#D8EEF1] bg-white p-6 shadow-sm">

                    {/* Filter by name */}
                    <div className="mb-5">
                        <label
                            htmlFor="searchName"
                            className="mb-2 block font-medium text-[#17324D]"
                        >
                            Naziv događaja
                        </label>

                        <input
                            id="searchName"
                            type="text"
                            value={searchName}
                            onChange={(e) => setSearchName(e.target.value)}
                            placeholder="Pretraži događaje..."
                            className="
                                    w-full
                                    rounded-xl
                                    border
                                    border-[#D8EEF1]
                                    bg-white
                                    px-4
                                    py-3
                                    text-[#52677D]
                                    outline-none
                                    transition
                                    placeholder:text-[#52677D]/50
                                    focus:border-[#0A99A8]
                                    focus:ring-2
                                    focus:ring-[#0A99A8]/10
                                "
                        />
                    </div>

                    {/* Filter by data */}
                    <div className="flex flex-col gap-5 md:flex-row md:items-end">
                        <div className="flex-1">
                            <label
                                htmlFor="dateFrom"
                                className="mb-2 block font-medium text-[#17324D]"
                            >
                                Od datuma
                            </label>

                            <input
                                id="dateFrom"
                                type="date"
                                value={dateFrom}
                                onChange={(e) => setDateFrom(e.target.value)}
                                className="
                                        w-full
                                        rounded-xl
                                        border
                                        border-[#D8EEF1]
                                        bg-white
                                        px-4
                                        py-3
                                        text-[#52677D]
                                        outline-none
                                        transition
                                        focus:border-[#0A99A8]
                                        focus:ring-2
                                        focus:ring-[#0A99A8]/10
                                    "
                            />
                        </div>

                        <div className="flex-1">
                            <label
                                htmlFor="dateTo"
                                className="mb-2 block font-medium text-[#17324D]"
                            >
                                Do datuma
                            </label>

                            <input
                                id="dateTo"
                                type="date"
                                value={dateTo}
                                min={dateFrom || undefined}
                                onChange={(e) => setDateTo(e.target.value)}
                                className="
                                        w-full
                                        rounded-xl
                                        border
                                        border-[#D8EEF1]
                                        bg-white
                                        px-4
                                        py-3
                                        text-[#52677D]
                                        outline-none
                                        transition
                                        focus:border-[#0A99A8]
                                        focus:ring-2
                                        focus:ring-[#0A99A8]/10
                                    "
                            />
                        </div>

                        <button
                            type="button"
                            onClick={() => {
                                setSearchName("");
                                setDateFrom("");
                                setDateTo("");
                            }}
                            disabled={!searchName && !dateFrom && !dateTo}
                            className="
                                rounded-xl
                                bg-[#0A99A8]
                                px-6
                                py-3
                                font-medium
                                text-white
                                transition
                                hover:bg-[#07828D]
                                disabled:cursor-not-allowed
                                disabled:opacity-40
                            "
                        >
                            Obriši filtere
                        </button>
                    </div>
                </div>

                {/*Card */}
                {filteredEvents.length === 0 ? (
                    <div className="rounded-2xl border border-[#D8EEF1] bg-white py-16 text-center shadow-sm">
                        <h2 className="text-xl font-semibold text-[#17324D]">
                            Nema pronađenih događaja
                        </h2>

                        <p className="mt-2 text-[#52677D]">
                            Promenite izabrani period.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredEvents.map((event) => (
                            <article
                                key={event.id}
                                className="
                                    flex
                                    min-h-[210px]
                                    flex-col
                                    rounded-2xl
                                    border
                                    border-[#D8EEF1]
                                    bg-white
                                    p-6
                                    shadow-sm
                                    transition
                                    duration-200
                                    hover:-translate-y-1
                                    hover:shadow-md
                                "
                            >
                                <h2 className="text-xl font-bold text-[#17324D]">
                                    {event.name}
                                </h2>

                                <div className="mt-5">
                                    <p className="text-sm text-[#52677D]">
                                        Mesto održavanja
                                    </p>

                                    <p className="mt-1 font-medium text-[#52677D]">
                                        {event.locationName}
                                    </p>
                                </div>

                                <div className="mt-auto border-t border-[#D8EEF1] pt-4">
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg text-[#0A99A8]">
                                            <RiCalendarLine
                                                size={20}
                                                className="text-[#0A99A8]"
                                            />
                                        </span>

                                        <span className="font-medium text-[#52677D]">
                                            {new Date(
                                                `${event.eventDate}T00:00:00`
                                            ).toLocaleDateString("sr-RS", {
                                                day: "2-digit",
                                                month: "2-digit",
                                                year: "numeric",
                                            })}
                                        </span>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}