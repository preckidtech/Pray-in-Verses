import React from "react";
import { Book, BookOpen } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import VERSE_COUNTS from "../../api/src/modules/bible/verse-counts.json"; // ← keep a copy in src/data

// Backend base (optional). Set VITE_API_BASE=http://localhost:4000 in .env if not using a proxy.
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

// Quick testament mapping
const TESTAMENT = new Map([
  ..."Genesis Exodus Leviticus Numbers Deuteronomy Joshua Judges Ruth 1 Samuel 2 Samuel 1 Kings 2 Kings 1 Chronicles 2 Chronicles Ezra Nehemiah Esther Job Psalms Proverbs Ecclesiastes Song of Solomon Isaiah Jeremiah Lamentations Ezekiel Daniel Hosea Joel Amos Obadiah Jonah Micah Nahum Habakkuk Zephaniah Haggai Zechariah Malachi"
    .split(" ").map((b) => [b, "old"]),
  ..."Matthew Mark Luke John Acts Romans 1 Corinthians 2 Corinthians Galatians Ephesians Philippians Colossians 1 Thessalonians 2 Thessalonians 1 Timothy 2 Timothy Titus Philemon Hebrews James 1 Peter 2 Peter 1 John 2 John 3 John Jude Revelation"
    .split(" ").map((b) => [b, "new"]),
]);

// Some APIs may expose alternate titles
const BOOK_ALIASES = {
  "Song of Solomon": ["Song of Songs", "Canticles"],
  "Psalms": ["Psalm"],
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
  let list =
    raw?.data?.books ??
    raw?.books ??
    raw?.data ??      // ← NEW: handle { data: [...] }
    raw ?? [];

  if (Array.isArray(list) && list.length && typeof list[0] === "object") {
    list = list.map((b) => b.name || b.book || b.title).filter(Boolean);
  }

  if (!Array.isArray(list) || list.length < 60) {
    // Too sparse (e.g., just “Psalms”) → fallback to canonical 66
    return CANONICAL_BOOKS;
  }

  const set = new Set(list.map(String));
  const inCanon = CANONICAL_BOOKS.filter((b) => set.has(b));
  const extras = list.filter((b) => !new Set(CANONICAL_BOOKS).has(b));
  return [...inCanon, ...extras];
}

// Sum total verses from verse-counts.json
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

  const [publishedCount, setPublishedCount] = React.useState(0);
  const totalVerses = React.useMemo(() => computeTotalVerses(), []);

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
          // Capture payload to help debugging
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
    return () => { alive = false; };
  }, [nav]);

  // Fetch published count (expects backend route: GET /browse/published-count → { count })
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
        } else if (res.status !== 404) {
          console.error("GET /browse/published-count failed:", res.status);
          toast.error("Couldn’t load published count.");
        }
      } catch (e) {
        console.error(e);
        // keep 0 silently
      }
    })();
    return () => { alive = false; };
  }, []);

  const filtered = React.useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return books;

    // Match against canonical names + aliases
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50 pt-24 lg:pl-[224px] px-4 pb-8">
      <div className="container px-4 lg:px-6 py-6">
        <div className="text-center mb-8">
          <h1 className="text-base font-semibold text-[#0C2E8A] mb-2 flex items-center justify-center gap-3">
            <BookOpen className="w-8 h-8 text-[#FCCF3A]" />
            Browse Prayers
          </h1>

          {/* Banner: Explore X across Y */}
          <p className="text-sm text-[#0C2E8A]">
            Explore over <span className="font-semibold">{publishedCount}</span>{" "}
            prayers across{" "}
            <span className="font-semibold">{totalVerses.toLocaleString()}</span>{" "}
            verses
          </p>

          <div className="mx-auto mt-4 max-w-md relative">
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search book…"
              className="w-full border rounded-md px-3 py-2 pr-9"
            />
            <span className="absolute right-2 top-2.5 text-gray-400">⌘K</span>
          </div>
        </div>

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
