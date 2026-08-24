import { db } from "@/db";
import { eventLocations } from "@/db/schema";
import { eq } from "drizzle-orm";

export interface EventLocationDto {
    id: string;
    name: string;
    type:
        | "pozoriste"
        | "bioskop"
        | "koncertna_dvorana"
        | "centar_za_kulturu"
        | "drugo";
    address: string;
    latitude: number;
    longitude: number;
    imageUrl: string | null;
    createdAt: Date;
}

export const GET = async (request: Request) => {
    const { searchParams } = new URL(request.url);

    const type = searchParams.get("type");

    const validTypes = [
        "pozoriste",
        "bioskop",
        "koncertna_dvorana",
        "centar_za_kulturu",
        "drugo",
    ] as const;

    const locationType = validTypes.find((item) => item === type);

    const eventLocationDto = await db
        .select({
            id: eventLocations.id,
            name: eventLocations.name,
            type: eventLocations.type,
            address: eventLocations.address,
            latitude: eventLocations.latitude,
            longitude: eventLocations.longitude,
            imageUrl: eventLocations.imageUrl,
            createdAt: eventLocations.createdAt,
        })
        .from(eventLocations)
        .where(
            locationType
                ? eq(eventLocations.type, locationType)
                : undefined
        )
        .orderBy(eventLocations.type, eventLocations.name);

    return Response.json(eventLocationDto);
};
