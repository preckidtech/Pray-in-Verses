import React, { useEffect, useState } from "react";
import { Plus, Heart, MessageCircle, Users, Clock, Search, Send, X } from "lucide-react";

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
  const [toastVisible, setToastVisible] = useState(false);

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

  // Load prayers and comments
  useEffect(() => {
    const savedPrayers = JSON.parse(localStorage.getItem("prayerRequests") || "[]");
    const savedComments = JSON.parse(localStorage.getItem("comments") || "{}");
    setPrayerRequests(savedPrayers);
    setComments(savedComments);
  }, []);

  // Save prayers and comments
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
    setPrayerRequests((prev) =>
      prev.map((request) =>
        request.id === id
          ? { ...request, prayers: request.prayed ? request.prayers - 1 : request.prayers + 1, prayed: !request.prayed }
          : request
      )
    );
  };

  const handleMarkAnswered = (id) => {
    setPrayerRequests((prev) =>
      prev.map((request) =>
        request.id === id ? { ...request, answered: !request.answered } : request
      )
    );
    const prayer = prayerRequests.find((p) => p.id === id);
    if (prayer) {
      const answeredPrayers = JSON.parse(localStorage.getItem("answeredPrayers") || "[]");
      const alreadyAnswered = answeredPrayers.find((p) => p.id === prayer.id);
      if (!alreadyAnswered) {
        localStorage.setItem(
          "answeredPrayers",
          JSON.stringify([...answeredPrayers, { ...prayer, answeredAt: new Date().toISOString() }])
        );
        showToast("Prayer marked as answered");
      } else {
        showToast("Prayer removed from answered prayers");
        localStorage.setItem(
          "answeredPrayers",
          JSON.stringify(answeredPrayers.filter((p) => p.id !== prayer.id))
        );
      }
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
      answered: false,
    };
    setPrayerRequests([newRequest, ...prayerRequests]);
    setFormData({ title: "", content: "", category: "General", isUrgent: false, isAnonymous: false });
    setShowModal(false);
    showToast("Prayer request posted");
  };

  const handleAddComment = (requestId) => {
    if (newComment.trim()) {
      const newEntry = {
        id: Date.now(),
        author: "You",
        content: newComment,
        time: "Just now",
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

  // ➤ Track Prayer Wall visit in History
  useEffect(() => {
    const history = JSON.parse(localStorage.getItem("savedPrayers") || "[]");
    const exists = history.some((item) => item.title === "Visited Prayer Wall");

    if (!exists) {
      const newHistoryItem = {
        id: Date.now() + Math.random(),
        title: "Visited Prayer Wall",
        verse: "Prayer Wall",
        savedAt: new Date().toISOString(),
        themeFocus: "Prayer Wall",
        content: "User visited the Prayer Wall page",
      };

      history.push(newHistoryItem);
      localStorage.setItem("savedPrayers", JSON.stringify(history));
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50 pt-16 pl-0 lg:pl-[224px]">
      {toastVisible && (
        <div className="fixed top-24 right-6 bg-white shadow-lg rounded-lg px-4 py-3 border-l-4 border-green-500 z-50 animate-slide-in">
          <span className="text-gray-800 font-medium">{toastMessage}</span>
        </div>
      )}

      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-2xl font-bold text-[#0C2E8A] mb-2 flex items-center justify-center gap-3">
            Prayer Wall
          </h1>
          <p className="text-sm md:text-lg text-[#0C2E8A]">Share prayer requests and support fellow believers</p>
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
              <div className="flex items-center gap-4 mt-4">
                <button
                  onClick={() => handlePray(req.id)}
                  className={`flex items-center gap-1 px-3 py-1 rounded-full border ${
                    req.prayed ? "bg-blue-600 text-white" : "border-gray-300 text-gray-700"
                  }`}
                >
                  <Heart className="w-4 h-4" /> Pray ({req.prayers})
                </button>
                <button
                  onClick={() =>
                    setShowComments(showComments === req.id ? null : req.id)
                  }
                  className="flex items-center gap-1 px-3 py-1 rounded-full border border-gray-300"
                >
                  <MessageCircle className="w-4 h-4" /> Comment ({req.comments})
                </button>
              </div>
              {showComments === req.id && (
                <div className="mt-4">
                  <div className="space-y-2">
                    {(comments[req.id] || []).map((c) => (
                      <div key={c.id} className="p-2 bg-gray-100 rounded">
                        <span className="font-bold">{c.author}</span>: {c.content}
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 flex gap-2">
                    <input
                      type="text"
                      placeholder="Write a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                    />
                    <button
                      onClick={() => handleAddComment(req.id)}
                      className="px-4 py-2 bg-[#0C2E8A] text-white rounded-lg"
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add Prayer Request</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Title"
                value={formData.title}
                required
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <textarea
                placeholder="Your prayer request..."
                value={formData.content}
                required
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                {categories.slice(1).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isUrgent}
                    onChange={(e) =>
                      setFormData({ ...formData, isUrgent: e.target.checked })
                    }
                  />
                  Urgent
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isAnonymous}
                    onChange={(e) =>
                      setFormData({ ...formData, isAnonymous: e.target.checked })
                    }
                  />
                  Post Anonymously
                </label>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0C2E8A] text-white rounded-lg"
                >
                  Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Animation Styles */}
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
