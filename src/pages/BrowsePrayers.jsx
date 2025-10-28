// src/pages/BrowsePrayers.jsx
import React from "react";
import { Book, BookOpen, Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import VERSE_COUNTS from "../constants/verse-counts.json";

// Backend base (proxy or full URL)
const API_BASE = import.meta.env.VITE_API_BASE || "";

// --- Canonical 66-book list (ordering + fallback) ---
const CANONICAL_BOOKS = [
  "Genesis","Exodus","Leviticus","Numbers","Deuteronomy",
  "Joshua","Judges","Ruth","1 Samuel","2 Samuel","1 Kings","2 Kings","1 Chronicles","2 Chronicles",
  "Ezra","Nehemiah","Esther","Job","Psalms","Proverbs","Ecclesiastes","Song of Solomon",
  "Isaiah","Jeremiah","Lamentations","Ezekiel","Daniel",
  "Hosea","Joel","Amos","Obadiah","Jonah","Micah","Nahum","Habakkuk","Zephaniah",
  "Haggai","Zechariah","Malachi",
  "Matthew","Mark","Luke","John","Acts","Romans","1 Corinthians","2 Corinthians","Galatians",
  "Ephesians","Philippians","Colossians","1 Thessalonians","2 Thessalonians","1 Timothy","2 Timothy",
  "Titus","Philemon","Hebrews","James","1 Peter","2 Peter","1 John","2 John","3 John","Jude","Revelation",
];

// Testament map
const TESTAMENT = new Map(
  [
    ..."Genesis Exodus Leviticus Numbers Deuteronomy Joshua Judges Ruth 1 Samuel 2 Samuel 1 Kings 2 Kings 1 Chronicles 2 Chronicles Ezra Nehemiah Esther Job Psalms Proverbs Ecclesiastes Song of Solomon Isaiah Jeremiah Lamentations Ezekiel Daniel Hosea Joel Amos Obadiah Jonah Micah Nahum Habakkuk Zephaniah Haggai Zechariah Malachi".split(
      " "
    ),
  ].map((b) => [b, "old"])
);
[
  ..."Matthew Mark Luke John Acts Romans 1 Corinthians 2 Corinthians Galatians Ephesians Philippians Colossians 1 Thessalonians 2 Thessalonians 1 Timothy 2 Timothy Titus Philemon Hebrews James 1 Peter 2 Peter 1 John 2 John 3 John Jude Revelation".split(
    " "
  ),
].forEach((b) => TESTAMENT.set(b, "new"));

// Aliases
const BOOK_ALIASES = {
  "Song of Solomon": ["Song of Songs", "Canticles"],
  Psalms: ["Psalm"],
};

function slugifyBook(name) {
  return String(name)
    .normalize("NFKD")
    .replace(/[’']/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/gi, "")
    .toLowerCase();
}

// Accept shapes: {data:{books:[...]}} | {books:[...]} | {data:[...]} | [ ... ]
function normalizeBooksFromApi(raw) {
  let list = raw?.data?.books ?? raw?.books ?? raw?.data ?? raw ?? [];
  if (Array.isArray(list) && list.length && typeof list[0] === "object") {
    list = list.map((b) => b.name || b.book || b.title).filter(Boolean);
  }
  if (!Array.isArray(list) || list.length < 60) {
    return CANONICAL_BOOKS;
  }
  const set = new Set(list.map(String));
  const inCanon = CANONICAL_BOOKS.filter((b) => set.has(b));
  const extras = list.filter((b) => !new Set(CANONICAL_BOOKS).has(b));
  return [...inCanon, ...extras];
}

function computeTotalVerses() {
  try {
    return Object.values(VERSE_COUNTS).reduce((sum, arr) => {
      if (Array.isArray(arr)) {
        return sum + arr.reduce((s, n) => s + Number(n || 0), 0);
      }
      return sum;
    }, 0);
  } catch {
    return 0;
  }
}

export default function BrowsePrayers() {
  const nav = useNavigate();
  const [loading, setLoading] = React.useState(true);
  const [books, setBooks] = React.useState(CANONICAL_BOOKS);
  const [q, setQ] = React.useState("");

  // banner count
  const [publishedCount, setPublishedCount] = React.useState(0);
  const totalVerses = React.useMemo(() => computeTotalVerses(), []);

  // server search (books + prayer points)
  const [searching, setSearching] = React.useState(false);
  const [results, setResults] = React.useState([]); // [{book, chapter, verse, theme, insight, prayerPoints}, ...]

  // Fetch books
  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/browse/books`, {
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) {
          const body = await res.text();
          console.error("GET /browse/books failed:", res.status, body);
          if (res.status === 401) return nav("/login", { replace: true });
          throw new Error(`HTTP ${res.status}`);
        }
        const data = await res.json();
        const normalized = normalizeBooksFromApi(data);
        if (alive) setBooks(normalized);
      } catch (e) {
        console.error(e);
        toast.error("Couldn’t load books; showing default list.");
        if (alive) setBooks(CANONICAL_BOOKS);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [nav]);

  // Fetch published count
  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/browse/published-count`, {
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });
        if (res.ok) {
          const data = await res.json();
          const c = Number(data?.count ?? 0);
          if (alive) setPublishedCount(Number.isFinite(c) ? c : 0);
        }
      } catch (e) {
        console.error(e);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // Debounced server search
  React.useEffect(() => {
    let alive = true;
    const term = q.trim();
    if (!term) {
      setResults([]);
      setSearching(false);
      return;
    }
    const t = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(
          `${API_BASE}/browse/search?` + new URLSearchParams({ q: term }),
          { credentials: "include", headers: { "Content-Type": "application/json" } }
        );
        if (!res.ok) {
          if (res.status === 401) return nav("/login", { replace: true });
          throw new Error(`HTTP ${res.status}`);
        }
        const data = await res.json();
        const list = Array.isArray(data?.data) ? data.data : [];
        if (alive) setResults(list.slice(0, 10));
      } catch (e) {
        console.error(e);
        if (alive) setResults([]);
      } finally {
        if (alive) setSearching(false);
      }
    }, 300);
    return () => {
      alive = false;
      clearTimeout(t);
    };
  }, [q, nav]);

  // Local filter on book list (kept for quick book lookup)
  const filtered = React.useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return books;

    const aliasLookup = new Map(
      Object.entries(BOOK_ALIASES).flatMap(([canon, arr]) => [
        [canon.toLowerCase(), canon],
        ...(arr || []).map((a) => [a.toLowerCase(), canon]),
      ])
    );

    return books.filter((b) => {
      const name = b.toLowerCase();
      if (name.includes(term)) return true;
      if (aliasLookup.has(name)) {
        const canon = aliasLookup.get(name);
        return canon?.toLowerCase().includes(term);
      }
      return false;
    });
  }, [q, books]);

  const oldBooks = filtered.filter((b) => TESTAMENT.get(b) === "old");
  const newBooks = filtered.filter((b) => TESTAMENT.get(b) === "new");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50 pt-24 lg:pl-[224px] px-4 pb-8 font-['Poppins']">
      <div className="container px-4 lg:px-6 py-6">
        {/* Header / Banner */}
        <div className="text-center mb-8">
          <h1 className="text-base font-semibold text-[#0C2E8A] mb-2 flex items-center justify-center gap-3">
            <BookOpen className="w-8 h-8 text-[#FCCF3A]" />
            Browse Prayers
          </h1>
          <p className="text-sm text-[#0C2E8A]">
            Explore over <span className="font-semibold">{publishedCount}</span> curated prayers across{" "}
            <span className="font-semibold">{totalVerses.toLocaleString()}</span> verses
          </p>

          {/* Search */}
          <div className="mx-auto mt-4 max-w-xl relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search books or prayer points…"
              className="w-full border rounded-md pl-10 pr-9 py-2 bg-white"
            />
            <span className="absolute right-2 top-2.5 text-gray-400 text-xs">⌘K</span>

            {/* Search results panel */}
            {q.trim() && (
              <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-auto z-10">
                {searching ? (
                  <div className="p-3 text-sm text-gray-500">Searching…</div>
                ) : results.length === 0 ? (
                  <div className="p-3 text-sm text-gray-500">No matches found.</div>
                ) : (
                  <ul className="divide-y divide-gray-100">
                    {results.map((r) => {
                      const ref = `${r.book} ${r.chapter}:${r.verse}`;
                      const pointsCount = Array.isArray(r.prayerPoints) ? r.prayerPoints.length : 0;
                      return (
                        <li key={`${r.book}-${r.chapter}-${r.verse}`}>
                          <Link
                            className="flex items-start justify-between gap-3 p-3 hover:bg-gray-50"
                            to={`/browse/verse/${encodeURIComponent(r.book)}/${r.chapter}/${r.verse}`}
                          >
                            <div>
                              <div className="text-sm font-semibold text-[#0C2E8A]">{ref}</div>
                              {r.theme ? (
                                <div className="text-xs text-gray-600 mt-0.5">{r.theme}</div>
                              ) : null}
                            </div>
                            <div className="text-xs text-gray-500 whitespace-nowrap">
                              {pointsCount} point{pointsCount === 1 ? "" : "s"}
                            </div>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-3">
            {Array.from({ length: 18 }).map((_, i) => (
              <div key={i} className="h-12 rounded-lg bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            {/* Old Testament */}
            <div className="mt-8 bg-[#FFFEF0] rounded-lg shadow p-4 py-10 border-l-4 border-[#FCCF3A]">
              <h3 className="text-base font-semibold text-[#0C2E8A] mb-4 flex items-center gap-2">
                <Book className="w-6 h-6 text-[#FCCF3A]" />
                Old Testament
              </h3>
              {oldBooks.length === 0 ? (
                <div className="text-sm text-gray-600">No matches.</div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
                  {oldBooks.map((name) => (
                    <Link
                      key={name}
                      to={`/book/${slugifyBook(name)}`}
                      className="flex items-center justify-between p-3 border border-[#FCCF3A] rounded-lg hover:bg-[#FFFEF0] transition-colors"
                    >
                      <span className="font-medium text-[#0C2E8A]">{name}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* New Testament */}
            <div className="mt-20 bg-[#FFFEF0] rounded-lg shadow p-4 py-10 border-l-4 border-[#0C2E8A]">
              <h3 className="text-base font-semibold text-[#0C2E8A] mb-4 flex items-center gap-2">
                <Book className="w-6 h-6 text-[#0C2E8A]" />
                New Testament
              </h3>
              {newBooks.length === 0 ? (
                <div className="text-sm text-gray-600">No matches.</div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
                  {newBooks.map((name) => (
                    <Link
                      key={name}
                      to={`/book/${slugifyBook(name)}`}
                      className="flex items-center justify-between p-3 border border-[#0C2E8A] rounded-lg hover:bg-[#3FCBFF]/10 transition-colors"
                    >
                      <span className="font-medium text-[#0C2E8A]">{name}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
