import { db } from "@/db";
import { upcomingEvents } from "@/db/schema";
import { asc, gte } from "drizzle-orm";
import { NextResponse } from "next/server";

export const GET = async () => {
    try {
        const today = new Date().toISOString().split("T")[0];

        const data = await db
            .select({
                id: upcomingEvents.id,
                name: upcomingEvents.name,
                eventDate: upcomingEvents.eventDate,
                locationName: upcomingEvents.locationName,
            })
            .from(upcomingEvents)
            .where(gte(upcomingEvents.eventDate, today))
            .orderBy(asc(upcomingEvents.eventDate));

        return NextResponse.json(
            { data },
            { status: 200 }
        );
    } catch (error) {
        console.error("Upcoming events GET error:", error);

        return NextResponse.json(
            {
                message: "Greška pri učitavanju predstojećih događaja.",
                error:
                    error instanceof Error
                        ? error.message
                        : "Nepoznata greška.",
            },
            { status: 500 }
        );
    }
};