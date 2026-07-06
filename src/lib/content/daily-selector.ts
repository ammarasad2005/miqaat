import versesData from '@/data/verses.json';
import hadithsData from '@/data/hadith.json';

export interface Verse {
  reference: string;
  surah: string;
  ayah: number;
  arabic: string;
  english: string;
}

export interface Hadith {
  collection: string;
  book: number;
  number: number;
  text: string;
  grade: string;
}

export interface DailyContent {
  verse: Verse;
  hadith: Hadith;
  showVerse: boolean;
}

export function getDailyContent(dateStr: string): DailyContent {
  // Date format is expected to be YYYY-MM-DD
  const parts = dateStr.split('-');
  let daysSinceEpoch = 0;
  
  if (parts.length === 3) {
    const d = new Date(Date.UTC(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2])));
    daysSinceEpoch = Math.floor(d.getTime() / (1000 * 60 * 60 * 24));
  } else {
    // Fallback if date is malformed
    let hash = 0;
    for (let i = 0; i < dateStr.length; i++) {
      hash = (hash << 5) - hash + dateStr.charCodeAt(i);
      hash |= 0;
    }
    daysSinceEpoch = Math.abs(hash);
  }

  // Ensure positive index
  daysSinceEpoch = Math.max(0, daysSinceEpoch);

  // Cycle through available items
  const verseIndex = daysSinceEpoch % versesData.length;
  // Use a slight multiplier for hadiths to ensure pairings mix over time 
  // (if lengths are same, 1-to-1 pairing gets boring)
  const hadithIndex = (daysSinceEpoch * 7) % hadithsData.length;

  return {
    verse: versesData[verseIndex] as Verse,
    hadith: hadithsData[hadithIndex] as Hadith,
    showVerse: daysSinceEpoch % 2 === 0,
  };
}
