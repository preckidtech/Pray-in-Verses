// src/pages/Home.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useVerseStore } from "../store";
import FeaturedVerseCards from "../components/ui/FeaturedVerseCards";
import QuickActionsGrid from "../components/ui/QuickActionsGrid";
import { BookOpen, Flame, RefreshCw } from "lucide-react";

import welcomeBg from "../assets/images/home/hero/a-group-of-young-christians-holding-hands-in-praye-2025-03-26-18-07-58-utc.jpg";

// --- small fetch helper with cookie auth
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
    // leave payload as {}
  }
  if (!res.ok) {
    const err = new Error(payload?.message || res.statusText || "Request failed");
    err.status = res.status;
    throw err;
  }
  return payload;
}

// slugify for verse routing
const slugifyBook = (name) =>
  String(name)
    .normalize("NFKD")
    .replace(/[’']/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/gi, "")
    .toLowerCase();

const Home = () => {
  const navigate = useNavigate();

  // you already had this (keeping it, though we won’t rely on it for VOTD)
  const verseOfDayFromStore = useVerseStore((s) => s.verseOfDay) || {
    reference: "John 3:16",
    text: "For God so loved the world...",
  };

  // NEW: fetched Verse of the Day (published curated verse)
  const [votd, setVotd] = React.useState(null);
  const [loadingVotd, setLoadingVotd] = React.useState(true);

  // NEW: simple streak (per-user localStorage)
  const [streak, setStreak] = React.useState({ current: 0, longest: 0 });
  const [loadingStreak, setLoadingStreak] = React.useState(true);

  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        // 1) Who am I? (for streak namespacing)
        const me = await request("/auth/me");
        const uid = me?.data?.id || me?.id || "anon";

        // 2) Update streak for today
        const key = `streak_${uid}`;
        const now = new Date();
        const todayStr = now.toISOString().slice(0, 10); // YYYY-MM-DD
        const prev = JSON.parse(localStorage.getItem(key) || "null");

        let current = 1;
        let longest = 1;
        let lastDate = todayStr;

        if (prev && prev.lastDate) {
          const last = new Date(prev.lastDate + "T00:00:00");
          const d0 = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
          const d1 = Date.UTC(last.getFullYear(), last.getMonth(), last.getDate());
          const diffDays = Math.floor((d0 - d1) / (1000 * 60 * 60 * 24));

          if (diffDays === 0) {
            current = prev.current || 1;
            longest = prev.longest || prev.current || 1;
            lastDate = prev.lastDate;
          } else if (diffDays === 1) {
            current = (prev.current || 0) + 1;
            longest = Math.max(prev.longest || 0, current);
            lastDate = todayStr;
          } else {
            current = 1;
            longest = Math.max(prev.longest || 0, 1);
            lastDate = todayStr;
          }
        }

        const saved = { current, longest, lastDate };
        localStorage.setItem(key, JSON.stringify(saved));
        if (!alive) return;
        setStreak({ current, longest });
      } catch (e) {
        if (e.status === 401) {
          navigate("/login", { replace: true });
          return;
        }
        // non-fatal for streak
      } finally {
        if (alive) setLoadingStreak(false);
      }

      try {
        // 3) Verse of the Day from backend
        const votdRes = await request("/browse/verse-of-the-day");
        if (!alive) return;
        setVotd(votdRes?.data || null);
      } catch (e) {
        if (e.status === 401) {
          navigate("/login", { replace: true });
          return;
        }
        // keep null
      } finally {
        if (alive) setLoadingVotd(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [navigate]);

  return (
    <div className="flex bg-gradient-to-br from-blue-50 via-white to-yellow-50 min-h-screen pt-32 pb-10 font-['Poppins'] lg:pl-[224px] px-4">
      <main className="flex-1 space-y-10 lg:px-6 pb-10 max-w-7xl">
        {/* Welcome Section */}
        <section
          className="relative rounded-xl overflow-hidden shadow-lg border border-gray-100"
          style={{
            backgroundImage: `url(${welcomeBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 to-blue-800/60" />
          <div className="relative p-8 lg:p-12 items-start lg:items-center gap-6 text-white">
            <div>
              <h1 className="text-2xl lg:text-3xl font-semibold mb-4 leading-tight text-yellow-50">
                Welcome to Pray in Verses
              </h1>
              <p className="italic text-base mb-2 lg:text-lg leading-relaxed text-blue-100 font-normal">
                Turn every verse into prayers!
              </p>
              <p className="text-sm">
                Pray in Verses is a unique devotional platform designed to help
                you connect deeply with God's Word through prayer.
              </p>
            </div>
          </div>
        </section>


        {/* Featured Verses */}
        <section className="space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2">
            <FeaturedVerseCards />
          </div>
        </section>

        {/* Quick Actions */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="mt-12 text-base font-semibold text-gray-900 tracking-wide">
              Quick Actions
            </h2>
          </div>
          <QuickActionsGrid />
        </section>
      </main>
    </div>
  );
};

export default Home;
