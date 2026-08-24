import { db } from "@/db";
import { eventTypes, eventLocations, events } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export interface FullEventDto {
    id: string;
    name: string;
    description: string;
    eventDate: string;
    eventTime: string;
    createdAt: Date;

    eventType: {
        id: string;
        name: string;
    };

    location: {
        id: string;
        name: string;
        type:
        | "pozoriste"
        | "bioskop"
        | "koncertna_dvorana"
        | "centar_za_kulturu"
        | "drugo";
        address: string;
        latitude: number;
        longitude: number;
        imageUrl: string | null;
        createdAt: Date;
    };
}

export const GET = async () => {
    const fullEventDto = await db
        .select({
            id: events.id,
            name: events.name,
            description: events.description,
            eventDate: events.eventDate,
            eventTime: events.eventTime,
            createdAt: events.createdAt,

            eventType: {
                id: eventTypes.id,
                name: eventTypes.name,
            },

            location: {
                id: eventLocations.id,
                name: eventLocations.name,
                type: eventLocations.type,
                address: eventLocations.address,
                latitude: eventLocations.latitude,
                longitude: eventLocations.longitude,
                imageUrl: eventLocations.imageUrl,
                createdAt: eventLocations.createdAt,
            },
        })
        .from(events)
        .innerJoin(
            eventTypes,
            eq(events.eventTypeId, eventTypes.id)
        )
        .innerJoin(
            eventLocations,
            eq(events.locationId, eventLocations.id)
        )

    return Response.json(fullEventDto);
};

export const POST = async (request: NextRequest) => {
    try {
        const body = await request.json();

        const {
            name,
            eventTypeId,
            locationId,
            eventDate,
            eventTime,
            description,
        } = body;

        if (
            !name ||
            !eventTypeId ||
            !locationId ||
            !eventDate ||
            !eventTime ||
            !description
        ) {
            return NextResponse.json(
                { message: "Sva polja su obavezna." },
                { status: 400 }
            );
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const selectedDate = new Date(
            `${eventDate}T00:00:00`
        );

        if (selectedDate <= today) {
            return NextResponse.json(
                {
                    message:
                        "Datum događaja mora biti veći od današnjeg datuma.",
                },
                { status: 400 }
            );
        }

        const [newEvent] = await db
            .insert(events)
            .values({
                name,
                eventTypeId,
                locationId,
                eventDate,
                eventTime,
                description,
            })
            .returning();

        return NextResponse.json(
            {
                message: "Događaj je uspešno dodat.",
                data: newEvent,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Greška pri dodavanju događaja:", error);

        return NextResponse.json(
            {
                message: "Greška pri dodavanju događaja.",
            },
            { status: 500 }
        );
    }
};