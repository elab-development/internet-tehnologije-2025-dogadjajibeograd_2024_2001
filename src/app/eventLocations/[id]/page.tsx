import EventLocationForm from "@/components/EventLocationForm";
import { FullEventLocationDto } from "@/shared/types";
import { notFound } from "next/navigation";

type Props = {
    params: Promise<{
        id: string;
    }>;
};

export default async function EventLocationPage({ params }: Props) {
    const { id } = await params;

    const res = await fetch(
        `${process.env.API_URL}/api/eventLocations/${id}`,
        {
            cache: "no-store",
        }
    );

    if (res.status === 404) {
        notFound();
    }

    if (!res.ok) {
        throw new Error("Greška pri učitavanju lokacije.");
    }

    const location = (await res.json()) as FullEventLocationDto;

    return <EventLocationForm location={location} />;
}