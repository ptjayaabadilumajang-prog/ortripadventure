import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { storagePut } from "./storage";
import { ENV } from "./_core/env";
import { buildAdminWhatsAppMessage, type BookingValidationStatus, buildAdminWhatsAppMessage as buildAdminMessage } from "../lib/booking-status";
import * as db from "./db";
import { invokeLLM } from "./_core/llm";

const bookingPayload = z.object({
  bookingCode: z.string().min(4).max(40),
  tripSlug: z.string().min(2).max(64).optional(), 
  tripName: z.string().min(2).max(160), 
  packageName: z.string().max(160).optional(), 
  date: z.string().min(2).max(80), 
  departureId: z.number().optional(), // New: linked to tripDepartures.id
  participants: z.number().int().min(1).max(30), 
  customerName: z.string().min(2).max(120), 
  phone: z.string().min(6).max(40), 
  email: z.string().email().max(180), 
  total: z.number().int().nonnegative(), 
  paymentMethod: z.string().min(2).max(80), 
  proofUrl: z.string().max(500).optional(),
});

function getAdminWhatsAppLink(message: string) {
  const number = (process.env.ORTRIP_ADMIN_WHATSAPP ?? "6285856602819").replace(/\D/g, "");
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

async function notifyWhatsApp(message: string) {
  const fallbackUrl = getAdminWhatsAppLink(message);
  if (!ENV.whatsappApiToken || !ENV.whatsappPhoneNumberId || !ENV.whatsappAdminRecipient) return { sent: false, fallbackUrl } as const;
  const response = await fetch(`https://graph.facebook.com/v22.0/${ENV.whatsappPhoneNumberId}/messages`, {
    method: "POST",
    headers: { Authorization: `Bearer ${ENV.whatsappApiToken}`, "Content-Type": "application/json" },
    body: JSON.stringify({ messaging_product: "whatsapp", to: ENV.whatsappAdminRecipient, type: "text", text: { body: message } }),
  });
  if (!response.ok) return { sent: false, fallbackUrl } as const;
  return { sent: true, fallbackUrl } as const;
}

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => { const cookieOptions = getSessionCookieOptions(ctx.req); ctx.res.clearCookie("session", { ...cookieOptions, maxAge: -1 }); return { success: true } as const; }),
  }),
  settings: router({
    get: publicProcedure.input(z.object({ key: z.string() })).query(({ input }) => db.getAppSetting(input.key)),
    update: protectedProcedure.input(z.object({ key: z.string(), value: z.any() })).mutation(({ ctx, input }) => {
      if (ctx.user.role !== "admin") throw new Error("Admin access required");
      return db.setAppSetting(input.key, input.value);
    }),
  }),
  trips: router({
    list: publicProcedure.query(async () => {
      const d = await db.getDb();
      if (!d) return [];
      const { trips, destinations } = require("../drizzle/schema");
      const { eq } = require("drizzle-orm");
      return d.select({
        trip: trips,
        destination: destinations,
      })
      .from(trips)
      .leftJoin(destinations, eq(trips.destinationId, destinations.id));
    }),
    getBySlug: publicProcedure.input(z.object({ slug: z.string() })).query(async ({ input }) => {
      const d = await db.getDb();
      if (!d) return null;
      const { trips, destinations } = require("../drizzle/schema");
      const { eq } = require("drizzle-orm");
      const result = await d.select({
        trip: trips,
        destination: destinations,
      })
      .from(trips)
      .leftJoin(destinations, eq(trips.destinationId, destinations.id))
      .where(eq(trips.slug, input.slug))
      .limit(1);
      return result[0] || null;
    }),
    update: protectedProcedure.input(z.object({ 
      id: z.number(), 
      title: z.string().optional(),
      priceBase: z.string().optional(),
      isVerified: z.boolean().optional(),
    })).mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") throw new Error("Admin access required");
      const { id, ...data } = input;
      const d = await db.getDb();
      if (!d) return;
      // @ts-ignore
      await d.update(require("../drizzle/schema").trips).set(data).where(require("drizzle-orm").eq(require("../drizzle/schema").trips.id, id));
    }),
    getDepartures: publicProcedure.input(z.object({ tripId: z.number() })).query(async ({ input }) => {
      return db.getDeparturesByTrip(input.tripId);
    }),
  }),
  crm: router({
    createLead: publicProcedure.input(z.object({
      name: z.string().optional(),
      phone: z.string().optional(),
      email: z.string().optional(),
      source: z.string().optional(),
      productInterest: z.string().optional(),
      status: z.string().optional(),
      score: z.number().optional(),
    })).mutation(({ input }) => db.createLead(input)),
    logActivity: publicProcedure.input(z.object({
      leadId: z.number(),
      action: z.string(),
      metadata: z.any().optional(),
      scoreAdded: z.number().optional(),
    })).mutation(({ input }) => db.logLeadActivity(input.leadId, input.action, input.metadata, input.scoreAdded)),
    listLeads: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") throw new Error("Admin access required");
      const d = await db.getDb();
      if (!d) return [];
      // @ts-ignore
      return d.select().from(require("../drizzle/schema").leads).orderBy(require("drizzle-orm").desc(require("../drizzle/schema").leads.score));
    }),
    getLeadDetails: protectedProcedure.input(z.object({ id: z.number() })).query(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") throw new Error("Admin access required");
      const d = await db.getDb();
      if (!d) return null;
      const { leads } = require("../drizzle/schema");
      const { eq } = require("drizzle-orm");
      const lead = await d.select().from(leads).where(eq(leads.id, input.id)).limit(1);
      const activities = await db.listLeadActivities(input.id);
      return lead[0] ? { ...lead[0], activities } : null;
    }),
  }),
  booking: router({
    uploadPaymentProof: publicProcedure.input(z.object({ bookingCode: z.string().min(4).max(40), fileName: z.string().min(1).max(160), mimeType: z.enum(["image/png", "image/jpeg", "image/webp", "application/pdf"]), base64: z.string().min(100).max(15_000_000) })).mutation(async ({ input }) => { const extension = input.fileName.split(".").pop()?.replace(/[^a-z0-9]/gi, "") || "bin"; const result = await storagePut(`payment-proofs/${input.bookingCode}.${extension}`, Buffer.from(input.base64, "base64"), input.mimeType); return { success: true, url: result.url, key: result.key } as const; }),
    submitToGoogleSheets: publicProcedure.input(bookingPayload).mutation(async ({ input }) => {
      // 1. Ensure lead exists or create one
      const leadId = await db.createLead({
        name: input.customerName,
        phone: input.phone,
        email: input.email,
        source: "booking_form",
        productInterest: input.tripSlug || input.tripName,
        status: "BOOKED",
        score: 100
      });

      // 2. Save to database with quota check
      let status: any = "under_review";
      let waitlisted = false;
      
      try {
        await db.createBooking({
          bookingCode: input.bookingCode,
          leadId,
          departureId: input.departureId || 0,
          packageId: input.packageName,
          participantCount: input.participants,
          totalAmount: input.total.toString(),
          status: "under_review",
          paymentProofUrl: input.proofUrl,
        });
      } catch (error: any) {
        if (error.message === "QUOTA_FULL") {
          // Move to waitlist
          const tripData = await db.listTrips();
          const trip = tripData.find(t => t.slug === input.tripSlug);
          await db.addToWaitlist(trip?.id || 0, input.departureId || null, leadId);
          status = "pending"; // Or a specific waitlist status
          waitlisted = true;
        } else {
          throw error;
        }
      }

      const message = buildAdminWhatsAppMessage({ ...input, status: waitlisted ? "pending" : "under_review" });
      const notification = await notifyWhatsApp(message);
      
      const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
      if (!webhookUrl || !/^https:\/\//.test(webhookUrl) || !webhookUrl.endsWith("/exec")) {
        return { success: true, configured: false, status: "under_review", whatsappUrl: notification.fallbackUrl, whatsappSent: notification.sent, message: "Booking tersimpan di DB; Google Sheets belum terhubung." } as const;
      }
      
      const response = await fetch(webhookUrl, { 
        method: "POST", 
        headers: { "Content-Type": "application/json", "X-OrTrip-Source": "ortrip-adventure" }, 
        body: JSON.stringify({ ...input, status: "under_review", submittedAt: new Date().toISOString(), spreadsheetId: ENV.bookingSpreadsheetId }) 
      });
      
      if (!response.ok) throw new Error(`Google Sheets submission failed (${response.status})`);
      return { success: true, configured: true, status: "under_review", whatsappUrl: notification.fallbackUrl, whatsappSent: notification.sent } as const;
    }),
    getStatus: publicProcedure.input(z.object({ bookingCode: z.string().min(4).max(40) })).query(async ({ input }) => { 
      const result = await db.getBookingByCode(input.bookingCode); 
      return result ? { status: result.booking.status, updatedAt: result.booking.submittedAt.toISOString() } : { status: "pending" as const, updatedAt: null }; 
    }),
    updateStatus: protectedProcedure.input(z.object({ bookingCode: z.string().min(4).max(40), status: z.enum(["pending", "under_review", "approved", "rejected", "cancelled", "refunded"]) })).mutation(async ({ ctx, input }) => { 
      if (ctx.user.role !== "admin") throw new Error("Admin access required"); 
      const oldBooking = await db.getBookingByCode(input.bookingCode);
      await db.updateBookingStatus(input.bookingCode, input.status);
      const result = await db.getBookingByCode(input.bookingCode);
      
      if (result) {
        await db.logAudit(
          ctx.user.id,
          "update_booking_status",
          "booking",
          result.booking.id,
          oldBooking?.booking,
          result.booking
        );
      }
      if (!result) throw new Error("Booking tidak ditemukan");
      
      const { booking, lead, trip, departure } = result;
      
      // Notify via WhatsApp
      const message = buildAdminWhatsAppMessage({ 
        bookingCode: booking.bookingCode,
        tripName: trip?.title || "Trip",
        customerName: lead?.name || "Customer",
        participants: booking.participantCount,
        total: parseFloat(booking.totalAmount.toString()),
        paymentMethod: "Bank Transfer",
        status: input.status,
        phone: lead?.phone || "",
        email: lead?.email || "",
        date: departure?.startDate.toLocaleDateString() || "",
      });
      const notification = await notifyWhatsApp(message); 
      return { success: true, status: input.status, whatsappUrl: notification.fallbackUrl, whatsappSent: notification.sent } as const; 
    }),
    list: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") throw new Error("Admin access required");
      const list = await db.listBookings();
      return list.map(({ booking, lead, trip, departure }) => ({
        ...booking,
        submittedAt: booking.submittedAt.toISOString(),
        total: parseFloat(booking.totalAmount.toString()),
        tripName: trip?.title || "Unknown Trip",
        customerName: lead?.name || "Anonymous",
        departureDate: departure?.startDate.toISOString(),
      }));
    }),
    getStats: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") throw new Error("Admin access required");
      const list = await db.listBookings();
      const totalRevenue = list.filter(b => b.booking.status === "approved").reduce((sum, b) => sum + parseFloat(b.booking.totalAmount.toString()), 0);
      const pendingRevenue = list.filter(b => b.booking.status === "under_review").reduce((sum, b) => sum + parseFloat(b.booking.totalAmount.toString()), 0);
      return {
        totalBookings: list.length,
        approvedBookings: list.filter(b => b.booking.status === "approved").length,
        pendingBookings: list.filter(b => b.booking.status === "under_review").length,
        totalRevenue,
        pendingRevenue,
      };
    }),
  }),
  ai: router({
    ask: publicProcedure.input(z.object({
      message: z.string(),
      leadId: z.number().optional(),
    })).mutation(async ({ input }) => {
      const tripsData = await db.listTrips();
      const context = tripsData.map(t => `- ${t.title}: ${t.description} (Price: Rp ${t.priceBase})`).join("\n");
      
      const res = await invokeLLM({
        model: "gpt-5-mini",
        messages: [
          { role: "system", content: `You are an AI Sales Assistant for Or.Trip Adventure. Use the following trip context to answer user questions about Indonesian mountain trips. Be helpful, professional, and encourage booking.\n\nContext:\n${context}` },
          { role: "user", content: input.message },
        ],
      });
      
      const answer = res.choices[0].message.content || "Maaf, saya sedang mengalami kendala teknis.";
      
      if (input.leadId) {
        await db.logLeadActivity(input.leadId, "chatbot_interaction", { message: input.message, answer }, 15);
      }
      
      return { answer };
    }),
  }),
});

export type AppRouter = typeof appRouter;
