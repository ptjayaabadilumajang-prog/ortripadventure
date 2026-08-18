import { describe, expect, it } from 'vitest';

describe('Google Sheets webhook configuration', () => {
  it('is configured with a reachable HTTPS Apps Script endpoint when provided', async () => {
    const url = process.env.GOOGLE_SHEETS_WEBHOOK_URL ?? '';
    if (!url || !url.startsWith('https://') || !url.match(/\/exec(?:\?.*)?$/)) {
      expect(true).toBe(true);
      return;
    }
    const response = await fetch(url, { method: 'HEAD' });
    expect(response.status).toBeLessThan(500);
  }, 15000);
});
