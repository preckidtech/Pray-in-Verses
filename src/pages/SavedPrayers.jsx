import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, X, Bookmark } from "lucide-react";

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
  } catch {
    payload = {};
  }
  if (!res.ok) {
    const err = new Error(payload?.message || res.statusText || "Request failed");
    err.status = res.status;
    err.payload = payload;
    throw err;
  }
  return payload;
}

function slugifyBook(name) {
  return String(name)
    .normalize("NFKD")
    .replace(/[’']/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/gi, "")
    .toLowerCase();
}

export default function SavedPrayers() {
  const nav = useNavigate();

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [toastMessage, setToastMessage] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const showToast = (msg) => {
    setToastMessage(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
  };

  // Normalize backend response into UI rows
  function normalizeList(payload) {
    // backend returns { data: [...] } where each entry: { id, curatedPrayer: {...} }
    const list = payload?.data ?? payload ?? [];
    if (!Array.isArray(list)) return [];
    return list.map((item) => {
      const cp = item.curatedPrayer || item; // tolerate flat shapes
      const chapter = Number(cp.chapter);
      const verse = Number(cp.verse);
      return {
        savedId: item.id || item.savedId, // for delete
        curatedId: item.curatedPrayerId || cp.id,
        savedAt:
          item.createdAt ||
          item.savedAt ||
          cp.publishedAt ||
          new Date().toISOString(),
        book: cp.book,
        chapter: Number.isFinite(chapter) ? chapter : null,
        verse: Number.isFinite(verse) ? verse : null,
        theme: cp.theme,
        scriptureText: cp.scriptureText,
        insight: cp.insight,
        prayerPoints: Array.isArray(cp.prayerPoints) ? cp.prayerPoints : [],
        closing: cp.closing,
      };
    });
  }

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        const res = await request("/saved-prayers");
        const normalized = normalizeList(res);
        if (alive) setRows(normalized);
      } catch (err) {
        if (err.status === 401) {
          nav("/login", { replace: true });
          return;
        }
        showToast(err?.message || "Could not load saved prayers");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [nav]);

  async function removeSaved(savedId) {
    try {
      // Some backends DELETE by curatedId; we prefer savedId if present
      const row = rows.find((r) => r.savedId === savedId);
      const idForDelete = row?.curatedId || savedId;
      await request(`/saved-prayers/${idForDelete}`, { method: "DELETE" });
      setRows((r) => r.filter((x) => x.savedId !== savedId));
      showToast("Prayer removed successfully 🗑️");
    } catch (err) {
      if (err.status === 401) nav("/login", { replace: true });
      else showToast(err?.message || "Failed to remove");
    }
  }

  function gotoVerse(row) {
    const slug = slugifyBook(row.book);
    if (!slug || !Number.isFinite(row.chapter) || !Number.isFinite(row.verse)) {
      showToast("This saved item is missing a valid reference");
      return;
    }
    nav(`/book/${slug}/chapter/${row.chapter}/verse/${row.verse}`);
  }

  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((p) => {
      const ref = `${p.book || ""} ${p.chapter || ""}:${p.verse || ""}`.toLowerCase();
      return (
        (p.theme || "").toLowerCase().includes(q) ||
        (p.scriptureText || "").toLowerCase().includes(q) ||
        (p.insight || "").toLowerCase().includes(q) ||
        ref.includes(q)
      );
    });
  }, [rows, searchTerm]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50 pt-24 pl-0 lg:pl-[224px] px-4 pb-8 font-['Poppins']">
      {/* Toast */}
      {toastVisible && (
        <div className="fixed top-24 right-6 bg-white shadow-lg rounded-lg px-4 py-3 border-l-4 border-green-500 z-50 animate-slide-in">
          <span className="text-gray-800 font-medium">{toastMessage}</span>
        </div>
      )}

      <main className="flex-1 space-y-10 px-4 lg:px-6 pb-10">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <h1 className="text-base font-semibold text-[#0C2E8A]">
              Saved Prayers
            </h1>
            <div className="relative w-full md:w-1/3 mt-4 md:mt-0">
              <input
                type="text"
                placeholder="Search saved prayers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-3 pr-9 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0C2E8A]"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
                  title="Clear"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-40 bg-white rounded-lg shadow p-6 border border-gray-100">
                  <div className="h-4 w-1/2 bg-gray-100 rounded animate-pulse mb-3" />
                  <div className="h-3 w-1/3 bg-gray-100 rounded animate-pulse mb-2" />
                  <div className="h-16 w-full bg-gray-100 rounded animate-pulse" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-gray-600 mt-6">No saved prayers found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((p) => {
                const canOpen =
                  !!p.book && Number.isFinite(p.chapter) && Number.isFinite(p.verse);
                const ref =
                  p.book && p.chapter && p.verse
                    ? `${p.book} ${p.chapter}:${p.verse}`
                    : "—";

                return (
                  <div
                    key={p.savedId || `${p.curatedId}-${p.savedAt}`}
                    className="bg-white rounded-lg shadow p-6 border border-gray-100 relative hover:shadow-lg transition"
                  >
                    {/* Remove */}
                    <button
                      onClick={() => removeSaved(p.savedId)}
                      className="absolute top-3 right-3 text-gray-400 hover:text-red-600"
                      title="Remove prayer"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>

                    {/* Title / Theme */}
                    <h3 className="text-base font-bold text-[#0C2E8A]">
                      {p.theme || "Curated Prayer"}
                    </h3>

                    <div className="text-sm text-gray-500 mt-1">{ref}</div>

                    {/* Scripture */}
                    {p.scriptureText ? (
                      <p className="text-gray-700 mt-3 line-clamp-4">
                        {p.scriptureText}
                      </p>
                    ) : null}

                    {/* Prayer points */}
                    {p.prayerPoints && p.prayerPoints.length > 0 ? (
                      <div className="mt-3">
                        <h4 className="text-sm font-semibold text-[#0C2E8A] mb-1">
                          Prayer Points:
                        </h4>
                        <ul className="list-disc pl-6 text-sm text-gray-700 space-y-1">
                          {p.prayerPoints.slice(0, 3).map((pt, i) => (
                            <li key={i} className="flex justify-between items-center">
                              <span>{pt}</span>
                              <Bookmark className="w-4 h-4 text-yellow-500" />
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}

                    <div className="text-xs text-gray-400 mt-3">
                      Saved: {new Date(p.savedAt).toLocaleDateString()}
                    </div>

                    {/* Actions */}
                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() =>
                          canOpen
                            ? gotoVerse(p)
                            : showToast("This saved item is missing its reference")
                        }
                        disabled={!canOpen}
                        className={`px-3 py-2 rounded-md border transition ${
                          canOpen
                            ? "text-[#0C2E8A] hover:bg-[#0C2E8A] hover:text-white"
                            : "text-gray-400 cursor-not-allowed bg-gray-50"
                        }`}
                      >
                        Open
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <style>{`
        @keyframes slide-in {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in { animation: slide-in 0.3s ease-out; }
      `}</style>
    </div>
  );
}
