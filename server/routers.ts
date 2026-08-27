import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { storagePut } from "./storage";
import { ENV } from "./_core/env";
import { buildAdminWhatsAppMessage, type BookingValidationStatus } from "../lib/booking-status";
import * as db from "./db";

const bookingPayload = z.object({
  bookingCode: z.string().min(4).max(40),
  tripSlug: z.string().min(2).max(64).optional(), // New: linked to trips.slug
  tripName: z.string().min(2).max(160), 
  packageName: z.string().max(160).optional(), 
  date: z.string().min(2).max(80), 
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
    list: publicProcedure.query(() => db.listTrips()),
    getBySlug: publicProcedure.input(z.object({ slug: z.string() })).query(({ input }) => db.getTripBySlug(input.slug)),
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
    updateScore: publicProcedure.input(z.object({ id: z.number(), score: z.number() })).mutation(({ input }) => db.updateLeadScore(input.id, input.score)),
    listLeads: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") throw new Error("Admin access required");
      const d = await db.getDb();
      if (!d) return [];
      // @ts-ignore
      return d.select().from(require("../drizzle/schema").leads).orderBy(require("drizzle-orm").desc(require("../drizzle/schema").leads.lastActivity));
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

      // 2. Save to database
      await db.createBooking({
        bookingCode: input.bookingCode,
        leadId,
        departureId: 0, // Placeholder for now, should be linked to tripDepartures
        packageId: input.packageName,
        participantCount: input.participants,
        totalAmount: input.total.toString(),
        status: "under_review",
        paymentProofUrl: input.proofUrl,
      });

      const message = buildAdminWhatsAppMessage({ ...input, status: "under_review" });
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
      const booking = await db.getBookingByCode(input.bookingCode); 
      return booking ? { status: booking.status, updatedAt: booking.submittedAt.toISOString() } : { status: "pending" as const, updatedAt: null }; 
    }),
    updateStatus: protectedProcedure.input(z.object({ bookingCode: z.string().min(4).max(40), status: z.enum(["pending", "under_review", "approved", "rejected"]) })).mutation(async ({ ctx, input }) => { 
      if (ctx.user.role !== "admin") throw new Error("Admin access required"); 
      await db.updateBookingStatus(input.bookingCode, input.status);
      const booking = await db.getBookingByCode(input.bookingCode);
      if (!booking) throw new Error("Booking tidak ditemukan");
      
      // Notify via WhatsApp
      const message = buildAdminWhatsAppMessage({ 
        bookingCode: booking.bookingCode,
        tripName: "Trip", // Ideally fetch from DB
        customerName: "Customer", // Ideally fetch from lead
        participants: booking.participantCount,
        total: parseFloat(booking.totalAmount.toString()),
        paymentMethod: "Bank Transfer",
        status: input.status,
        phone: "", // Need to fetch from lead
        email: "",
        date: "",
      });
      const notification = await notifyWhatsApp(message); 
      return { success: true, status: input.status, whatsappUrl: notification.fallbackUrl, whatsappSent: notification.sent } as const; 
    }),
    list: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") throw new Error("Admin access required");
      const list = await db.listBookings();
      return list.map(b => ({
        ...b,
        submittedAt: b.submittedAt.toISOString(),
        total: parseFloat(b.totalAmount.toString()),
        // Map back to frontend expected shape
        tripName: "Trip", // TODO: join with trips table
        customerName: "Customer", // TODO: join with leads table
      }));
    }),
    getStats: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") throw new Error("Admin access required");
      const list = await db.listBookings();
      const totalRevenue = list.filter(b => b.status === "approved").reduce((sum, b) => sum + parseFloat(b.totalAmount.toString()), 0);
      const pendingRevenue = list.filter(b => b.status === "under_review").reduce((sum, b) => sum + parseFloat(b.totalAmount.toString()), 0);
      return {
        totalBookings: list.length,
        approvedBookings: list.filter(b => b.status === "approved").length,
        pendingBookings: list.filter(b => b.status === "under_review").length,
        totalRevenue,
        pendingRevenue,
      };
    }),
  }),
});

export type AppRouter = typeof appRouter;
