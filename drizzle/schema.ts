import { boolean, decimal, int, json, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin", "superadmin", "guide", "partner"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

/**
 * Granular permissions for RBAC
 */
export const permissions = mysqlTable("permissions", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 64 }).notNull().unique(),
  description: text("description"),
});

export const rolePermissions = mysqlTable("role_permissions", {
  role: mysqlEnum("role", ["user", "admin", "superadmin", "guide", "partner"]).notNull(),
  permissionId: int("permissionId").notNull(),
});

/**
 * Admin-configurable settings
 */
export const appSettings = mysqlTable("app_settings", {
  key: varchar("key", { length: 64 }).primaryKey(),
  value: json("value").notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

/**
 * CRM: Customers (Converted leads)
 */
export const customers = mysqlTable("customers", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").unique(),
  name: varchar("name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 32 }),
  email: varchar("email", { length: 255 }),
  totalSpending: decimal("totalSpending", { precision: 15, scale: 2 }).default("0").notNull(),
  loyaltyPoints: int("loyaltyPoints").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

/**
 * CRM: Leads tracking for AI Marketing
 */
export const leads = mysqlTable("leads", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  customerId: int("customerId"),
  name: varchar("name", { length: 255 }),
  phone: varchar("phone", { length: 32 }),
  email: varchar("email", { length: 255 }),
  source: varchar("source", { length: 64 }),
  productInterest: varchar("productInterest", { length: 64 }),
  score: int("score").default(0).notNull(),
  status: mysqlEnum("status", ["NEW", "CONTACTED", "QUALIFIED", "WARM", "HOT", "VERY_HOT", "BOOKED", "LOST", "NURTURE"]).default("NEW").notNull(),
  lastActivity: timestamp("lastActivity").defaultNow().notNull(),
  nextAction: text("nextAction"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const leadActivities = mysqlTable("lead_activities", {
  id: int("id").autoincrement().primaryKey(),
  leadId: int("leadId").notNull(),
  action: varchar("action", { length: 255 }).notNull(),
  metadata: json("metadata"),
  scoreAdded: int("scoreAdded").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

/**
 * Communication: Conversations & Messages
 */
export const conversations = mysqlTable("conversations", {
  id: int("id").autoincrement().primaryKey(),
  leadId: int("leadId"),
  customerId: int("customerId"),
  platform: mysqlEnum("platform", ["whatsapp", "in_app", "email"]).notNull(),
  status: mysqlEnum("status", ["open", "closed", "archived"]).default("open").notNull(),
  lastMessageAt: timestamp("lastMessageAt").defaultNow().notNull(),
});

export const messages = mysqlTable("messages", {
  id: int("id").autoincrement().primaryKey(),
  conversationId: int("conversationId").notNull(),
  senderRole: mysqlEnum("senderRole", ["user", "admin", "ai"]).notNull(),
  content: text("content").notNull(),
  metadata: json("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

/**
 * Destinations & Trips
 */
export const destinations = mysqlTable("destinations", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  region: varchar("region", { length: 255 }),
  rules: text("rules"),
  safetyInfo: text("safetyInfo"),
});

export const trips = mysqlTable("trips", {
  id: int("id").autoincrement().primaryKey(),
  destinationId: int("destinationId"),
  slug: varchar("slug", { length: 64 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  type: mysqlEnum("type", ["Open Trip", "Private Trip"]).default("Open Trip").notNull(),
  description: text("description"),
  itinerary: json("itinerary"),
  facilities: json("facilities"),
  requirements: text("requirements"),
  priceBase: decimal("priceBase", { precision: 12, scale: 2 }).notNull(),
  isVerified: boolean("isVerified").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const tripDepartures = mysqlTable("trip_departures", {
  id: int("id").autoincrement().primaryKey(),
  tripId: int("tripId").notNull(),
  startDate: timestamp("startDate").notNull(),
  endDate: timestamp("endDate").notNull(),
  seatsTotal: int("seatsTotal").default(12).notNull(),
  seatsAvailable: int("seatsAvailable").default(12).notNull(),
  status: mysqlEnum("status", ["scheduled", "confirmed", "completed", "cancelled"]).default("scheduled").notNull(),
  isVerified: boolean("isVerified").default(false).notNull(),
});

/**
 * Booking & Participants
 */
export const bookings = mysqlTable("bookings", {
  id: int("id").autoincrement().primaryKey(),
  bookingCode: varchar("bookingCode", { length: 16 }).notNull().unique(),
  leadId: int("leadId").notNull(),
  customerId: int("customerId"),
  departureId: int("departureId").notNull(),
  packageId: varchar("packageId", { length: 64 }),
  participantCount: int("participantCount").default(1).notNull(),
  totalAmount: decimal("totalAmount", { precision: 12, scale: 2 }).notNull(),
  status: mysqlEnum("status", ["pending", "under_review", "approved", "rejected", "cancelled", "refunded"]).default("pending").notNull(),
  paymentProofUrl: text("paymentProofUrl"),
  submittedAt: timestamp("submittedAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const participants = mysqlTable("participants", {
  id: int("id").autoincrement().primaryKey(),
  bookingId: int("bookingId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  idNumber: varchar("idNumber", { length: 64 }),
  phone: varchar("phone", { length: 32 }),
  emergencyContact: varchar("emergencyContact", { length: 255 }),
});

export const waitlists = mysqlTable("waitlists", {
  id: int("id").autoincrement().primaryKey(),
  tripId: int("tripId").notNull(),
  departureId: int("departureId"),
  leadId: int("leadId").notNull(),
  priority: int("priority").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

/**
 * Financials
 */
export const payments = mysqlTable("payments", {
  id: int("id").autoincrement().primaryKey(),
  bookingId: int("bookingId").notNull(),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  method: varchar("method", { length: 64 }).notNull(),
  transactionId: varchar("transactionId", { length: 255 }),
  status: mysqlEnum("status", ["pending", "verified", "failed", "refunded"]).default("pending").notNull(),
  verifiedAt: timestamp("verifiedAt"),
  verifiedBy: int("verifiedBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

/**
 * Operations: Guides & Equipment
 */
export const guides = mysqlTable("guides", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").unique(),
  name: varchar("name", { length: 255 }).notNull(),
  bio: text("bio"),
  specialties: json("specialties"),
  isVerified: boolean("isVerified").default(false).notNull(),
});

export const equipment = mysqlTable("equipment", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  category: varchar("category", { length: 64 }),
  stockTotal: int("stockTotal").default(0).notNull(),
  stockAvailable: int("stockAvailable").default(0).notNull(),
  pricePerDay: decimal("pricePerDay", { precision: 10, scale: 2 }),
});

/**
 * Feedback
 */
export const reviews = mysqlTable("reviews", {
  id: int("id").autoincrement().primaryKey(),
  tripId: int("tripId").notNull(),
  customerId: int("customerId").notNull(),
  rating: int("rating").notNull(),
  comment: text("comment"),
  isPublic: boolean("isPublic").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const testimonials = mysqlTable("testimonials", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  role: varchar("role", { length: 64 }),
  content: text("content").notNull(),
  avatarUrl: text("avatarUrl"),
  isFeatured: boolean("isFeatured").default(false).notNull(),
});

/**
 * Marketing & Partnerships
 */
export const campaigns = mysqlTable("campaigns", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  type: mysqlEnum("type", ["email", "whatsapp", "social", "ads"]).notNull(),
  status: mysqlEnum("status", ["draft", "active", "completed", "paused"]).default("draft").notNull(),
  startDate: timestamp("startDate"),
  endDate: timestamp("endDate"),
});

export const content = mysqlTable("content", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  type: mysqlEnum("type", ["blog", "social_post", "ad_copy", "email_template"]).notNull(),
  body: text("body").notNull(),
  metadata: json("metadata"),
  status: mysqlEnum("status", ["draft", "published", "archived"]).default("draft").notNull(),
  publishedAt: timestamp("publishedAt"),
});

export const partners = mysqlTable("partners", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").unique(),
  companyName: varchar("companyName", { length: 255 }).notNull(),
  contactName: varchar("contactName", { length: 255 }),
  type: mysqlEnum("type", ["agency", "affiliate", "vendor"]).notNull(),
  status: mysqlEnum("status", ["active", "inactive", "pending"]).default("pending").notNull(),
});

export const referrals = mysqlTable("referrals", {
  id: int("id").autoincrement().primaryKey(),
  referrerId: int("referrerId").notNull(), // User ID
  referredId: int("referredId"), // Customer ID if converted
  code: varchar("code", { length: 32 }).notNull().unique(),
  status: mysqlEnum("status", ["pending", "converted", "rewarded"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

/**
 * AI Engine
 */
export const aiAgents = mysqlTable("ai_agents", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 64 }).notNull().unique(),
  role: text("role").notNull(),
  instructions: text("instructions").notNull(),
  isActive: boolean("isActive").default(true).notNull(),
});

export const aiLogs = mysqlTable("ai_logs", {
  id: int("id").autoincrement().primaryKey(),
  agentId: int("agentId"),
  action: varchar("action", { length: 255 }),
  input: text("input"),
  output: text("output"),
  tokensUsed: int("tokensUsed"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const knowledgeBase = mysqlTable("knowledge_base", {
  id: int("id").autoincrement().primaryKey(),
  category: varchar("category", { length: 64 }).notNull(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  isVerified: boolean("isVerified").default(false).notNull(),
});

/**
 * Compliance & Audit
 */
export const consents = mysqlTable("consents", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  leadId: int("leadId"),
  type: mysqlEnum("type", ["privacy_policy", "terms_conditions", "marketing"]).notNull(),
  ipAddress: varchar("ipAddress", { length: 45 }),
  userAgent: text("userAgent"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const auditLogs = mysqlTable("audit_logs", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  action: varchar("action", { length: 255 }).notNull(),
  entityType: varchar("entityType", { length: 64 }),
  entityId: int("entityId"),
  oldData: json("oldData"),
  newData: json("newData"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const legalDocuments = mysqlTable("legal_documents", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  type: varchar("type", { length: 64 }).notNull(), // TIN, NIB, PERNYATAAN, SERTIFIKAT
  documentNumber: varchar("documentNumber", { length: 255 }),
  fileUrl: text("fileUrl").notNull(),
  metadata: json("metadata"),
  isVerified: boolean("isVerified").default(false).notNull(),
  verifiedAt: timestamp("verifiedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type AppSetting = typeof appSettings.$inferSelect;
export type Trip = typeof trips.$inferSelect;
export type TripDeparture = typeof tripDepartures.$inferSelect;
export type Lead = typeof leads.$inferSelect;
export type Booking = typeof bookings.$inferSelect;
export type Customer = typeof customers.$inferSelect;
export type Conversation = typeof conversations.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type Payment = typeof payments.$inferSelect;
export type AuditLog = typeof auditLogs.$inferSelect;
export type Destination = typeof destinations.$inferSelect;
export type LegalDocument = typeof legalDocuments.$inferSelect;
export type InsertLegalDocument = typeof legalDocuments.$inferInsert;

/**
 * Push Notifications
 */
export const pushTokens = mysqlTable("push_tokens", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  token: varchar("token", { length: 255 }).notNull().unique(),
  platform: mysqlEnum("platform", ["ios", "android", "web"]).notNull(),
  deviceInfo: json("deviceInfo"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const pushNotifications = mysqlTable("push_notifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  title: varchar("title", { length: 255 }).notNull(),
  body: text("body").notNull(),
  data: json("data"),
  status: mysqlEnum("status", ["pending", "sent", "failed"]).default("pending").notNull(),
  sentAt: timestamp("sentAt"),
  error: text("error"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PushToken = typeof pushTokens.$inferSelect;
export type InsertPushToken = typeof pushTokens.$inferInsert;
export type PushNotification = typeof pushNotifications.$inferSelect;
export type InsertPushNotification = typeof pushNotifications.$inferInsert;
