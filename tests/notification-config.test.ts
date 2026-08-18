import { describe, expect, it } from "vitest";

describe("notification integration configuration", () => {
  it("accepts an Apps Script webhook when configured", () => {
    const url = process.env.GOOGLE_SHEETS_WEBHOOK_URL ?? "";
    const isPlaceholder = url === "RANUKUMBOLO-ORTRIP";
    expect(isPlaceholder || url === "" || (url.startsWith("https://") && /\/exec(?:\?.*)?$/.test(url))).toBe(true);
  });

  it("uses international recipient format when WhatsApp is configured", () => {
    const recipient = process.env.WHATSAPP_ADMIN_RECIPIENT ?? "";
    expect(recipient === "" || /^\d{10,15}$/.test(recipient)).toBe(true);
  });
});
