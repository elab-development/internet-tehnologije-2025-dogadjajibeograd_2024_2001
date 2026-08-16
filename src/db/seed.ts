import "dotenv/config";

import { db } from "@/db";
import { users } from "@/db/schema";
import bcrypt from "bcrypt"

const seedUsers = async () => {
    try {
        const password1 = await bcrypt.hash("Petar123!", 10);
        const password2 = await bcrypt.hash("Jovana123!", 10);
        const adminPassword = await bcrypt.hash("Admin123!", 10);

        await db.insert(users).values([
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
        ]);

        console.log("Users seeded successfully.");
    } catch (error) {
        console.error("Error seeding user:", error);
        process.exit(1);
    }

    process.exit(0);
};

seedUsers();