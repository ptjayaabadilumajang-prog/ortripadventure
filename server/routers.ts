import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { storagePut } from "./storage";
import { ENV } from "./_core/env";

const bookingPayload = z.object({
  bookingCode: z.string().min(4).max(40),
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

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie("session", { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  booking: router({
    uploadPaymentProof: publicProcedure
      .input(z.object({
        bookingCode: z.string().min(4).max(40),
        fileName: z.string().min(1).max(160),
        mimeType: z.enum(["image/png", "image/jpeg", "image/webp", "application/pdf"]),
        base64: z.string().min(100).max(15_000_000),
      }))
      .mutation(async ({ input }) => {
        const extension = input.fileName.split(".").pop()?.replace(/[^a-z0-9]/gi, "") || "bin";
        const result = await storagePut(`payment-proofs/${input.bookingCode}.${extension}`, Buffer.from(input.base64, "base64"), input.mimeType);
        return { success: true, url: result.url, key: result.key } as const;
      }),
    submitToGoogleSheets: publicProcedure
      .input(bookingPayload)
      .mutation(async ({ input }) => {
        const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
        if (!webhookUrl) {
          return { success: false, configured: false, message: "Google Sheets belum dikonfigurasi." } as const;
        }
        const response = await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json", "X-OrTrip-Source": "ortrip-adventure" },
          body: JSON.stringify({ ...input, submittedAt: new Date().toISOString(), spreadsheetId: ENV.bookingSpreadsheetId }),
        });
        if (!response.ok) throw new Error(`Google Sheets submission failed (${response.status})`);
        return { success: true, configured: true } as const;
      }),
  }),
});

export type AppRouter = typeof appRouter;
