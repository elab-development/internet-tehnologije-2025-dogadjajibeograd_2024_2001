"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";

type Mode = "login" | "register";

export default function AuthForm({ mode }: { mode: Mode }) {
    const router = useRouter();
    const { refresh } = useAuth();

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const [firstname, setFirstName] = useState("");
    const [lastname, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [pwd, setPwd] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");

    const today = new Date();
    const maxBirthDay = new Date(
        today.getFullYear() - 13,
        today.getMonth(),
        today.getDate()
    ).toISOString().split("T")[0];

    const btnLabel =
        mode === "login"
            ? "Prijavi se"
            : "Napravi nalog";

    const switchLine =
        mode === "login"
            ? (["Niste registrovani?", "Registruj se", "/register"] as const)
            : (["Već imate nalog?", "Prijavi se", "/login"] as const);

    const [fieldErrors, setFieldErrors] = useState({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        dateOfBirth: "",
    });

    const validateRegister = () => {
        const errors = {
            firstname: "",
            lastname: "",
            email: "",
            password: "",
            dateOfBirth: "",
        };

        if (!firstname.trim()) {
            errors.firstname = "Unesite ime.";
        } else if (!/^[\p{L}\s]+$/u.test(firstname)) {
            errors.firstname = "Ime može sadržati samo slova.";
        }

        if (!lastname.trim()) {
            errors.lastname = "Unesite prezime.";
        } else if (!/^[\p{L}\s]+$/u.test(lastname)) {
            errors.lastname = "Prezime može sadržati samo slova.";
        }

        if (!email.trim()) {
            errors.email = "Unesite email adresu.";
        } else if (
            !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
        ) {
            errors.email = "Unesite ispravnu email adresu.";
        }

        if (!pwd) {
            errors.password = "Unesite lozinku.";
        } else if (
            !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}/.test(pwd)
        ) {
            errors.password =
                "Lozinka mora imati najmanje 8 karaktera, veliko i malo slovo, broj i specijalni znak.";
        }

        if (!dateOfBirth) {
            errors.dateOfBirth = "Unesite datum rođenja.";
        } else if (dateOfBirth > maxBirthDay) {
            errors.dateOfBirth = "Morate imati najmanje 13 godina.";
        }

        setFieldErrors(errors);

        return !Object.values(errors).some(Boolean);
    };

    {/* SUBMIT*/ }
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        if (mode === "register" && !validateRegister()) {
            setLoading(false);
            return;
        }

        try {
            const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register"

            const body = mode === "login" ? { email, password: pwd } : { firstname, lastname, email, password: pwd, dateOfBirth }
            const res = await fetch(endpoint, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body)
            })

            if (!res.ok) {
                let message = "Greška pri autentifikaciji";

                try {
                    const data = await res.json();
                    message = data?.error ?? message;
                } catch {
                    setError(
                        "Došlo je do greške. Pokušajte ponovo."
                    );
                }

                setError(message);
                return;
            }

            await refresh();
            router.push("/");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="min-h-[calc(100vh-80px)] bg-[#EDFAF9] px-4 py-14 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-xl">

                {/* Home page*/}
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-[#163536]">
                        {mode === "login"
                            ? "Prijava"
                            : "Registracija"}
                    </h1>

                    <p className="mt-2 text-sm leading-6 text-[#607D7E]">
                        {mode === "login"
                            ? "Prijavite se na svoj nalog."
                            : "Kreirajte nalog i pronađite događaje koji vas zanimaju."}
                    </p>
                </div>

                {/* Card */}
                <div className="rounded-3xl border border-[#006D77]/10 bg-white p-6 shadow-[0_16px_45px_rgba(0,109,119,0.08)] sm:p-9">

                    <form className="space-y-6" onSubmit={handleSubmit} noValidate>

                        {/* First and last name */}
                        {mode === "register" && (
                            <div className="grid gap-5 sm:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-[#294C4E]">
                                        Ime
                                    </label>

                                    <input
                                        type="text"
                                        required
                                        value={firstname}
                                        onChange={(e) => {
                                            const value = e.target.value;

                                            if (/^[\p{L}\s]*$/u.test(value)) {
                                                setFirstName(value);
                                            }
                                        }}
                                        placeholder="Unesite ime"
                                        className={`block w-full rounded-xl border bg-[#F8FDFC] px-4 py-3 text-sm text-[#163536] outline-none transition duration-200 placeholder:text-[#8BA3A4]
                                            ${fieldErrors.firstname
                                                ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                                                : "border-[#006D77]/20 hover:border-[#006D77]/40 focus:border-[#2EC4B6] focus:bg-white focus:ring-4 focus:ring-[#2EC4B6]/10"
                                            }
                                        `}
                                    />
                                    {fieldErrors.firstname && (
                                        <p className="mt-2 text-xs font-medium text-red-600">
                                            {fieldErrors.firstname}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-[#294C4E]">
                                        Prezime
                                    </label>

                                    <input
                                        type="text"
                                        required
                                        value={lastname}
                                        onChange={(e) => {
                                            const value = e.target.value;

                                            if (/^[\p{L}\s]*$/u.test(value)) {
                                                setLastName(value);
                                            }
                                        }}
                                        placeholder="Unesite prezime"
                                        className={`block w-full rounded-xl border bg-[#F8FDFC] px-4 py-3 text-sm text-[#163536] outline-none transition duration-200 placeholder:text-[#8BA3A4]
                                            ${fieldErrors.lastname
                                                ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                                                : "border-[#006D77]/20 hover:border-[#006D77]/40 focus:border-[#2EC4B6] focus:bg-white focus:ring-4 focus:ring-[#2EC4B6]/10"
                                            }
                                        `}
                                    />
                                    {fieldErrors.lastname && (
                                        <p className="mt-2 text-xs font-medium text-red-600">
                                            {fieldErrors.lastname}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Email */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-[#294C4E]">
                                Email adresa
                            </label>

                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        className="h-5 w-5 text-[#6D8D8E]"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M21.75 6.75v10.5A2.25 2.25 0 0119.5 19.5h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0l-8.69 5.516a2 2 0 01-2.12 0L2.25 6.75"
                                        />
                                    </svg>
                                </div>

                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(e.target.value)
                                    }
                                    pattern="[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
                                    title="Unesite ispravnu email adresu, na primer: ime@gmail.com"
                                    placeholder="ime@email.com"
                                    className={`block w-full rounded-xl border bg-[#F8FDFC] py-3 pl-11 pr-4 text-sm text-[#163536] outline-none transition duration-200 placeholder:text-[#8BA3A4]
                                        ${fieldErrors.email
                                            ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                                            : "border-[#006D77]/20 hover:border-[#006D77]/40 focus:border-[#2EC4B6] focus:bg-white focus:ring-4 focus:ring-[#2EC4B6]/10"
                                        }
                                    `}
                                />

                                {fieldErrors.email && (
                                    <p className="mt-2 text-xs font-medium text-red-600">
                                        {fieldErrors.email}
                                    </p>
                                )}

                            </div>
                        </div>

                        {/* Passsword */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-[#294C4E]">
                                Lozinka
                            </label>

                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        className="h-5 w-5 text-[#6D8D8E]"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M16.5 10.5V6.75a4.5 4.5 0 00-9 0v3.75m-.75 0h10.5A2.25 2.25 0 0119.5 12.75v6A2.25 2.25 0 0117.25 21H6.75A2.25 2.25 0 014.5 18.75v-6a2.25 2.25 0 012.25-2.25z"
                                        />
                                    </svg>
                                </div>

                                <input
                                    type="password"
                                    required
                                    value={pwd}
                                    onChange={(e) =>
                                        setPwd(e.target.value)
                                    }
                                    pattern={
                                        mode === "register"
                                            ? "(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).{8,}"
                                            : undefined
                                    }
                                    title={
                                        mode === "register"
                                            ? "Lozinka mora imati najmanje 8 karaktera, jedno veliko slovo, jedno malo slovo, jedan broj i jedan specijalni znak."
                                            : undefined
                                    }
                                    placeholder="Unesite lozinku"
                                    className={`block w-full rounded-xl border bg-[#F8FDFC] py-3 pl-11 pr-4 text-sm text-[#163536] outline-none transition duration-200 placeholder:text-[#8BA3A4]
                                        ${fieldErrors.password
                                            ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                                            : "border-[#006D77]/20 hover:border-[#006D77]/40 focus:border-[#2EC4B6] focus:bg-white focus:ring-4 focus:ring-[#2EC4B6]/10"
                                        }
                                    `} />

                                {fieldErrors.password && (
                                    <p className="mt-2 text-xs font-medium text-red-600">
                                        {fieldErrors.password}
                                    </p>
                                )}
                            </div>

                            {mode === "register" && (
                                <p className="mt-2 text-xs leading-5 text-[#718B8C]">
                                    Najmanje 8 karaktera, veliko i malo slovo,
                                    broj i specijalni znak.
                                </p>
                            )}
                        </div>

                        {/* Date of birth */}
                        {mode === "register" && (
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-[#294C4E]">
                                    Datum rođenja
                                </label>

                                <input
                                    type="date"
                                    required
                                    value={dateOfBirth}
                                    onChange={(e) =>
                                        setDateOfBirth(e.target.value)
                                    }
                                    className={`block w-full rounded-xl border bg-[#F8FDFC] px-4 py-3 text-sm text-[#163536] outline-none transition duration-200
                                        ${fieldErrors.dateOfBirth
                                            ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                                            : "border-[#006D77]/20 hover:border-[#006D77]/40 focus:border-[#2EC4B6] focus:bg-white focus:ring-4 focus:ring-[#2EC4B6]/10"
                                        }
                                        `}
                                />
                                {fieldErrors.dateOfBirth ? (
                                    <p className="mt-2 text-xs font-medium text-red-600">
                                        {fieldErrors.dateOfBirth}
                                    </p>
                                ) : (
                                    <p className="mt-2 text-xs text-[#718B8C]">
                                        Morate imati najmanje 13 godina.
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Error */}
                        {error && (
                            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                                <p className="text-sm font-medium text-red-700">
                                    {error}
                                </p>
                            </div>
                        )}

                        {/* Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex w-full items-center justify-center rounded-xl bg-[#006D77] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_7px_18px_rgba(0,109,119,0.18)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#005C65] hover:shadow-[0_10px_24px_rgba(0,109,119,0.23)] focus:outline-none focus:ring-4 focus:ring-[#2EC4B6]/25 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                    Obrada...
                                </span>
                            ) : (
                                btnLabel
                            )}
                        </button>
                    </form>

                    {/* Login / register */}
                    <div className="mt-7 border-t border-[#006D77]/10 pt-6">
                        <p className="text-center text-sm text-[#607D7E]">
                            {switchLine[0]}{" "}

                            <Link
                                href={switchLine[2]}
                                className="font-semibold text-[#006D77] transition-colors hover:text-[#2A9D8F]"
                            >
                                {switchLine[1]}
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}