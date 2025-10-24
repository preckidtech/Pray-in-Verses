import { Injectable } from '@nestjs/common';
import { CANONICAL_BOOKS, VERSE_COUNTS, CanonicalBook } from './bible.constants';

@Injectable()
export class BibleService {
  getBooks(): { books: CanonicalBook[] } {
    return { books: CANONICAL_BOOKS as unknown as CanonicalBook[] };
  }

  getChapters(book: string): { chapters: number[] } {
    const canon = this.resolveBook(book);
    const counts = canon ? VERSE_COUNTS[canon] : undefined;
    if (!counts || counts.length === 0) return { chapters: [] };
    return { chapters: counts.map((_, idx) => idx + 1) };
  }

  getVerses(book: string, chapter: number): { verses: number[] } {
    const canon = this.resolveBook(book);
    const counts = canon ? VERSE_COUNTS[canon] : undefined;
    if (!counts || counts.length === 0) return { verses: [] };
    const total = counts[chapter - 1] ?? 0;
    return { verses: total ? Array.from({ length: total }, (_, i) => i + 1) : [] };
  }

  // Try to match user-provided key to canonical book name
  private resolveBook(input: string): CanonicalBook | null {
    if (!input) return null;
    const trimmed = String(input).trim();
    // exact match
    const exact = (CANONICAL_BOOKS as readonly string[]).find(b => b === trimmed);
    if (exact) return exact as CanonicalBook;

    // case-insensitive
    const ci = (CANONICAL_BOOKS as readonly string[]).find(b => b.toLowerCase() === trimmed.toLowerCase());
    if (ci) return ci as CanonicalBook;

    // slug match (e.g., "song-of-solomon")
    const slug = this.slugify(trimmed);
    const slugMatch = (CANONICAL_BOOKS as readonly string[]).find(b => this.slugify(b) === slug);
    if (slugMatch) return slugMatch as CanonicalBook;

    // basic aliases
    if (slug === 'song-of-songs' || slug === 'canticles') return 'Song of Solomon';
    if (slug === 'psalm') return 'Psalms';

    return null;
  }

  private slugify(s: string) {
    return s
      .normalize('NFKD')
      .replace(/[’']/g, '')
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/gi, '')
      .toLowerCase();
  }
}
