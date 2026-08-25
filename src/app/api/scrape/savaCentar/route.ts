import { NextResponse } from "next/server";
import { importSavaCentarEvents } from "@/services/scraping/importSavaCentarEvents";

export const POST = async () => {
    try {
        const result =
            await importSavaCentarEvents();

        return NextResponse.json(
            {
                message:
                    "Podaci sa Sava Centra su uspešno preuzeti.",
                data: result,
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        console.error(
            "Greška prilikom scraping-a Sava Centra:",
            error
        );

        return NextResponse.json(
            {
                message:
                    "Greška prilikom preuzimanja podataka sa Sava Centra.",
            },
            {
                status: 500,
            }
        );
    }
};