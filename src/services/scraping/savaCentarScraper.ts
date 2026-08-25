import * as cheerio from "cheerio";

const SAVA_CENTAR_URL =
    "https://savacentar.rs/dogadjaji-u-plavoj-dvorani/";

const BASE_URL = "https://savacentar.rs";

export interface SavaCentarEvent {
    name: string;
    locationName: string;
    address: string;
    eventDate: string;
    description: string | null;
    source: string;
    sourceUrl: string;
    externalId: string;
}

const convertDate = (date: string): string | null => {
    const match = date.match(/(\d{2})\.(\d{2})\.(\d{4})/);

    if (!match) {
        return null;
    }

    const [, day, month, year] = match;

    return `${year}-${month}-${day}`;
};

const getExternalId = (url: string) => {
    const parsedUrl = new URL(url);

    return parsedUrl.pathname
        .replace("/dogadjaji/", "")
        .replaceAll("/", "");
};

const scrapeEventDetails = async (
    url: string
): Promise<SavaCentarEvent | null> => {
    const response = await fetch(url, {
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

    const html = await response.text();

    const $ = cheerio.load(html);

    const name = $("h1").first().text().trim();

    const rawDate = $("h2").first().text().trim();

    const eventDate = convertDate(rawDate);

    if (!name || !eventDate) {
        return null;
    }


    const paragraphs: string[] = [];

    $("p").each((_, element) => {
        const text = $(element)
            .text()
            .replace(/\s+/g, " ")
            .trim();

        if (!text) {
            return;
        }

        if (
            text.includes("Ulaznice možete kupiti") ||
            text.includes("Sava Centar nije organizator") ||
            text.includes("Ulaznice za događaje dostupne") ||
            text.includes("Pristupačnost")
        ) {
            return;
        }

        paragraphs.push(text);
    });

    const description =
        paragraphs.length > 0
            ? paragraphs[0]
            : null;

    return {
        name,
        locationName: "Sava Centar - Plava Dvorana",
        address: "Milentija Popovića 9, Beograd",
        eventDate,
        description,
        source: "Sava Centar",
        sourceUrl: url,
        externalId: `sava-centar-${getExternalId(url)}`,
    };
};

export const scrapeSavaCentarEvents = async () => {
    const response = await fetch(SAVA_CENTAR_URL, {
        headers: {
            "User-Agent":
                "Mozilla/5.0 BelgradeEvents/1.0",
        },
        cache: "no-store",
    });

    if (!response.ok) {
        throw new Error(
            "Nije moguće učitati stranicu Sava Centra."
        );
    }

    const html = await response.text();

    const $ = cheerio.load(html);

    const eventUrls = new Set<string>();


    $('a[href*="/dogadjaji/"]').each((_, element) => {
        const href = $(element).attr("href");

        if (!href) {
            return;
        }

        let absoluteUrl: string;

        try {
            absoluteUrl = new URL(
                href,
                BASE_URL
            ).toString();
        } catch {
            return;
        }

        const pathname =
            new URL(absoluteUrl).pathname;

        if (
            pathname === "/dogadjaji/" ||
            pathname ===
                "/dogadjaji-u-plavoj-dvorani/"
        ) {
            return;
        }

        if (!pathname.startsWith("/dogadjaji/")) {
            return;
        }

        eventUrls.add(absoluteUrl);
    });

    const events: SavaCentarEvent[] = [];

    for (const url of eventUrls) {
        try {
            const event =
                await scrapeEventDetails(url);

            if (event) {
                events.push(event);
            }
        } catch (error) {
            console.error(
                `Greška prilikom scraping-a ${url}`,
                error
            );
        }
    }

    const today = new Date();

    const todayString =
        today.toISOString().split("T")[0];

    return events.filter(
        (event) =>
            event.eventDate >= todayString
    );
};