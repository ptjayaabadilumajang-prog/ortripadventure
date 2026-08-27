import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { appSettings, bookings, leads, tripDepartures, trips, users, type InsertUser } from "../drizzle/schema";
import type { Booking, Lead, Trip, TripDeparture } from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

/**
 * Settings Management
 */
export async function getAppSetting<T>(key: string): Promise<T | null> {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(appSettings).where(eq(appSettings.key, key)).limit(1);
  return result.length > 0 ? (result[0].value as T) : null;
}

export async function setAppSetting(key: string, value: any): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.insert(appSettings).values({ key, value }).onDuplicateKeyUpdate({ set: { value } });
}

/**
 * Trip Management
 */
export async function listTrips() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(trips);
}

export async function getTripBySlug(slug: string) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(trips).where(eq(trips.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : null;
}

/**
 * Lead & CRM Management
 */
export async function createLead(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(leads).values({
    ...data,
    lastActivity: new Date(),
  });
  return result[0].insertId;
}

export async function updateLeadScore(id: number, score: number) {
  const db = await getDb();
  if (!db) return;
  await db.update(leads).set({ score, lastActivity: new Date() }).where(eq(leads.id, id));
}

export async function logLeadActivity(leadId: number, action: string, metadata: any = {}, scoreAdded: number = 0) {
  const db = await getDb();
  if (!db) return;
  const { leadActivities } = require("../drizzle/schema");
  await db.insert(leadActivities).values({
    leadId,
    action,
    metadata,
    scoreAdded,
  });
  
  if (scoreAdded !== 0) {
    const [lead] = await db.select().from(leads).where(eq(leads.id, leadId)).limit(1);
    if (lead) {
      await db.update(leads).set({ 
        score: lead.score + scoreAdded,
        lastActivity: new Date() 
      }).where(eq(leads.id, leadId));
    }
  }
}

export async function listLeadActivities(leadId: number) {
  const db = await getDb();
  if (!db) return [];
  const { leadActivities } = require("../drizzle/schema");
  return db.select().from(leadActivities).where(eq(leadActivities.leadId, leadId)).orderBy(leadActivities.createdAt);
}

export async function logAudit(userId: number | null, action: string, entityType: string, entityId: number | null, oldData: any = null, newData: any = null) {
  const db = await getDb();
  if (!db) return;
  const { auditLogs } = require("../drizzle/schema");
  await db.insert(auditLogs).values({
    userId,
    action,
    entityType,
    entityId,
    oldData,
    newData,
  });
}

/**
 * Booking Management
 */
export async function createBooking(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(bookings).values(data);
}

export async function updateBookingStatus(bookingCode: string, status: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(bookings).set({ status }).where(eq(bookings.bookingCode, bookingCode));
}

export async function listBookings() {
  const db = await getDb();
  if (!db) return [];
  const { trips, tripDepartures } = require("../drizzle/schema");
  return db.select({
    booking: bookings,
    lead: leads,
    trip: trips,
    departure: tripDepartures,
  })
  .from(bookings)
  .leftJoin(leads, eq(bookings.leadId, leads.id))
  .leftJoin(tripDepartures, eq(bookings.departureId, tripDepartures.id))
  .leftJoin(trips, eq(tripDepartures.tripId, trips.id))
  .orderBy(bookings.submittedAt);
}

export async function getBookingByCode(bookingCode: string) {
  const db = await getDb();
  if (!db) return null;
  const { trips, tripDepartures } = require("../drizzle/schema");
  const result = await db.select({
    booking: bookings,
    lead: leads,
    trip: trips,
    departure: tripDepartures,
  })
  .from(bookings)
  .leftJoin(leads, eq(bookings.leadId, leads.id))
  .leftJoin(tripDepartures, eq(bookings.departureId, tripDepartures.id))
  .leftJoin(trips, eq(tripDepartures.tripId, trips.id))
  .where(eq(bookings.bookingCode, bookingCode))
  .limit(1);
  return result.length > 0 ? result[0] : null;
}

