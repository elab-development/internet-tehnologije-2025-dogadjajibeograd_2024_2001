"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
    isAdmin: boolean;
    mobile?: boolean;
    onNavigate?: () => void;
};

export default function NavigationMenu({
    isAdmin,
    mobile = false,
    onNavigate,
}: Props) {
    const pathname = usePathname();

    const navClass = (path: string) => {
        const active = pathname === path;

        if (mobile) {
            return `
                w-full
                rounded-xl
                px-4
                py-3
                text-left
                text-sm
                font-medium
                transition
                ${
                    active
                        ? "bg-[#E0F2FE] text-[#0369A1]"
                        : "text-[#52677D] hover:bg-[#F0F9FF] hover:text-[#0284C7]"
                }
            `;
        }

        return `
            whitespace-nowrap
            rounded-xl
            px-3
            py-2
            text-sm
            font-medium
            transition
            ${
                active
                    ? "bg-[#E0F2FE] font-semibold text-[#0369A1]"
                    : "text-[#52677D] hover:bg-[#F0F9FF] hover:text-[#0284C7]"
            }
        `;
    };

    const handleClick = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });

        onNavigate?.();
    };

    return (
        <nav
            className={
                mobile
                    ? "flex flex-col gap-1"
                    : "flex items-center gap-2"
            }
        >
            <Link
                href="/upcoming"
                onClick={handleClick}
                className={navClass("/upcoming")}
            >
                Predstojeći događaji
            </Link>

            <Link
                href="/eventLocations"
                onClick={handleClick}
                className={navClass("/eventLocations")}
            >
                Mesta održavanja
            </Link>

            <Link
                href="/aboutus"
                onClick={handleClick}
                className={navClass("/aboutus")}
            >
                O nama
            </Link>

            {isAdmin && (
                <Link
                    href="/new"
                    onClick={handleClick}
                    className={navClass("/new")}
                >
                    Dodaj događaj
                </Link>
            )}
        </nav>
    );
}