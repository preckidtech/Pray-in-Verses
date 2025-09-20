import React from "react";
import { Bookmark, Share2 } from "lucide-react";
import image1 from "../../assets/images/home/christian-afro-girl-holds-bible-in-her-hands-PCPX2FM.jpg";
import image2 from "../../assets/images/home/cropped-shot-of-african-american-man-praying-with-2021-08-30-01-46-12-utc.jpg";
import image3 from "../../assets/images/home/man-praying-hands-clasped-together-on-his-bible-JX5FTZD.jpg";
import image4 from "../../assets/images/home/two-lovers-studying-the-bible-it-is-god-s-love-for-2022-06-18-20-18-08-utc.jpg";
import PrayerStreakCard from "./PrayerStreakCard";

const listDefault = [
  { key: "featured", reference: "Philippians 4:6", text: "Be anxious for nothing...", image: image1 },
  { key: "prayerWall", reference: "John 3:16", text: "For God so loved the world...", image: image2 },
  { key: "saved", reference: "Psalm 23:1", text: "The Lord is my shepherd...", image: image3 },
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
    // placeholder: replace with real logic
    alert(`Bookmarked ${ref}`);
  };
  const handleShare = (ref) => {
    alert(`Share ${ref}`);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {list.map((v, i) => (
        <div key={i} className="bg-gray-50 p-0 shadow hover:shadow-md transition rounded-lg overflow-hidden">
          {/* Card top label */}
          <div className="px-4 py-2 bg-white border-b">
            <span className="text-xs font-semibold text-gray-700">{labelMap[v.key] || "Card"}</span>
          </div>

          {/* Card body */}
          <div className="p-4 flex flex-col h-full">
            {v.key === "streak" ? (
              <div className="flex-1 flex items-center justify-center">
                <PrayerStreakCard streakDays={5} />
              </div>
            ) : (
              <>
                {v.image && <img src={v.image} alt={v.reference} className="h-36 w-full object-cover rounded-md mb-4" />}
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
