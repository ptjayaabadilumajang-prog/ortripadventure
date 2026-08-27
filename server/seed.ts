import { sql, eq } from "drizzle-orm";
import { trips as demoTrips, ranuPackages, ranuFacilities, ranuMeals, ranuTimeline, officialContacts, testimonials as demoTestimonials } from "../lib/demo-data";
import { getDb } from "./db";
import { trips, appSettings, tripDepartures, destinations, testimonials } from "../drizzle/schema";

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

  console.log("Seeding destinations...");
  const uniqueLocations = Array.from(new Set(demoTrips.map(t => t.location)));
  for (const loc of uniqueLocations) {
    const name = loc.split(',')[0].trim();
    const region = loc.split(',')[1]?.trim() || "Jawa Timur";
    await db.insert(destinations).values({
      name,
      region,
      rules: "Ikuti jalur resmi dan bawa turun sampah.",
      safetyInfo: "Pastikan kondisi fisik prima sebelum mendaki."
    }).onDuplicateKeyUpdate({ set: { region } });
  }

  console.log("Seeding trips...");
  for (const trip of demoTrips) {
    const locName = trip.location.split(',')[0].trim();
    const [dest] = await db.select().from(destinations).where(eq(destinations.name, locName)).limit(1);
    
    await db.insert(trips).values({
      slug: trip.id,
      destinationId: dest?.id,
      title: trip.title,
      type: trip.type as any,
      description: trip.description,
      priceBase: trip.price.toString(),
      itinerary: trip.itinerary,
      facilities: trip.includes,
      requirements: "Kondisi fisik sehat, membawa identitas diri.",
      isVerified: true,
    }).onDuplicateKeyUpdate({
      set: {
        title: trip.title,
        destinationId: dest?.id,
        type: trip.type as any,
        description: trip.description,
        priceBase: trip.price.toString(),
        itinerary: trip.itinerary,
        facilities: trip.includes,
        isVerified: true,
      }
    });

    const [tripRow] = await db.select().from(trips).where(eq(trips.slug, trip.id)).limit(1);
    
    if (tripRow && trip.date !== "Custom date") {
      // Clear old departures for clean seed
      await db.delete(tripDepartures).where(eq(tripDepartures.tripId, tripRow.id));
      
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

  console.log("Seeding testimonials...");
  for (const t of demoTestimonials) {
    await db.insert(testimonials).values({
      name: t.name,
      role: t.city,
      content: t.quote,
      isFeatured: true
    });
  }

  console.log("Seeding complete!");
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
