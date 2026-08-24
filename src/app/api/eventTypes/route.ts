import { db } from "@/db";
import { eventTypes } from "@/db/schema";

export interface EventTypeDto{
    id: string;
    name: string;
}

export const GET = async (request: Request) =>{
    const eventTypeDto = await db.select({
        id: eventTypes.id,
        name: eventTypes.name,
    })
    .from(eventTypes);
    return Response.json(eventTypeDto);
}