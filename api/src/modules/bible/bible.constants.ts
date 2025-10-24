// Loads canonical books and verse counts from a JSON data file.
// Make sure tsconfig has `"resolveJsonModule": true`.

import VERSE_COUNTS_RAW from './verse-counts.json';

// Canonical Protestant order (stable order for selects & UX)
export const CANONICAL_BOOKS = [
  "Genesis","Exodus","Leviticus","Numbers","Deuteronomy",
  "Joshua","Judges","Ruth","1 Samuel","2 Samuel","1 Kings","2 Kings","1 Chronicles","2 Chronicles",
  "Ezra","Nehemiah","Esther","Job","Psalms","Proverbs","Ecclesiastes","Song of Solomon",
  "Isaiah","Jeremiah","Lamentations","Ezekiel","Daniel",
  "Hosea","Joel","Amos","Obadiah","Jonah","Micah","Nahum","Habakkuk","Zephaniah",
  "Haggai","Zechariah","Malachi",
  "Matthew","Mark","Luke","John","Acts","Romans","1 Corinthians","2 Corinthians","Galatians",
  "Ephesians","Philippians","Colossians","1 Thessalonians","2 Thessalonians","1 Timothy","2 Timothy",
  "Titus","Philemon","Hebrews","James","1 Peter","2 Peter","1 John","2 John","3 John","Jude","Revelation"
] as const;

export type CanonicalBook = (typeof CANONICAL_BOOKS)[number];

// Basic runtime validation + normalization
function isStringArray(arr: unknown): arr is number[] {
  return Array.isArray(arr) && arr.every(n => Number.isInteger(n) && n > 0);
}

// Build a typed map restricted to canonical names.
// If JSON is missing a book, we store an empty array so service can gracefully fall back.
const map: Record<CanonicalBook, number[]> = Object.create(null);
for (const book of CANONICAL_BOOKS) {
  const raw = (VERSE_COUNTS_RAW as Record<string, unknown>)[book];
  map[book] = isStringArray(raw) ? (raw as number[]) : [];
}

export const VERSE_COUNTS: Record<CanonicalBook, number[]> = map;

// Optional aliases so we can resolve a few common variants.
export const BOOK_ALIASES: Record<CanonicalBook, string[]> = {
    "Song of Solomon": ["Song of Songs", "Canticles"],
    "Psalms": ["Psalm"],
    "1 Samuel": ["1Samuel", "I Samuel", "1-samuel"],
    "2 Samuel": ["2Samuel", "II Samuel", "2-samuel"],
    "1 Kings": ["1Kings", "I Kings", "1-kings"],
    "2 Kings": ["2Kings", "II Kings", "2-kings"],
    "1 Chronicles": ["1Chronicles", "I Chronicles", "1-chronicles"],
    "2 Chronicles": ["2Chronicles", "II Chronicles", "2-chronicles"],
    "1 Corinthians": ["1Corinthians", "I Corinthians", "1-corinthians"],
    "2 Corinthians": ["2Corinthians", "II Corinthians", "2-corinthians"],
    "1 Thessalonians": ["1Thessalonians", "I Thessalonians", "1-thessalonians"],
    "2 Thessalonians": ["2Thessalonians", "II Thessalonians", "2-thessalonians"],
    "1 Timothy": ["1Timothy", "I Timothy", "1-timothy"],
    "2 Timothy": ["2Timothy", "II Timothy", "2-timothy"],
    "1 Peter": ["1Peter", "I Peter", "1-peter"],
    "2 Peter": ["2Peter", "II Peter", "2-peter"],
    "1 John": ["1John", "I John", "1-john"],
    "2 John": ["2John", "II John", "2-john"],
    "3 John": ["3John", "III John", "3-john"],
    // Books without common alternates:
    "Genesis": [], "Exodus": [], "Leviticus": [], "Numbers": [], "Deuteronomy": [],
    "Joshua": [], "Judges": [], "Ruth": [], "Ezra": [], "Nehemiah": [], "Esther": [], "Job": [],
    "Proverbs": [], "Ecclesiastes": [], "Isaiah": [], "Jeremiah": [], "Lamentations": [],
    "Ezekiel": [], "Daniel": [], "Hosea": [], "Joel": [], "Amos": [], "Obadiah": [], "Jonah": [],
    "Micah": [], "Nahum": [], "Habakkuk": [], "Zephaniah": [], "Haggai": [], "Zechariah": [], "Malachi": [],
    "Matthew": [], "Mark": [], "Luke": [], "John": [], "Acts": [], "Romans": [], "Galatians": [],
    "Ephesians": [], "Philippians": [], "Colossians": [], "Titus": [], "Philemon": [], "Hebrews": [], "James": [], "Revelation": [],
    "Jude": []
};
