import {
    NextResponse,
} from "next/server";

import {
    importDomOmladineEvents,
} from "@/services/scraping/importDomOmladineEvents";

export const POST =
    async () => {
        try {
            const result =
                await importDomOmladineEvents();

            return NextResponse.json(
                {
                    message:
                        "Podaci sa Doma omladine su uspešno preuzeti.",

                    data:
                        result,
                },
                {
                    status: 200,
                }
            );
        } catch (error) {
            console.error(
                "Dom omladine scraping error:",
                error
            );

            return NextResponse.json(
                {
                    message:
                        "Greška prilikom preuzimanja podataka sa Doma omladine.",

                    error:
                        error instanceof Error
                            ? error.message
                            : "Nepoznata greška.",
                },
                {
                    status: 500,
                }
            );
        }
    };