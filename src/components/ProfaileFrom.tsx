"use client";
"use client";

import { useAuth } from "./AuthProvider";
import Link from "next/link";

export default function ProfailForm() {
    const { user, status } = useAuth();

    const isLogin = status === "admin" || status === "user";

    if (!isLogin || !user) {
        return (
            <main className="min-h-[calc(100vh-80px)] bg-[#EDFAF9] px-4 py-14 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-2xl">
                    <div className="rounded-3xl border border-[#006D77]/10 bg-white p-8 text-center shadow-[0_16px_45px_rgba(0,109,119,0.08)]">

                        <h1 className="text-2xl font-bold text-[#163536]">
                            Niste prijavljeni
                        </h1>

                        <p className="mt-3 text-sm text-[#607D7E]">
                            Morate biti prijavljeni da biste pristupili svom profilu.
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
        <main className="min-h-[calc(100vh-80px)] bg-[#EDFAF9] px-4 py-14 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl">

                {/* Header*/}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight text-[#163536]">
                        Moj profil
                    </h1>

                    <p className="mt-2 text-sm text-[#607D7E]">
                        Pregled podataka vašeg korisničkog naloga.
                    </p>
                </div>

                {isLogin && user && (
                    <div className="rounded-3xl border border-[#006D77]/10 bg-white p-6 shadow-[0_16px_45px_rgba(0,109,119,0.08)] sm:p-9">

                        {/* Firstname */}
                        <div className="border-b border-[#006D77]/10 py-4">
                            <p className="text-sm font-medium text-[#607D7E]">
                                Ime
                            </p>
                            <p className="mt-1 text-base font-semibold text-[#163536]">
                                {user.firstname}
                            </p>
                        </div>

                        {/* Lastname */}
                        <div className="border-b border-[#006D77]/10 py-4">
                            <p className="text-sm font-medium text-[#607D7E]">
                                Prezime
                            </p>
                            <p className="mt-1 text-base font-semibold text-[#163536]">
                                {user.lastname}
                            </p>
                        </div>

                        {/* Email */}
                        <div className="border-b border-[#006D77]/10 py-4">
                            <p className="text-sm font-medium text-[#607D7E]">
                                Email adresa
                            </p>
                            <p className="mt-1 text-base font-semibold text-[#163536]">
                                {user.email}
                            </p>
                        </div>

                        {/* Date of Birth*/} 
                        <div className="border-b border-[#006D77]/10 py-4">
                            <p className="text-sm font-medium text-[#607D7E]">
                                Datum rođenja
                            </p>
                            <p className="mt-1 text-base font-semibold text-[#163536]">
                                {user.dateOfBirth}
                            </p>
                        </div>

                        {/* Created at */}
                        <div className="py-4">
                            <p className="text-sm font-medium text-[#607D7E]">
                                Nalog kreiran
                            </p>
                            <p className="mt-1 text-base font-semibold text-[#163536]">
                                {new Date(user.createdAt).toLocaleDateString("sr-RS")}
                            </p>
                        </div>

                    </div>
                )}
            </div>
        </main>
    );
}