import { db } from "@/db";
import { eventTypes, eventLocations, events } from "@/db/schema";
import { eq } from "drizzle-orm";

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
