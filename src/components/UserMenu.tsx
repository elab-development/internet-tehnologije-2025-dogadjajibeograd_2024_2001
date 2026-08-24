"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "./AuthProvider";

export default function UserMenu() {
    const { status, user, logout } = useAuth();

    const pathname = usePathname();

    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);

    const isLogin = status === "user" || status === "admin";

    const navClass = (path: string) =>
        pathname === path
            ? "whitespace-nowrap rounded-xl bg-[#E0F2FE] px-3 py-2 text-sm font-semibold text-[#0369A1]"
            : "whitespace-nowrap rounded-xl px-3 py-2 text-sm font-medium text-[#52677D] transition duration-200 hover:bg-[#F0F9FF] hover:text-[#0284C7]";

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

    if (!isLogin || !user) {
        return (
            <Link
                href="/login"
                className={navClass("/login")}
            >
                Uloguj se
            </Link>
        );
    }

    return (
        <div
            ref={userMenuRef}
            className="relative w-44 shrink-0"
        >
            <button
                type="button"
                onClick={() => setUserMenuOpen((prev) => !prev)}
                className={`
                w-full
                whitespace-nowrap
                px-5
                py-2.5
                text-left
                text-sm
                font-semibold
                transition
                duration-200
                ${userMenuOpen
                        ? `
                        rounded-t-xl
                        rounded-b-none
                        border
                        border-b-0
                        border-[#BAE6FD]
                        bg-white
                        text-[#0369A1]
                        `
                        : `
                        rounded-xl
                        border
                        border-transparent
                        text-[#52677D]
                        hover:bg-[#F0F9FF]
                        hover:text-[#0284C7]
                        `
                        }
                `}
            >
                {user.firstname} {user.lastname}
            </button>

            {userMenuOpen && (
                <div
                    className="
                    absolute
                    left-0
                    top-full
                    z-[100]
                    w-full
                    overflow-hidden
                    rounded-b-xl
                    border
                    border-t-0
                    border-[#BAE6FD]
                    bg-white
                    shadow-lg
                "
                >
                    <Link
                        href="/profile"
                        onClick={() => setUserMenuOpen(false)}
                        className="
                        block
                        w-full
                        px-5
                        py-2.5
                        text-left
                        text-sm
                        font-medium
                        text-[#52677D]
                        transition
                        hover:bg-[#E0F2FE]
                        hover:text-[#0284C7]
                    "
                    >
                        Moj profil
                    </Link>

                    <Link
                        href="/favorites"
                        onClick={() => setUserMenuOpen(false)}
                        className="
                        block
                        w-full
                        px-5
                        py-2.5
                        text-left
                        text-sm
                        font-medium
                        text-[#52677D]
                        transition
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
                        className="
                        block
                        w-full
                        px-5
                        py-2.5
                        text-left
                        text-sm
                        font-medium
                        text-[#52677D]
                        transition
                        hover:bg-[#E0F2FE]
                        hover:text-[#0284C7]
                    "
                    >
                        Izloguj se
                    </button>
                </div>
            )}
        </div>
    );
}