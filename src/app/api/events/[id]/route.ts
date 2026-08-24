import { db } from "@/db";
import { eventTypes, eventLocations, events } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

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

type RouteParams = {
    params: Promise<{
        id: string;
    }>;
};

export const GET = async (
    request: Request,
    { params }: RouteParams
) => {
    try {
        const { id } = await params;

        const [result] = await db
            .select({
                id: events.id,
                name: events.name,
                description: events.description,
                eventDate: events.eventDate,
                eventTime: events.eventTime,
                createdAt: events.createdAt,

                eventTypeId: eventTypes.id,
                eventTypeName: eventTypes.name,

                locationId: eventLocations.id,
                locationName: eventLocations.name,
                locationType: eventLocations.type,
                locationAddress: eventLocations.address,
                locationLatitude: eventLocations.latitude,
                locationLongitude: eventLocations.longitude,
                locationImageUrl: eventLocations.imageUrl,
                locationCreatedAt: eventLocations.createdAt,
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
            .where(eq(events.id, id))
            .limit(1);

        if (!result) {
            return NextResponse.json(
                { error: "Događaj nije pronađen." },
                { status: 404 }
            );
        }

        const event: FullEventDto = {
            id: result.id,
            name: result.name,
            description: result.description,
            eventDate: result.eventDate,
            eventTime: result.eventTime,
            createdAt: result.createdAt,

            eventType: {
                id: result.eventTypeId,
                name: result.eventTypeName,
            },

            location: {
                id: result.locationId,
                name: result.locationName,
                type: result.locationType,
                address: result.locationAddress,
                latitude: result.locationLatitude,
                longitude: result.locationLongitude,
                imageUrl: result.locationImageUrl,
                createdAt: result.locationCreatedAt,
            },
        };

        return NextResponse.json(event);
    } catch (error) {
        console.error("GET /api/events/[id] error:", error);

        return NextResponse.json(
            { error: "Greška pri učitavanju događaja." },
            { status: 500 }
        );
    }
};

export const POST = async (
    request: Request,
    { params }: RouteParams
) => {
    try {
        const { id } = await params;
        const body = await request.json();

        const {
            name,
            description,
            eventDate,
            eventTime,
            eventTypeId,
            locationId,
        } = body;

        const [updatedEvent] = await db
            .update(events)
            .set({
                name,
                description,
                eventDate,
                eventTime,
                eventTypeId,
                locationId,
            })
            .where(eq(events.id, id))
            .returning();

        if (!updatedEvent) {
            return NextResponse.json(
                { error: "Događaj nije pronađen." },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: "Događaj je uspešno izmenjen.",
            event: updatedEvent,
        });
    } catch (error) {
        console.error("POST /api/events/[id] error:", error);

        return NextResponse.json(
            { error: "Greška pri izmeni događaja." },
            { status: 500 }
        );
    }
};

export const DELETE = async (
    request: Request,
    { params }: RouteParams
) => {
    try {
        const { id } = await params;

        const [deletedEvent] = await db
            .delete(events)
            .where(eq(events.id, id))
            .returning();

        if (!deletedEvent) {
            return NextResponse.json(
                { error: "Događaj nije pronađen." },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: "Događaj je uspešno obrisan.",
            event: deletedEvent,
        });
    } catch (error) {
        console.error("DELETE /api/events/[id] error:", error);

        return NextResponse.json(
            { error: "Greška pri brisanju događaja." },
            { status: 500 }
        );
    }
};