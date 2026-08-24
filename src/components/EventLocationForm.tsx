import Image from "next/image";
import { FullEventLocationDto } from "@/shared/types";
import EventLocationMap from "@/components/EventLocationMap";

type Props = {
    location: FullEventLocationDto;
};

const typeLabels: Record<string, string> = {
    pozoriste: "Pozorište",
    bioskop: "Bioskop",
    koncertna_dvorana: "Koncertna dvorana",
    centar_za_kulturu: "Centar za kulturu",
    drugo: "Drugo",
};

export default function EventLocationForm({ location }: Props) {
    return (
        <main className="min-h-screen bg-[#EDFAF9] px-6 py-12">
            <div className="mx-auto max-w-6xl">
                <div className="grid gap-8 lg:grid-cols-[1fr_420px]">

                    {/* Location details */}
                    <div>
                        <h1 className="text-3xl font-bold text-[#163536] md:text-4xl">
                            {location.name}
                        </h1>

                        {/* Image */}
                        <div className="mt-6 overflow-hidden rounded-3xl border border-[#008C95]/10 bg-white shadow-sm">
                            <div className="relative h-[280px] w-full">
                                {location.imageUrl ? (
                                    <Image
                                        src={location.imageUrl}
                                        alt={location.name}
                                        fill
                                        priority
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center bg-[#DDF5F2]">
                                        <span className="text-sm font-medium text-[#52677D]">
                                            Slika nije dostupna
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mt-8 pt-7">
                            <h2 className="text-xl font-semibold text-[#163536]">
                                Informacije o lokaciji
                            </h2>

                            <div className="mt-6 space-y-6">
                                <div>
                                    <p className="text-sm font-medium text-[#52677D]">
                                        Adresa
                                    </p>

                                    <p className="mt-1 text-base font-semibold text-[#163536]">
                                        {location.address || "Adresa nije dostupna"}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-[#52677D]">
                                        Tip lokacije
                                    </p>

                                    <p className="mt-1 text-base font-semibold text-[#163536]">
                                        {typeLabels[location.type] ?? location.type}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mapp */}
                    <div className="space-y-6">
                        {location.latitude != null &&
                            location.longitude != null && (
                                <div className="overflow-hidden rounded-2xl">
                                    <EventLocationMap
                                        name={location.name}
                                        latitude={location.latitude}
                                        longitude={location.longitude}
                                    />
                                </div>
                            )}
                    </div>
                </div>
            </div>
        </main>
    );
}