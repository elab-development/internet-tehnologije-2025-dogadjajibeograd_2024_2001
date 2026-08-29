"use client";

import {
    FullEventTypeDto,
    FullEventLocationDto,
} from "@/shared/types";
import { FormEvent, useEffect, useState } from "react";

import { useAuth } from "./AuthProvider";
import Link from "next/link";

export default function AddEvent() {
    const [eventTypes, setEventTypes] = useState<FullEventTypeDto[]>([]);
    const [eventLocations, setEventLocations] =
        useState<FullEventLocationDto[]>([]);

    const [name, setName] = useState("");
    const [eventTypeId, setEventTypeId] = useState("");
    const [locationId, setLocationId] = useState("");
    const [eventDate, setEventDate] = useState("");
    const [eventTime, setEventTime] = useState("");
    const [description, setDescription] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const minDate = tomorrow.toISOString().split("T")[0];

    const { status } = useAuth();
    const isAdmin = status === "admin";

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError("");

            try {
                const [typeResponse, locationResponse] =
                    await Promise.all([
                        fetch("/api/eventTypes"),
                        fetch("/api/eventLocations"),
                    ]);

                if (!typeResponse.ok || !locationResponse.ok) {
                    throw new Error(
                        "Greška pri učitavanju podataka za formu."
                    );
                }

                const dataType = await typeResponse.json();
                const dataLocation = await locationResponse.json();

                setEventTypes(dataType);
                setEventLocations(dataLocation);
            } catch (error) {
                console.error(error);

                setError(
                    "Greška pri učitavanju podataka za formu."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const submit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const selectedDate = new Date(`${eventDate}T00:00:00`);

        if (selectedDate <= today) {
            setError(
                "Datum događaja mora biti veći od današnjeg datuma."
            );
            setSuccess("");
            return;
        }

        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const res = await fetch("/api/events", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    eventTypeId,
                    locationId,
                    eventDate,
                    eventTime,
                    description,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(
                    data?.message ||
                    "Greška pri dodavanju događaja."
                );
            }

            setSuccess("Događaj je uspešno dodat.");

            setName("");
            setEventTypeId("");
            setLocationId("");
            setEventDate("");
            setEventTime("");
            setDescription("");
        } catch (error) {
            console.error(error);

            setError(
                error instanceof Error
                    ? error.message
                    : "Greška pri dodavanju događaja."
            );
        } finally {
            setLoading(false);
        }
    };

    const inputClass = `
        w-full
        rounded-2xl
        border border-[#D7EAF5]
        bg-white
        px-4 py-3.5
        text-[15px]
        text-[#52677D]
        shadow-sm
        outline-none
        transition
        placeholder:text-[#94A3B8]
        hover:border-[#7DD3FC]
        focus:border-[#38BDF8]
        focus:ring-4
        focus:ring-[#E0F2FE]
    `;

    const labelClass = "mb-2.5 block text-sm font-semibold text-[#52677D]";

    if (!isAdmin) {
        return (
            <main className="min-h-[calc(100vh-80px)] bg-[#EDFAF9] px-4 py-14 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-2xl">
                    <div className="rounded-3xl border border-[#006D77]/10 bg-white p-8 text-center shadow-[0_16px_45px_rgba(0,109,119,0.08)]">
                        <h1 className="text-2xl font-bold text-[#163536]">
                            Pristup nije dozvoljen
                        </h1>

                        <p className="mt-3 text-sm leading-6 text-[#607D7E]">
                            Samo administrator ima pravo da dodaje nove događaje.
                        </p>

                        {status === "unauthenticated" && (
                            <Link
                                href="/login"
                                className="mt-6 inline-flex items-center justify-center rounded-xl bg-[#006D77] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#005A63]"
                            >
                                Prijavi se
                            </Link>
                        )}
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-[calc(100vh-80px)] bg-[#F8FCFE]">
            <div className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-8 sm:py-14">

                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-3xl font-bold tracking-tight text-[#52677D] sm:text-4xl">
                        Dodaj novi događaj
                    </h1>

                    <p className="mt-3 max-w-2xl text-[15px] leading-7 text-[#7A8DA1]">
                        Unesite podatke o događaju koji želite da dodate na sajt.
                    </p>
                </div>

                <form
                    onSubmit={submit}
                    className="space-y-10"
                >

                    {/* Main information */}
                    <section>
                        <div className="mb-6 flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E0F2FE] text-[#0284C7]">
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    className="h-5 w-5"
                                >
                                    <path
                                        d="M5 7.5A2.5 2.5 0 0 1 7.5 5h9A2.5 2.5 0 0 1 19 7.5v9a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 5 16.5v-9Z"
                                        stroke="currentColor"
                                        strokeWidth="1.7"
                                    />
                                    <path
                                        d="M8.5 9h7M8.5 12h7M8.5 15h4"
                                        stroke="currentColor"
                                        strokeWidth="1.7"
                                        strokeLinecap="round"
                                    />
                                </svg>
                            </div>

                            <div>
                                <h2 className="font-semibold text-[#52677D]">
                                    Osnovni podaci
                                </h2>

                                <p className="text-sm text-[#8AA0B4]">
                                    Naziv, tip i mesto održavanja
                                </p>
                            </div>
                        </div>

                        <div className="space-y-6 border-l-2 border-[#E0F2FE] pl-5 sm:pl-7">

                            {/* Name */}
                            <div>
                                <label
                                    htmlFor="name"
                                    className={labelClass}
                                >
                                    Naziv događaja
                                </label>

                                <input
                                    id="name"
                                    value={name}
                                    type="text"
                                    onChange={(e) =>
                                        setName(e.target.value)
                                    }
                                    placeholder="Unesite naziv događaja"
                                    className={inputClass}
                                    required
                                />
                            </div>

                            {/* Event type */}
                            <div>
                                <p className={labelClass}>
                                    Tip događaja
                                </p>

                                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                                    {eventTypes.map((type) => {
                                        const isSelected =
                                            eventTypeId === type.id;

                                        return (
                                            <label
                                                key={type.id}
                                                className={`
                                                    group
                                                    flex cursor-pointer
                                                    items-center gap-3
                                                    rounded-2xl
                                                    border
                                                    px-4 py-3.5
                                                    transition
                                                    ${isSelected
                                                        ? "border-[#38BDF8] bg-[#EAF7FD] shadow-sm"
                                                        : "border-[#D7EAF5] bg-white hover:border-[#7DD3FC] hover:bg-[#F8FDFF]"
                                                    }
                                                `}
                                            >
                                                <span
                                                    className={`
                                                        flex h-5 w-5
                                                        shrink-0
                                                        items-center
                                                        justify-center
                                                        rounded-full
                                                        border-2
                                                        transition
                                                        ${isSelected
                                                            ? "border-[#0284C7]"
                                                            : "border-[#B7C9D8] group-hover:border-[#38BDF8]"
                                                        }
                                                    `}
                                                >
                                                    {isSelected && (
                                                        <span className="h-2.5 w-2.5 rounded-full bg-[#0284C7]" />
                                                    )}
                                                </span>

                                                <input
                                                    type="radio"
                                                    name="eventType"
                                                    value={type.id}
                                                    checked={isSelected}
                                                    onChange={(e) =>
                                                        setEventTypeId(
                                                            e.target.value
                                                        )
                                                    }
                                                    className="sr-only"
                                                    required
                                                />

                                                <span
                                                    className={`
                                                        text-sm font-semibold capitalize
                                                        ${isSelected
                                                            ? "text-[#0284C7]"
                                                            : "text-[#52677D]"
                                                        }
                                                    `}
                                                >
                                                    {type.name}
                                                </span>
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Location */}
                            <div>
                                <label
                                    htmlFor="location"
                                    className={labelClass}
                                >
                                    Mesto održavanja
                                </label>

                                <select
                                    id="location"
                                    value={locationId}
                                    onChange={(e) =>
                                        setLocationId(e.target.value)
                                    }
                                    className={`${inputClass} cursor-pointer`}
                                    required
                                >
                                    <option value="">
                                        Izaberi mesto održavanja
                                    </option>

                                    {eventLocations.map((location) => (
                                        <option
                                            key={location.id}
                                            value={location.id}
                                        >
                                            {location.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </section>

                    {/* Date and time */}
                    <section>
                        <div className="mb-6 flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E0F2FE] text-[#0284C7]">
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    className="h-5 w-5"
                                >
                                    <path
                                        d="M7 3v3M17 3v3M4.5 9h15"
                                        stroke="currentColor"
                                        strokeWidth="1.7"
                                        strokeLinecap="round"
                                    />
                                    <rect
                                        x="4.5"
                                        y="5"
                                        width="15"
                                        height="15"
                                        rx="2.5"
                                        stroke="currentColor"
                                        strokeWidth="1.7"
                                    />
                                </svg>
                            </div>

                            <div>
                                <h2 className="font-semibold text-[#52677D]">
                                    Datum i vreme
                                </h2>

                                <p className="text-sm text-[#8AA0B4]">
                                    Termin održavanja događaja
                                </p>
                            </div>
                        </div>

                        <div className="border-l-2 border-[#E0F2FE] pl-5 sm:pl-7">
                            <div className="grid gap-6 md:grid-cols-2">

                                {/* Data */}
                                <div>
                                    <label
                                        htmlFor="eventDate"
                                        className={labelClass}
                                    >
                                        Datum
                                    </label>

                                    <input
                                        id="eventDate"
                                        type="date"
                                        value={eventDate}
                                        onChange={(e) =>
                                            setEventDate(e.target.value)
                                        }
                                        min={
                                            minDate
                                        }
                                        className={inputClass}
                                        required
                                    />
                                </div>

                                {/* Time */}
                                <div>
                                    <label
                                        htmlFor="eventTime"
                                        className={labelClass}
                                    >
                                        Vreme
                                    </label>

                                    <input
                                        id="eventTime"
                                        type="time"
                                        value={eventTime}
                                        onChange={(e) =>
                                            setEventTime(e.target.value)
                                        }
                                        className={inputClass}
                                        step="60"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Description */}
                    <section>
                        <div className="mb-6 flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E0F2FE] text-[#0284C7]">
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    className="h-5 w-5"
                                >
                                    <path
                                        d="M6 5h12M6 9h12M6 13h8M6 17h6"
                                        stroke="currentColor"
                                        strokeWidth="1.7"
                                        strokeLinecap="round"
                                    />
                                </svg>
                            </div>

                            <div>
                                <h2 className="font-semibold text-[#52677D]">
                                    Opis događaja
                                </h2>

                                <p className="text-sm text-[#8AA0B4]">
                                    Dodajte više informacija o događaju
                                </p>
                            </div>
                        </div>

                        <div className="border-l-2 border-[#E0F2FE] pl-5 sm:pl-7">

                            {/* Description */}
                            <textarea
                                id="description"
                                value={description}
                                onChange={(e) =>
                                    setDescription(e.target.value)
                                }
                                placeholder="Unesite opis događaja..."
                                rows={7}
                                className={`${inputClass} resize-none leading-7`}
                                required
                            />
                        </div>
                    </section>

                    {/* Error */}
                    {error && (
                        <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-100">
                                !
                            </span>

                            {error}
                        </div>
                    )}

                    {/* Success */}
                    {success && (
                        <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-medium text-emerald-700">
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                                ✓
                            </span>

                            {success}
                        </div>
                    )}

                    {/* Button */}
                    <div className="flex justify-end border-t border-[#E0EEF5] pt-7">
                        <button
                            type="submit"
                            disabled={loading}
                            className="
                                inline-flex
                                min-w-44
                                items-center
                                justify-center
                                rounded-xl
                                bg-[#0284C7]
                                px-7 py-3
                                text-sm
                                font-semibold
                                text-white
                                shadow-sm
                                transition
                                hover:bg-[#0369A1]
                                hover:shadow-md
                                active:scale-[0.98]
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                            "
                        >
                            {loading
                                ? "Dodavanje..."
                                : "Dodaj događaj"}
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}