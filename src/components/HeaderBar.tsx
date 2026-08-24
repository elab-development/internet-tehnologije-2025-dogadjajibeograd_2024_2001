"use client";

import { useAuth } from "./AuthProvider";
import Link from "next/link";
import { useState } from "react";
import NavigationMenu from "./NavigationMenu";
import UserMenu from "./UserMenu";
import Weather from "./Weather";

export default function HeaderBar() {
    const { status } = useAuth();

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const isAdmin = status === "admin";

    const scrollTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <header className="sticky top-0 z-50 border-b border-[#BAE6FD] bg-white/95 shadow-sm backdrop-blur-md">

            {/* Main header */}
            <div className="mx-auto flex min-h-24 max-w-[1500px] items-center gap-8 px-6 lg:px-8">

                {/* LOGO */}
                <Link
                    href="/"
                    onClick={scrollTop}
                    className="group flex shrink-0 items-center gap-3"
                >
                    <div
                        className="
        h-12 w-12 shrink-0
        overflow-hidden
        rounded-2xl
        border border-[#BAE6FD]
        bg-[#F0F9FF]
        shadow-sm
        transition duration-300
        group-hover:border-[#38BDF8]
        group-hover:shadow-md
    "
                    >
                        <img
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQglR4LiYmmH6Y4Rg8jSp5zBw-BBErMwczfO5fegL3yow&s=10"
                            alt="Moj Beograd"
                            className="h-full w-full object-cover"
                        />
                    </div>
                    <div className="leading-tight">
                        <h1 className="whitespace-nowrap text-xl font-bold tracking-tight text-[#0F2942]">
                            Moj{" "}
                            <span className="text-[#0284C7]">
                                Beograd
                            </span>
                        </h1>

                        <p className="mt-1 whitespace-nowrap text-xs font-medium text-[#64748B]">
                            Pregled događaja u Beogradu
                        </p>
                    </div>
                </Link>

                {/* DESKTOP MENU */}
                <div className="ml-auto hidden items-center gap-4 lg:flex">

                    <NavigationMenu isAdmin={isAdmin} />

                    <div className="hidden shrink-0 xl:block">
                        <Weather />
                    </div>

                    <UserMenu />

                </div>

                {/* HAMBURGER */}
                <button
                    type="button"
                    onClick={() =>
                        setMobileMenuOpen((prev) => !prev)
                    }
                    className="
                        ml-auto
                        flex
                        h-11
                        w-11
                        items-center
                        justify-center
                        rounded-xl
                        text-[#52677D]
                        transition
                        hover:bg-[#E0F2FE]
                        hover:text-[#0284C7]
                        lg:hidden
                    "
                    aria-label="Meni"
                >
                    {mobileMenuOpen ? (
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            className="h-6 w-6"
                        >
                            <path
                                d="M6 6L18 18M18 6L6 18"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                        </svg>
                    ) : (
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            className="h-6 w-6"
                        >
                            <path
                                d="M4 7H20M4 12H20M4 17H20"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                        </svg>
                    )}
                </button>

            </div>

            {/* MOBILE MENU */}
            {mobileMenuOpen && (
                <div
                    className="
                        border-t
                        border-[#BAE6FD]
                        bg-white
                        px-6
                        py-4
                        lg:hidden
                    "
                >
                    <div className="mx-auto max-w-[1500px]">

                        <NavigationMenu
                            isAdmin={isAdmin}
                            mobile
                            onNavigate={() =>
                                setMobileMenuOpen(false)
                            }
                        />
                        <Weather />

                        <div className="my-3 border-t border-[#BAE6FD]" />

                        <UserMenu />

                    </div>
                </div>
            )}

        </header>
    );
}