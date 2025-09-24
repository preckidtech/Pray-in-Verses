import React, { useState, useEffect } from "react";
import { Search, Edit, Trash2, Plus, Book, Filter, X, Save, BookOpen } from "lucide-react";
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
  "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy", "Joshua", "Judges", "Ruth",
  "1 Samuel", "2 Samuel", "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles", "Ezra", "Nehemiah",
  "Esther", "Job", "Psalms", "Proverbs", "Ecclesiastes", "Song of Solomon", "Isaiah", "Jeremiah",
  "Lamentations", "Ezekiel", "Daniel", "Hosea", "Joel", "Amos", "Obadiah", "Jonah", "Micah",
  "Nahum", "Habakkuk", "Zephaniah", "Haggai", "Zechariah", "Malachi", "Matthew", "Mark",
  "Luke", "John", "Acts", "Romans", "1 Corinthians", "2 Corinthians", "Galatians", "Ephesians",
  "Philippians", "Colossians", "1 Thessalonians", "2 Thessalonians", "1 Timothy", "2 Timothy",
  "Titus", "Philemon", "Hebrews", "James", "1 Peter", "2 Peter", "1 John", "2 John", "3 John",
  "Jude", "Revelation"
];

const AdminForm = () => {
  // Form States
  const [book, setBook] = useState("");
  const [chapter, setChapter] = useState("");
  const [verse, setVerse] = useState("");
  const [title, setTitle] = useState("");
  const [contentInput, setContentInput] = useState("");
  const [contents, setContents] = useState([]);
  const [insightInput, setInsightInput] = useState("");
  const [insights, setInsights] = useState([]);
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
      filtered = filtered.filter(p => p.book === selectedBookFilter);
    }

    setFilteredPrayers(filtered);
    setCurrentPage(1);
  };

  const handleAddContent = () => {
    if (contentInput.trim()) {
      setContents([...contents, contentInput.trim()]);
      setContentInput("");
    }
  };

  const handleRemoveContent = (index) => {
    setContents(contents.filter((_, i) => i !== index));
  };

  const handleAddInsight = () => {
    if (insightInput.trim()) {
      setInsights([...insights, insightInput.trim()]);
      setInsightInput("");
    }
  };

  const handleRemoveInsight = (index) => {
    setInsights(insights.filter((_, i) => i !== index));
  };

  const handleEdit = (prayer) => {
    setEditingId(prayer.id);
    setBook(prayer.book);
    setChapter(prayer.chapter.toString());
    setVerse(prayer.verse?.toString() || "");
    setTitle(prayer.title);
    setContents(prayer.contents || []);
    setInsights(prayer.insights || []);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this prayer?")) {
      deletePrayer(id);
      loadPrayers();
      toast.success("Prayer deleted successfully!");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!book || !chapter || !title || contents.length === 0) {
      toast.error("Please fill in all required fields and add at least one prayer content");
      return;
    }

    const prayerData = {
      book,
      chapter: parseInt(chapter),
      verse: verse ? parseInt(verse) : null,
      title,
      contents,
      insights,
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
    setTitle("");
    setContents([]);
    setInsights([]);
    setContentInput("");
    setInsightInput("");
    setEditingId(null);
    setShowForm(false);
  };

  // Pagination
  const totalPages = Math.ceil(filteredPrayers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPrayers = filteredPrayers.slice(startIndex, startIndex + itemsPerPage);

  // Get prayer counts by book
  const getPrayerCounts = () => {
    const counts = {};
    prayers.forEach(p => {
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
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors"
            >
              <Plus className="w-5 h-5" />
              {showForm ? 'Hide Form' : 'Add New Prayer'}
            </button>
          </div>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingId ? 'Edit Prayer' : 'Add New Prayer'}
              </h2>
              <button
                onClick={resetForm}
                className="text-gray-500 hover:text-gray-700 p-2"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bible Book *
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
                        {bookName} {prayerCounts[bookName] ? `(${prayerCounts[bookName]})` : ''}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chapter *
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
                    Verse (Optional)
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prayer Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Prayer for Wisdom and Understanding"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Prayer Contents */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prayer Contents *
                </label>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <textarea
                      placeholder="Add prayer content..."
                      value={contentInput}
                      onChange={(e) => setContentInput(e.target.value)}
                      rows="3"
                      className="flex-1 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddContent}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" />
                      Add
                    </button>
                  </div>
                  
                  {contents.length > 0 && (
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {contents.map((content, index) => (
                        <div key={index} className="bg-green-50 border border-green-200 rounded-lg p-3 flex justify-between items-start gap-3">
                          <p className="text-sm text-gray-800 flex-1">{content}</p>
                          <button
                            type="button"
                            onClick={() => handleRemoveContent(index)}
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

              {/* Insights */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Insights (Optional)
                </label>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <textarea
                      placeholder="Add spiritual insight or commentary..."
                      value={insightInput}
                      onChange={(e) => setInsightInput(e.target.value)}
                      rows="2"
                      className="flex-1 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddInsight}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" />
                      Add
                    </button>
                  </div>
                  
                  {insights.length > 0 && (
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {insights.map((insight, index) => (
                        <div key={index} className="bg-purple-50 border border-purple-200 rounded-lg p-3 flex justify-between items-start gap-3">
                          <p className="text-sm text-gray-800 flex-1">{insight}</p>
                          <button
                            type="button"
                            onClick={() => handleRemoveInsight(index)}
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

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold flex items-center gap-2 transition-colors"
                >
                  <Save className="w-5 h-5" />
                  {editingId ? "Update Prayer" : "Add Prayer"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-500 hover:bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Search and Filter */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search prayers by title, content, book, chapter..."
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
                    {bookName} {prayerCounts[bookName] ? `(${prayerCounts[bookName]})` : '(0)'}
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
            <h3 className="text-xl font-bold text-gray-900">Prayers Management</h3>
          </div>
          
          {currentPrayers.length === 0 ? (
            <div className="text-center py-12">
              <Book className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No prayers found</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {currentPrayers.map((prayer) => (
                <div key={prayer.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                          {prayer.book} {prayer.chapter}{prayer.verse ? `:${prayer.verse}` : ''}
                        </span>
                        {prayer.saved && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                            Saved
                          </span>
                        )}
                        {prayer.answered && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">
                            Answered
                          </span>
                        )}
                      </div>
                      
                      <h4 className="text-lg font-bold text-gray-900 mb-2">{prayer.title}</h4>
                      
                      <div className="space-y-2 text-sm text-gray-600">
                        <div>
                          <strong>Contents ({prayer.contents?.length || 0}):</strong>
                          <div className="mt-1 space-y-1">
                            {(prayer.contents || []).map((content, idx) => (
                              <div key={idx} className="bg-gray-50 p-2 rounded text-xs">
                                {content.length > 150 ? `${content.substring(0, 150)}...` : content}
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {prayer.insights && prayer.insights.length > 0 && (
                          <div>
                            <strong>Insights ({prayer.insights.length}):</strong>
                            <div className="mt-1 space-y-1">
                              {prayer.insights.map((insight, idx) => (
                                <div key={idx} className="bg-purple-50 p-2 rounded text-xs">
                                  {insight.length > 100 ? `${insight.substring(0, 100)}...` : insight}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-3 text-xs text-gray-400">
                        Created: {new Date(prayer.createdAt).toLocaleDateString()}
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
                  Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredPrayers.length)} of {filteredPrayers.length} prayers
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
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
                              ? 'bg-blue-600 text-white'
                              : 'border border-gray-300 hover:bg-gray-100'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                  </div>
                  
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
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