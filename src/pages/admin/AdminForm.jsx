import React, { useState, useEffect } from "react";
import {
  Search,
  Edit,
  Trash2,
  Plus,
  BookOpen,
  Filter,
  X,
  Save,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import {
  addPrayer,
  editPrayer,
  getPrayers,
  deletePrayer,
  searchPrayers,
} from "../../data/prayers";

const bibleBooks = [
  "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy", "Joshua",
  "Judges", "Ruth", "1 Samuel", "2 Samuel", "1 Kings", "2 Kings",
  "1 Chronicles", "2 Chronicles", "Ezra", "Nehemiah", "Esther", "Job",
  "Psalms", "Proverbs", "Ecclesiastes", "Song of Solomon", "Isaiah",
  "Jeremiah", "Lamentations", "Ezekiel", "Daniel", "Hosea", "Joel",
  "Amos", "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk",
  "Zephaniah", "Haggai", "Zechariah", "Malachi", "Matthew", "Mark",
  "Luke", "John", "Acts", "Romans", "1 Corinthians", "2 Corinthians",
  "Galatians", "Ephesians", "Philippians", "Colossians", "1 Thessalonians",
  "2 Thessalonians", "1 Timothy", "2 Timothy", "Titus", "Philemon",
  "Hebrews", "James", "1 Peter", "2 Peter", "1 John", "2 John", "3 John",
  "Jude", "Revelation",
];

const AdminForm = () => {
  const [book, setBook] = useState("");
  const [chapter, setChapter] = useState("");
  const [verse, setVerse] = useState("");
  const [themeFocus, setThemeFocus] = useState("");
  const [scripturalReference, setScripturalReference] = useState("");
  const [shortInsight, setShortInsight] = useState("");
  const [keyLessonInput, setKeyLessonInput] = useState("");
  const [keyLessons, setKeyLessons] = useState([]);
  const [prayerPointInput, setPrayerPointInput] = useState("");
  const [prayerPoints, setPrayerPoints] = useState([]);
  const [closingPrayer, setClosingPrayer] = useState("");
  const [editingId, setEditingId] = useState(null);

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

  const handleAddKeyLesson = () => {
    if (keyLessonInput.trim()) {
      setKeyLessons([...keyLessons, keyLessonInput.trim()]);
      setKeyLessonInput("");
    }
  };

  const handleRemoveKeyLesson = (index) => {
    setKeyLessons(keyLessons.filter((_, i) => i !== index));
  };

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
    setChapter(prayer.chapter?.toString() || "");
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
    if (!book || !chapter || !themeFocus || !scripturalReference || !shortInsight) {
      toast.error(
        "Please fill in all required fields (Book, Chapter, Theme/Focus, Scriptural Reference, Short Insight)"
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
    } catch {
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

  const totalPages = Math.ceil(filteredPrayers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPrayers = filteredPrayers.slice(
    startIndex,
    startIndex + itemsPerPage
  );

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
                Manage {prayers.length} prayers across {Object.keys(prayerCounts).length} books
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors"
            >
              <Plus className="w-5 h-5" />
              {showForm ? "Hide Form" : "Add New Prayer"}
            </button>
          </div>
        </div>

        {/* Form Section */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {/* Book */}
              <div>
                <label className="font-semibold">Book *</label>
                <select
                  value={book}
                  onChange={(e) => setBook(e.target.value)}
                  className="w-full border rounded p-2"
                >
                  <option value="">Select Book</option>
                  {bibleBooks.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              {/* Chapter */}
              <div>
                <label className="font-semibold">Chapter *</label>
                <input
                  type="number"
                  value={chapter}
                  onChange={(e) => setChapter(e.target.value)}
                  className="w-full border rounded p-2"
                />
              </div>

              {/* Verse */}
              <div>
                <label className="font-semibold">Verse</label>
                <input
                  type="number"
                  value={verse}
                  onChange={(e) => setVerse(e.target.value)}
                  className="w-full border rounded p-2"
                />
              </div>

              {/* Theme Focus */}
              <div>
                <label className="font-semibold">Theme / Focus *</label>
                <input
                  type="text"
                  value={themeFocus}
                  onChange={(e) => setThemeFocus(e.target.value)}
                  className="w-full border rounded p-2"
                />
              </div>

              {/* Scriptural Reference */}
              <div className="md:col-span-2">
                <label className="font-semibold">Scriptural Reference *</label>
                <textarea
                  value={scripturalReference}
                  onChange={(e) => setScripturalReference(e.target.value)}
                  className="w-full border rounded p-2"
                />
              </div>

              {/* Short Insight */}
              <div className="md:col-span-2">
                <label className="font-semibold">Short Insight *</label>
                <textarea
                  value={shortInsight}
                  onChange={(e) => setShortInsight(e.target.value)}
                  className="w-full border rounded p-2"
                />
              </div>

              {/* Key Lessons */}
              <div className="md:col-span-2">
                <label className="font-semibold">Key Lessons</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={keyLessonInput}
                    onChange={(e) => setKeyLessonInput(e.target.value)}
                    className="flex-1 border rounded p-2"
                  />
                  <button
                    type="button"
                    onClick={handleAddKeyLesson}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                  >
                    Add
                  </button>
                </div>
                <ul className="list-disc pl-5">
                  {keyLessons.map((lesson, idx) => (
                    <li key={idx} className="flex justify-between">
                      {lesson}
                      <button
                        type="button"
                        onClick={() => handleRemoveKeyLesson(idx)}
                        className="text-red-500 ml-2"
                      >
                        <X size={16} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Prayer Points */}
              <div className="md:col-span-2">
                <label className="font-semibold">Prayer Points</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={prayerPointInput}
                    onChange={(e) => setPrayerPointInput(e.target.value)}
                    className="flex-1 border rounded p-2"
                  />
                  <button
                    type="button"
                    onClick={handleAddPrayerPoint}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                  >
                    Add
                  </button>
                </div>
                <ul className="list-disc pl-5">
                  {prayerPoints.map((point, idx) => (
                    <li key={idx} className="flex justify-between">
                      {point}
                      <button
                        type="button"
                        onClick={() => handleRemovePrayerPoint(idx)}
                        className="text-red-500 ml-2"
                      >
                        <X size={16} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Closing Prayer */}
              <div className="md:col-span-2">
                <label className="font-semibold">Closing Prayer</label>
                <textarea
                  value={closingPrayer}
                  onChange={(e) => setClosingPrayer(e.target.value)}
                  className="w-full border rounded p-2"
                />
              </div>
            </div>

            {/* Form Buttons */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={handleSubmit}
                className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold flex items-center gap-2"
              >
                <Save size={16} />
                {editingId ? "Update Prayer" : "Add Prayer"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 hover:bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Search & Filter */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 flex flex-col md:flex-row gap-4">
          <div className="flex flex-1 gap-2">
            <input
              type="text"
              placeholder="Search prayers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 border rounded p-2"
            />
            <button
              type="button"
              onClick={filterPrayers}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              <Search size={16} />
            </button>
          </div>

          <div className="flex gap-2">
            <select
              value={selectedBookFilter}
              onChange={(e) => setSelectedBookFilter(e.target.value)}
              className="border rounded p-2"
            >
              <option value="">Filter by Book</option>
              {Object.keys(prayerCounts).map((bookName) => (
                <option key={bookName} value={bookName}>
                  {bookName} ({prayerCounts[bookName]})
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setSelectedBookFilter("")}
              className="bg-gray-300 px-4 py-2 rounded"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Prayer List */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Book</th>
                <th className="p-2 border">Chapter</th>
                <th className="p-2 border">Theme</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentPrayers.map((prayer) => (
                <tr key={prayer.id} className="hover:bg-gray-50">
                  <td className="p-2 border">{prayer.book}</td>
                  <td className="p-2 border">{prayer.chapter}</td>
                  <td className="p-2 border">{prayer.themeFocus}</td>
                  <td className="p-2 border flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(prayer)}
                      className="bg-yellow-400 px-2 py-1 rounded"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(prayer.id)}
                      className="bg-red-500 px-2 py-1 rounded"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
            >
              Prev
            </button>
            <span className="flex items-center gap-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminForm;
