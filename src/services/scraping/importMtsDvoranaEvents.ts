import { db } from "@/db";
import { upcomingEvents } from "@/db/schema";
import { inArray } from "drizzle-orm";
import { scrapeMtsDvoranaEvents } from "./mtsDvoranaScraper";

export const importMtsDvoranaEvents = async () => {
    const events = await scrapeMtsDvoranaEvents();

    if (events.length === 0) {
        return {
            total: 0,
            inserted: 0,
            updated: 0,
        };
    }

    const externalIds = events.map(
        (event) => event.externalId
    );

    const existingEvents = await db
        .select({
            externalId: upcomingEvents.externalId,
        })
        .from(upcomingEvents)
        .where(
            inArray(
                upcomingEvents.externalId,
                externalIds
            )
        );

    const existingIds = new Set(
        existingEvents
            .map((event) => event.externalId)
            .filter(
                (externalId): externalId is string =>
                    externalId !== null
            )
    );

    let inserted = 0;
    let updated = 0;

    for (const event of events) {
        const alreadyExists = existingIds.has(
            event.externalId
        );

        await db
            .insert(upcomingEvents)
            .values({
                name: event.name,
                locationName: event.locationName,
                address: event.address,
                eventDate: event.eventDate,
                description: event.description,
                source: event.source,
                sourceUrl: event.sourceUrl,
                externalId: event.externalId,
                scrapedAt: new Date(),
            })
            .onConflictDoUpdate({
                target: upcomingEvents.externalId,
                set: {
                    name: event.name,
                    locationName: event.locationName,
                    address: event.address,
                    eventDate: event.eventDate,
                    description: event.description,
                    source: event.source,
                    sourceUrl: event.sourceUrl,
                    scrapedAt: new Date(),
                },
            });

        if (alreadyExists) {
            updated++;
        } else {
            inserted++;
        }
    }

    return {
        total: events.length,
        inserted,
        updated,
    };
};