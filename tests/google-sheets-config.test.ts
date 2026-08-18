import { describe, expect, it } from 'vitest';

describe('Google Sheets webhook configuration', () => {
  it('is configured with a reachable HTTPS Apps Script endpoint', async () => {
    const url = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
    expect(url, 'GOOGLE_SHEETS_WEBHOOK_URL must be configured').toMatch(/^https:\/\//);
    expect(url).toMatch(/\/exec(?:\?.*)?$/);
    const response = await fetch(url!, { method: 'HEAD' });
    expect(response.status).toBeLessThan(500);
  }, 15000);
});
