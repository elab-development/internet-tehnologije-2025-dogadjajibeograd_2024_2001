import "dotenv/config";

import { db } from "@/db";
import {
    users,
    eventTypes,
    eventLocations,
    events,
    favoriteEvents,
} from "@/db/schema";

import bcrypt from "bcrypt";

const seed = async () => {
    try {
        const password1 = await bcrypt.hash("Petar123!", 10);
        const password2 = await bcrypt.hash("Jovana123!", 10);
        const adminPassword = await bcrypt.hash("Admin123!", 10);

        const insertedUsers = await db
            .insert(users)
            .values([
                {
                    firstName: "Petar",
                    lastName: "Petrović",
                    email: "petar.petrovic@gmail.com",
                    passHash: password1,
                    dateOfBirth: "1998-05-14",
                    role: "user",
                },
                {
                    firstName: "Jovana",
                    lastName: "Jovanović",
                    email: "jovana.jovanovic@gmail.com",
                    passHash: password2,
                    dateOfBirth: "2000-09-22",
                    role: "user",
                },
                {
                    firstName: "Marko",
                    lastName: "Marković",
                    email: "admin@belgradeevents.rs",
                    passHash: adminPassword,
                    dateOfBirth: "1995-03-10",
                    role: "admin",
                },
            ])
            .onConflictDoNothing()
            .returning();

        console.log("Users seeded successfully.");

        const insertedEventTypes = await db
            .insert(eventTypes)
            .values([
                {
                    name: "Predstava",
                },
                {
                    name: "Opera",
                },
                {
                    name: "Balet",
                },
                {
                    name: "Mjuzikl",
                },
                {
                    name: "Koncert",
                },
                {
                    name: "Književni događaj",
                },
                {
                    name: "Film",
                },
                {
                    name: "Izložba",
                },
                {
                    name: "Radionica",
                },
                {
                    name: "Drugo",
                },
            ])
            .returning();

        console.log("Event types seeded successfully.");

        const insertedLocations = await db
            .insert(eventLocations)
            .values([
                {
                    name: "Narodno pozorište",
                    type: "pozoriste",
                    address: "Francuska 3, Beograd",
                    latitude: 44.8163,
                    longitude: 20.4607,
                },
                {
                    name: "Atelje 212",
                    type: "pozoriste",
                    address: "Svetogorska 21, Beograd",
                    latitude: 44.8138,
                    longitude: 20.4699,
                },
                {
                    name: "Jugoslovensko dramsko pozorište",
                    type: "pozoriste",
                    address: "Kralja Milana 50, Beograd",
                    latitude: 44.8054,
                    longitude: 20.4633,
                },
                {
                    name: "Sava Centar",
                    type: "koncertna_dvorana",
                    address: "Milentija Popovića 9, Beograd",
                    latitude: 44.8085,
                    longitude: 20.4326,
                },
                {
                    name: "Dom omladine Beograda",
                    type: "centar_za_kulturu",
                    address: "Makedonska 22, Beograd",
                    latitude: 44.8152,
                    longitude: 20.4634,
                },
                {
                    name: "Kulturni centar Beograda",
                    type: "centar_za_kulturu",
                    address: "Knez Mihailova 6, Beograd",
                    latitude: 44.8154,
                    longitude: 20.4598,
                },
                {
                    name: "Cineplexx Galerija",
                    type: "bioskop",
                    address: "Bulevar Vudroa Vilsona 12, Beograd",
                    latitude: 44.8016,
                    longitude: 20.4387,
                },
            ])
            .returning();

        console.log("Event locations seeded successfully.");

        const predstavaType = insertedEventTypes.find(
            (type) => type.name === "Predstava",
        );

        const operaType = insertedEventTypes.find(
            (type) => type.name === "Opera",
        );

        const baletType = insertedEventTypes.find(
            (type) => type.name === "Balet",
        );

        const mjuziklType = insertedEventTypes.find(
            (type) => type.name === "Mjuzikl",
        );

        const koncertType = insertedEventTypes.find(
            (type) => type.name === "Koncert",
        );

        const knjizevniType = insertedEventTypes.find(
            (type) => type.name === "Književni događaj",
        );

        const filmType = insertedEventTypes.find(
            (type) => type.name === "Film",
        );

        const izlozbaType = insertedEventTypes.find(
            (type) => type.name === "Izložba",
        );

        const narodnoPozoriste = insertedLocations.find(
            (location) => location.name === "Narodno pozorište",
        );

        const atelje212 = insertedLocations.find(
            (location) => location.name === "Atelje 212",
        );

        const jdp = insertedLocations.find(
            (location) =>
                location.name === "Jugoslovensko dramsko pozorište",
        );

        const savaCentar = insertedLocations.find(
            (location) => location.name === "Sava Centar",
        );

        const domOmladine = insertedLocations.find(
            (location) => location.name === "Dom omladine Beograda",
        );

        const kulturniCentar = insertedLocations.find(
            (location) => location.name === "Kulturni centar Beograda",
        );

        const cineplexx = insertedLocations.find(
            (location) => location.name === "Cineplexx Galerija",
        );

        if (
            !predstavaType ||
            !operaType ||
            !baletType ||
            !mjuziklType ||
            !koncertType ||
            !knjizevniType ||
            !filmType ||
            !izlozbaType ||
            !narodnoPozoriste ||
            !atelje212 ||
            !jdp ||
            !savaCentar ||
            !domOmladine ||
            !kulturniCentar ||
            !cineplexx
        ) {
            throw new Error("Missing required seed data.");
        }

        const insertedEvents = await db
            .insert(events)
            .values([
                {
                    name: "Hamlet",
                    description:
                        "Pozorišna predstava po delu Vilijama Šekspira.",
                    eventDate: "2026-09-10",
                    eventTime: "19:30",
                    eventTypeId: predstavaType.id,
                    locationId: narodnoPozoriste.id,
                },
                {
                    name: "Koštana",
                    description:
                        "Pozorišna predstava zasnovana na delu Bore Stankovića.",
                    eventDate: "2026-09-15",
                    eventTime: "20:00",
                    eventTypeId: predstavaType.id,
                    locationId: jdp.id,
                },
                {
                    name: "Travijata",
                    description:
                        "Opera Đuzepea Verdija u izvođenju Opere Narodnog pozorišta.",
                    eventDate: "2026-09-20",
                    eventTime: "19:00",
                    eventTypeId: operaType.id,
                    locationId: narodnoPozoriste.id,
                },
                {
                    name: "Labudovo jezero",
                    description:
                        "Klasični balet Petra Iljiča Čajkovskog.",
                    eventDate: "2026-09-25",
                    eventTime: "19:30",
                    eventTypeId: baletType.id,
                    locationId: narodnoPozoriste.id,
                },
                {
                    name: "Mamma Mia!",
                    description:
                        "Muzički spektakl inspirisan pesmama grupe ABBA.",
                    eventDate: "2026-10-02",
                    eventTime: "20:00",
                    eventTypeId: mjuziklType.id,
                    locationId: savaCentar.id,
                },
                {
                    name: "Veče filmske muzike",
                    description:
                        "Koncert poznatih kompozicija iz domaćih i stranih filmova.",
                    eventDate: "2026-10-05",
                    eventTime: "20:00",
                    eventTypeId: koncertType.id,
                    locationId: savaCentar.id,
                },
                {
                    name: "Razgovor sa savremenim piscima",
                    description:
                        "Književno veče posvećeno savremenoj srpskoj književnosti.",
                    eventDate: "2026-10-08",
                    eventTime: "18:00",
                    eventTypeId: knjizevniType.id,
                    locationId: domOmladine.id,
                },
                {
                    name: "Veče evropskog filma",
                    description:
                        "Projekcija odabranog evropskog filma uz razgovor nakon projekcije.",
                    eventDate: "2026-10-12",
                    eventTime: "20:30",
                    eventTypeId: filmType.id,
                    locationId: cineplexx.id,
                },
                {
                    name: "Savremena umetnost Beograda",
                    description:
                        "Izložba radova savremenih umetnika iz Srbije.",
                    eventDate: "2026-10-15",
                    eventTime: "18:00",
                    eventTypeId: izlozbaType.id,
                    locationId: kulturniCentar.id,
                },
                {
                    name: "Komad o svakodnevici",
                    description:
                        "Savremena pozorišna predstava o životu u velikom gradu.",
                    eventDate: "2026-10-18",
                    eventTime: "20:00",
                    eventTypeId: predstavaType.id,
                    locationId: atelje212.id,
                },
            ])
            .returning();

        console.log("Events seeded successfully.");

        const petar = insertedUsers.find(
            (user) => user.email === "petar.petrovic@gmail.com",
        );

        const jovana = insertedUsers.find(
            (user) => user.email === "jovana.jovanovic@gmail.com",
        );

        const hamlet = insertedEvents.find(
            (event) => event.name === "Hamlet",
        );

        const travijata = insertedEvents.find(
            (event) => event.name === "Travijata",
        );

        const labudovoJezero = insertedEvents.find(
            (event) => event.name === "Labudovo jezero",
        );

        const koncert = insertedEvents.find(
            (event) => event.name === "Veče filmske muzike",
        );

        const knjizevnoVece = insertedEvents.find(
            (event) =>
                event.name === "Razgovor sa savremenim piscima",
        );

        if (
            !petar ||
            !jovana ||
            !hamlet ||
            !travijata ||
            !labudovoJezero ||
            !koncert ||
            !knjizevnoVece
        ) {
            throw new Error("Missing favorite events seed data.");
        }

        await db.insert(favoriteEvents).values([
            {
                userId: petar.id,
                eventId: hamlet.id,
            },
            {
                userId: petar.id,
                eventId: koncert.id,
            },
            {
                userId: petar.id,
                eventId: knjizevnoVece.id,
            },
            {
                userId: jovana.id,
                eventId: travijata.id,
            },
            {
                userId: jovana.id,
                eventId: labudovoJezero.id,
            },
        ])

        console.log("Favorite events seeded successfully.");

        console.log("Database seeded successfully.");

        process.exit(0);
    } catch (error) {
        console.error("Error seeding database:", error);
        process.exit(1);
    }
};

seed();