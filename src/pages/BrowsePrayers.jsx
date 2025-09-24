import React, { useState, useEffect } from "react";
import { Book, Search, Filter, ChevronRight, BookOpen, Heart, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { usePrayers } from "../context/PrayerContext";
import { getPrayersByBook, searchPrayers, getRecentPrayers } from "../data/prayers";

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
  const { prayers } = usePrayers();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTestament, setSelectedTestament] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // Get prayer counts by book
  const getPrayerCounts = () => {
    const counts = {};
    prayers.forEach(prayer => {
      counts[prayer.book] = (counts[prayer.book] || 0) + 1;
    });
    return counts;
  };

  const prayerCounts = getPrayerCounts();

  // Filter books based on search and filters
  const getFilteredBooks = () => {
    let filtered = bibleBooks;

    if (selectedTestament) {
      filtered = filtered.filter(book => book.testament === selectedTestament);
    }

    if (selectedCategory) {
      filtered = filtered.filter(book => book.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(book => 
        book.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered.map(book => ({
      ...book,
      prayerCount: prayerCounts[book.name] || 0
    }));
  };

  const filteredBooks = getFilteredBooks();
  const totalPrayers = Object.values(prayerCounts).reduce((sum, count) => sum + count, 0);

  // Get unique categories
  const categories = [...new Set(bibleBooks.map(book => book.category))];

  // Handle search
  useEffect(() => {
    if (searchQuery.length > 0) {
      const results = searchPrayers(searchQuery);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  // Get recent prayers
  const recentPrayers = getRecentPrayers(5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-20 lg:pl-[224px] px-4 pb-8">
      <div className="container mx-auto px-4 py-6">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-3">
            <BookOpen className="w-10 h-10 text-blue-600" />
            Browse Prayers
          </h1>
          <p className="text-gray-600 text-lg">
            Explore {totalPrayers} prayers across {Object.keys(prayerCounts).length} books of the Bible
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search books, prayers, or categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Testament Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={selectedTestament}
                onChange={(e) => setSelectedTestament(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                <option value="">All Testament</option>
                <option value="old">Old Testament</option>
                <option value="new">New Testament</option>
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Search Results Preview */}
          {searchQuery && searchResults.length > 0 && (
            <div className="mt-6 border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Found {searchResults.length} prayer{searchResults.length !== 1 ? 's' : ''}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {searchResults.slice(0, 6).map(prayer => (
                  <Link
                    key={prayer.id}
                    to={`/book/${prayer.book.toLowerCase().replace(/\s+/g, '-')}`}
                    className="p-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <div className="text-sm font-medium text-blue-800">
                      {prayer.book} {prayer.chapter}{prayer.verse ? `:${prayer.verse}` : ''}
                    </div>
                    <div className="text-sm text-gray-700 truncate mt-1">
                      {prayer.title}
                    </div>
                  </Link>
                ))}
              </div>
              {searchResults.length > 6 && (
                <div className="text-center mt-4">
                  <span className="text-sm text-gray-500">
                    And {searchResults.length - 6} more results...
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{totalPrayers}</div>
            <div className="text-gray-600">Total Prayers</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {Object.keys(prayerCounts).length}
            </div>
            <div className="text-gray-600">Books Available</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {prayers.filter(p => p.saved).length}
            </div>
            <div className="text-gray-600">Saved Prayers</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-2">
              {prayers.filter(p => p.answered).length}
            </div>
            <div className="text-gray-600">Answered Prayers</div>
          </div>
        </div>


        {/* Bible Books Grid */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Bible Books</h2>
            <div className="text-sm text-gray-600">
              {filteredBooks.length} of {bibleBooks.length} books
              {selectedTestament && ` • ${selectedTestament === 'old' ? 'Old' : 'New'} Testament`}
              {selectedCategory && ` • ${selectedCategory}`}
            </div>
          </div>

          {filteredBooks.length === 0 ? (
            <div className="text-center py-12">
              <Book className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No books found matching your criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredBooks.map((book) => (
                <Link
                  key={book.name}
                  to={`/book/${book.name.toLowerCase().replace(/\s+/g, '-')}`}
                  className="group bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl p-5 hover:shadow-lg hover:border-blue-300 transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      book.testament === 'old' 
                        ? 'bg-gradient-to-br from-amber-400 to-orange-500' 
                        : 'bg-gradient-to-br from-blue-400 to-indigo-500'
                    }`}>
                      <Book className="w-6 h-6 text-white" />
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {book.name}
                  </h3>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        book.testament === 'old'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {book.category}
                      </span>
                      <span className="text-gray-500 text-xs">
                        {book.testament === 'old' ? 'OT' : 'NT'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Heart className="w-4 h-4" />
                        <span>{book.prayerCount} prayer{book.prayerCount !== 1 ? 's' : ''}</span>
                      </div>
                      
                      {book.prayerCount > 0 && (
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      )}
                    </div>
                  </div>

                  {book.prayerCount === 0 && (
                    <div className="mt-3 text-xs text-gray-400 italic">
                      No prayers available yet
                    </div>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Testament Sections for better organization */}
        {!selectedTestament && !searchQuery && (
          <>
            {/* Old Testament */}
            <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-amber-800 mb-4 flex items-center gap-2">
                <Book className="w-6 h-6" />
                Old Testament
                <span className="text-sm font-normal text-gray-600">
                  ({filteredBooks.filter(b => b.testament === 'old').length} books)
                </span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {filteredBooks
                  .filter(book => book.testament === 'old')
                  .slice(0, 8)
                  .map(book => (
                    <Link
                      key={book.name}
                      to={`/book/${book.name.toLowerCase().replace(/\s+/g, '-')}`}
                      className="flex items-center justify-between p-3 border border-amber-200 rounded-lg hover:bg-amber-50 transition-colors"
                    >
                      <span className="font-medium text-gray-900">{book.name}</span>
                      <span className="text-sm text-amber-600 font-semibold">
                        {book.prayerCount}
                      </span>
                    </Link>
                  ))}
              </div>
            </div>

            {/* New Testament */}
            <div className="mt-6 bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center gap-2">
                <Book className="w-6 h-6" />
                New Testament
                <span className="text-sm font-normal text-gray-600">
                  ({filteredBooks.filter(b => b.testament === 'new').length} books)
                </span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {filteredBooks
                  .filter(book => book.testament === 'new')
                  .slice(0, 8)
                  .map(book => (
                    <Link
                      key={book.name}
                      to={`/book/${book.name.toLowerCase().replace(/\s+/g, '-')}`}
                      className="flex items-center justify-between p-3 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      <span className="font-medium text-gray-900">{book.name}</span>
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