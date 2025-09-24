import React, { useState, useEffect } from "react";
import {
  Book,
  Search,
  Filter,
  ChevronRight,
  BookOpen,
  Heart,
  Clock,
} from "lucide-react";
import { Link } from "react-router-dom";
import { usePrayers } from "../context/PrayerContext";
import {
  getPrayersByBook,
  searchPrayers,
  getRecentPrayers,
} from "../data/prayers";

const bibleBooks = [
  // Old Testament
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

  // New Testament
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
  const { prayers } = usePrayers(); // Shared state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTestament, setSelectedTestament] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const getPrayerCounts = () => {
    const counts = {};
    prayers.forEach((prayer) => {
      counts[prayer.book] = (counts[prayer.book] || 0) + 1;
    });
    return counts;
  };

  const prayerCounts = getPrayerCounts();

  const getFilteredBooks = () => {
    let filtered = bibleBooks;

    if (selectedTestament) {
      filtered = filtered.filter(
        (book) => book.testament === selectedTestament
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter((book) => book.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (book) =>
          book.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered.map((book) => ({
      ...book,
      prayerCount: prayerCounts[book.name] || 0,
    }));
  };

  const filteredBooks = getFilteredBooks();
  const totalPrayers = Object.values(prayerCounts).reduce(
    (sum, count) => sum + count,
    0
  );

  const categories = [...new Set(bibleBooks.map((book) => book.category))];

  useEffect(() => {
    if (searchQuery.length > 0) {
      const results = searchPrayers(searchQuery);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, prayers]); // <-- prayers dependency ensures updates

  const recentPrayers = getRecentPrayers(5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-24 lg:pl-[224px] px-4 pb-8">
      <div className="container px-2 md:px-6 lg:px-6 py-6">
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-2xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-3">
            <BookOpen className="w-10 h-10 text-blue-600" />
            Browse Prayers
          </h1>
          <p className="text-gray-600 text-lg">
            Explore {totalPrayers} prayers across{" "}
            {Object.keys(prayerCounts).length} books of the Bible
          </p>
        </div>

        {!selectedTestament && !searchQuery && (
          <>
            {/* Old Testament */}
            <div className="mt-8 bg-white rounded-lg shadow-lg p-2">
              <h3 className="text-xl font-bold text-amber-800 mb-4 flex items-center gap-2">
                <Book className="w-6 h-6" />
                Old Testament
                <span className="text-sm font-normal text-gray-600">
                  ({filteredBooks.filter((b) => b.testament === "old").length}{" "}
                  books)
                </span>
              </h3>
              {/* Updated grid for desktop and mobile */}
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
                {filteredBooks
                  .filter((book) => book.testament === "old")
                  .map((book) => (
                    <Link
                      key={book.name}
                      to={`/book/${book.name
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                      className="flex items-center justify-between p-3 border border-amber-200 rounded-lg hover:bg-amber-50 transition-colors"
                    >
                      <span className="font-medium text-gray-900">
                        {book.name}
                      </span>
                      <span className="text-sm text-amber-600 font-semibold">
                        {book.prayerCount}
                      </span>
                    </Link>
                  ))}
              </div>
            </div>

            {/* New Testament */}
            <div className="mt-6 bg-white rounded-lg shadow-lg p-2">
              <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center gap-2">
                <Book className="w-6 h-6" />
                New Testament
                <span className="text-sm font-normal text-gray-600">
                  ({filteredBooks.filter((b) => b.testament === "new").length}{" "}
                  books)
                </span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
                {filteredBooks
                  .filter((book) => book.testament === "new")
                  .map((book) => (
                    <Link
                      key={book.name}
                      to={`/book/${book.name
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                      className="flex items-center justify-between p-3 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      <span className="font-medium text-gray-900">
                        {book.name}
                      </span>
                      <span className="text-sm text-blue-600 font-semibold">
                        {book.prayerCount}
                      </span>
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
