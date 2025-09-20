import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Copy, Share2 } from "lucide-react";
import { useVerseStore } from "../store";

const navItems = [
  { label: "Home", path: "/home" },
  { label: "Journal", path: "/journal" },
  { label: "Guided Prayer", path: "/prayer" },
  { label: "Profile", path: "/profile" },
  { label: "Settings", path: "/settings" },
];

const Explore = () => {
  const { verses } = useVerseStore(); // Get all verses from global store
  const [search, setSearch] = useState("");
  const [recentSearches, setRecentSearches] = useState([]);
  const [verseOfTheDay, setVerseOfTheDay] = useState(null);
  const location = useLocation();

  // Pick random Verse of the Day
  useEffect(() => {
    if (verses.length > 0) {
      const randomVerse = verses[Math.floor(Math.random() * verses.length)];
      setVerseOfTheDay(randomVerse);
    }
  }, [verses]);

  // Filter verses based on search input
  const filteredVerses = verses.filter(
    (v) =>
      v.text.toLowerCase().includes(search.toLowerCase()) ||
      v.reference.toLowerCase().includes(search.toLowerCase())
  );

  // Add selected verse to recent searches
  const addToRecent = (verseText) => {
    setRecentSearches((prev) => {
      const updated = [verseText, ...prev.filter((s) => s !== verseText)];
      return updated.slice(0, 5); // Keep last 5
    });
    setSearch(verseText); // Fill input
  };

  // Copy verse
  const handleCopy = (verse) => {
    navigator.clipboard.writeText(`${verse.text} - ${verse.reference}`);
  };

  // Share verse
  const handleShare = (verse) => {
    if (navigator.share) {
      navigator.share({
        title: "Verse of the Day",
        text: `${verse.text} - ${verse.reference}`,
      });
    } else {
      alert("Sharing not supported on this device");
    }
  };

  return (
    <div className="min-h-screen flex bg-cream dark:bg-primary text-primary dark:text-white">

      {/* Sidebar */}
      <aside className="hidden md:flex md:w-64 bg-primary/10 dark:bg-white/10 p-6 flex-col space-y-6">
        <div className="pb-4 border-b border-primary/30 mb-4 text-center font-bold text-xl">
          Pray The Bible
        </div>
        <nav className="flex flex-col space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`block px-4 py-2 rounded-lg font-medium border-b border-transparent hover:border-b-2 hover:border-primary hover:bg-primary/20 transition ${
                location.pathname === item.path
                  ? "bg-primary/20 border-b-2 border-primary"
                  : ""
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 flex flex-col gap-6">

        {/* Search Bar */}
        <div className="relative bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search verse, book, keyword..."
            className="w-full border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
          />

          {/* Live Dropdown */}
          {search && filteredVerses.length > 0 && (
            <ul className="absolute z-10 bg-white dark:bg-gray-700 w-full max-h-60 overflow-y-auto rounded-xl shadow-lg mt-2">
              {filteredVerses.map((v) => (
                <li
                  key={v.id}
                  className="p-3 border-b border-gray-200 dark:border-gray-600 hover:bg-primary/10 cursor-pointer"
                  onClick={() => addToRecent(`${v.text} - ${v.reference}`)}
                >
                  {v.text} - <span className="text-gray-500 dark:text-gray-300">{v.reference}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Filtered Results */}
        {search && (
          <div className="space-y-3 mt-4 max-h-[50vh] overflow-y-auto">
            {filteredVerses.map((v) => (
              <div
                key={v.id}
                className="p-4 rounded-2xl shadow-md bg-white dark:bg-gray-700 hover:shadow-lg transition"
              >
                <p className="mb-1 font-medium">{v.text}</p>
                <small className="text-gray-600 dark:text-gray-300">{v.reference}</small>
                <Link
                  to={`/verse/${v.id}`}
                  className="block text-primary mt-2 font-semibold hover:underline"
                >
                  Read More
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row gap-6 mt-6">

          {/* Recent Searches */}
          <div className="flex-1 bg-white/30 dark:bg-white/20 p-4 rounded-2xl flex flex-col items-center">
            <h3 className="font-bold text-lg mb-4">Recent Searches</h3>
            {recentSearches.length > 0 ? (
              <ul className="space-y-2 text-center">
                {recentSearches.map((s, idx) => (
                  <li
                    key={idx}
                    className="text-white font-medium cursor-pointer hover:underline"
                    onClick={() => setSearch(s)}
                  >
                    {s}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-white text-center">No recent searches</p>
            )}
          </div>

          {/* Verse of the Day */}
          {verseOfTheDay && (
            <div className="flex-1 bg-white/30 dark:bg-white/20 p-4 rounded-2xl flex flex-col items-center relative">
              <h3 className="font-bold text-lg mb-2">Verse of the Day</h3>
              <p className="mb-1 font-medium text-center">{verseOfTheDay.text}</p>
              <small className="text-white block text-center">{verseOfTheDay.reference}</small>
              <Link
                to={`/verse/${verseOfTheDay.id}`}
                className="mt-2 font-semibold text-white hover:underline"
              >
                Read More
              </Link>

              {/* Copy & Share */}
              <div className="flex gap-4 mt-4">
                <button
                  onClick={() => handleCopy(verseOfTheDay)}
                  className="flex items-center gap-1 px-3 py-1 bg-white/20 text-white rounded-lg hover:bg-white/30 transition"
                >
                  <Copy size={16} /> Copy
                </button>
                <button
                  onClick={() => handleShare(verseOfTheDay)}
                  className="flex items-center gap-1 px-3 py-1 bg-white/20 text-white rounded-lg hover:bg-white/30 transition"
                >
                  <Share2 size={16} /> Share
                </button>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default Explore;
