<div className="flex gap-4">
  <button
    onClick={handleSubmit}
    className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold flex items-center gap-2 transition-colors"
  >
    <Save className="w-5 h-5" />
    {editingId ? "Update Prayer" : "Add Prayer"}
  </button>
  <button
    onClick={resetForm}
    className="bg-gray-500 hover:bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
  >
    Cancel
  </button>
</div>;

import React, { useState, useEffect } from "react";
import {
  Search,
  Edit,
  Trash2,
  Plus,
  Book,
  Filter,
  X,
  Save,
  BookOpen,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import {
  addPrayer,
  editPrayer,
  getPrayers,
  deletePrayer,
  searchPrayers,
  getPrayersByBook,
} from "../../data/prayers";

const bibleBooks = [
  "Genesis",
  "Exodus",
  "Leviticus",
  "Numbers",
  "Deuteronomy",
  "Joshua",
  "Judges",
  "Ruth",
  "1 Samuel",
  "2 Samuel",
  "1 Kings",
  "2 Kings",
  "1 Chronicles",
  "2 Chronicles",
  "Ezra",
  "Nehemiah",
  "Esther",
  "Job",
  "Psalms",
  "Proverbs",
  "Ecclesiastes",
  "Song of Solomon",
  "Isaiah",
  "Jeremiah",
  "Lamentations",
  "Ezekiel",
  "Daniel",
  "Hosea",
  "Joel",
  "Amos",
  "Obadiah",
  "Jonah",
  "Micah",
  "Nahum",
  "Habakkuk",
  "Zephaniah",
  "Haggai",
  "Zechariah",
  "Malachi",
  "Matthew",
  "Mark",
  "Luke",
  "John",
  "Acts",
  "Romans",
  "1 Corinthians",
  "2 Corinthians",
  "Galatians",
  "Ephesians",
  "Philippians",
  "Colossians",
  "1 Thessalonians",
  "2 Thessalonians",
  "1 Timothy",
  "2 Timothy",
  "Titus",
  "Philemon",
  "Hebrews",
  "James",
  "1 Peter",
  "2 Peter",
  "1 John",
  "2 John",
  "3 John",
  "Jude",
  "Revelation",
];

const AdminForm = () => {
  // Form States - Updated to match the 9-field structure
  const [book, setBook] = useState("");
  const [chapter, setChapter] = useState("");
  const [verse, setVerse] = useState("");
  const [themeFocus, setThemeFocus] = useState("");
  const [scripturalReference, setScripturalReference] = useState("");
  const [shortInsight, setShortInsight] = useState("");

  // Key Lessons with add functionality
  const [keyLessonInput, setKeyLessonInput] = useState("");
  const [keyLessons, setKeyLessons] = useState([]);

  // Prayer Points with add functionality
  const [prayerPointInput, setPrayerPointInput] = useState("");
  const [prayerPoints, setPrayerPoints] = useState([]);

  const [closingPrayer, setClosingPrayer] = useState("");
  const [editingId, setEditingId] = useState(null);

  // Management States
  const [prayers, setPrayers] = useState([]);
  const [filteredPrayers, setFilteredPrayers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBookFilter, setSelectedBookFilter] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);

  useEffect(() => {
    loadPrayers();
  }, []);

  useEffect(() => {
    filterPrayers();
  }, [prayers, searchQuery, selectedBookFilter]);

  const loadPrayers = () => {
    const allPrayers = getPrayers();
    setPrayers(allPrayers);
  };

  const filterPrayers = () => {
    let filtered = prayers;
    if (searchQuery) {
      filtered = searchPrayers(searchQuery);
    }
    if (selectedBookFilter) {
      filtered = filtered.filter((p) => p.book === selectedBookFilter);
    }
    setFilteredPrayers(filtered);
    setCurrentPage(1);
  };

  // Key Lessons handlers
  const handleAddKeyLesson = () => {
    if (keyLessonInput.trim()) {
      setKeyLessons([...keyLessons, keyLessonInput.trim()]);
      setKeyLessonInput("");
    }
  };

  const handleRemoveKeyLesson = (index) => {
    setKeyLessons(keyLessons.filter((_, i) => i !== index));
  };

  // Prayer Points handlers
  const handleAddPrayerPoint = () => {
    if (prayerPointInput.trim()) {
      setPrayerPoints([...prayerPoints, prayerPointInput.trim()]);
      setPrayerPointInput("");
    }
  };

  const handleRemovePrayerPoint = (index) => {
    setPrayerPoints(prayerPoints.filter((_, i) => i !== index));
  };

  const handleEdit = (prayer) => {
    setEditingId(prayer.id);
    setBook(prayer.book);
    setChapter(prayer.chapter.toString());
    setVerse(prayer.verse?.toString() || "");
    setThemeFocus(prayer.themeFocus || "");
    setScripturalReference(prayer.scripturalReference || "");
    setShortInsight(prayer.shortInsight || "");
    setKeyLessons(prayer.keyLessons || []);
    setPrayerPoints(prayer.prayerPoints || []);
    setClosingPrayer(prayer.closingPrayer || "");
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this prayer?")) {
      deletePrayer(id);
      loadPrayers();
      toast.success("Prayer deleted successfully!");
    }
  };

  const handleSubmit = () => {
    if (
      !book ||
      !chapter ||
      !themeFocus ||
      !scripturalReference ||
      !shortInsight
    ) {
      toast.error(
        "Please fill in all required fields (Book, Chapter, Theme/Focus, Scriptural Reference, and Short Insight)"
      );
      return;
    }

    const prayerData = {
      book,
      chapter: parseInt(chapter),
      verse: verse ? parseInt(verse) : null,
      themeFocus,
      scripturalReference,
      shortInsight,
      keyLessons,
      prayerPoints,
      closingPrayer,
    };

    try {
      if (editingId) {
        editPrayer(editingId, prayerData);
        toast.success("Prayer updated successfully!");
      } else {
        addPrayer(prayerData);
        toast.success("Prayer added successfully!");
      }

      loadPrayers();
      resetForm();
    } catch (error) {
      toast.error("Error saving prayer. Please try again.");
    }
  };

  const resetForm = () => {
    setBook("");
    setChapter("");
    setVerse("");
    setThemeFocus("");
    setScripturalReference("");
    setShortInsight("");
    setKeyLessons([]);
    setPrayerPoints([]);
    setClosingPrayer("");
    setKeyLessonInput("");
    setPrayerPointInput("");
    setEditingId(null);
    setShowForm(false);
  };

  // Pagination
  const totalPages = Math.ceil(filteredPrayers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPrayers = filteredPrayers.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Get prayer counts by book
  const getPrayerCounts = () => {
    const counts = {};
    prayers.forEach((p) => {
      counts[p.book] = (counts[p.book] || 0) + 1;
    });
    return counts;
  };

  const prayerCounts = getPrayerCounts();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-20 lg:pl-[224px] px-4 pb-8">
      <Toaster position="top-right" reverseOrder={false} />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <BookOpen className="w-8 h-8 text-blue-600" />
                Prayer Management System
              </h1>
              <p className="text-gray-600 mt-1">
                Manage {prayers.length} prayers across{" "}
                {Object.keys(prayerCounts).length} books
              </p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors"
            >
              <Plus className="w-5 h-5" />
              {showForm ? "Hide Form" : "Add New Prayer"}
            </button>
          </div>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingId ? "Edit Prayer" : "Add New Prayer"}
              </h2>
              <button
                onClick={resetForm}
                className="text-gray-500 hover:text-gray-700 p-2"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* 1. BOOK, 2. CHAPTER, 3. VERSE */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    1. BOOK *
                  </label>
                  <select
                    value={book}
                    onChange={(e) => setBook(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Book</option>
                    {bibleBooks.map((bookName) => (
                      <option key={bookName} value={bookName}>
                        {bookName}{" "}
                        {prayerCounts[bookName]
                          ? `(${prayerCounts[bookName]})`
                          : ""}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    2. CHAPTER *
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="e.g., 1"
                    value={chapter}
                    onChange={(e) => setChapter(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    3. VERSE (Optional)
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="e.g., 5"
                    value={verse}
                    onChange={(e) => setVerse(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* 4. THEME/FOCUS */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  4. THEME/FOCUS *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Prayer for Wisdom and Understanding"
                  value={themeFocus}
                  onChange={(e) => setThemeFocus(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* 5. SCRIPTURAL REFERENCE */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  5. SCRIPTURAL REFERENCE *
                </label>
                <textarea
                  placeholder="Enter the complete scriptural reference or verse text..."
                  value={scripturalReference}
                  onChange={(e) => setScripturalReference(e.target.value)}
                  rows="3"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  required
                />
              </div>

              {/* 6. SHORT INSIGHT / REFLECTION */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  6. SHORT INSIGHT / REFLECTION *
                </label>
                <textarea
                  placeholder="Enter your short insight or reflection on the scripture..."
                  value={shortInsight}
                  onChange={(e) => setShortInsight(e.target.value)}
                  rows="4"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  required
                />
              </div>

              {/* 7. KEY LESSONS (WITH ADD FUNCTIONALITY) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  7. KEY LESSONS
                </label>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <textarea
                      placeholder="Add a key lesson from this scripture..."
                      value={keyLessonInput}
                      onChange={(e) => setKeyLessonInput(e.target.value)}
                      rows="2"
                      className="flex-1 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddKeyLesson}
                      className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" />
                      Add
                    </button>
                  </div>

                  {keyLessons.length > 0 && (
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {keyLessons.map((lesson, index) => (
                        <div
                          key={index}
                          className="bg-orange-50 border border-orange-200 rounded-lg p-3 flex justify-between items-start gap-3"
                        >
                          <p className="text-sm text-gray-800 flex-1">
                            {lesson}
                          </p>
                          <button
                            type="button"
                            onClick={() => handleRemoveKeyLesson(index)}
                            className="text-red-500 hover:text-red-700 flex-shrink-0"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* 8. PRAYER POINTS (WITH ADD FUNCTIONALITY) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  8. PRAYER POINTS
                </label>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <textarea
                      placeholder="Add a prayer point based on this scripture..."
                      value={prayerPointInput}
                      onChange={(e) => setPrayerPointInput(e.target.value)}
                      rows="2"
                      className="flex-1 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddPrayerPoint}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" />
                      Add
                    </button>
                  </div>

                  {prayerPoints.length > 0 && (
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {prayerPoints.map((point, index) => (
                        <div
                          key={index}
                          className="bg-green-50 border border-green-200 rounded-lg p-3 flex justify-between items-start gap-3"
                        >
                          <p className="text-sm text-gray-800 flex-1">
                            {point}
                          </p>
                          <button
                            type="button"
                            onClick={() => handleRemovePrayerPoint(index)}
                            className="text-red-500 hover:text-red-700 flex-shrink-0"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* 9. CLOSING PRAYER / CONFESSION */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  9. CLOSING PRAYER / CONFESSION
                </label>
                <textarea
                  placeholder="Enter the closing prayer or confession..."
                  value={closingPrayer}
                  onChange={(e) => setClosingPrayer(e.target.value)}
                  rows="4"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleSubmit}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold flex items-center gap-2 transition-colors"
                >
                  <Save className="w-5 h-5" />
                  {editingId ? "Update Prayer" : "Add Prayer"}
                </button>
                <button
                  onClick={resetForm}
                  className="bg-gray-500 hover:bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filter */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search prayers by theme, content, book, chapter..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={selectedBookFilter}
                onChange={(e) => setSelectedBookFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                <option value="">All Books</option>
                {bibleBooks.map((bookName) => (
                  <option key={bookName} value={bookName}>
                    {bookName}{" "}
                    {prayerCounts[bookName]
                      ? `(${prayerCounts[bookName]})`
                      : "(0)"}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredPrayers.length} of {prayers.length} prayers
            {searchQuery && ` for "${searchQuery}"`}
            {selectedBookFilter && ` in ${selectedBookFilter}`}
          </div>
        </div>

        {/* Prayers List */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-900">
              Prayers Management
            </h3>
          </div>

          {currentPrayers.length === 0 ? (
            <div className="text-center py-12">
              <Book className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No prayers found</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {currentPrayers.map((prayer) => (
                <div
                  key={prayer.id}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                          {prayer.book} {prayer.chapter}
                          {prayer.verse ? `:${prayer.verse}` : ""}
                        </span>
                      </div>

                      <h4 className="text-lg font-bold text-gray-900 mb-2">
                        {prayer.themeFocus}
                      </h4>

                      <div className="space-y-2 text-sm text-gray-600">
                        {prayer.scripturalReference && (
                          <div>
                            <strong>Scriptural Reference:</strong>
                            <p className="bg-gray-50 p-2 rounded text-xs mt-1">
                              {prayer.scripturalReference.length > 150
                                ? `${prayer.scripturalReference.substring(
                                    0,
                                    150
                                  )}...`
                                : prayer.scripturalReference}
                            </p>
                          </div>
                        )}

                        {prayer.shortInsight && (
                          <div>
                            <strong>Short Insight:</strong>
                            <p className="bg-blue-50 p-2 rounded text-xs mt-1">
                              {prayer.shortInsight.length > 150
                                ? `${prayer.shortInsight.substring(0, 150)}...`
                                : prayer.shortInsight}
                            </p>
                          </div>
                        )}

                        {prayer.keyLessons && prayer.keyLessons.length > 0 && (
                          <div>
                            <strong>
                              Key Lessons ({prayer.keyLessons.length}):
                            </strong>
                            <div className="mt-1 space-y-1">
                              {prayer.keyLessons.map((lesson, idx) => (
                                <div
                                  key={idx}
                                  className="bg-orange-50 p-2 rounded text-xs"
                                >
                                  {lesson.length > 100
                                    ? `${lesson.substring(0, 100)}...`
                                    : lesson}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {prayer.prayerPoints &&
                          prayer.prayerPoints.length > 0 && (
                            <div>
                              <strong>
                                Prayer Points ({prayer.prayerPoints.length}):
                              </strong>
                              <div className="mt-1 space-y-1">
                                {prayer.prayerPoints.map((point, idx) => (
                                  <div
                                    key={idx}
                                    className="bg-green-50 p-2 rounded text-xs"
                                  >
                                    {point.length > 100
                                      ? `${point.substring(0, 100)}...`
                                      : point}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                        {prayer.closingPrayer && (
                          <div>
                            <strong>Closing Prayer:</strong>
                            <p className="bg-purple-50 p-2 rounded text-xs mt-1">
                              {prayer.closingPrayer.length > 100
                                ? `${prayer.closingPrayer.substring(0, 100)}...`
                                : prayer.closingPrayer}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="mt-3 text-xs text-gray-400">
                        Created:{" "}
                        {new Date(prayer.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleEdit(prayer)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        title="Edit prayer"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(prayer.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        title="Delete prayer"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  Showing {startIndex + 1}-
                  {Math.min(startIndex + itemsPerPage, filteredPrayers.length)}{" "}
                  of {filteredPrayers.length} prayers
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                  >
                    Previous
                  </button>

                  <div className="flex gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = i + 1;
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-2 rounded-lg transition-colors ${
                            currentPage === page
                              ? "bg-blue-600 text-white"
                              : "border border-gray-300 hover:bg-gray-100"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminForm;
