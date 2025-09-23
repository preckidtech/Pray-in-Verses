import React, { useState } from "react";
import {
  Plus,
  Heart,
  MessageCircle,
  Users,
  Clock,
  Search,
  Send,
  X,
} from "lucide-react";

const PrayerWalls = () => {
  const [prayerRequests, setPrayerRequests] = useState([
    {
      id: 1,
      author: "Sarah M.",
      title: "Prayer for my mother's surgery",
      content:
        "Please pray for my mother who is going into surgery tomorrow. We're trusting God for a successful operation and quick recovery.",
      category: "Health",
      isUrgent: true,
      createdAt: "2024-03-15T10:30:00",
      prayers: 45,
      comments: 3,
      prayed: false,
      avatar: "SM",
    },
    {
      id: 2,
      author: "John D.",
      title: "Job interview guidance",
      content:
        "I have an important job interview next week. Praying for God's favor and wisdom as I seek His will for my career path.",
      category: "Career",
      isUrgent: false,
      createdAt: "2024-03-15T08:15:00",
      prayers: 28,
      comments: 2,
      prayed: true,
      avatar: "JD",
    },
  ]);

  const [comments, setComments] = useState({
    1: [
      {
        id: 1,
        author: "Grace K.",
        content: "Praying for your mother! God is the great healer.",
        time: "2 hours ago",
      },
      {
        id: 2,
        author: "Peter S.",
        content: "Lifting your family up in prayer. Trusting God for a miracle.",
        time: "4 hours ago",
      },
    ],
    2: [
      {
        id: 3,
        author: "David R.",
        content: "Praying for God's favor upon you!",
        time: "3 hours ago",
      },
    ],
  });

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
  };

  const handleAddComment = (requestId) => {
    if (newComment.trim()) {
      const newEntry = {
        id: Date.now(),
        author: "You",
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
      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-3">Prayer Wall</h1>
          <p className="text-lg text-gray-600">Share prayer requests and support fellow believers</p>
        </div>

        {/* Search and Add Button */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search prayer requests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              className="flex items-center gap-2 bg-blue-700 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition font-medium"
              onClick={() => setShowModal(true)}
            >
              <Plus className="w-5 h-5" /> Add Request
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Category</label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                      selectedCategory === cat
                        ? "bg-blue-700 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
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
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
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
          {sortedRequests.map((req) => (
            <div
              key={req.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-700 text-white rounded-full flex items-center justify-center font-medium">
                    {req.avatar}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{req.title}</h3>
                    {req.isUrgent && (
                      <span className="inline-block px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full font-medium">
                        Urgent
                      </span>
                    )}
                  </div>
                </div>
                <span
                  className={`text-xs px-3 py-1 rounded-full font-medium ${categoryColors[req.category]}`}
                >
                  {req.category}
                </span>
              </div>
              
              <p className="text-gray-600 mb-4 leading-relaxed">{req.content}</p>
              
              <div className="flex items-center text-sm text-gray-500 gap-4 mb-4">
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" /> {req.author}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" /> {formatTimeAgo(req.createdAt)}
                </span>
              </div>
              
              <div className="flex gap-4 pt-4 border-t border-gray-100">
                <button
                  onClick={() => handlePray(req.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition font-medium ${
                    req.prayed 
                      ? "bg-red-100 text-red-700 hover:bg-red-200" 
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Heart className="w-4 h-4" /> {req.prayers} Prayed
                </button>
                <button
                  onClick={() =>
                    setShowComments(showComments === req.id ? null : req.id)
                  }
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
                >
                  <MessageCircle className="w-4 h-4" /> {req.comments} Comments
                </button>
              </div>

              {/* Comments */}
              {showComments === req.id && (
                <div className="mt-6 space-y-3 border-t border-gray-100 pt-4">
                  {(comments[req.id] || []).map((c) => (
                    <div key={c.id} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">{c.author}</span>
                        <span className="text-xs text-gray-500">{c.time}</span>
                      </div>
                      <p className="text-gray-700">{c.content}</p>
                    </div>
                  ))}
                  <div className="flex gap-3 mt-4">
                    <input
                      type="text"
                      placeholder="Add a supportive comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      onClick={() => handleAddComment(req.id)}
                      className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Empty State */}
        {sortedRequests.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-10 h-10 text-blue-700" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No prayer requests found
            </h3>
            <p className="text-gray-600">
              Be the first to share a prayer request with the community
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">New Prayer Request</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    placeholder="Brief description of your prayer need"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prayer Request</label>
                  <textarea
                    placeholder="Share your prayer request with the community..."
                    value={formData.content}
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {categories.filter(cat => cat !== "All").map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isUrgent}
                      onChange={(e) =>
                        setFormData({ ...formData, isUrgent: e.target.checked })
                      }
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Mark as urgent</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isAnonymous}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isAnonymous: e.target.checked,
                        })
                      }
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Post anonymously</span>
                  </label>
                </div>
                
                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition font-medium"
                  >
                    Submit Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrayerWalls;