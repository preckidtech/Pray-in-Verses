import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit3,
  Trash2,
  CheckCircle,
  Clock,
  Search,
  X,
  BookOpen,
  Calendar,
  Target,
  Heart,
  Check,
  Bookmark,
} from "lucide-react";
import { Link } from "react-router-dom";

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

// Delete Confirmation Modal
const DeleteModal = ({ onConfirm, onCancel }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Delete Prayer Point
      </h3>
      <p className="text-gray-600 mb-6">
        Are you sure you want to delete this prayer point? This action cannot be
        undone.
      </p>
      <div className="flex gap-3 justify-end">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors rounded-lg hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
);

const MyPrayerPoint = () => {
  const [prayers, setPrayers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingPrayer, setEditingPrayer] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [toastMessage, setToastMessage] = useState("");
  const [deletePrayerId, setDeletePrayerId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });

  // Get current user
  const getCurrentUser = () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    if (currentUser.id && currentUser.name) {
      return currentUser;
    }

    const legacyUserName = localStorage.getItem("userName");
    const legacyUserEmail = localStorage.getItem("userEmail");

    if (legacyUserName && legacyUserEmail) {
      return {
        name: legacyUserName,
        email: legacyUserEmail,
        id: legacyUserEmail,
      };
    }

    return { name: "User", email: "user@example.com", id: "user" };
  };

  // Show toast message
  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(""), 3000);
  };

  // Handle bookmark
  const handleBookmark = (prayer) => {
    const userId = getCurrentUser().id;
    const bookmarks = JSON.parse(
      localStorage.getItem(`bookmarks_${userId}`) || "[]"
    );

    const isAlreadyBookmarked = bookmarks.some(
      (b) => b.id === prayer.id && b.type === "prayer-point"
    );

    if (isAlreadyBookmarked) {
      showToast("This prayer point is already bookmarked");
      return;
    }

    const newBookmark = {
      id: prayer.id,
      type: "prayer-point",
      title: prayer.title,
      content: prayer.content,
      verse: `"${prayer.content}"`,
      reference: prayer.title,
      category: "Prayer Point",
      tags: ["personal", "prayer"],
      dateBookmarked: new Date().toISOString(),
      author: prayer.author,
      status: prayer.status,
      isAnswered: prayer.isAnswered,
    };

    localStorage.setItem(
      `bookmarks_${userId}`,
      JSON.stringify([...bookmarks, newBookmark])
    );

    window.dispatchEvent(new Event("bookmarkUpdated"));
    showToast("Prayer point bookmarked!");
  };

  // Load prayers from localStorage
  useEffect(() => {
    const currentUser = getCurrentUser();
    const savedPrayers = JSON.parse(
      localStorage.getItem(`myPrayerPoints_${currentUser.id}`) || "[]"
    );
    setPrayers(savedPrayers);
  }, []);

  // Save prayers to localStorage
  const savePrayers = (prayersToSave) => {
    const currentUser = getCurrentUser();
    localStorage.setItem(
      `myPrayerPoints_${currentUser.id}`,
      JSON.stringify(prayersToSave)
    );
    setPrayers(prayersToSave);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const currentUser = getCurrentUser();

    if (editingPrayer) {
      // Update existing prayer
      const updatedPrayers = prayers.map((prayer) =>
        prayer.id === editingPrayer.id
          ? {
              ...prayer,
              title: formData.title,
              content: formData.content,
              updatedAt: new Date().toISOString(),
            }
          : prayer
      );
      savePrayers(updatedPrayers);
      showToast("Prayer point updated successfully!");
    } else {
      // Add new prayer
      const newPrayer = {
        id: Date.now(),
        title: formData.title,
        content: formData.content,
        author: currentUser.name,
        userId: currentUser.id,
        status: "Praying",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isAnswered: false,
        answeredAt: null,
      };

      const updatedPrayers = [newPrayer, ...prayers];
      savePrayers(updatedPrayers);
      showToast("New prayer point added!");
    }

    // Reset form
    setFormData({ title: "", content: "" });
    setShowModal(false);
    setEditingPrayer(null);
  };

  // Handle edit
  const handleEdit = (prayer) => {
    setEditingPrayer(prayer);
    setFormData({
      title: prayer.title,
      content: prayer.content,
    });
    setShowModal(true);
  };

  // Handle delete
  const handleDelete = (prayerId) => {
    setDeletePrayerId(prayerId);
  };

  const confirmDelete = () => {
    const updatedPrayers = prayers.filter(
      (prayer) => prayer.id !== deletePrayerId
    );
    savePrayers(updatedPrayers);
    setDeletePrayerId(null);
    showToast("Prayer point deleted");
  };

  // Mark as answered
  const markAsAnswered = (prayerId) => {
    const updatedPrayers = prayers.map((prayer) =>
      prayer.id === prayerId
        ? {
            ...prayer,
            isAnswered: true,
            status: "Answered",
            answeredAt: new Date().toISOString(),
          }
        : prayer
    );
    savePrayers(updatedPrayers);

    // Add to answered prayers for the answered prayers page
    const answeredPrayer = updatedPrayers.find((p) => p.id === prayerId);
    if (answeredPrayer) {
      const existingAnsweredPrayers = JSON.parse(
        localStorage.getItem("answeredPrayers") || "[]"
      );
      const newAnsweredPrayer = {
        ...answeredPrayer,
        category: "Personal",
        tags: ["personal", "testimony"],
        timeAgo: "Just now",
        verse:
          "Philippians 4:6 - Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.",
      };
      existingAnsweredPrayers.unshift(newAnsweredPrayer);
      localStorage.setItem(
        "answeredPrayers",
        JSON.stringify(existingAnsweredPrayers)
      );
    }

    showToast("Marked as answered! Added to testimonies ✨");
  };

  // Unmark as answered
  const unmarkAnswered = (prayerId) => {
    const updatedPrayers = prayers.map((prayer) =>
      prayer.id === prayerId
        ? {
            ...prayer,
            isAnswered: false,
            status: "Praying",
            answeredAt: null,
          }
        : prayer
    );
    savePrayers(updatedPrayers);

    // Remove from answered prayers
    const existingAnsweredPrayers = JSON.parse(
      localStorage.getItem("answeredPrayers") || "[]"
    );
    const filteredAnsweredPrayers = existingAnsweredPrayers.filter(
      (p) => p.id !== prayerId
    );
    localStorage.setItem(
      "answeredPrayers",
      JSON.stringify(filteredAnsweredPrayers)
    );

    showToast("Unmarked as answered");
  };

  // Filter prayers
  const filteredPrayers = prayers.filter((prayer) => {
    const matchesSearch =
      prayer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prayer.content.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "All" ||
      (filterStatus === "Answered" && prayer.isAnswered) ||
      (filterStatus === "Praying" && !prayer.isAnswered);

    return matchesSearch && matchesStatus;
  });

  // Stats
  const totalPrayers = prayers.length;
  const answeredPrayers = prayers.filter((p) => p.isAnswered).length;
  const prayingPrayers = totalPrayers - answeredPrayers;

  // Format time
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
      {/* Toast Notification */}
      {toastMessage && <Toast message={toastMessage} />}

      {/* Delete Confirmation Modal */}
      {deletePrayerId && (
        <DeleteModal
          onConfirm={confirmDelete}
          onCancel={() => setDeletePrayerId(null)}
        />
      )}

      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-[#FCCF3A] rounded-full">
              <Target className="w-8 h-8 text-[#0C2E8A]" />
            </div>
          </div>
          <h1 className="text-2xl md:text-2xl font-bold text-[#0C2E8A] mb-2">
            My Prayer Points
          </h1>
          <p className="text-sm md:text-lg text-[#0C2E8A]">
            Track your personal prayers and testimonies
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Prayers</p>
                <p className="text-2xl font-bold text-[#0C2E8A]">
                  {totalPrayers}
                </p>
              </div>
              <BookOpen className="w-8 h-8 text-[#0C2E8A] opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Still Praying</p>
                <p className="text-2xl font-bold text-blue-600">
                  {prayingPrayers}
                </p>
              </div>
              <Heart className="w-8 h-8 text-blue-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Answered</p>
                <p className="text-2xl font-bold text-green-600">
                  {answeredPrayers}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600 opacity-20" />
            </div>
          </div>
        </div>

        {/* Search and Add Button */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 md:p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search your prayers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-[#0C2E8A] focus:border-transparent"
              />
            </div>
            <button
              className="flex items-center gap-2 bg-[#0C2E8A] text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition font-medium w-full md:w-auto justify-center"
              onClick={() => setShowModal(true)}
            >
              <Plus className="w-5 h-5" /> Add Prayer Point
            </button>
          </div>
        </div>

        {/* Filter */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 md:p-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <label className="text-sm font-medium text-[#0C2E8A]">
              Filter by Status:
            </label>
            <div className="flex gap-2 flex-wrap">
              {["All", "Praying", "Answered"].map((status) => (
                <button
                  key={status}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    filterStatus === status
                      ? "bg-[#0C2E8A] text-white"
                      : "bg-[#FCCF3A] text-[#0C2E8A] font-bold hover:bg-[#ABBC6B]"
                  }`}
                  onClick={() => setFilterStatus(status)}
                >
                  {status}
                </button>
              ))}
            </div>
            {answeredPrayers > 0 && (
              <Link
                to="/answered-prayers"
                className="ml-auto flex items-center gap-2 text-[#0C2E8A] hover:text-blue-800 font-medium text-sm"
              >
                <CheckCircle className="w-4 h-4" />
                View All Testimonies
              </Link>
            )}
          </div>
        </div>

        {/* Prayer Points */}
        <div className="space-y-4">
          {filteredPrayers.length > 0 ? (
            filteredPrayers.map((prayer) => (
              <div
                key={prayer.id}
                className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 md:p-6 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex justify-between items-start mb-4 gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="text-lg font-medium text-[#0C2E8A] break-words">
                        {prayer.title}
                      </h3>
                      <span
                        className={`px-3 py-1 text-xs rounded-full font-medium flex-shrink-0 ${
                          prayer.isAnswered
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {prayer.status}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3 leading-relaxed break-words">
                      {prayer.content}
                    </p>
                    <div className="flex items-center text-sm text-gray-500 gap-4 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 flex-shrink-0" />
                        {formatTimeAgo(prayer.createdAt)}
                      </span>
                      {prayer.answeredAt && (
                        <span className="flex items-center gap-1 text-green-600">
                          <CheckCircle className="w-4 h-4 flex-shrink-0" />
                          Answered {formatTimeAgo(prayer.answeredAt)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Bookmark Button */}
                  <button
                    onClick={() => handleBookmark(prayer)}
                    className="p-2 text-gray-500 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition flex-shrink-0"
                    title="Bookmark this prayer"
                  >
                    <Bookmark className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-4 border-t border-gray-100 gap-3">
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => handleEdit(prayer)}
                      className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-[#0C2E8A] hover:bg-blue-50 rounded-lg transition font-medium text-sm"
                    >
                      <Edit3 className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(prayer.id)}
                      className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition font-medium text-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>

                  <div className="flex gap-2 w-full sm:w-auto">
                    {prayer.isAnswered ? (
                      <button
                        onClick={() => unmarkAnswered(prayer.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium text-sm flex-1 sm:flex-initial justify-center"
                      >
                        <Clock className="w-4 h-4" />
                        Mark as Praying
                      </button>
                    ) : (
                      <button
                        onClick={() => markAsAnswered(prayer.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition font-medium text-sm flex-1 sm:flex-initial justify-center"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Mark as Answered
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-10 h-10 text-blue-700" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                {searchTerm || filterStatus !== "All"
                  ? "No prayers match your search"
                  : "No prayer points yet"}
              </h3>
              <p className="text-gray-600 mb-6 px-4">
                {searchTerm || filterStatus !== "All"
                  ? "Try adjusting your search or filter"
                  : "Start documenting your prayer journey and track God's faithfulness"}
              </p>
              {!searchTerm && filterStatus === "All" && (
                <button
                  onClick={() => setShowModal(true)}
                  className="bg-[#0C2E8A] text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition font-medium"
                >
                  Add First Prayer Point
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-[#0C2E8A]">
                  {editingPrayer ? "Edit Prayer Point" : "New Prayer Point"}
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditingPrayer(null);
                    setFormData({ title: "", content: "" });
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
                    placeholder="Brief title for your prayer"
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
                    Prayer Content *
                  </label>
                  <textarea
                    placeholder="Describe what you're praying for..."
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

                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingPrayer(null);
                      setFormData({ title: "", content: "" });
                    }}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-[#0C2E8A] text-white rounded-lg hover:bg-blue-800 transition font-medium"
                  >
                    {editingPrayer ? "Update Prayer" : "Add Prayer"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

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

export default MyPrayerPoint;
