// src/components/PrayerStreakCard.jsx
import React from "react";
import { Flame, RefreshCw } from "lucide-react";

// --- small date helpers ---
function isoDay(d = new Date()) {
  // local midnight ISO (YYYY-MM-DD)
  const yr = d.getFullYear();
  const mo = String(d.getMonth() + 1).padStart(2, "0");
  const da = String(d.getDate()).padStart(2, "0");
  return `${yr}-${mo}-${da}`;
}
function daysDiff(aISO, bISO) {
  if (!aISO || !bISO) return NaN;
  const a = new Date(aISO + "T00:00:00");
  const b = new Date(bISO + "T00:00:00");
  const ms = b.getTime() - a.getTime();
  return Math.round(ms / 86400000);
}

// --- PUBLIC HELPER ---
// Call this from anywhere after a user "prays" (e.g., VerseDetails → Pray Now).
export function recordPrayerActivity(date = new Date()) {
  const today = isoDay(date);
  const last = localStorage.getItem("streak.lastDate") || "";
  const current = parseInt(localStorage.getItem("streak.count") || "0", 10) || 0;

  // If already counted for today, no change
  if (last === today) {
    window.dispatchEvent(
      new CustomEvent("streakUpdated", {
        detail: { count: current, lastDate: today, unchanged: true },
      })
    );
    return current;
  }

  let next = 1;
  const delta = last ? daysDiff(last, today) : NaN;
  if (delta === 1) next = current + 1; // consecutive day
  else next = 1; // missed a day (or first time)

  localStorage.setItem("streak.count", String(next));
  localStorage.setItem("streak.lastDate", today);

  window.dispatchEvent(
    new CustomEvent("streakUpdated", {
      detail: { count: next, lastDate: today },
    })
  );
  return next;
}

// --- Card component ---
export default function PrayerStreakCard() {
  const [count, setCount] = React.useState(() => {
    const c = parseInt(localStorage.getItem("streak.count") || "0", 10);
    return Number.isFinite(c) ? c : 0;
  });
  const [lastDate, setLastDate] = React.useState(
    localStorage.getItem("streak.lastDate") || ""
  );
  const [refreshing, setRefreshing] = React.useState(false);

  React.useEffect(() => {
    // keep in sync if other parts of the app update the streak
    const onUpdate = (e) => {
      const { count: c, lastDate: d } = e.detail || {};
      if (typeof c === "number") setCount(c);
      if (d) setLastDate(d);
      setRefreshing(false);
    };
    window.addEventListener("streakUpdated", onUpdate);
    return () => window.removeEventListener("streakUpdated", onUpdate);
  }, []);

  const today = isoDay();
  const isCountedToday = lastDate === today;

  const markToday = () => {
    setRefreshing(true);
    recordPrayerActivity(); // this will emit the event and update the card
  };

  // Optional: manual refresh from storage (if needed)
  const reloadFromStorage = () => {
    setRefreshing(true);
    const c = parseInt(localStorage.getItem("streak.count") || "0", 10) || 0;
    const d = localStorage.getItem("streak.lastDate") || "";
    setCount(c);
    setLastDate(d);
    setRefreshing(false);
  };

  return (
    <div className="w-full bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 rounded-lg p-4 text-white shadow-lg flex flex-col items-center justify-center w-full mx-auto">
      <div className="flex justify-center mb-3">
        <div className="bg-white/20 rounded-full p-2">
          <Flame size={28} className="text-white" />
        </div>
      </div>

      <h3 className="text-center text-lg font-semibold mb-2">Prayer Streak</h3>

      <div className="text-center">
        <div className="text-3xl font-bold">{count}</div>
        <div className="text-sm opacity-90">day{count === 1 ? "" : "s"} in a row</div>
      </div>

      <div className="text-center text-sm opacity-90 mt-2">
        {isCountedToday ? "Already counted today—keep shining!" : "Mark today when you pray 🙏"}
      </div>

      <div className="flex gap-2 mt-3">
        <button
          onClick={markToday}
          disabled={isCountedToday || refreshing}
          className={`px-3 py-1.5 rounded bg-white/20 hover:bg-white/25 transition ${
            isCountedToday ? "opacity-60 cursor-not-allowed" : ""
          }`}
          title={isCountedToday ? "Today's prayer already counted" : "Mark today's prayer"}
        >
          Mark Today
        </button>

        <button
          onClick={reloadFromStorage}
          disabled={refreshing}
          className="px-3 py-1.5 rounded bg-white/20 hover:bg-white/25 transition inline-flex items-center gap-1"
          title="Refresh streak"
        >
          <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>
    </div>
  );
}
