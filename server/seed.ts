import { sql } from "drizzle-orm";
import { trips as demoTrips, ranuPackages, ranuFacilities, ranuMeals, ranuTimeline, officialContacts } from "../lib/demo-data";
import { getDb } from "./db";
import { trips, appSettings, tripDepartures } from "../drizzle/schema";

async function seed() {
  const db = await getDb();
  if (!db) {
    console.error("Database not connected");
    process.exit(1);
  }

  console.log("Seeding app settings...");
  const settingsToSeed = [
    { key: "official_contacts", value: officialContacts },
    { key: "ranu_packages", value: ranuPackages },
    { key: "ranu_facilities", value: ranuFacilities },
    { key: "ranu_meals", value: ranuMeals },
    { key: "ranu_timeline", value: ranuTimeline },
    { 
      key: "lead_scoring_rules", 
      value: {
        visit_website: 5,
        view_trip: 5,
        view_price: 10,
        chatbot_interaction: 15,
        ask_date: 20,
        ask_payment: 25,
        click_booking: 30,
        fill_booking: 40
      }
    }
  ];

  for (const s of settingsToSeed) {
    await db.insert(appSettings).values(s).onDuplicateKeyUpdate({ set: { value: s.value } });
  }

  console.log("Seeding trips...");
  for (const trip of demoTrips) {
    await db.insert(trips).values({
      slug: trip.id,
      title: trip.title,
      location: trip.location,
      type: trip.type as any,
      description: trip.description,
      priceBase: trip.price.toString(),
      isVerified: true,
    }).onDuplicateKeyUpdate({
      set: {
        title: trip.title,
        location: trip.location,
        type: trip.type as any,
        description: trip.description,
        priceBase: trip.price.toString(),
        isVerified: true,
      }
    });

    const [tripRow] = await db.select().from(trips).where(sql`slug = ${trip.id}`).limit(1);
    
    if (tripRow && trip.date !== "Custom date") {
      await db.insert(tripDepartures).values({
        tripId: tripRow.id,
        startDate: new Date("2026-09-14T08:00:00Z"),
        endDate: new Date("2026-09-15T17:00:00Z"),
        seatsTotal: trip.seats,
        seatsAvailable: trip.seats,
        isVerified: true,
      });
    }
  }

  console.log("Seeding complete!");
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
