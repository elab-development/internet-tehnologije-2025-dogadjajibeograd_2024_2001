import { db } from "@/db";
import { favoriteEvents } from "@/db/schema";
import { AUTH_COOKIE, verifyAuthToken } from "@/lib/auth";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export interface FavoritesDTO{
    userId: string;
    eventId: string;
}
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const token = request.cookies.get(AUTH_COOKIE)?.value;

        if (!token) {
            return NextResponse.json(
                { isFavorite: false },
                { status: 401 }
            );
        }

        const user = verifyAuthToken(token);
        const { id } = await params;

        const favorite = await db
            .select()
            .from(favoriteEvents)
            .where(
                and(
                    eq(favoriteEvents.userId, user.sub),
                    eq(favoriteEvents.eventId, id)
                )
            )
            .limit(1);

        return NextResponse.json({
            isFavorite: favorite.length > 0,
        });
    } catch (error) {
        console.error("Favorite GET error:", error);

        return NextResponse.json(
            { isFavorite: false },
            { status: 500 }
        );
    }
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const token = request.cookies.get(AUTH_COOKIE)?.value;

        if (!token) {
            return NextResponse.json(
                { message: "Korisnik nije prijavljen." },
                { status: 401 }
            );
        }

        const user = verifyAuthToken(token);

        const { id } = await params;

        const existingFavorite = await db
            .select()
            .from(favoriteEvents)
            .where(
                and(
                    eq(favoriteEvents.userId, user.sub),
                    eq(favoriteEvents.eventId, id)
                )
            )
            .limit(1);

        if (existingFavorite.length > 0) {
            return NextResponse.json(
                {
                    message: "Događaj je već dodat u omiljeno.",
                    isFavorite: true,
                },
                { status: 409 }
            );
        }

        await db.insert(favoriteEvents).values({
            userId: user.sub,
            eventId: id,
        });

        return NextResponse.json(
            {
                message: "Događaj je dodat u omiljeno.",
                isFavorite: true,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Favorite POST error:", error);

        return NextResponse.json(
            {
                message: "Greška pri dodavanju događaja u omiljeno.",
                error:
                    error instanceof Error
                        ? error.message
                        : "Nepoznata greška",
            },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const token = request.cookies.get(AUTH_COOKIE)?.value;

        if (!token) {
            return NextResponse.json(
                { message: "Korisnik nije prijavljen." },
                { status: 401 }
            );
        }

        const user = verifyAuthToken(token);

        const { id } = await params;

        const deletedFavorite = await db
            .delete(favoriteEvents)
            .where(
                and(
                    eq(favoriteEvents.userId, user.sub),
                    eq(favoriteEvents.eventId, id)
                )
            )
            .returning();

        if (deletedFavorite.length === 0) {
            return NextResponse.json(
                {
                    message: "Događaj nije pronađen u omiljenim.",
                    isFavorite: false,
                },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                message: "Događaj je uklonjen iz omiljenih.",
                isFavorite: false,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Favorite DELETE error:", error);

        return NextResponse.json(
            {
                message: "Greška pri uklanjanju događaja iz omiljenih.",
                error:
                    error instanceof Error
                        ? error.message
                        : "Nepoznata greška",
            },
            { status: 500 }
        );
    }
}