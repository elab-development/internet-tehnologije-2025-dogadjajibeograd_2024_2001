import {
    pgTable,
    pgEnum,
    uuid,
    varchar,
    date,
    timestamp,
    doublePrecision,
    text,
    time,
    primaryKey,
} from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", [
    "user",
    "admin",
]);

export const locationTypeEnum = pgEnum("location_type", [
    "pozoriste",
    "bioskop",
    "koncertna_dvorana",
    "centar_za_kulturu",
    "drugo",
]);

export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),

    firstname: varchar("first_name", {
        length: 30,
    }).notNull(),

    lastname: varchar("last_name", {
        length: 30,
    }).notNull(),

    email: varchar("email", {
        length: 50,
    })
        .notNull()
        .unique(),

    passHash: varchar("pass_hash", {
        length: 255,
    }).notNull(),

    dateOfBirth: date("date_of_birth").notNull(),

    role: userRoleEnum("role").notNull().default("user"),

    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const eventLocations = pgTable("event_locations", {
    id: uuid("id")
        .primaryKey()
        .defaultRandom(),

    name: varchar("name", {
        length: 100,
    }).notNull(),

    type: locationTypeEnum("type")
        .notNull(),

    address: varchar("address", {
        length: 200,
    }).notNull(),

    latitude: doublePrecision("latitude").notNull(),

    longitude: doublePrecision("longitude").notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),

});

export const eventTypes = pgTable("event_types", {
    id: uuid("id").primaryKey().defaultRandom(),

    name: varchar("name", {
        length: 50,
    }).notNull().unique(),
});

export const events = pgTable("events", {
    id: uuid("id").primaryKey().defaultRandom(),

    name: varchar("name", {
        length: 150,
    }).notNull(),

    description: text("description").notNull(),

    eventDate: date("event_date").notNull(),

    eventTime: time("event_time").notNull(),

    eventTypeId: uuid("event_type_id").notNull().references(() => eventTypes.id, {
        onDelete: "restrict",
    }),

    locationId: uuid("location_id").notNull().references(() => eventLocations.id, {
        onDelete: "restrict",
    }),

    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const favoriteEvents = pgTable(
    "favorite_events",
    {
        userId: uuid("user_id").notNull().references(() => users.id, {
            onDelete: "cascade",
        }),

        eventId: uuid("event_id").notNull().references(() => events.id, {
            onDelete: "cascade",
        }),
    },
    (table) => [
        primaryKey({
            columns: [
                table.userId,
                table.eventId,
            ],
        }),
    ],
);