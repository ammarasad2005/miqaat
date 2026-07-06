import { describe, it, expect, vi } from 'vitest';
import { getDailyContent } from './daily-selector';

// Mock the JSON data so tests are isolated from actual dataset size
vi.mock('@/data/verses.json', () => ({
  default: Array.from({ length: 50 }, (_, i) => ({ reference: `verse-${i}` }))
}));
vi.mock('@/data/hadith.json', () => ({
  default: Array.from({ length: 50 }, (_, i) => ({ number: i }))
}));

describe('Daily Content Selector', () => {
  it('should deterministically return the same content for the same date', () => {
    const result1 = getDailyContent('2023-10-25');
    const result2 = getDailyContent('2023-10-25');
    
    expect(result1.verse.reference).toBe(result2.verse.reference);
    expect(result1.hadith.number).toBe(result2.hadith.number);
  });

  it('should return different content for different dates', () => {
    const result1 = getDailyContent('2023-10-25');
    const result2 = getDailyContent('2023-10-26');
    
    expect(result1.verse.reference).not.toBe(result2.verse.reference);
  });

  it('should handle malformed date strings gracefully', () => {
    const result1 = getDailyContent('invalid-date');
    const result2 = getDailyContent('invalid-date');
    
    expect(result1.verse).toBeDefined();
    expect(result1.hadith).toBeDefined();
    expect(result1.verse.reference).toBe(result2.verse.reference);
  });
  
  it('should never go out of bounds', () => {
    for (let i = 1; i <= 365; i++) {
      const date = new Date(Date.UTC(2023, 0, i)).toISOString().split('T')[0];
      const result = getDailyContent(date);
      expect(result.verse).toBeDefined();
      expect(result.hadith).toBeDefined();
    }
  });
});
