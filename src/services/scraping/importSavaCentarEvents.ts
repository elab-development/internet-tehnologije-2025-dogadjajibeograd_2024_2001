import { db } from "@/db";
import { upcomingEvents } from "@/db/schema";
import { scrapeSavaCentarEvents } from "./savaCentarScraper";

export const importSavaCentarEvents = async () => {
    const scrapedEvents =
        await scrapeSavaCentarEvents();

    let inserted = 0;
    let updated = 0;

    for (const event of scrapedEvents) {
        const result = await db
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
                    sourceUrl: event.sourceUrl,
                    scrapedAt: new Date(),
                },
            })
            .returning();

        if (result.length > 0) {
            inserted++;
        }
    }

    return {
        total: scrapedEvents.length,
        inserted,
        updated,
    };
};