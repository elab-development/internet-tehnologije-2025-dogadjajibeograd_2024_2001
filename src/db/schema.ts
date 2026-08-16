import {
    pgTable,
    pgEnum,
    uuid,
    varchar,
    date,
    timestamp,
} from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", [
    "user",
    "admin",
]);

export const users = pgTable("users", {
    id: uuid("id")
        .primaryKey()
        .defaultRandom(),

    firstName: varchar("first_name", {
        length: 30,
    }).notNull(),

    lastName: varchar("last_name", {
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

    dateOfBirth: date("date_of_birth"),

    role: userRoleEnum("role")
        .notNull()
        .default("user"),

    createdAt: timestamp("created_at")
        .defaultNow()
        .notNull(),
});