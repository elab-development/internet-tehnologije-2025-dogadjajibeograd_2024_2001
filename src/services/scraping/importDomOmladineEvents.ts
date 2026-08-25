import { db } from "@/db";
import { upcomingEvents } from "@/db/schema";
import { eq } from "drizzle-orm";
import { scrapeDomOmladineEvents } from "./domOmladineScraper";

export const importDomOmladineEvents = async () => {
    const events = await scrapeDomOmladineEvents();

    let inserted = 0;
    let updated = 0;

    for (const event of events) {
        const existingEvent = await db
            .select({
                id: upcomingEvents.id,
            })
            .from(upcomingEvents)
            .where(
                eq(
                    upcomingEvents.externalId,
                    event.externalId
                )
            )
            .limit(1);

        if (existingEvent.length > 0) {
            await db
                .update(upcomingEvents)
                .set({
                    name: event.name,
                    locationName: event.locationName,
                    address: event.address,
                    eventDate: event.eventDate,
                    description: event.description,
                    source: event.source,
                    sourceUrl: event.sourceUrl,
                    scrapedAt: new Date(),
                })
                .where(
                    eq(
                        upcomingEvents.externalId,
                        event.externalId
                    )
                );

            updated++;
        } else {
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
                });

            inserted++;
        }
    }

    return {
        total: events.length,
        inserted,
        updated,
    };
};