import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Play, RefreshCw, BookOpen, Star } from "lucide-react";

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
    throw err;
  }
  return payload;
}

const slugifyBook = (name) =>
  String(name)
    .normalize("NFKD")
    .replace(/[’']/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/gi, "")
    .toLowerCase();

export default function DailyPrayerVerse() {
  const nav = useNavigate();
  const [votd, setVotd] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [error, setError] = React.useState("");

  const load = React.useCallback(async () => {
    try {
      setError("");
      const res = await request("/browse/verse-of-the-day");
      setVotd(res?.data || null);
    } catch (e) {
      if (e.status === 401) {
        nav("/login", { replace: true });
        return;
      }
      setError(e?.message || "Could not load the verse of the day.");
      setVotd(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [nav]);

  React.useEffect(() => {
    load();
  }, [load]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
  };

  const refStr = votd ? `${votd.book} ${votd.chapter}:${votd.verse}` : "";

  return (
    <div className="bg-[#0C2E8A] rounded-lg p-6 items-center text-white">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Star size={16} className="text-yellow-300" />
          <span className="text-sm opacity-90">Today's Prayer Verse</span>
        </div>

        <button
          onClick={onRefresh}
          disabled={loading || refreshing}
          className="inline-flex items-center gap-1 bg-white/20 hover:bg-white/25 disabled:opacity-60 px-3 py-1.5 rounded transition"
          title="Refresh verse"
        >
          <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
          <span className="text-xs">Refresh</span>
        </button>
      </div>

      {loading ? (
        <>
          <div className="h-5 w-40 bg-white/20 rounded mb-3 animate-pulse" />
          <div className="h-16 bg-white/10 rounded animate-pulse" />
        </>
      ) : error ? (
        <p className="text-sm bg-black/20 rounded p-3">{error}</p>
      ) : votd ? (
        <>
          <h1 className="text-2xl font-bold mb-2">{refStr}</h1>
          {votd.theme ? (
            <div className="text-sm italic text-white/90 mb-1">{votd.theme}</div>
          ) : null}
          <p className="mb-5 text-lg leading-relaxed mt-4">
            {votd.scriptureText || "—"}
          </p>

          <div className="flex flex-wrap gap-3">
            {/* Both buttons open the verse details */}

            <Link
              to={`/book/${slugifyBook(votd.book)}/chapter/${votd.chapter}/verse/${votd.verse}`}
              className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/25 px-4 py-2 rounded transition"
            >
              <BookOpen size={16} />
              Open Verse
            </Link>
          </div>
        </>
      ) : (
        <p className="text-sm">No verse available today.</p>
      )}
    </div>
  );
}
