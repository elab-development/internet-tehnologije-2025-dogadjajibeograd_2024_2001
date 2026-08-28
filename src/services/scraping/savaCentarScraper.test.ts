import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { scrapeSavaCentarEvents } from "./savaCentarScraper";

describe("Sava Centar scraper", () => {
    beforeEach(() => {
        vi.resetAllMocks();
        vi.useFakeTimers();
        vi.setSystemTime(new Date("2026-08-28T10:00:00.000Z"));
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.restoreAllMocks();
    });

    it("uspešno učitava i formatira događaj", async () => {
        const mainPageHtml = `
            <html>
                <body>
                    <a href="/dogadjaji/hamlet/">
                        Hamlet
                    </a>
                </body>
            </html>
        `;

        const eventPageHtml = `
            <html>
                <body>
                    <h1>Hamlet</h1>
                    <h2>30.08.2026.</h2>

                    <p>
                        Pozorišna predstava Hamlet.
                    </p>
                </body>
            </html>
        `;

        vi.spyOn(global, "fetch")
            .mockResolvedValueOnce({
                ok: true,
                text: async () => mainPageHtml,
            } as Response)
            .mockResolvedValueOnce({
                ok: true,
                text: async () => eventPageHtml,
            } as Response);

        const events = await scrapeSavaCentarEvents();

        expect(events).toHaveLength(1);

        expect(events[0]).toEqual({
            name: "Hamlet",
            locationName: "Sava Centar - Plava Dvorana",
            address: "Milentija Popovića 9, Beograd",
            eventDate: "2026-08-30",
            description: "Pozorišna predstava Hamlet.",
            source: "Sava Centar",
            sourceUrl:
                "https://savacentar.rs/dogadjaji/hamlet/",
            externalId: "sava-centar-hamlet",
        });
    });

    it("pravilno formatira datum za upis u bazu", async () => {
        const mainPageHtml = `
            <a href="/dogadjaji/koncert/">
                Koncert
            </a>
        `;

        const eventPageHtml = `
            <html>
                <body>
                    <h1>Koncert</h1>

                    <h2>
                        Datum događaja: 15.09.2026.
                    </h2>

                    <p>Opis koncerta.</p>
                </body>
            </html>
        `;

        vi.spyOn(global, "fetch")
            .mockResolvedValueOnce({
                ok: true,
                text: async () => mainPageHtml,
            } as Response)
            .mockResolvedValueOnce({
                ok: true,
                text: async () => eventPageHtml,
            } as Response);

        const events = await scrapeSavaCentarEvents();

        expect(events).toHaveLength(1);

        expect(events[0].eventDate).toBe(
            "2026-09-15"
        );
    });

    it("pravilno kreira externalId događaja", async () => {
        const mainPageHtml = `
            <a href="/dogadjaji/moja-predstava/">
                Moja predstava
            </a>
        `;

        const eventPageHtml = `
            <html>
                <body>
                    <h1>Moja predstava</h1>
                    <h2>10.09.2026.</h2>
                    <p>Opis predstave.</p>
                </body>
            </html>
        `;

        vi.spyOn(global, "fetch")
            .mockResolvedValueOnce({
                ok: true,
                text: async () => mainPageHtml,
            } as Response)
            .mockResolvedValueOnce({
                ok: true,
                text: async () => eventPageHtml,
            } as Response);

        const events = await scrapeSavaCentarEvents();

        expect(events).toHaveLength(1);

        expect(events[0].externalId).toBe(
            "sava-centar-moja-predstava"
        );
    });

    it("ne dodaje isti događaj više puta", async () => {
        const mainPageHtml = `
            <html>
                <body>
                    <a href="/dogadjaji/hamlet/">
                        Hamlet
                    </a>

                    <a href="/dogadjaji/hamlet/">
                        Hamlet
                    </a>
                </body>
            </html>
        `;

        const eventPageHtml = `
            <html>
                <body>
                    <h1>Hamlet</h1>
                    <h2>30.08.2026.</h2>
                    <p>Opis događaja.</p>
                </body>
            </html>
        `;

        const fetchMock = vi
            .spyOn(global, "fetch")
            .mockResolvedValueOnce({
                ok: true,
                text: async () => mainPageHtml,
            } as Response)
            .mockResolvedValueOnce({
                ok: true,
                text: async () => eventPageHtml,
            } as Response);

        const events = await scrapeSavaCentarEvents();

        expect(events).toHaveLength(1);

        // Jedan zahtev za glavnu stranicu
        // + jedan zahtev za događaj.
        expect(fetchMock).toHaveBeenCalledTimes(2);
    });

    it("ignoriše događaj bez naziva", async () => {
        const mainPageHtml = `
            <a href="/dogadjaji/test/">
                Test
            </a>
        `;

        const eventPageHtml = `
            <html>
                <body>
                    <h2>30.08.2026.</h2>
                    <p>Opis događaja.</p>
                </body>
            </html>
        `;

        vi.spyOn(global, "fetch")
            .mockResolvedValueOnce({
                ok: true,
                text: async () => mainPageHtml,
            } as Response)
            .mockResolvedValueOnce({
                ok: true,
                text: async () => eventPageHtml,
            } as Response);

        const events = await scrapeSavaCentarEvents();

        expect(events).toEqual([]);
    });

    it("ignoriše događaj sa datumom koji nije u očekivanom formatu", async () => {
        const mainPageHtml = `
            <a href="/dogadjaji/test/">
                Test
            </a>
        `;

        const eventPageHtml = `
            <html>
                <body>
                    <h1>Test događaj</h1>
                    <h2>Datum će biti objavljen naknadno</h2>
                    <p>Opis događaja.</p>
                </body>
            </html>
        `;

        vi.spyOn(global, "fetch")
            .mockResolvedValueOnce({
                ok: true,
                text: async () => mainPageHtml,
            } as Response)
            .mockResolvedValueOnce({
                ok: true,
                text: async () => eventPageHtml,
            } as Response);

        const events = await scrapeSavaCentarEvents();

        expect(events).toEqual([]);
    });

    it("ne vraća događaje koji su prošli", async () => {
        const mainPageHtml = `
            <a href="/dogadjaji/stari-dogadjaj/">
                Stari događaj
            </a>
        `;

        const eventPageHtml = `
            <html>
                <body>
                    <h1>Stari događaj</h1>
                    <h2>20.08.2026.</h2>
                    <p>Opis starog događaja.</p>
                </body>
            </html>
        `;

        vi.spyOn(global, "fetch")
            .mockResolvedValueOnce({
                ok: true,
                text: async () => mainPageHtml,
            } as Response)
            .mockResolvedValueOnce({
                ok: true,
                text: async () => eventPageHtml,
            } as Response);

        const events = await scrapeSavaCentarEvents();

        expect(events).toEqual([]);
    });

    it("izbacuje grešku kada glavna stranica Sava Centra nije dostupna", async () => {
        vi.spyOn(global, "fetch")
            .mockResolvedValueOnce({
                ok: false,
            } as Response);

        await expect(
            scrapeSavaCentarEvents()
        ).rejects.toThrow(
            "Nije moguće učitati stranicu Sava Centra."
        );
    });

    it("ignoriše događaj kada njegova stranica nije dostupna", async () => {
        const consoleErrorSpy = vi
            .spyOn(console, "error")
            .mockImplementation(() => { });

        const mainPageHtml = `
            <a href="/dogadjaji/test/">
                Test
            </a>
        `;

        vi.spyOn(global, "fetch")
            .mockResolvedValueOnce({
                ok: true,
                text: async () => mainPageHtml,
            } as Response)
            .mockResolvedValueOnce({
                ok: false,
            } as Response);

        const events = await scrapeSavaCentarEvents();

        expect(events).toEqual([]);

        expect(consoleErrorSpy).toHaveBeenCalled();
    });
});