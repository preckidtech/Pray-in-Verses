import React from "react";
import { Bookmark, Share2 } from "lucide-react";
import { Link } from "react-router-dom";
import image1 from "../../assets/images/home/christian-afro-girl-holds-bible-in-her-hands-PCPX2FM.jpg";
import image2 from "../../assets/images/home/cropped-shot-of-african-american-man-praying-with-2021-08-30-01-46-12-utc.jpg";
import image3 from "../../assets/images/home/man-praying-hands-clasped-together-on-his-bible-JX5FTZD.jpg";
import image4 from "../../assets/images/home/two-lovers-studying-the-bible-it-is-god-s-love-for-2022-06-18-20-18-08-utc.jpg";
import PrayerStreakCard from "./PrayerStreakCard";

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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 gap-y-12">
      {list.map((v, i) => (
        <div key={i} className="space-y-3">
          {/* Title + gradient line (like your section) */}
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900 tracking-wide">
              {labelMap[v.key] || "Card"}
            </h2>
            <div className="w-10 h-0.5 bg-gradient-to-r from-blue-600 to-yellow-500 rounded-full"></div>
          </div>

          {/* Card body */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            {v.key === "streak" ? (
              <div className="flex items-center justify-center h-36">
                <PrayerStreakCard streakDays={5} />
              </div>
            ) : v.key === "prayerWall" ? (
              <>
                {v.image && (
                  <img
                    src={v.image}
                    alt="Prayer Wall"
                    className="h-36 w-full object-cover rounded-md mb-4"
                  />
                )}
                <Link
                  to="/prayer-wall"
                  className="px-4 py-2 bg-[#0C2E8A] text-white text-sm rounded-lg font-medium hover:bg-[#0C2E8A]f transition-colors duration-300 text-center block"
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
                    className="h-36 w-full object-cover rounded-md mb-4"
                  />
                )}
                <Link
                  to="/saved-prayers"
                  className="px-4 py-2 bg-[#FCCF3A] text-white text-sm rounded-lg font-medium hover:bg-[#FCCF3A] transition-colors duration-300 text-center block"
                >
                  View Saved Prayers
                </Link>
              </>
            ) : (
              <>
                {v.image && (
                  <img
                    src={v.image}
                    alt={v.reference}
                    className="h-36 w-full object-cover rounded-md mb-4"
                  />
                )}
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-gray-900">{v.reference}</h4>
                    {v.text && <p className="text-sm text-gray-600 mt-1">{v.text}</p>}
                  </div>
                  <div className="flex flex-col gap-2">
                    <button onClick={() => handleBookmark(v.reference)} aria-label="bookmark">
                      <Bookmark size={18} className="text-gray-500 hover:text-blue-600" />
                    </button>
                    <button onClick={() => handleShare(v.reference)} aria-label="share">
                      <Share2 size={18} className="text-gray-500 hover:text-green-600" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeaturedVerseCards;
