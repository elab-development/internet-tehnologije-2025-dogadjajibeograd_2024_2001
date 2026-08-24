"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "./AuthProvider";

interface FullEventDto {
    id: string;
    name: string;
    description: string;
    eventDate: string;
    eventTime: string;
    createdAt: string;

    eventType: {
        id: string;
        name: string;
    };

    location: {
        id: string;
        name: string;
        type:
        | "pozoriste"
        | "bioskop"
        | "koncertna_dvorana"
        | "centar_za_kulturu"
        | "drugo";
        address: string;
        latitude: number;
        longitude: number;
        imageUrl: string | null;
        createdAt: string;
    };
}

function formatDate(date: string) {
    return new Intl.DateTimeFormat("sr-RS", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    }).format(new Date(`${date}T00:00:00`));
}

function formatTime(time: string) {
    return time.slice(0, 5);
}

function formatLocationType(type: FullEventDto["location"]["type"]) {
    switch (type) {
        case "pozoriste":
            return "Pozorište";
        case "bioskop":
            return "Bioskop";
        case "koncertna_dvorana":
            return "Koncertna dvorana";
        case "centar_za_kulturu":
            return "Centar za kulturu";
        default:
            return "Drugo";
    }
}

function CalendarIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-5 w-5"
        >
            <rect x="3" y="5" width="18" height="16" rx="2" />
            <path d="M8 3v4M16 3v4M3 10h18" />
        </svg>
    );
}

function ClockIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-5 w-5"
        >
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 2" />
        </svg>
    );
}

function LocationIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-5 w-5"
        >
            <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
            <circle cx="12" cy="10" r="2.5" />
        </svg>
    );
}

function HeartIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-5 w-5"
        >
            <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" />
        </svg>
    );
}

function TrashIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-5 w-5"
        >
            <path d="M3 6h18" />
            <path d="M8 6V4h8v2" />
            <path d="M19 6l-1 14H6L5 6" />
            <path d="M10 11v5M14 11v5" />
        </svg>
    );
}

export default function EventDetailsForm() {
    const params = useParams();
    const id = params.id as string;

    const [event, setEvent] = useState<FullEventDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);


    const router = useRouter();

    const { status } = useAuth();

    const isAdmin = status === "admin";
    const isLoggedIn = status === "admin" || status === "user";

    const [deleting, setDeleting] = useState(false);
    const [favoriteLoading, setFavoriteLoading] = useState(false);

    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        if (!id) return;

        const loadEvent = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch(`/api/events/${id}`, {
                    cache: "no-store",
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data?.error || "Greška pri učitavanju događaja."
                    );
                }

                setEvent(data);

                const favoriteResponse = await fetch(`/api/favorites/event/${id}`, {
                    cache: "no-store",
                });

                if (favoriteResponse.ok) {
                    const favoriteData = await favoriteResponse.json();

                    setIsFavorite(favoriteData.isFavorite);
                }
            } catch (error) {
                setError(
                    error instanceof Error
                        ? error.message
                        : "Greška pri učitavanju događaja."
                );
            } finally {
                setLoading(false);
            }
        };

        loadEvent();
    }, [id]);

    const handleDelete = async () => {
        const confirmed = window.confirm(
            "Da li ste sigurni da želite da obrišete ovaj događaj?"
        );

        if (!confirmed) return;

        try {
            setDeleting(true);

            const response = await fetch(`/api/events/${id}`, {
                method: "DELETE",
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data?.error || "Greška pri brisanju događaja."
                );
            }

            router.push("/");
            router.refresh();
        } catch (error) {
            alert(
                error instanceof Error
                    ? error.message
                    : "Greška pri brisanju događaja."
            );
        } finally {
            setDeleting(false);
        }
    };

    const handleAddFavorite = async () => {
        try {
            setFavoriteLoading(true);

            const response = await fetch(`/api/favorites/event/${event?.id}`, {
                method: "POST",
            });

            const data = await response.json();

            console.log("STATUS:", response.status);
            console.log("API RESPONSE:", data);

            if (!response.ok) {
                console.error("MESSAGE:", data.message);
                console.error("ERROR:", data.error);
                return;
            }

            setIsFavorite(true);

        } catch (error) {
            console.error("Favorite error:", error);
        } finally {
            setFavoriteLoading(false);
        }
    };

    const handleRemoveFavorite = async () => {
        try {
            setFavoriteLoading(true);

            const response = await fetch(
                `/api/favorites/event/${event?.id}`,
                {
                    method: "DELETE",
                }
            );

            const data = await response.json();

            if (!response.ok) {
                console.error(data.message);
                return;
            }

            setIsFavorite(false);
        } catch (error) {
            console.error(
                "Greška pri uklanjanju iz omiljenih:",
                error
            );
        } finally {
            setFavoriteLoading(false);
        }
    };

    if (loading) {
        return (
            <main className="min-h-[calc(100vh-80px)] bg-[#EDFAF9]">
                <div className="flex min-h-[500px] items-center justify-center">
                    <p className="text-sm text-[#52677D]">
                        Učitavanje događaja...
                    </p>
                </div>
            </main>
        );
    }

    if (error || !event) {
        return (
            <main className="min-h-[calc(100vh-80px)] bg-[#EDFAF9] px-4 py-16">
                <div className="mx-auto max-w-5xl text-center">
                    <h1 className="text-3xl font-bold text-[#163536]">
                        Događaj nije pronađen
                    </h1>

                    <p className="mt-3 text-[#52677D]">
                        {error || "Traženi događaj ne postoji."}
                    </p>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-[calc(100vh-80px)] bg-[#EDFAF9]">
            <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">

                <div className="mt-10 grid items-start gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">

                    <section>
                        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#008C95]">
                            {event.eventType.name}
                        </p>

                        <h1 className="mt-4 max-w-4xl text-4xl font-bold leading-[1.1] tracking-tight text-[#163536] sm:text-5xl lg:text-6xl">
                            {event.name}
                        </h1>

                        {/* Date and time */}
                        <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4 text-[#52677D]">

                            <div className="flex items-center gap-2.5">
                                <span className="text-[#008C95]">
                                    <CalendarIcon />
                                </span>

                                <span className="font-medium">
                                    {formatDate(event.eventDate)}
                                </span>
                            </div>

                            <div className="flex items-center gap-2.5">
                                <span className="text-[#008C95]">
                                    <ClockIcon />
                                </span>

                                <span className="font-medium">
                                    {formatTime(event.eventTime)}
                                </span>
                            </div>
                        </div>

                        <div className="mt-10 h-px w-full bg-[#008C95]/15" />

                        {/*Event detsils */}
                        <div className="mt-10">
                            <h2 className="text-2xl font-bold text-[#163536]">
                                O događaju
                            </h2>

                            <p className="mt-5 max-w-3xl whitespace-pre-line text-[16px] leading-8 text-[#52677D]">
                                {event.description}
                            </p>
                        </div>

                        {/* Favorites and delete */}
                        {isLoggedIn && (
                            <div className="mt-10 flex flex-wrap items-center gap-4">
                                {isFavorite ? (
                                    <button
                                        type="button"
                                        onClick={handleRemoveFavorite}
                                        disabled={favoriteLoading}
                                        className="
                                            inline-flex items-center gap-2
                                            rounded-xl
                                            border border-[#008C95]
                                            px-5 py-2.5
                                            text-sm font-semibold text-[#008C95]
                                            transition
                                            hover:bg-[#008C95]
                                            hover:text-white
                                            disabled:cursor-not-allowed
                                            disabled:opacity-50
                                         "
                                    >
                                        <HeartIcon />

                                        {favoriteLoading
                                            ? "Uklanjanje..."
                                            : "Izbaci iz omiljenog"}
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handleAddFavorite}
                                        disabled={favoriteLoading}
                                        className="
                                                inline-flex items-center gap-2
                                                rounded-xl
                                                bg-[#008C95]
                                                px-5 py-2.5
                                                text-sm font-semibold text-white
                                                transition
                                                hover:bg-[#006D77]
                                                disabled:cursor-not-allowed
                                                disabled:opacity-50
                                        "
                                    >
                                        <HeartIcon />

                                        {favoriteLoading
                                            ? "Dodavanje..."
                                            : "Dodaj u omiljeno"}
                                    </button>
                                )}

                                {/* Dletete */}
                                {isAdmin && (
                                    <button
                                        type="button"
                                        onClick={handleDelete}
                                        disabled={deleting}
                                        className="
                                        inline-flex items-center gap-2
                                        rounded-xl
                                        border border-red-500
                                        px-5 py-2.5
                                        text-sm font-semibold text-red-600
                                        transition
                                        hover:bg-red-50
                                        disabled:cursor-not-allowed
                                        disabled:opacity-50
                                    "
                                    >
                                        <TrashIcon />

                                        {deleting
                                            ? "Brisanje..."
                                            : "Obriši događaj"}
                                    </button>
                                )}
                            </div>
                        )}
                    </section>

                    {/* Location */}
                    <Link
                        href={`/eventLocations/${event.location.id}`}
                        className="group block"
                    >
                        <aside>
                            {event.location.imageUrl && (
                                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[2rem]">
                                    <Image
                                        src={event.location.imageUrl}
                                        alt={event.location.name}
                                        fill
                                        className="object-cover transition duration-300 group-hover:scale-[1.02]"
                                        sizes="(max-width: 1024px) 100vw, 500px"
                                    />
                                </div>
                            )}

                            <div className="mt-7">
                                <div className="flex items-start gap-3">
                                    <span className="mt-1 text-[#008C95]">
                                        <LocationIcon />
                                    </span>

                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#008C95]">
                                            Lokacija
                                        </p>

                                        <h2 className="mt-2 text-2xl font-bold text-[#163536] transition group-hover:text-[#008C95]">
                                            {event.location.name}
                                        </h2>

                                        <p className="mt-1 text-sm text-[#52677D]">
                                            {formatLocationType(
                                                event.location.type
                                            )}
                                        </p>

                                        <p className="mt-4 text-[15px] leading-7 text-[#52677D]">
                                            {event.location.address}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </Link>
                </div>
            </div>
        </main>
    );
}