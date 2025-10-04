import React, { useState, useEffect } from "react";
import { Book, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { usePrayers } from "../context/PrayerContext";
import { searchPrayers, getRecentPrayers } from "../data/prayers";
import AdminForm from "../pages/admin/AdminForm"; // <-- Import AdminForm

// Brand palette
// primary: #0C2E8A
// secondary: #FCCF3A
// olive: #ABBC6B
// cream: #FFFEF0
// crimson: #BA1A1A
// sky: #3FCBFF

const bibleBooks = [
  { name: "Genesis", testament: "old", category: "Law" },
  { name: "Exodus", testament: "old", category: "Law" },
  { name: "Leviticus", testament: "old", category: "Law" },
  { name: "Numbers", testament: "old", category: "Law" },
  { name: "Deuteronomy", testament: "old", category: "Law" },
  { name: "Joshua", testament: "old", category: "History" },
  { name: "Judges", testament: "old", category: "History" },
  { name: "Ruth", testament: "old", category: "History" },
  { name: "1 Samuel", testament: "old", category: "History" },
  { name: "2 Samuel", testament: "old", category: "History" },
  { name: "1 Kings", testament: "old", category: "History" },
  { name: "2 Kings", testament: "old", category: "History" },
  { name: "1 Chronicles", testament: "old", category: "History" },
  { name: "2 Chronicles", testament: "old", category: "History" },
  { name: "Ezra", testament: "old", category: "History" },
  { name: "Nehemiah", testament: "old", category: "History" },
  { name: "Esther", testament: "old", category: "History" },
  { name: "Job", testament: "old", category: "Poetry" },
  { name: "Psalms", testament: "old", category: "Poetry" },
  { name: "Proverbs", testament: "old", category: "Poetry" },
  { name: "Ecclesiastes", testament: "old", category: "Poetry" },
  { name: "Song of Solomon", testament: "old", category: "Poetry" },
  { name: "Isaiah", testament: "old", category: "Prophets" },
  { name: "Jeremiah", testament: "old", category: "Prophets" },
  { name: "Lamentations", testament: "old", category: "Prophets" },
  { name: "Ezekiel", testament: "old", category: "Prophets" },
  { name: "Daniel", testament: "old", category: "Prophets" },
  { name: "Hosea", testament: "old", category: "Prophets" },
  { name: "Joel", testament: "old", category: "Prophets" },
  { name: "Amos", testament: "old", category: "Prophets" },
  { name: "Obadiah", testament: "old", category: "Prophets" },
  { name: "Jonah", testament: "old", category: "Prophets" },
  { name: "Micah", testament: "old", category: "Prophets" },
  { name: "Nahum", testament: "old", category: "Prophets" },
  { name: "Habakkuk", testament: "old", category: "Prophets" },
  { name: "Zephaniah", testament: "old", category: "Prophets" },
  { name: "Haggai", testament: "old", category: "Prophets" },
  { name: "Zechariah", testament: "old", category: "Prophets" },
  { name: "Malachi", testament: "old", category: "Prophets" },
  { name: "Matthew", testament: "new", category: "Gospels" },
  { name: "Mark", testament: "new", category: "Gospels" },
  { name: "Luke", testament: "new", category: "Gospels" },
  { name: "John", testament: "new", category: "Gospels" },
  { name: "Acts", testament: "new", category: "History" },
  { name: "Romans", testament: "new", category: "Epistles" },
  { name: "1 Corinthians", testament: "new", category: "Epistles" },
  { name: "2 Corinthians", testament: "new", category: "Epistles" },
  { name: "Galatians", testament: "new", category: "Epistles" },
  { name: "Ephesians", testament: "new", category: "Epistles" },
  { name: "Philippians", testament: "new", category: "Epistles" },
  { name: "Colossians", testament: "new", category: "Epistles" },
  { name: "1 Thessalonians", testament: "new", category: "Epistles" },
  { name: "2 Thessalonians", testament: "new", category: "Epistles" },
  { name: "1 Timothy", testament: "new", category: "Epistles" },
  { name: "2 Timothy", testament: "new", category: "Epistles" },
  { name: "Titus", testament: "new", category: "Epistles" },
  { name: "Philemon", testament: "new", category: "Epistles" },
  { name: "Hebrews", testament: "new", category: "Epistles" },
  { name: "James", testament: "new", category: "General Epistles" },
  { name: "1 Peter", testament: "new", category: "General Epistles" },
  { name: "2 Peter", testament: "new", category: "General Epistles" },
  { name: "1 John", testament: "new", category: "General Epistles" },
  { name: "2 John", testament: "new", category: "General Epistles" },
  { name: "3 John", testament: "new", category: "General Epistles" },
  { name: "Jude", testament: "new", category: "General Epistles" },
  { name: "Revelation", testament: "new", category: "Prophecy" },
];

const BrowsePrayers = () => {
  const { prayers } = usePrayers();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTestament, setSelectedTestament] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const getPrayerCounts = () => {
    const counts = {};
    (prayers || []).forEach((prayer) => {
      counts[prayer.book] = (counts[prayer.book] || 0) + 1;
    });
    return counts;
  };

  const prayerCounts = getPrayerCounts();

  const getFilteredBooks = () => {
    let filtered = bibleBooks.slice();
    if (selectedTestament) {
      filtered = filtered.filter((book) => book.testament === selectedTestament);
    }
    if (selectedCategory) {
      filtered = filtered.filter((book) => book.category === selectedCategory);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (book) =>
          book.name.toLowerCase().includes(q) ||
          book.category.toLowerCase().includes(q)
      );
    }
    return filtered.map((book) => ({
      ...book,
      prayerCount: prayerCounts[book.name] || 0,
    }));
  };

  const filteredBooks = getFilteredBooks();
  const totalPrayers = Object.values(prayerCounts).reduce((sum, c) => sum + c, 0);

  useEffect(() => {
    if (searchQuery.length > 0) {
      const results = searchPrayers(searchQuery);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, prayers]);

  const recentPrayers = getRecentPrayers(5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50 pt-24 lg:pl-[224px] px-4 pb-8">
      <div className="container px-2 md:px-6 lg:px-6 py-6">
        <div className="text-center mb-8">
          <h1 className="text-base md:text-base font-bold text-[#0C2E8A] mb-2 flex items-center justify-center gap-3">
            <BookOpen className="w-8 h-8 text-[#FCCF3A] text-base" />
            Browse Prayers
          </h1>
          <p className="text-sm md:text-base text-[#0C2E8A]">
            Explore {totalPrayers} prayers across {Object.keys(prayerCounts).length} books of the Bible
          </p>
        </div>

        {!selectedTestament && !searchQuery && (
          <>
            {/* Old Testament */}
            <div className="mt-8 bg-[#FFFEF0] rounded-lg shadow p-3 border-l-4 border-[#FCCF3A]">
              <h3 className="text-base font-bold text-[#0C2E8A] mb-4 flex items-center gap-2">
                <Book className="w-6 h-6 text-[#FCCF3A]" />
                Old Testament
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
                {filteredBooks
                  .filter((book) => book.testament === "old")
                  .map((book) => (
                    <Link
                      key={book.name}
                      to={`/book/${book.name.toLowerCase().replace(/\s+/g, "-")}`}
                      className="flex items-center justify-between p-3 border border-[#FCCF3A] rounded-lg hover:bg-[#FFFEF0] transition-colors"
                    >
                      <span className="font-medium text-[#0C2E8A]">{book.name}</span>
                      <span className="text-sm font-semibold text-[#BA1A1A]">{book.prayerCount}</span>
                    </Link>
                  ))}
              </div>
            </div>

            {/* New Testament */}
            <div className="mt-6 bg-[#FFFEF0] rounded-lg shadow p-3 border-l-4 border-[#0C2E8A]">
              <h3 className="text-base font-bold text-[#0C2E8A] mb-4 flex items-center gap-2">
                <Book className="w-6 h-6 text-[#0C2E8A]" />
                New Testament
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
                {filteredBooks
                  .filter((book) => book.testament === "new")
                  .map((book) => (
                    <Link
                      key={book.name}
                      to={`/book/${book.name.toLowerCase().replace(/\s+/g, "-")}`}
                      className="flex items-center justify-between p-3 border border-[#0C2E8A] rounded-lg hover:bg-[#3FCBFF]/10 transition-colors"
                    >
                      <span className="font-medium text-[#0C2E8A]">{book.name}</span>
                      <span className="text-sm font-semibold text-[#FCCF3A]">{book.prayerCount}</span>
                    </Link>
                  ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BrowsePrayers;