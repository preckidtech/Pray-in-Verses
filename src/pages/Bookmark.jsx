import React, { useState, useEffect } from "react";
import {
  BookMarked,
  Search,
  Calendar,
  Heart,
  Share2,
  Trash2,
  Eye,
  BookOpen,
  Tag,
  Check,
  X,
  AlertCircle,
} from "lucide-react";

export default function Bookmark() {
  const [bookmarks, setBookmarks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [notification, setNotification] = useState(null);

  // Get current user
  const getCurrentUser = () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    return currentUser.id || currentUser.email || "guest";
  };

  // Load bookmarks from localStorage
  useEffect(() => {
    const loadBookmarks = () => {
      setLoading(true);
      try {
        const userId = getCurrentUser();
        const savedBookmarks = JSON.parse(
          localStorage.getItem(`bookmarks_${userId}`) || "[]"
        );
        setBookmarks(savedBookmarks);
      } catch (error) {
        console.error("Error loading bookmarks:", error);
        setBookmarks([]);
      } finally {
        setLoading(false);
      }
    };

    loadBookmarks();

    // Listen for bookmark updates from other parts of the app
    const handleBookmarkUpdate = () => {
      loadBookmarks();
    };

    window.addEventListener("bookmarkUpdated", handleBookmarkUpdate);
    return () => window.removeEventListener("bookmarkUpdated", handleBookmarkUpdate);
  }, []);

  // Save bookmarks to localStorage
  const saveBookmarks = (updatedBookmarks) => {
    const userId = getCurrentUser();
    localStorage.setItem(`bookmarks_${userId}`, JSON.stringify(updatedBookmarks));
    setBookmarks(updatedBookmarks);
    
    // Dispatch event to notify other components
    window.dispatchEvent(new Event("bookmarkUpdated"));
  };

  // Show notification
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Get all unique categories from bookmarks
  const getCategories = () => {
    const categoryCount = bookmarks.reduce((acc, bookmark) => {
      acc[bookmark.category] = (acc[bookmark.category] || 0) + 1;
      return acc;
    }, {});

    const categories = [
      { value: "all", label: "All Categories", count: bookmarks.length },
      ...Object.entries(categoryCount).map(([key, count]) => ({
        value: key,
        label: key.charAt(0).toUpperCase() + key.slice(1),
        count
      }))
    ];

    return categories;
  };

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "alphabetical", label: "A-Z" },
    { value: "favorites", label: "Favorites First" },
  ];

  // Filter and sort bookmarks
  const filteredBookmarks = bookmarks
    .filter((bookmark) => {
      const matchesSearch = 
        bookmark.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bookmark.verse?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bookmark.reference?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bookmark.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategory === "all" || bookmark.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.dateBookmarked) - new Date(a.dateBookmarked);
        case "oldest":
          return new Date(a.dateBookmarked) - new Date(b.dateBookmarked);
        case "alphabetical":
          return a.title.localeCompare(b.title);
        case "favorites":
          return (b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0);
        default:
          return 0;
      }
    });

  const toggleFavorite = (id) => {
    const updatedBookmarks = bookmarks.map(bookmark => 
      bookmark.id === id ? { ...bookmark, isFavorite: !bookmark.isFavorite } : bookmark
    );
    saveBookmarks(updatedBookmarks);
    showNotification(
      updatedBookmarks.find(b => b.id === id).isFavorite 
        ? "Added to favorites" 
        : "Removed from favorites"
    );
  };

  const handleShare = async (bookmark) => {
    const shareText = `${bookmark.title}\n\n"${bookmark.verse}"\n- ${bookmark.reference}\n\nShared from Pray in Verses`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: bookmark.title,
          text: shareText,
        });
        showNotification("Shared successfully");
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.log('Error sharing:', err);
        }
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(shareText);
        setCopiedId(bookmark.id);
        setTimeout(() => setCopiedId(null), 2000);
        showNotification("Copied to clipboard");
      } catch (err) {
        console.error('Error copying:', err);
        showNotification("Failed to copy", "error");
      }
    }
  };

  const handleSelectItem = (id) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleDeleteSelected = () => {
    const updatedBookmarks = bookmarks.filter(
      bookmark => !selectedItems.includes(bookmark.id)
    );
    saveBookmarks(updatedBookmarks);
    setSelectedItems([]);
    setShowDeleteModal(false);
    showNotification(`Deleted ${selectedItems.length} bookmark${selectedItems.length > 1 ? 's' : ''}`);
  };

  const handleDeleteSingle = (id) => {
    const updatedBookmarks = bookmarks.filter(bookmark => bookmark.id !== id);
    saveBookmarks(updatedBookmarks);
    showNotification("Bookmark deleted");
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pl-0 lg:pl-56">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pl-0 lg:pl-56">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Notification */}
        {notification && (
          <div className={`fixed top-24 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg ${
            notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-white animate-slide-in`}>
            <Check className="w-5 h-5" />
            <span>{notification.message}</span>
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <BookMarked className="w-8 h-8 text-[#2c3E91]" />
            <h1 className="text-3xl font-bold text-[#2c3E91]">My Bookmarks</h1>
          </div>
          <p className="text-gray-600">Save and organize your favorite prayers and verses</p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search bookmarks, verses, or references..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2c3E91] focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2c3E91] focus:border-transparent"
            >
              {getCategories().map(category => (
                <option key={category.value} value={category.value}>
                  {category.label} ({category.count})
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2c3E91] focus:border-transparent"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {/* Bulk Actions */}
            {selectedItems.length > 0 && (
              <button
                onClick={() => setShowDeleteModal(true)}
                className="px-4 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete ({selectedItems.length})
              </button>
            )}
          </div>
        </div>

        {/* Results Count */}
        {bookmarks.length > 0 && (
          <div className="mb-6">
            <p className="text-gray-600">
              Showing {filteredBookmarks.length} of {bookmarks.length} bookmarks
            </p>
          </div>
        )}

        {/* Bookmarks Grid */}
        {filteredBookmarks.length > 0 ? (
          <div className="grid gap-6">
            {filteredBookmarks.map((bookmark) => (
              <div
                key={bookmark.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(bookmark.id)}
                      onChange={() => handleSelectItem(bookmark.id)}
                      className="w-4 h-4 text-[#2c3E91] focus:ring-[#2c3E91] border-gray-300 rounded"
                    />
                    <div className="flex items-center gap-2">
                      {bookmark.type === 'prayer' ? (
                        <BookOpen className="w-5 h-5 text-[#2c3E91]" />
                      ) : (
                        <BookMarked className="w-5 h-5 text-[#2c3E91]" />
                      )}
                      <h3 className="text-lg font-semibold text-[#2c3E91]">
                        {bookmark.title}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleFavorite(bookmark.id)}
                      className={`p-2 rounded-full transition-colors ${
                        bookmark.isFavorite
                          ? 'text-red-500 hover:bg-red-50'
                          : 'text-gray-400 hover:bg-gray-100'
                      }`}
                      title={bookmark.isFavorite ? "Remove from favorites" : "Add to favorites"}
                    >
                      <Heart className={`w-5 h-5 ${bookmark.isFavorite ? 'fill-current' : ''}`} />
                    </button>
                    
                    <button
                      onClick={() => handleShare(bookmark)}
                      className="p-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-[#2c3E91] transition-colors"
                      title="Share bookmark"
                    >
                      {copiedId === bookmark.id ? (
                        <Check className="w-5 h-5 text-green-500" />
                      ) : (
                        <Share2 className="w-5 h-5" />
                      )}
                    </button>

                    <button
                      onClick={() => handleDeleteSingle(bookmark.id)}
                      className="p-2 rounded-full text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                      title="Delete bookmark"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Verse */}
                <div className="mb-4 p-4 bg-gradient-to-r from-[#2c3E91]/5 to-[#FCCF3A]/10 rounded-lg border-l-4 border-[#2c3E91]">
                  <blockquote className="text-gray-700 italic text-lg leading-relaxed mb-2">
                    "{bookmark.verse}"
                  </blockquote>
                  <cite className="text-[#2c3E91] font-semibold not-italic">
                    - {bookmark.reference}
                  </cite>
                </div>

                {/* Prayer Text */}
                {bookmark.prayerText && (
                  <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Prayer:</h4>
                    <p className="text-gray-600 leading-relaxed">
                      {bookmark.prayerText}
                    </p>
                  </div>
                )}

                {/* Tags */}
                {bookmark.tags && bookmark.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {bookmark.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-[#FCCF3A]/20 text-[#2c3E91] text-sm rounded-full font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Saved {formatDate(bookmark.dateBookmarked)}</span>
                    </div>
                    {bookmark.category && (
                      <div className="flex items-center gap-1">
                        <Tag className="w-4 h-4" />
                        <span className="capitalize">{bookmark.category}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
              <BookMarked className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {searchQuery || selectedCategory !== "all" 
                ? "No bookmarks found" 
                : "No bookmarks yet"
              }
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              {searchQuery || selectedCategory !== "all"
                ? "Try adjusting your search or filters to find what you're looking for"
                : "Start bookmarking prayers and verses to build your personal collection"
              }
            </p>
            {(!searchQuery && selectedCategory === "all") && (
              <button
                onClick={() => window.location.href = '/browse-prayers'}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#2c3E91] text-white rounded-lg hover:bg-[#1e2a6b] transition-colors"
              >
                <BookOpen className="w-5 h-5" />
                Browse Prayers
              </button>
            )}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Trash2 className="w-6 h-6 text-red-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Delete Bookmarks
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">
                      Are you sure you want to delete {selectedItems.length} bookmark{selectedItems.length > 1 ? 's' : ''}? This action cannot be undone.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteSelected}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}