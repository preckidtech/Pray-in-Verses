// src/components/ui/FeaturedVerseCards.jsx
import React from "react";
import { Bookmark, Share2 } from "lucide-react";
import { Link } from "react-router-dom";
import image1 from "../../assets/images/home/christian-afro-girl-holds-bible-in-her-hands-PCPX2FM.jpg";
import image2 from "../../assets/images/home/cropped-shot-of-african-american-man-praying-with-2021-08-30-01-46-12-utc.jpg";
import image3 from "../../assets/images/home/man-praying-hands-clasped-together-on-his-bible-JX5FTZD.jpg";
import image4 from "../../assets/images/home/two-lovers-studying-the-bible-it-is-god-s-love-for-2022-06-18-20-18-08-utc.jpg";
import PrayerStreakCard from "./PrayerStreakCard";
import DailyPrayerVerse from "./DailyPrayerVerse"; // Verse-of-the-Day card

const listDefault = [
  { key: "featured", reference: "Philippians 4:6", text: "Be anxious for nothing...", image: image1 },
  { key: "prayerWall", reference: "Prayer Wall", text: "", image: image2 },
  { key: "saved", reference: "Saved Prayers", text: "", image: image3 },
  { key: "streak", reference: "Streak", text: "", image: image4 },
];

const labelMap = {
  featured: "Today's Featured Verse",
  prayerWall: "Prayer Wall",
  saved: "Saved Prayers",
  streak: "Streak",
};

const FeaturedVerseCards = ({ items = [] }) => {
  const list = items.length ? items : listDefault;

  const handleBookmark = (ref) => {
    alert(`Bookmarked ${ref}`);
  };
  const handleShare = (ref) => {
    alert(`Share ${ref}`);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-8 items-stretch">
      {list.map((v, i) => (
        <div key={i} className="space-y-4 self-stretch">
          {/* Heading + accent line */}
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900 tracking-wide mt-2">
              {labelMap[v.key] || "Card"}
            </h2>
            <div className="mt-2 w-10 h-0.5 bg-[#0C2E8A] rounded-full" />
          </div>

          {/* Card body */}
          {v.key === "featured" ? (
            // Keep the dedicated VOTD component as-is
            <DailyPrayerVerse />
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 h-42 flex flex-col">
              {v.key === "prayerWall" ? (
                <>
                  {v.image && (
                    <img
                      src={v.image}
                      alt="Prayer Wall"
                      className="w-full aspect-[16/9] object-cover rounded-md mb-3 block"
                    />
                  )}

                  <Link
                    to="/prayer-wall"
                    className="mt-auto px-4 py-2 bg-[#0C2E8A] text-white text-sm rounded-lg font-medium hover:bg-blue-900 transition-colors duration-300 text-center"
                  >
                    Go to Prayer Wall
                  </Link>
                </>
              ) : v.key === "saved" ? (
                <>
                  {v.image && (
                    <img
                      src={v.image}
                      alt="Saved Prayers"
                      className="w-full aspect-[16/9] object-cover rounded-md mb-3 block"
                    />
                  )}

                  <Link
                    to="/saved-prayers"
                    className="mt-auto px-4 py-2 bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 text-[#FFFFFF] text-sm rounded-lg font-semibold hover:brightness-95 transition-colors duration-300 text-center"
                  >
                    View Saved Prayers
                  </Link>
                </>
              ) : v.key === "streak" ? (
                <div className="mt-3 mb-3">
                  <PrayerStreakCard streakDays={5} />
                </div>
              ) : (
                <>
                  {v.image && (
                    <img
                      src={v.image}
                      alt={v.reference}
                      className="w-full aspect-[16/9] object-cover rounded-md mb-3 block"
                    />
                  )}
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{v.reference}</h4>
                    {v.text && <p className="text-sm text-gray-600 mt-1">{v.text}</p>}
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button onClick={() => handleBookmark(v.reference)} aria-label="bookmark"
                      className="p-2 rounded-md hover:bg-gray-50">
                      <Bookmark size={18} className="text-gray-500 hover:text-blue-600" />
                    </button>
                    <button onClick={() => handleShare(v.reference)} aria-label="share"
                      className="p-2 rounded-md hover:bg-gray-50">
                      <Share2 size={18} className="text-gray-500 hover:text-green-600" />
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FeaturedVerseCards;
