// src/pages/VerseDetails.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Bookmark } from "lucide-react";
import banner from "../assets/images/suggest/two-lovers-studying-the-bible-it-is-god-s-love-for-2022-06-18-20-18-08-utc.jpg";
import { usePageLogger } from "../hooks/usePageLogger";
import { logPrayer } from "../utils/historyLogger";

// ---- Small local fetch helper with cookie auth ----
const API_BASE = import.meta.env.VITE_API_BASE || "";
async function request(path, { method = "GET", body, headers = {} } = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...headers },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text().catch(() => "");
  let payload = {};
  try {
    payload = text ? JSON.parse(text) : {};
  } catch {}
  if (!res.ok) {
    const err = new Error(payload?.message || res.statusText || "Request failed");
    err.status = res.status;
    err.payload = payload;
    throw err;
  }
  return payload;
}

// ---- Book helpers to resolve clean display names from slugs or aliases ----
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

// Turn "genesis" → "Genesis", "song-of-solomon" → "Song of Solomon"
function resolveBookName(slugOrName) {
  if (!slugOrName) return "";
  const lower = slugOrName.toLowerCase();

  // 1) exact canonical match
  const exact = CANONICAL_BOOKS.find((b) => b.toLowerCase() === lower);
  if (exact) return exact;

  // 2) match by canonical slug
  const bySlug = CANONICAL_BOOKS.find((b) => slugifyBook(b) === lower);
  if (bySlug) return bySlug;

  // 3) alias support
  for (const [canon, aliases] of Object.entries(BOOK_ALIASES)) {
    if (
      aliases.some(
        (a) => a.toLowerCase() === lower || slugifyBook(a) === lower
      )
    ) {
      return canon;
    }
  }

  // 4) fallback: title-case the slug
  return String(slugOrName)
    .split("-")
    .map((t) => (t.length ? t[0].toUpperCase() + t.slice(1).toLowerCase() : ""))
    .join(" ");
}

const VerseDetails = () => {
  const { bookSlug, chapterNumber, verseNumber } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [curated, setCurated] = useState(null); // { id, book, chapter, verse, theme, scriptureText, insight, prayerPoints[], closing }
  const [error, setError] = useState("");

  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  // Local toast
  const [toastMessage, setToastMessage] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const showToast = (msg) => {
    setToastMessage(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
  };

  // ---- Clean, display-first reference values (ALWAYS from route) ----
  const bookNameFromRoute = useMemo(() => resolveBookName(bookSlug), [bookSlug]);
  const chapterFromRoute = useMemo(() => Number(chapterNumber), [chapterNumber]);
  const verseFromRoute = useMemo(() => Number(verseNumber), [verseNumber]);

  // ---- Compute final display reference (prefer route; fall back to API if needed) ----
  const displayBook = bookNameFromRoute || curated?.book || "";
  const displayChapter = Number.isFinite(chapterFromRoute)
    ? chapterFromRoute
    : Number(curated?.chapter);
  const displayVerse = Number.isFinite(verseFromRoute)
    ? verseFromRoute
    : Number(curated?.verse);

  // Fetch curated verse + saved status
  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setError("");
      setCurated(null);
      setIsSaved(false);

      try {
        // Load curated/published content for this verse
        const chStr = String(chapterNumber || "").trim();
        const vsStr = String(verseNumber || "").trim();
        if (!/^\d+$/.test(chStr) || !/^\d+$/.test(vsStr)) {
          throw new Error("Invalid reference.");
        }

        const verseRes = await request(
          `/browse/verse/${encodeURIComponent(bookSlug)}/${chStr}/${vsStr}`
        );
        const data = verseRes?.data || verseRes;
        if (!alive) return;

        if (!data) {
          throw new Error("No curated content for this verse yet.");
        }
        setCurated(data);

        // Check saved status
        try {
          const savedRes = await request(`/saved-prayers`);
          const list = savedRes?.data || savedRes || [];
          const saved =
            Array.isArray(list) &&
            list.some((it) => it.curatedPrayerId === data.id);
          if (!alive) return;
          setIsSaved(saved);
        } catch {
          // ignore saved list failure; user can still toggle
        }
      } catch (err) {
        if (!alive) return;
        if (err.status === 401) {
          // not authenticated → go to login
          navigate("/login", { replace: true });
          return;
        }
        setError(err?.message || "Could not load verse content.");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [bookSlug, chapterNumber, verseNumber, navigate]);

  // Page title + analytics (use display refs)
  const refLabel = useMemo(() => {
    const ch = Number.isFinite(displayChapter) ? displayChapter : "?";
    const vs = Number.isFinite(displayVerse) ? displayVerse : "?";
    return `${displayBook} ${ch}:${vs}`;
  }, [displayBook, displayChapter, displayVerse]);

  useEffect(() => {
    if (refLabel) document.title = refLabel;
  }, [refLabel]);

  usePageLogger({
    title: refLabel,
    type: "verse",
    reference: refLabel,
    content: "Viewed Bible verse details and reflections",
    category: "Bible Study",
  });

  async function onToggleSave(pointTextForLog) {
    if (!curated?.id) return;
    setSaving(true);
    try {
      if (isSaved) {
        await request(`/saved-prayers/${curated.id}`, { method: "DELETE" });
        setIsSaved(false);
        showToast("Removed from Saved ✅");
      } else {
        await request(`/saved-prayers/${curated.id}`, { method: "POST" });
        setIsSaved(true);
        showToast("Saved ✅");

        // Optional: log the first prayer point or a provided text
        if (pointTextForLog) {
          logPrayer("Prayer Point Saved", pointTextForLog, refLabel);
        } else if (Array.isArray(curated.prayerPoints) && curated.prayerPoints[0]) {
          logPrayer("Prayer Point Saved", curated.prayerPoints[0], refLabel);
        }
      }
    } catch (err) {
      if (err.status === 401) navigate("/login", { replace: true });
      else showToast(err?.message || "Action failed");
    } finally {
      setSaving(false);
    }
  }

  // Loading shell
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-20 lg:pl-[224px] pb-12">
        <div className="relative w-full h-48 md:h-64">
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        </div>
        <div className="max-w-3xl mx-auto px-6 -mt-12">
          <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-100">
            <div className="h-6 w-1/2 bg-gray-200 rounded animate-pulse mb-4" />
            <div className="h-4 w-1/3 bg-gray-200 rounded animate-pulse mb-6" />
            <div className="h-24 w-full bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  // Error / empty
  if (error || !curated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-20 lg:pl-[224px] pb-12">
        <div className="max-w-3xl mx-auto px-6">
          <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-100">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 mb-6 text-[#0C2E8A] hover:underline"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <div className="text-red-600 mb-2">{error || "No curated content for this verse yet."}</div>
            <div className="text-sm text-gray-600">
              Try another verse or check back later after it’s curated.
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Use the computed display reference everywhere (banner & breadcrumb)
  const bannerBook = displayBook;
  const bannerChapter = Number.isFinite(displayChapter) ? displayChapter : "?";
  const bannerVerse = Number.isFinite(displayVerse) ? displayVerse : "?";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-20 lg:pl-[224px] pb-12">
      {/* Toast */}
      {toastVisible && (
        <div className="fixed top-24 right-6 bg-white shadow-lg rounded-lg px-4 py-3 border-l-4 border-green-500 z-50 animate-slide-in">
          <span className="text-gray-800 font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Banner */}
      <div className="relative w-full h-48 md:h-64 flex items-center justify-center text-white">
        <img src={banner} alt="Bible Banner" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/50" />
        <h1 className="relative z-10 text-2xl md:text-3xl font-bold text-center px-4">
          {bannerBook} – Chapter {bannerChapter}, Verse {bannerVerse}
        </h1>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 -mt-12 relative z-10">
        <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-100">
          {/* Back + breadcrumb */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-[#0C2E8A] hover:underline"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Chapter
            </button>
            <div className="text-xs text-gray-500">
              <Link to={`/book/${encodeURIComponent(bookSlug)}`} className="hover:underline">
                {bannerBook}
              </Link>
              <span className="mx-1">›</span>
              <Link
                to={`/book/${encodeURIComponent(bookSlug)}/chapter/${bannerChapter}`}
                className="hover:underline"
              >
                Chapter {bannerChapter}
              </Link>
              <span className="mx-1">›</span>
              <span>Verse {bannerVerse}</span>
            </div>
          </div>

          {/* Theme / Reference */}
          {curated.theme ? (
            <h2 className="text-xl font-bold text-[#0C2E8A] mb-2">{curated.theme}</h2>
          ) : null}

          {/* Scripture Text */}
          {curated.scriptureText ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }}>
              <h3 className="text-sm font-semibold text-[#0C2E8A] mb-2 mt-9 uppercase tracking-wide">
                Scripture Reference
              </h3>
              <p className="text-gray-700 leading-relaxed bg-gray-50 border rounded-md p-3">
                {curated.scriptureText}
              </p>
            </motion.div>
          ) : null}

          {/* Insight */}
          {curated.insight ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="mt-6">
              <h3 className="text-lg font-semibold text-[#0C2E8A] mb-2">Short Insight</h3>
              <p className="text-gray-700 leading-relaxed">{curated.insight}</p>
            </motion.div>
          ) : null}

          {/* Prayer Points */}
          {Array.isArray(curated.prayerPoints) && curated.prayerPoints.length > 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="mt-6">
              <h3 className="text-lg font-semibold text-[#0C2E8A] mb-2 flex items-center gap-2">
                Prayer Points
              </h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                {curated.prayerPoints.map((point, i) => (
                  <li key={i} className="flex justify-between items-center">
                    <span>{point}</span>
                    {/* Quick-save of a specific point also toggles the global saved state */}
                    <button
                      onClick={() => onToggleSave(point)}
                      title={isSaved ? "Unsave entry" : "Save entry"}
                    >
                      <Bookmark
                        className={`w-6 h-6 transition-transform ${
                          isSaved ? "text-yellow-500 scale-110" : "text-gray-400 hover:text-yellow-500"
                        }`}
                      />
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          ) : null}

          {/* Closing */}
          {curated.closing ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mt-6">
              <h3 className="text-lg font-semibold text-[#0C2E8A] mb-2">Closing Prayer / Confession</h3>
              <p className="text-gray-700 italic leading-relaxed">{curated.closing}</p>
            </motion.div>
          ) : null}

          {/* Save/Unsave main action */}
          <div className="flex items-center gap-3 pt-6">
            <button
              onClick={() => onToggleSave()}
              disabled={!curated?.id || saving}
              className={`px-3 py-2 rounded-md border ${
                isSaved ? "bg-green-600 text-white border-green-600" : "bg-white text-gray-900"
              }`}
            >
              {saving ? "…" : isSaved ? "Unsave" : "Save"}
            </button>

            <Link
              to={`/journal?ref=${encodeURIComponent(refLabel)}&curatedId=${encodeURIComponent(curated.id)}`}
              className="px-3 py-2 rounded-md border bg-white text-gray-900"
            >
              Open Journal
            </Link>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes slide-in {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in { animation: slide-in 0.3s ease-out; }
      `}</style>
    </div>
  );
};

export default VerseDetails;
