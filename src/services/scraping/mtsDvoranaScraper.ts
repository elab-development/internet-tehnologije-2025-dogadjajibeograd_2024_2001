import * as cheerio from "cheerio";

const MTS_EVENTS_URL =
    "https://www.mtsdvorana.rs/dogadjaji";

const BASE_URL =
    "https://www.mtsdvorana.rs";

const EVENT_BATCH_SIZE = 5;
const PROJECTION_BATCH_SIZE = 8;

export interface MtsDvoranaEvent {
    name: string;
    locationName: string;
    address: string;
    eventDate: string;
    description: string | null;
    source: string;
    sourceUrl: string;
    externalId: string;
}

const normalizeUrl = (
    href: string
): string | null => {
    try {
        return new URL(
            href,
            BASE_URL
        ).toString();
    } catch {
        return null;
    }
};

const convertDate = (
    value: string
): string | null => {
    const match = value.match(
        /(\d{2})\.(\d{2})\.(\d{4})/
    );

    if (!match) {
        return null;
    }

    const [, day, month, year] = match;

    return `${year}-${month}-${day}`;
};

const processInBatches = async <T, R>(
    items: T[],
    batchSize: number,
    handler: (item: T) => Promise<R>
): Promise<R[]> => {
    const results: R[] = [];

    for (
        let i = 0;
        i < items.length;
        i += batchSize
    ) {
        const batch = items.slice(
            i,
            i + batchSize
        );

        const batchResults =
            await Promise.all(
                batch.map(handler)
            );

        results.push(
            ...batchResults
        );
    }

    return results;
};

const fetchHtml = async (
    url: string
): Promise<string | null> => {
    try {
        const response = await fetch(
            url,
            {
                headers: {
                    "User-Agent":
                        "Mozilla/5.0 BelgradeEvents/1.0",
                },
                cache: "no-store",

                signal: AbortSignal.timeout(
                    10000
                ),
            }
        );

        if (!response.ok) {
            console.error(
                `Greška pri učitavanju: ${url}`
            );

            return null;
        }

        return await response.text();
    } catch (error) {
        console.error(
            `Greška pri fetch-u ${url}:`,
            error
        );

        return null;
    }
};

const getProjectionDate = async (
    projectionUrl: string
): Promise<string | null> => {
    const html =
        await fetchHtml(
            projectionUrl
        );

    if (!html) {
        return null;
    }

    const $ = cheerio.load(html);

    const pageText = $("body")
        .text()
        .replace(/\s+/g, " ")
        .trim();

    return convertDate(pageText);
};

const getDescription = (
    $: cheerio.CheerioAPI
): string | null => {
    const descriptions: string[] = [];

    $("h1")
        .first()
        .nextUntil("h2")
        .each((_, element) => {
            const text = $(element)
                .text()
                .replace(/\s+/g, " ")
                .trim();

            if (text) {
                descriptions.push(
                    text
                );
            }
        });

    if (
        descriptions.length > 0
    ) {
        return descriptions.join(
            " "
        );
    }

    const paragraphs: string[] =
        [];

    $("p").each(
        (_, element) => {
            const text = $(element)
                .text()
                .replace(/\s+/g, " ")
                .trim();

            if (!text) {
                return;
            }

            if (
                text.includes(
                    "Telefonske rezervacije"
                )
            ) {
                return;
            }

            paragraphs.push(
                text
            );
        }
    );

    return paragraphs.length > 0
        ? paragraphs.join(" ")
        : null;
};

const scrapeProjection = async (
    projectionUrl: string,
    name: string,
    description: string | null,
    eventUrl: string
): Promise<MtsDvoranaEvent | null> => {
    try {
        const eventDate =
            await getProjectionDate(
                projectionUrl
            );

        if (!eventDate) {
            return null;
        }

        const projection =
            new URL(
                projectionUrl
            );

        const projectionId =
            projection.searchParams.get(
                "id"
            );

        if (!projectionId) {
            return null;
        }

        return {
            name,
            locationName:
                "MTS Dvorana",
            address:
                "Dečanska 14, Beograd",
            eventDate,
            description,
            source:
                "MTS Dvorana",
            sourceUrl:
                eventUrl,
            externalId:
                `mts-dvorana-${projectionId}`,
        };
    } catch (error) {
        console.error(
            `Greška pri obradi termina ${projectionUrl}:`,
            error
        );

        return null;
    }
};

const scrapeEventDetails = async (
    eventUrl: string
): Promise<MtsDvoranaEvent[]> => {
    const html =
        await fetchHtml(
            eventUrl
        );

    if (!html) {
        return [];
    }

    const $ =
        cheerio.load(html);

    const name = $("h1")
        .first()
        .text()
        .replace(/\s+/g, " ")
        .trim();

    if (!name) {
        return [];
    }

    if (
        name
            .toLocaleUpperCase(
                "sr"
            )
            .includes("OTKAZANO")
    ) {
        return [];
    }

    const description =
        getDescription($);

    const projectionUrls =
        new Set<string>();

    $(
        'a[href*="/projekcija"]'
    ).each(
        (_, element) => {
            const href =
                $(element).attr(
                    "href"
                );

            if (!href) {
                return;
            }

            const url =
                normalizeUrl(
                    href
                );

            if (url) {
                projectionUrls.add(
                    url
                );
            }
        }
    );

    const projectionResults =
        await processInBatches(
            Array.from(
                projectionUrls
            ),
            PROJECTION_BATCH_SIZE,
            async (
                projectionUrl
            ) => {
                return await scrapeProjection(
                    projectionUrl,
                    name,
                    description,
                    eventUrl
                );
            }
        );

    return projectionResults.filter(
        (
            event
        ): event is MtsDvoranaEvent =>
            event !== null
    );
};

export const scrapeMtsDvoranaEvents =
    async (): Promise<
        MtsDvoranaEvent[]
    > => {
        const html =
            await fetchHtml(
                MTS_EVENTS_URL
            );

        if (!html) {
            throw new Error(
                "Nije moguće učitati stranicu MTS Dvorane."
            );
        }

        const $ =
            cheerio.load(html);

        const eventUrls =
            new Set<string>();

        $(
            'a[href*="/dogadjaj/"]'
        ).each(
            (_, element) => {
                const href =
                    $(element).attr(
                        "href"
                    );

                if (!href) {
                    return;
                }

                const url =
                    normalizeUrl(
                        href
                    );

                if (!url) {
                    return;
                }

                const pathname =
                    new URL(
                        url
                    ).pathname;

                if (
                    !pathname.startsWith(
                        "/dogadjaj/"
                    )
                ) {
                    return;
                }

                eventUrls.add(
                    url
                );
            }
        );

        const results =
            await processInBatches(
                Array.from(
                    eventUrls
                ),
                EVENT_BATCH_SIZE,
                async (
                    eventUrl
                ) => {
                    try {
                        return await scrapeEventDetails(
                            eventUrl
                        );
                    } catch (
                    error
                    ) {
                        console.error(
                            `Greška pri scraping-u ${eventUrl}:`,
                            error
                        );

                        return [];
                    }
                }
            );

        const events =
            results.flat();

        const today =
            new Date()
                .toISOString()
                .split("T")[0];

        return events.filter(
            (event) =>
                event.eventDate >=
                today
        );
    };