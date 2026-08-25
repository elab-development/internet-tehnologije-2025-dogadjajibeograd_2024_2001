CREATE TABLE "upcoming_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(200) NOT NULL,
	"location_name" varchar(150) NOT NULL,
	"address" varchar(200) NOT NULL,
	"event_date" date NOT NULL,
	"description" text,
	"source" varchar(100) NOT NULL,
	"source_url" varchar(500) NOT NULL,
	"external_id" varchar(255) NOT NULL,
	"scraped_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "upcoming_events_external_id_unique" UNIQUE("external_id")
);
