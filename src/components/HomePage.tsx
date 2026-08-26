"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    FullEventDto,
    FullEventTypeDto,
} from "@/shared/types";
import {
    RiMusic2Line,
    RiMovie2Line,
    RiStarLine,
    RiTicket2Line,
    RiImageLine,
    RiBookOpenLine,
    RiToolsLine,
} from "@remixicon/react";

type Props = {
    initialEvents: FullEventDto[];
};

export default function HomePage({
    initialEvents,
}: Props) {
    const [events] = useState<FullEventDto[]>(initialEvents);

    const [eventTypes, setEventTypes] = useState<
        FullEventTypeDto[]
    >([]);

    const [loading, setLoading] = useState(false);

    const [search, setSearch] = useState("");

    const [eventTypeId, setEventTypeId] = useState<
        string | null
    >(null);

    const eventTypeIcons: Record<
        string,
        React.ComponentType<{ className?: string }>
    > = {
        predstava: RiTicket2Line,
        opera: RiMusic2Line,
        balet: RiStarLine,
        mjuzikl: RiMovie2Line,
        koncert: RiMusic2Line,
        radionica: RiToolsLine,
        "izložba": RiImageLine,
        film: RiTicket2Line,
        "književni događaj": RiBookOpenLine,
    };


    useEffect(() => {
        const loadEventTypes = async () => {
            try {
                setLoading(true);

                const res = await fetch("/api/eventTypes");

                if (!res.ok) {
                    throw new Error(
                        "Greška pri učitavanju tipova događaja"
                    );
                }

                const data = await res.json();

                setEventTypes(data);

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

            } catch (error) {
                console.error(
                    "Event types error:",
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        loadEventTypes();
    }, []);

    const filteredEvents = events.filter((event) => {
        const matchesSearch = event.name
            .toLowerCase()
            .includes(search.toLowerCase());

        const matchesType =
            eventTypeId === null ||
            event.eventType.id === eventTypeId;

        
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const eventDate = new Date(`${event.eventDate}T00:00:00`);

        const isUpcoming = eventDate >= today;

        return matchesSearch && matchesType && isUpcoming;
    });

    return (
        <main className="min-h-screen bg-[#EDFAF9]">
            <div className="mx-auto max-w-7xl px-6 py-10 sm:px-8 lg:px-10">

                <div className="flex flex-col gap-8 lg:flex-row lg:items-start">

                    {/* Filter */}
                    <aside className="w-full lg:sticky lg:top-24 lg:w-72 lg:shrink-0">
                        <div className="rounded-3xl border border-[#008C95]/10 bg-white p-5 shadow-md">

                            <h2 className="mb-6 text-center text-2xl font-bold text-[#163536]">
                                Tip događaja
                            </h2>

                            <div className="flex flex-col gap-3">

                                {/* All evants */}
                                <button
                                    type="button"
                                    onClick={() => setEventTypeId(null)}
                                    className={`flex w-full items-center gap-4 rounded-2xl border px-5 py-4 text-left text-base font-medium transition-all ${eventTypeId === null
                                        ? "border-[#008C95] bg-[#008C95] text-white shadow-sm"
                                        : "border-[#008C95]/15 bg-white text-[#52677D] hover:border-[#008C95]/40 hover:bg-[#F5FCFB] hover:text-[#008C95]"
                                        }`}
                                >
                                    <span className="h-3 w-3 shrink-0 rounded-full bg-current" />

                                    <span>Svi događaji</span>
                                </button>

                                {/* Type events */}
                                {eventTypes.map((eventType) => {
                                    const active = eventTypeId === eventType.id;

                                    const Icon =
                                        eventTypeIcons[eventType.name.toLowerCase()] ??
                                        RiTicket2Line;

                                    return (
                                        <button
                                            key={eventType.id}
                                            type="button"
                                            onClick={() => setEventTypeId(eventType.id)}
                                            className={`flex w-full items-center gap-4 rounded-2xl border px-5 py-4 text-left text-base font-medium transition-all ${active
                                                ? "border-[#008C95] bg-[#008C95] text-white shadow-sm"
                                                : "border-[#008C95]/15 bg-white text-[#52677D] hover:border-[#008C95]/40 hover:bg-[#F5FCFB] hover:text-[#008C95]"
                                                }`}
                                        >
                                            {eventType.name.toLowerCase() === "drugo" ? (
                                                <span className="flex h-6 w-6 shrink-0 items-center justify-center text-lg font-bold tracking-widest">
                                                    •••
                                                </span>
                                            ) : (
                                                <Icon className="h-6 w-6 shrink-0" />
                                            )}

                                            <span>{eventType.name}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </aside>

                    {/* Sidebar */}
                    <div className="min-w-0 flex-1">

                        {/* Header */}
                        <section className="mb-10 text-center">
                            <div className="mx-auto " />

                            <h1 className="text-3xl font-bold tracking-tight text-[#006D77] sm:text-4xl lg:text-5xl">
                                Događaji u Beogradu
                            </h1>

                            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[#52677D]">
                                Pronađi predstave, opere, balete i mjuzikle koji se
                                održavaju u Beogradu.
                            </p>
                        </section>

                        {/* SEARCH */}
                        <div className="mb-8">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                                placeholder="Pretraži događaje..."
                                className="
                                    w-full rounded-xl
                                    border border-[#008C95]/20
                                    bg-white px-4 py-3
                                    text-sm text-[#163536]
                                    outline-none transition
                                    placeholder:text-[#52677D]/60
                                    focus:border-[#008C95]
                                    focus:ring-2
                                    focus:ring-[#008C95]/10
                                "
                            />
                        </div>

                        {/* Lading */}
                        {loading && !eventTypes.length ? (
                            <div className="flex min-h-[300px] items-center justify-center">
                                <div className="text-center">

                                    <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-[#DDF4F2] border-t-[#008C95]" />

                                    <p className="text-sm font-medium text-[#52677D]">
                                        Učitavanje događaja...
                                    </p>
                                </div>
                            </div>
                        ) : filteredEvents.length === 0 ? (

                            /* EMPTY */
                            <div className="rounded-2xl border border-[#008C95]/10 bg-white px-6 py-14 text-center shadow-sm">

                                <h2 className="text-lg font-semibold text-[#163536]">
                                    Nema pronađenih događaja
                                </h2>

                                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#52677D]">
                                    Promeni pretragu ili izaberi drugi
                                    tip događaja.
                                </p>
                            </div>
                        ) : (

                            /* Events */
                            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">

                                {filteredEvents.map((event) => (
                                    <Link
                                        key={event.id}
                                        href={`/events/${event.id}`}
                                        className="group"
                                    >
                                        <article className="
                                            flex h-full flex-col
                                            rounded-2xl
                                            border border-[#008C95]/10
                                            bg-white p-5 shadow-sm
                                            transition duration-300
                                            hover:-translate-y-1
                                            hover:border-[#008C95]/25
                                            hover:shadow-md
                                        ">

                                            {/* Name */}
                                            <h2 className="mt-4 line-clamp-2 text-lg font-bold text-[#163536] transition-colors group-hover:text-[#006D77]">
                                                {event.name}
                                            </h2>

                                            {/* Descritpion */}
                                            <p className="mt-2 line-clamp-3 text-sm leading-6 text-[#52677D]">
                                                {event.description}
                                            </p>

                                            {/* Location*/}
                                            <p className="mt-4 text-sm font-medium text-[#52677D]">
                                                {event.location.name}
                                            </p>

                                            {/* Date / Time */}
                                            <div className="mt-auto pt-6">
                                                <div className="border-t border-[#008C95]/10 pt-4">

                                                    <div className="flex items-center justify-between gap-3">

                                                        <div className="flex items-center gap-2 text-sm text-[#52677D]">

                                                            <svg
                                                                viewBox="0 0 24 24"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                strokeWidth="1.8"
                                                                className="h-4 w-4 text-[#008C95]"
                                                            >
                                                                <rect
                                                                    x="3"
                                                                    y="5"
                                                                    width="18"
                                                                    height="16"
                                                                    rx="2"
                                                                />

                                                                <path d="M8 3v4M16 3v4M3 10h18" />
                                                            </svg>

                                                            <span>
                                                                {event.eventDate}
                                                            </span>
                                                        </div>

                                                        <div className="flex items-center gap-2 text-sm font-semibold text-[#163536]">

                                                            <svg
                                                                viewBox="0 0 24 24"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                strokeWidth="1.8"
                                                                className="h-4 w-4 text-[#008C95]"
                                                            >
                                                                <circle
                                                                    cx="12"
                                                                    cy="12"
                                                                    r="9"
                                                                />

                                                                <path d="M12 7v5l3 2" />
                                                            </svg>

                                                            <span>
                                                                {event.eventTime}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
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