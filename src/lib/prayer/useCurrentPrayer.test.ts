import { describe, it, expect } from 'vitest';
import { deriveCurrentPrayer } from './useCurrentPrayer';
import { ComputedPrayerTimes } from './calculate';

// Helper to create mocked times
function createMockTimes(baseHour: number): ComputedPrayerTimes {
  const d = new Date(2024, 0, 1);
  return {
    fajr: new Date(d.setHours(baseHour + 5, 0, 0, 0)),
    sunrise: new Date(d.setHours(baseHour + 6, 30, 0, 0)),
    dhuhr: new Date(d.setHours(baseHour + 12, 0, 0, 0)),
    asr: new Date(d.setHours(baseHour + 15, 30, 0, 0)),
    maghrib: new Date(d.setHours(baseHour + 18, 0, 0, 0)),
    isha: new Date(d.setHours(baseHour + 19, 30, 0, 0)),
  };
}

describe('deriveCurrentPrayer', () => {
  const yesterday = createMockTimes(-24); // 24 hours ago
  const today = createMockTimes(0);
  const tomorrow = createMockTimes(24); // 24 hours from now

  it('handles exactly on a prayer time (Fajr)', () => {
    const result = deriveCurrentPrayer(today.fajr, yesterday, today, tomorrow);
    expect(result.current.name).toBe('fajr');
    expect(result.next.name).toBe('sunrise');
    expect(result.isAfterIsha).toBe(false);
  });

  it('handles daytime between prayers (Dhuhr -> Asr)', () => {
    const currentTime = new Date(today.dhuhr.getTime() + 1000 * 60 * 30); // 30 mins after Dhuhr
    const result = deriveCurrentPrayer(currentTime, yesterday, today, tomorrow);
    expect(result.current.name).toBe('dhuhr');
    expect(result.next.name).toBe('asr');
    expect(result.isAfterIsha).toBe(false);
  });

  it('handles immediately after Isha (Before midnight)', () => {
    const currentTime = new Date(today.isha.getTime() + 1000 * 60); // 1 min after Isha
    const result = deriveCurrentPrayer(currentTime, yesterday, today, tomorrow);
    expect(result.current.name).toBe('isha');
    expect(result.current.time).toEqual(today.isha);
    expect(result.next.name).toBe('fajr');
    expect(result.next.time).toEqual(tomorrow.fajr);
    expect(result.isAfterIsha).toBe(true);
  });

  it('handles immediately before Fajr (After midnight)', () => {
    const currentTime = new Date(today.fajr.getTime() - 1000 * 60); // 1 min before Fajr
    const result = deriveCurrentPrayer(currentTime, yesterday, today, tomorrow);
    expect(result.current.name).toBe('isha');
    expect(result.current.time).toEqual(yesterday.isha);
    expect(result.next.name).toBe('fajr');
    expect(result.next.time).toEqual(today.fajr);
    expect(result.isAfterIsha).toBe(true);
  });
});
