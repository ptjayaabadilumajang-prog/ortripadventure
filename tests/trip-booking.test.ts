import { describe, expect, it } from 'vitest';
import { buildBookingWhatsAppMessage, formatIDR, getTrip, isBookingConsentComplete, trips } from '../lib/demo-data';

describe('Or.Trip demo booking logic', () => {
  it('returns a known trip by id and falls back safely', () => {
    expect(getTrip('bromo-sunrise').title).toBe('Bromo Sunrise Escape');
    expect(getTrip('missing-id').id).toBe(trips[0].id);
  });

  it('formats IDR totals consistently for booking summaries', () => {
    expect(formatIDR(875000)).toBe('Rp 875.000');
    expect(formatIDR(1750000)).toBe('Rp 1.750.000');
  });

  it('calculates a multi-participant total from the selected trip', () => {
    const trip = getTrip('bromo-sunrise');
    expect(trip.price * 2).toBe(1750000);
  });

  it('requires both legal consents before booking can continue', () => {
    expect(isBookingConsentComplete(false, false)).toBe(false);
    expect(isBookingConsentComplete(true, false)).toBe(false);
    expect(isBookingConsentComplete(false, true)).toBe(false);
    expect(isBookingConsentComplete(true, true)).toBe(true);
  });

  it('builds a WhatsApp message with the selected trip details', () => {
    expect(buildBookingWhatsAppMessage({ tripName: 'Bromo Sunrise Escape', date: '14–15 Sep 2026', participants: 3 })).toContain('Bromo Sunrise Escape');
    expect(buildBookingWhatsAppMessage({ tripName: 'Bromo Sunrise Escape', date: '14–15 Sep 2026', participants: 3 })).toContain('Jumlah peserta: 3');
  });
});
