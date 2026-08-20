"use client";

import { useAuth } from "./AuthProvider";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function headerBar() {
    const { status, user, logout } = useAuth();
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                userMenuRef.current &&
                !userMenuRef.current.contains(event.target as Node)
            ) {
                setUserMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    const isLogin = status === "user" || status === "admin";
    const pathname = usePathname();

    const scrollTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const navClass = (path: string) =>
        pathname === path
            ? "rounded-xl bg-[#E0F2FE] px-4 py-2 text-sm font-semibold text-[#0369A1]"
            : "rounded-xl px-4 py-2 text-sm font-medium text-[#52677D] transition duration-200 hover:bg-[#E0F2FE] hover:text-[#0284C7]";

    return (
        <header
            className="
                sticky
                top-0
                z-50
                border-b
                border-[#BAE6FD]
                bg-white/95
                shadow-sm
                backdrop-blur-md
            "
        >
            <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

                {/* LOGO */}
                <Link
                    href="/"
                    onClick={scrollTop}
                    className="group flex items-center gap-3"
                >
                    <div
                        className="
                            flex
                            h-11
                            w-11
                            items-center
                            justify-center
                            rounded-xl
                            border
                            border-[#BAE6FD]
                            bg-[#F0F9FF]
                            shadow-sm
                            transition
                            duration-300
                            group-hover:border-[#38BDF8]
                            group-hover:bg-[#E0F2FE]
                        "
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            className="
                                h-6
                                w-6
                                text-[#0284C7]
                                transition
                                duration-300
                                group-hover:text-[#0369A1]
                            "
                        >
                            <path
                                d="M5 5.5C5 4.67 5.67 4 6.5 4H11v15H6.5A1.5 1.5 0 0 0 5 20.5v-15Z"
                                stroke="currentColor"
                                strokeWidth="1.7"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />

                            <path
                                d="M19 5.5C19 4.67 18.33 4 17.5 4H13v15h4.5a1.5 1.5 0 0 1 1.5 1.5v-15Z"
                                stroke="currentColor"
                                strokeWidth="1.7"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>

                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-[#0F2942]">
                            Pregled kultrurnih događaja<br></br>
                            <span className="ml-1 text-[#0284C7]">
                                Moj Beograd
                            </span>
                        </h1>

                        <p className="mt-0.5 hidden text-xs font-medium tracking-wide text-[#64748B] sm:block">
                            Književnost · Pozorište · Muzika · Umetnost
                        </p>
                    </div>
                </Link>

                {/* NAVIGATION */}
                <nav className="hidden items-center gap-1 md:flex">

                    <Link
                        href="/news"
                        onClick={scrollTop}
                        className={navClass("/news")}
                    >
                        Vesti
                    </Link>

                    <Link
                        href="/venues"
                        onClick={scrollTop}
                        className={navClass("/venues")}
                    >
                        Mesta događanja
                    </Link>

                    <Link
                        href="/new"
                        onClick={scrollTop}
                        className={navClass("/new")}
                    >
                        Dodaj događaj
                    </Link>

                </nav>
                {isLogin ? (
                    <div
                        ref={userMenuRef}
                        className="relative inline-block"
                    >
                        <button
                            type="button"
                            onClick={() => setUserMenuOpen((prev) => !prev)}
                            className={`flex
                                items-center
                                justify-center
                                px-4
                                py-2.5
                                text-sm
                                font-semibold
                                text-[#52677D]
                                transition
                                duration-200
                                hover:bg-[#E0F2FE]
                                hover:text-[#0284C7]
                                ${userMenuOpen
                                    ? "rounded-t-xl bg-[#F0F9FF] text-[#0284C7]"
                                    : "rounded-xl bg-transparent"
                                }
`}
                        >
                            {user.firstname} {user.lastname}
                        </button>

                        {userMenuOpen && (
                            <div
                                className=" absolute
                                left-0
                                top-full
                                z-[100]
                                min-w-full
                                w-max
                                overflow-hidden
                                rounded-b-xl
                                border
                                border-t-0
                                border-[#BAE6FD]
                                bg-white/95
                                shadow-lg
                                backdrop-blur-md"
                            >
                                <Link
                                    href="/profile"
                                    onClick={() => setUserMenuOpen(false)}
                                    className=" block
                                    whitespace-nowrap
                                    px-5
                                    py-3
                                    text-sm
                                    font-medium
                                    text-[#52677D]
                                    transition
                                    duration-200
                                    hover:bg-[#E0F2FE]
                                    hover:text-[#0284C7]
                                    "
                                >
                                    Moj profil
                                </Link>

                                <Link
                                    href="/favorites"
                                    onClick={() => setUserMenuOpen(false)}
                                    className=" block
                                    whitespace-nowrap
                                    px-5
                                    py-3
                                    text-sm
                                    font-medium
                                    text-[#52677D]
                                    transition
                                    duration-200
                                    hover:bg-[#E0F2FE]
                                    hover:text-[#0284C7]
                                    "
                                >
                                    Omiljeni događaji
                                </Link>

                                <div className="border-t border-[#BAE6FD]" />

                                <button
                                    type="button"
                                    onClick={async () => {
                                        setUserMenuOpen(false);
                                        await logout();
                                    }}
                                    className=" block
                                    w-full
                                    whitespace-nowrap
                                    px-5
                                    py-3
                                    text-left
                                    text-sm
                                    font-medium
                                    text-[#52677D]
                                    transition
                                    duration-200
                                    hover:bg-[#E0F2FE]
                                    hover:text-[#0284C7]"
                                >
                                    Izloguj se
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <Link
                        href="/login"
                        className=" flex
                        items-center
                        justify-center
                        rounded-xl
                        bg-transparent
                        px-4
                        py-2.5
                        text-sm
                        font-semibold
                        text-[#52677D]
                        transition
                        duration-200
                        hover:bg-[#E0F2FE]
                        hover:text-[#0284C7]"
                    >
                        Uloguj se
                    </Link>
                )}

            </div>
        </header>
    );
}