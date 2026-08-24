import HomePage from "@/components/HomePage";
import { FullEventDto } from "@/shared/types";

export default async function EventsPage() {
   const res = await fetch(`${process.env.API_URL}/api/events`, {
    cache: "no-store",
  });

  const events = (await res.json()) as FullEventDto[];

  return <HomePage initialEvents={events}/>

}