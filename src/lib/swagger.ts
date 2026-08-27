export const swaggerSpec = {
    openapi: "3.0.0",

    info: {
        title: "Belgrade Events API",
        version: "1.0.0",
        description: "API dokumentacija aplikacije Belgrade Events",
    },

    tags: [
        { name: "Auth" },
        { name: "Events" },
        { name: "Event Locations" },
        { name: "Event Types" },
        { name: "Favorites" },
        { name: "Upcoming Events" },
        { name: "Scraping" },
    ],

    paths: {
        "/api/auth/login": {
            post: {
                tags: ["Auth"],
                summary: "Prijava korisnika",

                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            example: {
                                email: "petar@example.com",
                                password: "Petar123!",
                            },
                        },
                    },
                },

                responses: {
                    "200": {
                        description: "Uspešna prijava",
                        content: {
                            "application/json": {
                                example: {
                                    id: "uuid",
                                    email: "petar@example.com",
                                    firstname: "Petar",
                                    lastname: "Petrović",
                                    dateOfBirth: "1998-05-14",
                                    role: "user",
                                },
                            },
                        },
                    },

                    "401": {
                        description: "Pogrešni akreditacioni podaci",
                        content: {
                            "application/json": {
                                example: {
                                    error: "Pogrešni akreditacioni podaci.",
                                },
                            },
                        },
                    },
                },
            },
        },

        "/api/auth/logout": {
            post: {
                tags: ["Auth"],
                summary: "Odjava korisnika",

                responses: {
                    "200": {
                        description: "Uspešna odjava",
                        content: {
                            "application/json": {
                                example: {
                                    ok: true,
                                },
                            },
                        },
                    },
                },
            },
        },

        "/api/auth/me": {
            get: {
                tags: ["Auth"],
                summary: "Podaci prijavljenog korisnika",

                responses: {
                    "200": {
                        description: "Podaci korisnika",
                    },

                    "401": {
                        description: "Korisnik nije prijavljen",
                    },
                },
            },
        },

        "/api/auth/register": {
            post: {
                tags: ["Auth"],
                summary: "Registracija korisnika",

                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            example: {
                                firstname: "Petar",
                                lastname: "Petrović",
                                email: "petar@example.com",
                                password: "Petar123!",
                                dateOfBirth: "1998-05-14",
                            },
                        },
                    },
                },

                responses: {
                    "201": {
                        description: "Korisnik uspešno registrovan",
                    },

                    "400": {
                        description: "Nedostaju obavezni podaci",
                    },

                    "409": {
                        description: "Korisnik sa datim emailom već postoji",
                    },
                },
            },
        },

        "/api/eventLocations": {
            get: {
                tags: ["Event Locations"],
                summary: "Prikaz svih lokacija",

                parameters: [
                    {
                        name: "type",
                        in: "query",
                        required: false,
                        description: "Tip lokacije",
                        example: "pozoriste",
                    },
                ],

                responses: {
                    "200": {
                        description: "Lista lokacija",
                    },
                },
            },
        },

        "/api/eventLocations/{id}": {
            get: {
                tags: ["Event Locations"],
                summary: "Prikaz lokacije prema ID-u",

                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        description: "ID lokacije",
                        example: "uuid",
                    },
                ],

                responses: {
                    "200": {
                        description: "Podaci o lokaciji",
                    },

                    "404": {
                        description: "Lokacija nije pronađena",
                    },
                },
            },
        },

        "/api/events": {
            get: {
                tags: ["Events"],
                summary: "Prikaz svih događaja",

                responses: {
                    "200": {
                        description: "Lista događaja",
                    },
                },
            },

            post: {
                tags: ["Events"],
                summary: "Dodavanje novog događaja",

                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            example: {
                                name: "Hamlet",
                                eventTypeId: "uuid",
                                locationId: "uuid",
                                eventDate: "2026-09-15",
                                eventTime: "20:00",
                                description: "Pozorišna predstava Hamlet.",
                            },
                        },
                    },
                },

                responses: {
                    "201": {
                        description: "Događaj uspešno dodat",
                    },

                    "400": {
                        description: "Neispravni podaci",
                    },

                    "401": {
                        description: "Korisnik nije prijavljen",
                    },

                    "403": {
                        description: "Korisnik nema dozvolu",
                    },
                },
            },
        },

        "/api/events/{id}": {
            get: {
                tags: ["Events"],
                summary: "Prikaz događaja prema ID-u",

                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        example: "uuid",
                    },
                ],

                responses: {
                    "200": {
                        description: "Detalji događaja",
                    },

                    "404": {
                        description: "Događaj nije pronađen",
                    },
                },
            },

            post: {
                tags: ["Events"],
                summary: "Izmena događaja",

                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        example: "uuid",
                    },
                ],

                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            example: {
                                name: "Hamlet",
                                eventTypeId: "uuid",
                                locationId: "uuid",
                                eventDate: "2026-09-15",
                                eventTime: "20:00",
                                description: "Izmenjen opis događaja.",
                            },
                        },
                    },
                },

                responses: {
                    "200": {
                        description: "Događaj uspešno izmenjen",
                    },

                    "400": {
                        description: "Neispravni podaci",
                    },

                    "404": {
                        description: "Događaj nije pronađen",
                    },
                },
            },

            delete: {
                tags: ["Events"],
                summary: "Brisanje događaja",

                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        example: "uuid",
                    },
                ],

                responses: {
                    "200": {
                        description: "Događaj uspešno obrisan",
                    },

                    "404": {
                        description: "Događaj nije pronađen",
                    },
                },
            },
        },

        "/api/eventTypes": {
            get: {
                tags: ["Event Types"],
                summary: "Prikaz svih tipova događaja",

                responses: {
                    "200": {
                        description: "Lista tipova događaja",
                    },
                },
            },
        },

        "/api/favorites/event/{eventId}": {
            post: {
                tags: ["Favorites"],
                summary: "Dodavanje događaja u omiljene",

                parameters: [
                    {
                        name: "eventId",
                        in: "path",
                        required: true,
                        description: "ID događaja",
                        example: "uuid",
                    },
                ],

                responses: {
                    "201": {
                        description: "Događaj dodat u omiljene",
                    },

                    "401": {
                        description: "Korisnik nije prijavljen",
                    },
                },
            },

            delete: {
                tags: ["Favorites"],
                summary: "Uklanjanje događaja iz omiljenih",

                parameters: [
                    {
                        name: "eventId",
                        in: "path",
                        required: true,
                        description: "ID događaja",
                        example: "uuid",
                    },
                ],

                responses: {
                    "200": {
                        description: "Događaj uklonjen iz omiljenih",
                    },

                    "401": {
                        description: "Korisnik nije prijavljen",
                    },

                    "404": {
                        description: "Događaj nije pronađen u omiljenim",
                    },
                },
            },
        },

        "/api/favorites/user": {
            get: {
                tags: ["Favorites"],
                summary: "Prikaz omiljenih događaja korisnika",

                responses: {
                    "200": {
                        description: "Lista omiljenih događaja",
                    },

                    "401": {
                        description: "Korisnik nije prijavljen",
                    },
                },
            },
        },

        "/api/upcomingEvents": {
            get: {
                tags: ["Upcoming Events"],
                summary: "Prikaz predstojećih događaja",

                responses: {
                    "200": {
                        description: "Lista predstojećih događaja",
                    },

                    "500": {
                        description: "Greška pri učitavanju događaja",
                    },
                },
            },
        },

        "/api/scrape/mtsDvorana": {
            post: {
                tags: ["Scraping"],
                summary: "Preuzimanje događaja sa MTS Dvorane",

                responses: {
                    "200": {
                        description: "Podaci uspešno preuzeti",
                    },

                    "500": {
                        description: "Greška pri preuzimanju podataka",
                    },
                },
            },
        },

        "/api/scrape/savaCentar": {
            post: {
                tags: ["Scraping"],
                summary: "Preuzimanje događaja sa Sava Centra",

                responses: {
                    "200": {
                        description: "Podaci uspešno preuzeti",
                    },

                    "500": {
                        description: "Greška pri preuzimanju podataka",
                    },
                },
            },
        },
    },
};