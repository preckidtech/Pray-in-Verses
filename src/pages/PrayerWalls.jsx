// src/components/PrayerWalls.jsx
import React, { useEffect, useState } from "react";
import { Plus, Heart, MessageCircle, Search, Send } from "lucide-react";
import { usePageLogger } from "../hooks/usePageLogger";
import { logPrayer } from "../utils/historyLogger";

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
    isAnonymous: false
  });
  const [toastMessage, setToastMessage] = useState("");
  const [toastVisible, setToastVisible] = useState(false);

  const categories = [
    "All", "Health", "Family", "Career", "Relationship", "Financial", "Spiritual", "General"
  ];

  const categoryColors = {
    Health: "bg-red-100 text-red-800",
    Family: "bg-green-100 text-green-800",
    Career: "bg-blue-100 text-blue-800",
    Relationship: "bg-purple-100 text-purple-800",
    Financial: "bg-yellow-100 text-yellow-800",
    Spiritual: "bg-indigo-100 text-indigo-800",
    General: "bg-gray-100 text-gray-800"
  };

  // Track Prayer Wall page visit
  usePageLogger({
    title: "Prayer Wall",
    type: "page",
    reference: "Prayer Wall Page",
    content: "Browsing community prayer requests",
    category: "Prayer"
  });

  useEffect(() => {
    const savedPrayers = JSON.parse(localStorage.getItem("prayerRequests") || "[]");
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

  const showToast = (message) => {
    setToastMessage(message);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
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
    const request = prayerRequests.find(r => r.id === id);
    
    setPrayerRequests((prev) =>
      prev.map((request) =>
        request.id === id
          ? { ...request, prayers: request.prayed ? request.prayers - 1 : request.prayers + 1, prayed: !request.prayed }
          : request
      )
    );

    // Log to history when user prays for a request
    if (request && !request.prayed) {
      logPrayer(
        `Prayed for: ${request.title}`,
        request.content,
        request.category
      );
    }
  };

  const handleMarkAnswered = (id) => {
    const request = prayerRequests.find(r => r.id === id);
    
    setPrayerRequests((prev) =>
      prev.map((request) =>
        request.id === id ? { ...request, answered: !request.answered } : request
      )
    );
    
    showToast("Marked as answered");

    // Log to history when a prayer is marked as answered
    if (request && !request.answered) {
      logPrayer(
        `Prayer Answered: ${request.title}`,
        "Testimony of answered prayer",
        request.category
      );
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newRequest = {
      id: Date.now(),
      author: formData.isAnonymous ? "Anonymous" : "You",
      title: formData.title,
      content: formData.content,
      category: formData.category,
      isUrgent: formData.isUrgent,
      createdAt: new Date().toISOString(),
      prayers: 0,
      comments: 0,
      prayed: false,
      avatar: formData.isAnonymous ? "A" : "Y",
      answered: false
    };
    
    setPrayerRequests([newRequest, ...prayerRequests]);
    setFormData({ title: "", content: "", category: "General", isUrgent: false, isAnonymous: false });
    setShowModal(false);
    showToast("Prayer request posted");

    // Log to history when user posts a prayer request
    logPrayer(
      `Posted Prayer Request: ${formData.title}`,
      formData.content,
      formData.category
    );
  };

  const handleAddComment = (requestId) => {
    if (newComment.trim()) {
      const newEntry = {
        id: Date.now(),
        author: "You",
        content: newComment,
        time: "Just now"
      };
      setComments((prev) => ({ ...prev, [requestId]: [...(prev[requestId] || []), newEntry] }));
      setPrayerRequests((prev) =>
        prev.map((req) => (req.id === requestId ? { ...req, comments: req.comments + 1 } : req))
      );
      setNewComment("");
      showToast("Comment added");
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50 pt-16 pl-0 lg:pl-[224px]">
      {toastVisible && (
        <div className="fixed top-24 right-6 bg-white shadow-lg rounded-lg px-4 py-3 border-l-4 border-green-500 z-50 animate-slide-in">
          <span className="text-gray-800 font-medium">{toastMessage}</span>
        </div>
      )}

      <div className="container mx-auto px-4 py-8 space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-2xl font-bold text-[#0C2E8A] mb-2 flex items-center justify-center gap-3">
            Prayer Wall
          </h1>
          <p className="text-sm md:text-lg text-[#0C2E8A]">
            Share prayer requests and support fellow believers
          </p>
        </div>

        {/* Search + Add Button */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search prayer requests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-[#0C2E8A]"
            />
          </div>
          <button
            className="flex items-center gap-2 bg-[#0C2E8A] text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition font-medium"
            onClick={() => setShowModal(true)}
          >
            <Plus className="w-5 h-5" /> Add Request
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-[#0C2E8A] mb-2">Filter by Category</label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                    selectedCategory === cat ? "bg-[#0C2E8A] text-white" : "bg-[#FCCF3A] text-[#0C2E8A] font-bold hover:bg-[#ABBC6B]"
                  }`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sort by</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0C2E8A]"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="most-prayed">Most Prayed</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
        </div>

        {/* Prayer Requests */}
        <div className="space-y-4">
          {sortedRequests.map((req) => (
            <div
              key={req.id}
              className={`bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-lg transition ${
                req.answered ? "bg-green-50 border-green-300" : ""
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 text-white font-bold">
                    {req.avatar}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#0C2E8A]">{req.title}</h3>
                    <p className="text-sm text-gray-500">{formatTimeAgo(req.createdAt)}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleMarkAnswered(req.id)}
                  className={`px-3 py-1 text-sm font-medium rounded-full ${
                    req.answered ? "bg-green-600 text-white" : "bg-yellow-300 text-[#0C2E8A]"
                  }`}
                >
                  {req.answered ? "Answered" : "Mark Answered"}
                </button>
              </div>
              <p className="text-gray-700 mb-4">{req.content}</p>
              <div className="flex gap-4 flex-wrap">
                <span
                  className={`px-2 py-1 text-xs rounded-full ${categoryColors[req.category]}`}
                >
                  {req.category}
                </span>
                {req.isUrgent && (
                  <span className="px-2 py-1 text-xs rounded-full bg-red-200 text-red-800">
                    Urgent
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between mt-4 border-t border-gray-200 pt-3">
                <div className="flex items-center gap-4">
                  <button
                    className="flex items-center gap-1 text-[#0C2E8A]"
                    onClick={() => handlePray(req.id)}
                  >
                    <Heart className={`w-4 h-4 ${req.prayed ? "text-red-500" : ""}`} />
                    {req.prayers}
                  </button>
                  <button
                    className="flex items-center gap-1 text-[#0C2E8A]"
                    onClick={() => setShowComments(showComments === req.id ? null : req.id)}
                  >
                    <MessageCircle className="w-4 h-4" /> {req.comments}
                  </button>
                </div>
              </div>

              {/* Comments Section */}
              {showComments === req.id && (
                <div className="mt-4 space-y-3">
                  {(comments[req.id] || []).map((comment) => (
                    <div key={comment.id} className="flex gap-2 items-start">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-white font-bold">
                        {comment.author[0]}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#0C2E8A]">{comment.author}</p>
                        <p className="text-sm text-gray-700">{comment.content}</p>
                        <span className="text-xs text-gray-400">{comment.time}</span>
                      </div>
                    </div>
                  ))}

                  {/* Add Comment */}
                  <div className="flex gap-2 items-center mt-2">
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0C2E8A]"
                    />
                    <button
                      onClick={() => handleAddComment(req.id)}
                      className="bg-[#0C2E8A] text-white px-4 py-2 rounded-lg"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Add Request Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
            <h2 className="text-lg font-bold mb-4">Add Prayer Request</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0C2E8A]"
                required
              />
              <textarea
                placeholder="Content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0C2E8A]"
                rows="4"
                required
              />
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0C2E8A]"
              >
                {categories.slice(1).map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isUrgent}
                    onChange={(e) => setFormData({ ...formData, isUrgent: e.target.checked })}
                  />
                  Urgent
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isAnonymous}
                    onChange={(e) => setFormData({ ...formData, isAnonymous: e.target.checked })}
                  />
                  Anonymous
                </label>
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0C2E8A] text-white rounded-lg"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrayerWalls;