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

export const GET = async (request: Request,
    { params }: { params: Promise<{ id: string }> }
) => {
    const [location] = await db.select({
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
        .where(eq(eventLocations.id, (await params).id))
        .limit(1);

    if (!location) {
        return Response.json(
            { message: "Mesto nije pronađeno." },
            { status: 404 }
        );
    }

    return Response.json(location);
}