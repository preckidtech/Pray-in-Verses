// src/pages/BibleVerse.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { usePageLogger } from "../hooks/usePageLogger";

// Same slug → title helper used elsewhere
const toTitleFromSlug = (s) =>
  String(s || "")
    .split("-")
    .map((t) => (t.length ? t[0].toUpperCase() + t.slice(1).toLowerCase() : ""))
    .join(" ");

// Tiny local fetch helper with cookie auth
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
  try { payload = text ? JSON.parse(text) : {}; } catch {}
  if (!res.ok) {
    const err = new Error(payload?.message || res.statusText || "Request failed");
    err.status = res.status;
    err.payload = payload;
    throw err;
  }
  return payload;
}

const BibleVerse = () => {
  const { bookSlug, chapterNumber, verseNumber } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [curated, setCurated] = useState(null); // { id, book, chapter, verse, theme, scriptureText, insight, prayerPoints[], closing }
  const [error, setError] = useState("");

  // Friendly "Book C:V" label
  const refLabel = useMemo(() => {
    const bookTitle = curated?.book || toTitleFromSlug(bookSlug);
    const ch = Number(chapterNumber) || "";
    const v = Number(verseNumber) || "";
    return bookTitle && ch && v ? `${bookTitle} ${ch}:${v}` : bookTitle || "Bible Verse";
  }, [curated, bookSlug, chapterNumber, verseNumber]);

  // Update tab title
  useEffect(() => {
    if (refLabel) document.title = refLabel;
  }, [refLabel]);

  // Page view logging
  usePageLogger({
    title: refLabel,
    type: "verse",
    reference: `/book/${bookSlug}/chapter/${chapterNumber}/verse/${verseNumber}`,
    content: "",
    category: "Bible Verses",
  });

  // Fetch curated content
  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setError("");
      setCurated(null);
      try {
        const res = await request(
          `/browse/verse/${encodeURIComponent(bookSlug)}/${Number(chapterNumber)}/${Number(verseNumber)}`
        );
        const data = res?.data || res;
        if (!alive) return;
        setCurated(data || null);
      } catch (err) {
        if (!alive) return;
        if (err.status === 401) {
          // not authenticated → go to login (your app guard may already handle this)
          navigate("/login", { replace: true });
          return;
        }
        setError(err?.message || "Could not load verse content.");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [bookSlug, chapterNumber, verseNumber, navigate]);

  return (
    <div className="min-h-screen pt-[100px] p-4 bg-gray-50">
      <h1 className="text-xl font-bold text-[#0C2E8A]">{refLabel}</h1>

      {/* Loading */}
      {loading && (
        <div className="mt-6 space-y-3">
          <div className="h-5 w-1/2 bg-gray-200 animate-pulse rounded" />
          <div className="h-4 w-1/3 bg-gray-200 animate-pulse rounded" />
          <div className="h-24 w-full bg-gray-200 animate-pulse rounded" />
        </div>
      )}

      {/* Error / Empty */}
      {!loading && (error || !curated) && (
        <div className="mt-6">
          <p className="text-red-600">{error || "No curated content for this verse yet."}</p>
          <p className="text-sm text-gray-600 mt-1">
            Try another verse or check back later after it’s curated.
          </p>
        </div>
      )}

      {/* Compact Curated Content */}
      {!loading && curated && (
        <div className="mt-6 bg-white rounded-lg shadow border border-gray-100 p-5 space-y-4">
          {curated.theme ? (
            <div>
              <div className="text-sm uppercase tracking-wide text-gray-500">Theme / Focus</div>
              <div className="text-[#0C2E8A] font-semibold">{curated.theme}</div>
            </div>
          ) : null}

          {curated.scriptureText ? (
            <div>
              <div className="text-sm uppercase tracking-wide text-gray-500">Scripture Reference</div>
              <p className="bg-gray-50 border rounded p-3 leading-relaxed text-gray-800">
                {curated.scriptureText}
              </p>
            </div>
          ) : null}

          {curated.insight ? (
            <div>
              <div className="text-sm uppercase tracking-wide text-gray-500">Short Insight</div>
              <p className="leading-relaxed text-gray-800">{curated.insight}</p>
            </div>
          ) : null}

          <div className="pt-2">
            <Link
              to={`/book/${encodeURIComponent(bookSlug)}/chapter/${curated.chapter}/verse/${curated.verse}`}
              className="inline-block px-3 py-2 rounded-md border bg-white text-gray-900 hover:bg-gray-50"
            >
              Open full details
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default BibleVerse;
