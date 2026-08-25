import * as cheerio from "cheerio";

const DOM_OMLADINE_URL =
    "https://domomladine.org/kalendar/";

const BASE_URL =
    "https://domomladine.org";

export interface DomOmladineEvent {
    name: string;
    locationName: string;
    address: string;
    eventDate: string;
    description: string | null;
    source: string;
    sourceUrl: string;
    externalId: string;
}

const normalizeText = (value: string) => {
    return value
        .replace(/\u00a0/g, " ")
        .replace(/\s+/g, " ")
        .trim();
};

const monthMap: Record<string, string> = {
    januar: "01",
    januara: "01",

    februar: "02",
    februara: "02",

    mart: "03",
    marta: "03",

    april: "04",
    aprila: "04",

    maj: "05",
    maja: "05",

    jun: "06",
    juna: "06",

    jul: "07",
    jula: "07",

    avgust: "08",
    avgusta: "08",

    septembar: "09",
    septembra: "09",

    oktobar: "10",
    oktobra: "10",

    novembar: "11",
    novembra: "11",

    decembar: "12",
    decembra: "12",
};

const convertDate = (
    text: string
): string | null => {
    const normalized =
        text.toLocaleLowerCase("sr");

    /*
        Primer:

        Utorak, 8. septembar 2026. u 19.00

        ili:

        Od 11. do 28. avgusta 2026.
    */

    const fullDateMatch =
        normalized.match(
            /(\d{1,2})\.\s*([a-zčćžšđ]+)\s+(\d{4})/
        );

    if (fullDateMatch) {
        const [, day, monthName, year] =
            fullDateMatch;

        const month =
            monthMap[monthName];

        if (!month) {
            return null;
        }

        return `${year}-${month}-${day.padStart(
            2,
            "0"
        )}`;
    }

    /*
        Poseban slučaj:

        Od 11. do 28. avgusta 2026.

        Hoćemo početni datum:
        11.08.2026.
    */

    const rangeMatch =
        normalized.match(
            /od\s+(\d{1,2})\.\s+do\s+\d{1,2}\.\s+([a-zčćžšđ]+)\s+(\d{4})/
        );

    if (rangeMatch) {
        const [, day, monthName, year] =
            rangeMatch;

        const month =
            monthMap[monthName];

        if (!month) {
            return null;
        }

        return `${year}-${month}-${day.padStart(
            2,
            "0"
        )}`;
    }

    /*
        Primer:

        Od 27. maja do 31. avgusta 2026.

        Ovde početni mesec nije isti kao krajnji.
    */

    const longRangeMatch =
        normalized.match(
            /od\s+(\d{1,2})\.\s+([a-zčćžšđ]+)\s+do\s+\d{1,2}\.\s+[a-zčćžšđ]+\s+(\d{4})/
        );

    if (longRangeMatch) {
        const [, day, monthName, year] =
            longRangeMatch;

        const month =
            monthMap[monthName];

        if (!month) {
            return null;
        }

        return `${year}-${month}-${day.padStart(
            2,
            "0"
        )}`;
    }

    return null;
};

const getExternalId = (
    url: string
) => {
    const parsed = new URL(url);

    return (
        "dom-omladine-" +
        parsed.pathname
            .replace(/^\/+|\/+$/g, "")
            .replaceAll("/", "-")
    );
};

const getLocation = (
    eventInfo: string
): string => {
    const normalized =
        normalizeText(eventInfo);

    /*
        Na sajtu se pojavljuju lokacije kao:

        DOB//Amerikana
        DOB//Galerija
        DOB//Klub
        DOB//Velika sala
    */

    const locationMatch =
        normalized.match(
            /DOB\/\/[^–—,\n]+/i
        );

    if (locationMatch) {
        return normalizeText(
            locationMatch[0]
        );
    }

    return "Dom omladine Beograda";
};

const getDescription = (
    $: cheerio.CheerioAPI
): string | null => {
    const paragraphs: string[] = [];

    $("h1")
        .first()
        .nextAll()
        .each((_, element) => {
            const tag =
                element.tagName?.toLowerCase();

            /*
                Ne idemo do navigacije
                "prethodni / sledeći".
            */

            const text = normalizeText(
                $(element).text()
            );

            if (
                text.includes("← prethodni") ||
                text.includes("sledeći →")
            ) {
                return false;
            }

            if (tag === "p" && text) {
                paragraphs.push(text);
            }
        });

    if (paragraphs.length === 0) {
        return null;
    }

    /*
        Prvi pasus je često glavni opis.
        Nećemo čuvati celu ogromnu stranicu.
    */

    return paragraphs
        .slice(0, 3)
        .join(" ");
};

const scrapeEventDetails = async (
    url: string
): Promise<DomOmladineEvent | null> => {
    const response =
        await fetch(url, {
            headers: {
                "User-Agent":
                    "Mozilla/5.0 BelgradeEvents/1.0",
            },

            cache: "no-store",
        });

    if (!response.ok) {
        console.error(
            `Greška pri učitavanju događaja: ${url}`
        );

        return null;
    }

    const html =
        await response.text();

    const $ =
        cheerio.load(html);

    const name =
        normalizeText(
            $("h1")
                .first()
                .text()
        );

    if (!name) {
        return null;
    }

    /*
        Informacija odmah nakon naslova
        sadrži datum/vreme/lokaciju.
    */

    const heading =
        $("h1").first();

    let eventInfo = "";

    let current =
        heading.next();

    for (
        let i = 0;
        i < 5 && current.length > 0;
        i++
    ) {
        const text =
            normalizeText(
                current.text()
            );

        if (
            text &&
            (
                text.match(/\d{4}/) ||
                text.includes("DOB//")
            )
        ) {
            eventInfo = text;
            break;
        }

        current =
            current.next();
    }

    /*
        Rezervna opcija ako je datum
        smešten u drugom elementu.
    */

    if (!eventInfo) {
        const bodyText =
            normalizeText(
                $("body").text()
            );

        const match =
            bodyText.match(
                /(?:Ponedeljak|Utorak|Sreda|Četvrtak|Petak|Subota|Nedelja|Od)\b.{0,120}?\d{4}\.?[^]*?(?:DOB\/\/[^\s]+)?/i
            );

        if (match) {
            eventInfo =
                match[0];
        }
    }

    const eventDate =
        convertDate(eventInfo);

    if (!eventDate) {
        console.warn(
            `Datum nije pronađen za: ${name}`
        );

        return null;
    }

    const locationName =
        getLocation(eventInfo);

    const description =
        getDescription($);

    return {
        name,

        locationName,

        address:
            "Makedonska 22, Beograd",

        eventDate,

        description,

        source:
            "Dom omladine Beograda",

        sourceUrl:
            url,

        externalId:
            getExternalId(url),
    };
};

export const scrapeDomOmladineEvents =
    async (): Promise<
        DomOmladineEvent[]
    > => {
        const response =
            await fetch(
                DOM_OMLADINE_URL,
                {
                    headers: {
                        "User-Agent":
                            "Mozilla/5.0 BelgradeEvents/1.0",
                    },

                    cache: "no-store",
                }
            );

        if (!response.ok) {
            throw new Error(
                "Nije moguće učitati kalendar Doma omladine."
            );
        }

        const html =
            await response.text();

        const $ =
            cheerio.load(html);

        const eventUrls =
            new Set<string>();

        /*
            Događaji Doma omladine imaju različite
            kategorije, npr:

            /koncerti/...
            /filmovi/...
            /debate/...
            /izlozbe/...
            /pozoriste/...
            /radionice/...
        */

        const allowedPaths = [
            "/koncerti/",
            "/filmovi/",
            "/debate/",
            "/izlozbe/",
            "/pozoriste/",
            "/radionice/",
        ];

        $("a[href]").each(
            (_, element) => {
                const href =
                    $(element).attr(
                        "href"
                    );

                if (!href) {
                    return;
                }

                let url: URL;

                try {
                    url =
                        new URL(
                            href,
                            BASE_URL
                        );
                } catch {
                    return;
                }

                /*
                    Samo Dom omladine.
                */

                if (
                    url.hostname !==
                    "domomladine.org"
                ) {
                    return;
                }

                const isEvent =
                    allowedPaths.some(
                        (path) =>
                            url.pathname.startsWith(
                                path
                            ) &&
                            url.pathname !==
                            path
                    );

                if (!isEvent) {
                    return;
                }

                eventUrls.add(
                    url.toString()
                );
            }
        );

        const events:
            DomOmladineEvent[] = [];

        for (
            const eventUrl
            of eventUrls
        ) {
            try {
                const event =
                    await scrapeEventDetails(
                        eventUrl
                    );

                if (event) {
                    events.push(
                        event
                    );
                }
            } catch (error) {
                console.error(
                    `Greška pri scraping-u ${eventUrl}:`,
                    error
                );
            }
        }

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