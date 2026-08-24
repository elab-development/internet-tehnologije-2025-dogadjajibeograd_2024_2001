import "dotenv/config";

import { db } from "@/db";
import { eventLocations } from "@/db/schema";
import { eq } from "drizzle-orm";

const updateLocationImages = async () => {
    try {
        await db
            .update(eventLocations)
            .set({
                imageUrl:
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfL7wN-BUK3XD_QyNeATDoAriddqX-D-cCTUJLysMBuA&s=10",
            })
            .where(eq(eventLocations.name, "Narodno pozorište"));

        await db
            .update(eventLocations)
            .set({
                imageUrl:
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRIptcIfKojznPlerxWMcHnxEo7L4i1sJewoPwMMEmUQ&s=10",
            })
            .where(eq(eventLocations.name, "Atelje 212"));

        await db
            .update(eventLocations)
            .set({
                imageUrl:
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6KHIkTQctcztZIePVc8qjxR4GaCT1dYIF_C8B6VTjRQ&s=10",
            })
            .where(
                eq(
                    eventLocations.name,
                    "Jugoslovensko dramsko pozorište"
                )
            );

        await db
            .update(eventLocations)
            .set({
                imageUrl:
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnOEvuJUwtIkfuWDG5Cc615f69Z2vKK8fqCZVV8dt1Og&s=10",
            })
            .where(eq(eventLocations.name, "Sava Centar"));

        await db
            .update(eventLocations)
            .set({
                imageUrl:
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHvf2j2HfEpfZUTUN2o4GiYlUINP5zJLQsr-YbfKwxKQ&s=10",
            })
            .where(
                eq(eventLocations.name, "Dom omladine Beograda")
            );

        await db
            .update(eventLocations)
            .set({
                imageUrl:
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmlmFe_-WMbze000wuupSesz02tHElBTuJjGGdLnOAcw&s=10",
            })
            .where(
                eq(
                    eventLocations.name,
                    "Kulturni centar Beograda"
                )
            );

        await db
            .update(eventLocations)
            .set({
                imageUrl:
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQtLPi4a1WLQvF3TEQG9Mv7YPYrKC-cnn1Ep1muRxBkA&s=10",
            })
            .where(
                eq(eventLocations.name, "Cineplexx Galerija")
            );

        console.log("Location images updated successfully.");
    } catch (error) {
        console.error("Error updating location images:", error);
    }

    process.exit();
};

updateLocationImages();