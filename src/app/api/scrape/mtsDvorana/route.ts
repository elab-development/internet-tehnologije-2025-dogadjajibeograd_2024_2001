import { NextResponse } from "next/server";
import { importMtsDvoranaEvents } from "@/services/scraping/importMtsDvoranaEvents";

export const POST = async () => {
    try {
        const result =
            await importMtsDvoranaEvents();

        return NextResponse.json(
            {
                message:
                    "Podaci sa MTS Dvorane su uspešno preuzeti.",
                data: result,
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        console.error(
            "MTS Dvorana scraping error:",
            error
        );

        return NextResponse.json(
            {
                message:
                    "Greška prilikom preuzimanja podataka sa MTS Dvorane.",
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