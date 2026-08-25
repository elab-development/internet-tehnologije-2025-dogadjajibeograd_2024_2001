import { db } from "@/db";
import { favoriteEvents, events } from "@/db/schema";
import { AUTH_COOKIE, verifyAuthToken } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
    try {
        const token = request.cookies.get(AUTH_COOKIE)?.value;

        if (!token) {
            return NextResponse.json(
                { message: "Korisnik nije prijavljen." },
                { status: 401 }
            );
        }

        const user = verifyAuthToken(token);

        const data = await db
            .select({
                eventId: favoriteEvents.eventId,
            })
            .from(favoriteEvents)
            .where(eq(favoriteEvents.userId, user.sub));

        return NextResponse.json(
            { data },
            { status: 200 }
        );

    } catch (error) {
        console.error("Favorite GET error:", error);

        return NextResponse.json(
            {
                message: "Greška pri učitavanju omiljenih događaja.",
                error:
                    error instanceof Error
                        ? error.message
                        : "Nepoznata greška",
            },
            { status: 500 }
        );
    }
};