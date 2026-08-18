import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { storagePut } from "./storage";
import { ENV } from "./_core/env";
import { buildAdminWhatsAppMessage, type BookingValidationStatus } from "../lib/booking-status";

const bookingPayload = z.object({
  bookingCode: z.string().min(4).max(40), tripName: z.string().min(2).max(160), packageName: z.string().max(160).optional(), date: z.string().min(2).max(80), participants: z.number().int().min(1).max(30), customerName: z.string().min(2).max(120), phone: z.string().min(6).max(40), email: z.string().email().max(180), total: z.number().int().nonnegative(), paymentMethod: z.string().min(2).max(80), proofUrl: z.string().max(500).optional(),
});

type StoredBooking = z.infer<typeof bookingPayload> & { submittedAt: string; status: BookingValidationStatus };
const bookingStore = new Map<string, StoredBooking>();

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
  booking: router({
    uploadPaymentProof: publicProcedure.input(z.object({ bookingCode: z.string().min(4).max(40), fileName: z.string().min(1).max(160), mimeType: z.enum(["image/png", "image/jpeg", "image/webp", "application/pdf"]), base64: z.string().min(100).max(15_000_000) })).mutation(async ({ input }) => { const extension = input.fileName.split(".").pop()?.replace(/[^a-z0-9]/gi, "") || "bin"; const result = await storagePut(`payment-proofs/${input.bookingCode}.${extension}`, Buffer.from(input.base64, "base64"), input.mimeType); return { success: true, url: result.url, key: result.key } as const; }),
    submitToGoogleSheets: publicProcedure.input(bookingPayload).mutation(async ({ input }) => {
      const stored: StoredBooking = { ...input, submittedAt: new Date().toISOString(), status: "under_review" };
      bookingStore.set(input.bookingCode, stored);
      const message = buildAdminWhatsAppMessage({ ...input, status: stored.status });
      const notification = await notifyWhatsApp(message);
      const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
      if (!webhookUrl || !/^https:\/\//.test(webhookUrl) || !webhookUrl.endsWith("/exec")) return { success: true, configured: false, status: stored.status, whatsappUrl: notification.fallbackUrl, whatsappSent: notification.sent, message: "Booking tersimpan dan siap diteruskan; Google Sheets belum terhubung." } as const;
      const response = await fetch(webhookUrl, { method: "POST", headers: { "Content-Type": "application/json", "X-OrTrip-Source": "ortrip-adventure" }, body: JSON.stringify({ ...input, status: stored.status, submittedAt: stored.submittedAt, spreadsheetId: ENV.bookingSpreadsheetId }) });
      if (!response.ok) throw new Error(`Google Sheets submission failed (${response.status})`);
      return { success: true, configured: true, status: stored.status, whatsappUrl: notification.fallbackUrl, whatsappSent: notification.sent } as const;
    }),
    getStatus: publicProcedure.input(z.object({ bookingCode: z.string().min(4).max(40) })).query(({ input }) => { const booking = bookingStore.get(input.bookingCode); return booking ? { status: booking.status, updatedAt: booking.submittedAt } : { status: "pending" as const, updatedAt: null }; }),
    updateStatus: protectedProcedure.input(z.object({ bookingCode: z.string().min(4).max(40), status: z.enum(["pending", "under_review", "approved", "rejected"]) })).mutation(async ({ ctx, input }) => { if (ctx.user.role !== "admin") throw new Error("Admin access required"); const booking = bookingStore.get(input.bookingCode); if (!booking) throw new Error("Booking tidak ditemukan pada sesi server ini"); booking.status = input.status; const message = buildAdminWhatsAppMessage({ ...booking, status: input.status }); const notification = await notifyWhatsApp(message); return { success: true, status: input.status, whatsappUrl: notification.fallbackUrl, whatsappSent: notification.sent } as const; }),
  }),
});

export type AppRouter = typeof appRouter;
