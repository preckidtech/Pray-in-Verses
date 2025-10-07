// src/components/PrayerWalls.jsx
import React, { useEffect, useState } from "react";
import {
  Plus,
  Heart,
  MessageCircle,
  Search,
  Send,
  Bookmark,
  X,
  Check,
} from "lucide-react";
import { usePageLogger } from "../hooks/usePageLogger";
import { logPrayer } from "../utils/historyLogger";

// Toast Component
const Toast = ({ message, onClose }) => (
  <div className="fixed top-20 right-4 md:right-6 bg-white shadow-lg rounded-lg px-4 py-3 border-l-4 border-green-500 z-50 animate-slide-in max-w-sm">
    <div className="flex items-center gap-2">
      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
      <span className="text-gray-800 font-medium text-sm md:text-base">
        {message}
      </span>
    </div>
  </div>
);

const PrayerWalls = () => {
  const [prayerRequests, setPrayerRequests] = useState([]);
  const [comments, setComments] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [showComments, setShowComments] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [newComment, setNewComment] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "General",
    isUrgent: false,
    isAnonymous: false,
  });
  const [toastMessage, setToastMessage] = useState("");

  const categories = [
    "All",
    "Health",
    "Family",
    "Career",
    "Relationship",
    "Financial",
    "Spiritual",
    "General",
  ];

  const categoryColors = {
    Health: "bg-red-100 text-red-800",
    Family: "bg-green-100 text-green-800",
    Career: "bg-blue-100 text-blue-800",
    Relationship: "bg-purple-100 text-purple-800",
    Financial: "bg-yellow-100 text-yellow-800",
    Spiritual: "bg-indigo-100 text-indigo-800",
    General: "bg-gray-100 text-gray-800",
  };

  const getCurrentUser = () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    if (currentUser.id) return currentUser;
    return { id: "guest", name: "User" };
  };

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(""), 3000);
  };

  // Track Prayer Wall page visit
  usePageLogger({
    title: "Prayer Wall",
    type: "page",
    reference: "Prayer Wall Page",
    content: "Browsing community prayer requests",
    category: "Prayer",
  });

  useEffect(() => {
    const savedPrayers = JSON.parse(
      localStorage.getItem("prayerRequests") || "[]"
    );
    const savedComments = JSON.parse(localStorage.getItem("comments") || "{}");
    setPrayerRequests(savedPrayers);
    setComments(savedComments);
  }, []);

  useEffect(() => {
    localStorage.setItem("prayerRequests", JSON.stringify(prayerRequests));
  }, [prayerRequests]);

  useEffect(() => {
    localStorage.setItem("comments", JSON.stringify(comments));
  }, [comments]);

  const handleBookmark = (request) => {
    const userId = getCurrentUser().id;
    const bookmarks = JSON.parse(
      localStorage.getItem(`bookmarks_${userId}`) || "[]"
    );

    const isAlreadyBookmarked = bookmarks.some(
      (b) => b.id === request.id && b.type === "prayer-wall"
    );

    if (isAlreadyBookmarked) {
      showToast("This prayer request is already bookmarked");
      return;
    }

    const newBookmark = {
      id: request.id,
      type: "prayer-wall",
      title: request.title,
      content: request.content,
      verse: `"${request.content}"`,
      reference: request.title,
      category: request.category,
      tags: [request.category.toLowerCase(), "prayer-wall"],
      dateBookmarked: new Date().toISOString(),
      author: request.author,
      isUrgent: request.isUrgent,
      prayers: request.prayers,
      createdAt: request.createdAt,
    };

    localStorage.setItem(
      `bookmarks_${userId}`,
      JSON.stringify([...bookmarks, newBookmark])
    );

    window.dispatchEvent(new Event("bookmarkUpdated"));
    showToast("Prayer request bookmarked!");
  };

  const filteredRequests = prayerRequests.filter((request) => {
    const matchesSearch =
      request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || request.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedRequests = [...filteredRequests].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.createdAt) - new Date(a.createdAt);
      case "oldest":
        return new Date(a.createdAt) - new Date(b.createdAt);
      case "most-prayed":
        return b.prayers - a.prayers;
      case "urgent":
        return b.isUrgent - a.isUrgent;
      default:
        return 0;
    }
  });

  const handlePray = (id) => {
    const request = prayerRequests.find((r) => r.id === id);
    setPrayerRequests((prev) =>
      prev.map((request) =>
        request.id === id
          ? {
              ...request,
              prayers: request.prayed
                ? request.prayers - 1
                : request.prayers + 1,
              prayed: !request.prayed,
            }
          : request
      )
    );

    if (request && !request.prayed) {
      logPrayer(
        `Prayed for: ${request.title}`,
        request.content,
        request.category
      );
      showToast("Added to your prayer list");
    } else {
      showToast("Removed from prayer list");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const currentUser = getCurrentUser();
    const newRequest = {
      id: Date.now(),
      author: formData.isAnonymous ? "Anonymous" : currentUser.name,
      title: formData.title,
      content: formData.content,
      category: formData.category,
      isUrgent: formData.isUrgent,
      createdAt: new Date().toISOString(),
      prayers: 0,
      comments: 0,
      prayed: false,
      avatar: formData.isAnonymous ? "A" : currentUser.name[0].toUpperCase(),
      answered: false,
      type: "Prayer",
    };
    setPrayerRequests([newRequest, ...prayerRequests]);
    setFormData({
      title: "",
      content: "",
      category: "General",
      isUrgent: false,
      isAnonymous: false,
    });
    setShowModal(false);
    showToast("Prayer request posted successfully!");
    logPrayer(
      `Posted Prayer Request: ${formData.title}`,
      formData.content,
      formData.category
    );
  };

  const handleAddComment = (requestId) => {
    if (newComment.trim()) {
      const currentUser = getCurrentUser();
      const newEntry = {
        id: Date.now(),
        author: currentUser.name,
        content: newComment,
        time: "Just now",
      };
      setComments((prev) => ({
        ...prev,
        [requestId]: [...(prev[requestId] || []), newEntry],
      }));
      setPrayerRequests((prev) =>
        prev.map((req) =>
          req.id === requestId ? { ...req, comments: req.comments + 1 } : req
        )
      );
      setNewComment("");
      showToast("Comment added successfully!");
    }
  };

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    return `${Math.floor(diffInHours / 24)} days ago`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50 pt-24 pl-0 lg:pl-[224px] font-['Poppins']">
      {/* Toast Notification */}
      {toastMessage && <Toast message={toastMessage} />}
      <main className="flex-1 space-y-10 px-4  lg:px-6 pb-10">
        <div className="container mx-auto px-4 py-8 space-y-6">
          <div className="text-center mb-8">
            <h1 className="text-base font-semibold text-[#0C2E8A] mb-2 flex items-center justify-center gap-3">
              Prayer Wall
            </h1>
            <p className="text-sm text-[#0C2E8A]">
              Share prayer requests and support fellow believers
            </p>
          </div>

          {/* Search + Add Button */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 md:p-6 mb-6 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search prayer requests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-[#0C2E8A] focus:border-transparent"
              />
            </div>
            <button
              className="flex items-center gap-2 bg-[#0C2E8A] text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition font-medium justify-center"
              onClick={() => setShowModal(true)}
            >
              <Plus className="w-5 h-5" /> Add Request
            </button>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 md:p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
              <div className="flex-1 w-full">
                <label className="block text-sm font-medium text-[#0C2E8A] mb-2">
                  Filter by Category
                </label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                        selectedCategory === cat
                          ? "bg-[#0C2E8A] text-white"
                          : "bg-[#FCCF3A] text-[#0C2E8A] font-bold hover:bg-[#ABBC6B]"
                      }`}
                      onClick={() => setSelectedCategory(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div className="w-full lg:w-auto">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort by
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0C2E8A] focus:border-transparent"
                >
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                  <option value="most-prayed">Most Prayed</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>
          </div>

          {/* Prayer Requests */}
          <div className="space-y-4">
            {sortedRequests.length > 0 ? (
              sortedRequests.map((req) => (
                <div
                  key={req.id}
                  className={`bg-white rounded-lg shadow-sm border border-gray-100 p-4 md:p-6 hover:shadow-lg transition ${
                    req.answered ? "bg-green-50 border-green-300" : ""
                  }`}
                >
                  <div className="flex justify-between items-start mb-4 gap-2">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#0C2E8A] text-white font-bold flex-shrink-0">
                        {req.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-semibold text-[#0C2E8A] break-words">
                          {req.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {formatTimeAgo(req.createdAt)}
                        </p>
                      </div>
                    </div>

                    {/* Bookmark Button */}
                    <button
                      onClick={() => handleBookmark(req)}
                      className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-yellow-100 hover:text-yellow-600 transition flex-shrink-0"
                      title="Bookmark this prayer request"
                    >
                      <Bookmark className="w-5 h-5" />
                    </button>
                  </div>

                  <p className="text-gray-700 text-sm mb-4 break-words leading-relaxed">
                    {req.content}
                  </p>

                  <div className="flex gap-2 flex-wrap mb-4">
                    <span
                      className={`px-3 py-1 text-xs rounded-full font-medium ${
                        categoryColors[req.category]
                      }`}
                    >
                      {req.category}
                    </span>
                    {req.isUrgent && (
                      <span className="px-3 py-1 text-xs rounded-full bg-red-200 text-red-800 font-medium">
                        Urgent
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    <div className="flex items-center gap-4">
                      <button
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition font-medium text-sm ${
                          req.prayed
                            ? "bg-red-50 text-red-600"
                            : "bg-gray-50 text-gray-600 hover:bg-red-50 hover:text-red-600"
                        }`}
                        onClick={() => handlePray(req.id)}
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            req.prayed ? "fill-current" : ""
                          }`}
                        />
                        <span>{req.prayers}</span>
                      </button>
                      <button
                        className="flex items-center gap-2 px-3 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-blue-50 hover:text-[#0C2E8A] transition font-medium text-sm"
                        onClick={() =>
                          setShowComments(
                            showComments === req.id ? null : req.id
                          )
                        }
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>{req.comments}</span>
                      </button>
                    </div>
                  </div>

                  {/* Comments Section */}
                  {showComments === req.id && (
                    <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                      {(comments[req.id] || []).map((comment) => (
                        <div
                          key={comment.id}
                          className="flex gap-3 items-start bg-gray-50 p-3 rounded-lg"
                        >
                          <div className="w-8 h-8 rounded-full bg-[#0C2E8A] flex items-center justify-center text-white font-bold flex-shrink-0 text-sm">
                            {comment.author[0]}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-[#0C2E8A] break-words">
                              {comment.author}
                            </p>
                            <p className="text-sm text-gray-700 break-words">
                              {comment.content}
                            </p>
                            <span className="text-xs text-gray-400">
                              {comment.time}
                            </span>
                          </div>
                        </div>
                      ))}

                      {/* Add Comment */}
                      <div className="flex gap-2 items-center mt-3">
                        <input
                          type="text"
                          placeholder="Add a comment..."
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              handleAddComment(req.id);
                            }
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0C2E8A] focus:border-transparent text-sm"
                        />
                        <button
                          onClick={() => handleAddComment(req.id)}
                          className="bg-[#0C2E8A] text-white p-2 rounded-lg hover:bg-blue-800 transition flex-shrink-0"
                          title="Send comment"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-10 h-10 text-blue-700" />
                </div>
                <h3 className="text-base font-medium text-gray-900 mb-2">
                  {searchTerm || selectedCategory !== "All"
                    ? "No prayer requests match your search"
                    : "No prayer requests yet"}
                </h3>
                <p className="text-gray-600 mb-6 px-4">
                  {searchTerm || selectedCategory !== "All"
                    ? "Try adjusting your search or filter"
                    : "Be the first to share a prayer request with the community"}
                </p>
                {!searchTerm && selectedCategory === "All" && (
                  <button
                    onClick={() => setShowModal(true)}
                    className="bg-[#0C2E8A] text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition font-medium"
                  >
                    Add First Prayer Request
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Add Request Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-base font-semibold text-[#0C2E8A]">
                    Add Prayer Request
                  </h2>
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setFormData({
                        title: "",
                        content: "",
                        category: "General",
                        isUrgent: false,
                        isAnonymous: false,
                      });
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      placeholder="Brief title for your prayer request"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0C2E8A] focus:border-transparent"
                      required
                      maxLength={100}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.title.length}/100
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prayer Request *
                    </label>
                    <textarea
                      placeholder="Describe your prayer request..."
                      value={formData.content}
                      onChange={(e) =>
                        setFormData({ ...formData, content: e.target.value })
                      }
                      rows="4"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0C2E8A] focus:border-transparent resize-none"
                      required
                      maxLength={500}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.content.length}/500
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0C2E8A] focus:border-transparent"
                    >
                      {categories.slice(1).map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isUrgent}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            isUrgent: e.target.checked,
                          })
                        }
                        className="w-4 h-4 text-[#0C2E8A] focus:ring-[#0C2E8A] border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">
                        Mark as urgent
                      </span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isAnonymous}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            isAnonymous: e.target.checked,
                          })
                        }
                        className="w-4 h-4 text-[#0C2E8A] focus:ring-[#0C2E8A] border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">
                        Post anonymously
                      </span>
                    </label>
                  </div>

                  <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => {
                        setShowModal(false);
                        setFormData({
                          title: "",
                          content: "",
                          category: "General",
                          isUrgent: false,
                          isAnonymous: false,
                        });
                      }}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-3 bg-[#0C2E8A] text-white rounded-lg hover:bg-blue-800 transition font-medium"
                    >
                      Submit Request
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default PrayerWalls;
