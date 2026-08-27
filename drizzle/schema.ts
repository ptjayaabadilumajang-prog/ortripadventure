import { boolean, decimal, int, json, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Admin-configurable settings (WhatsApp, scoring rules, etc.)
 */
export const appSettings = mysqlTable("app_settings", {
  key: varchar("key", { length: 64 }).primaryKey(),
  value: json("value").notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

/**
 * Trip definitions (Open Trip / Private Trip)
 */
export const trips = mysqlTable("trips", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 64 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  location: varchar("location", { length: 255 }),
  type: mysqlEnum("type", ["Open Trip", "Private Trip"]).default("Open Trip").notNull(),
  description: text("description"),
  priceBase: decimal("priceBase", { precision: 12, scale: 2 }).notNull(),
  isVerified: boolean("isVerified").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

/**
 * Specific trip departures / schedules
 */
export const tripDepartures = mysqlTable("trip_departures", {
  id: int("id").autoincrement().primaryKey(),
  tripId: int("tripId").notNull(),
  startDate: timestamp("startDate").notNull(),
  endDate: timestamp("endDate").notNull(),
  seatsTotal: int("seatsTotal").default(12).notNull(),
  seatsAvailable: int("seatsAvailable").default(12).notNull(),
  isVerified: boolean("isVerified").default(false).notNull(),
});

/**
 * CRM: Leads tracking for AI Marketing
 */
export const leads = mysqlTable("leads", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"), // Linked if they logged in
  name: varchar("name", { length: 255 }),
  phone: varchar("phone", { length: 32 }),
  email: varchar("email", { length: 255 }),
  source: varchar("source", { length: 64 }), // chatbot, landing, campaign
  productInterest: varchar("productInterest", { length: 64 }),
  score: int("score").default(0).notNull(),
  status: mysqlEnum("status", ["NEW", "CONTACTED", "QUALIFIED", "HOT", "VERY_HOT", "BOOKED", "LOST", "NURTURE"]).default("NEW").notNull(),
  lastActivity: timestamp("lastActivity").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

/**
 * Durable bookings
 */
export const bookings = mysqlTable("bookings", {
  id: int("id").autoincrement().primaryKey(),
  bookingCode: varchar("bookingCode", { length: 16 }).notNull().unique(),
  leadId: int("leadId").notNull(),
  departureId: int("departureId").notNull(),
  packageId: varchar("packageId", { length: 64 }),
  participantCount: int("participantCount").default(1).notNull(),
  totalAmount: decimal("totalAmount", { precision: 12, scale: 2 }).notNull(),
  status: mysqlEnum("status", ["pending", "under_review", "approved", "rejected"]).default("pending").notNull(),
  paymentProofUrl: text("paymentProofUrl"),
  submittedAt: timestamp("submittedAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AppSetting = typeof appSettings.$inferSelect;
export type Trip = typeof trips.$inferSelect;
export type TripDeparture = typeof tripDepartures.$inferSelect;
export type Lead = typeof leads.$inferSelect;
export type Booking = typeof bookings.$inferSelect;
