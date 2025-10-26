// src/pages/MyPrayerPoint.jsx
import React, { useEffect, useMemo, useState } from "react";
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
  RotateCcw,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

/** ---- tiny API helper (cookie auth) ---- */
const API_BASE = import.meta.env.VITE_API_BASE || "/api";
async function request(path, { method = "GET", body, headers = {} } = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...headers },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text().catch(() => "");
  let payload = {};
  try { payload = text ? JSON.parse(text) : {}; } catch {}
  if (!res.ok) {
    const err = new Error(payload?.message || res.statusText || "Request failed");
    err.status = res.status;
    err.payload = payload;
    throw err;
  }
  return payload;
}

/** ---- Toast ---- */
const Toast = ({ message }) => (
  <div className="fixed top-20 right-4 md:right-6 bg-white shadow-lg rounded-lg px-4 py-3 border-l-4 border-green-500 z-50 animate-slide-in max-w-sm">
    <div className="flex items-center gap-2">
      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
      <span className="text-gray-800 font-medium text-sm md:text-base">{message}</span>
    </div>
  </div>
);

/** ---- Delete Confirm ---- */
const DeleteModal = ({ onConfirm, onCancel }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
      <h3 className="text-base font-semibold text-gray-900 mb-2">Delete Prayer Point</h3>
      <p className="text-gray-600 mb-6">
        Are you sure you want to delete this prayer point? This action cannot be undone.
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
  const nav = useNavigate();

  // server state
  const [stats, setStats] = useState({ total: 0, open: 0, answered: 0 });
  const [prayers, setPrayers] = useState([]);
  const [loading, setLoading] = useState(true);

  // ui state
  const [showModal, setShowModal] = useState(false);
  const [editingPrayer, setEditingPrayer] = useState(null); // reserved for future edit API
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All"); // All | Praying | Answered
  const [toastMessage, setToastMessage] = useState("");
  const [deletePrayerId, setDeletePrayerId] = useState(null);

  // create form
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    tags: "",
  });

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(""), 2800);
  };

  /** ---------- load from server ---------- */
  const apiStatusForFilter = (s) =>
    s === "All" ? "ALL" : s === "Praying" ? "OPEN" : "ANSWERED";

  async function loadAll() {
    setLoading(true);
    try {
      const [sres, lres] = await Promise.all([
        request("/my-prayers/stats"),
        request(
          `/my-prayers?q=${encodeURIComponent(searchTerm)}&status=${apiStatusForFilter(
            filterStatus
          )}`
        ),
      ]);
      setStats(sres || { total: 0, open: 0, answered: 0 });
      setPrayers(lres?.data ?? []);
    } catch (e) {
      if (e.status === 401) nav("/login", { replace: true });
      else showToast(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // initial load & when the tab changes
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterStatus]);

  /** ---------- actions ---------- */
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const tags = formData.tags
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean);

      await request("/my-prayers", {
        method: "POST",
        body: { title: formData.title, body: formData.content, tags },
      });

      setShowModal(false);
      setFormData({ title: "", content: "", tags: "" });
      showToast("New prayer point added!");
      loadAll();
    } catch (e) {
      if (e.status === 401) nav("/login", { replace: true });
      else showToast(e.message);
    }
  }

  async function markAsAnswered(id) {
    try {
      await request(`/my-prayers/${id}/toggle`, { method: "POST" });
      showToast("Marked as answered ✨");
      loadAll();
    } catch (e) {
      if (e.status === 401) nav("/login", { replace: true });
      else showToast(e.message);
    }
  }

  async function unmarkAnswered(id) {
    try {
      await request(`/my-prayers/${id}/toggle`, { method: "POST" });
      showToast("Marked as praying");
      loadAll();
    } catch (e) {
      if (e.status === 401) nav("/login", { replace: true });
      else showToast(e.message);
    }
  }

  function handleEdit(prayer) {
    // (Optional: add PATCH API in future)
    setEditingPrayer(prayer);
    setFormData({ title: prayer.title, content: prayer.body || "", tags: (prayer.tags || []).join(", ") });
    setShowModal(true);
  }

  async function confirmDelete() {
    if (!deletePrayerId) return;
    try {
      await request(`/my-prayers/${deletePrayerId}`, { method: "DELETE" });
      setDeletePrayerId(null);
      showToast("Prayer point deleted");
      loadAll();
    } catch (e) {
      if (e.status === 401) nav("/login", { replace: true });
      else showToast(e.message);
    }
  }

  /** ---------- local helpers ---------- */
  const totalPrayers = stats.total ?? 0;
  const answeredPrayers = stats.answered ?? 0;
  const prayingPrayers = stats.open ?? 0;

  const filteredPrayers = useMemo(() => {
    // server already filters by status & q, but keep client-side search for instant UX
    const q = searchTerm.toLowerCase().trim();
    if (!q) return prayers;
    return prayers.filter(
      (p) =>
        p.title?.toLowerCase().includes(q) ||
        (p.body || "").toLowerCase().includes(q) ||
        (Array.isArray(p.tags) ? p.tags.join(" ").toLowerCase().includes(q) : false)
    );
  }, [prayers, searchTerm]);

  const formatTimeAgo = (dateString) => {
    if (!dateString) return "";
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    return `${Math.floor(diffInHours / 24)} days ago`;
  };

  // (Optional) Keep your bookmark-to-localStorage behavior
  const handleBookmark = (prayer) => {
    try {
      const userId =
        JSON.parse(localStorage.getItem("currentUser") || "{}").id || "guest";
      const bookmarks = JSON.parse(localStorage.getItem(`bookmarks_${userId}`) || "[]");
      const isAlready = bookmarks.some((b) => b.id === prayer.id && b.type === "prayer-point");
      if (isAlready) return showToast("This prayer point is already bookmarked");

      const newBookmark = {
        id: prayer.id,
        type: "prayer-point",
        title: prayer.title,
        content: prayer.body,
        category: "Prayer Point",
        tags: Array.isArray(prayer.tags) ? prayer.tags : [],
        dateBookmarked: new Date().toISOString(),
        status: prayer.status,
        isAnswered: prayer.status === "ANSWERED",
      };
      localStorage.setItem(
        `bookmarks_${userId}`,
        JSON.stringify([newBookmark, ...bookmarks])
      );
      window.dispatchEvent(new Event("bookmarkUpdated"));
      showToast("Prayer point bookmarked!");
    } catch {
      showToast("Failed to bookmark");
    }
  };

  /** ---------- UI ---------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50 pt-24 pl-0 lg:pl-[224px] font-['Poppins']">
      {toastMessage && <Toast message={toastMessage} />}

      {deletePrayerId && (
        <DeleteModal
          onConfirm={confirmDelete}
          onCancel={() => setDeletePrayerId(null)}
        />
      )}

      <main className="flex-1 space-y-10 px-4 lg:px-6 pb-10">
        <div className="container mx-auto px-4 py-8 space-y-6">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-[#FCCF3A] rounded-full">
                <Target className="w-8 h-8 text-[#0C2E8A]" />
              </div>
            </div>
            <h1 className="text-base font-semibold text-[#0C2E8A] mb-2">
              My Prayer Points
            </h1>
            <p className="text-sm text-[#0C2E8A]">
              Track your personal prayers and testimonies
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Prayers</p>
                  <p className="text-2xl font-bold text-[#0C2E8A]">{totalPrayers}</p>
                </div>
                <BookOpen className="w-8 h-8 text-[#0C2E8A] opacity-20" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Still Praying</p>
                  <p className="text-2xl font-bold text-blue-600">{prayingPrayers}</p>
                </div>
                <Heart className="w-8 h-8 text-blue-600 opacity-20" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Answered</p>
                  <p className="text-2xl font-bold text-green-600">{answeredPrayers}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600 opacity-20" />
              </div>
            </div>
          </div>

          {/* Search + Add */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 md:p-6 mb-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search your prayers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && loadAll()}
                  className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-[#0C2E8A] focus:border-transparent"
                />
                <button
                  onClick={loadAll}
                  title="Refresh"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
              <button
                className="flex items-center gap-2 bg-[#0C2E8A] text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition font-medium w-full md:w-auto justify-center"
                onClick={() => {
                  setEditingPrayer(null);
                  setFormData({ title: "", content: "", tags: "" });
                  setShowModal(true);
                }}
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

          {/* List */}
          <div className="space-y-4">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-28 bg-white rounded-lg border border-gray-100 animate-pulse" />
              ))
            ) : filteredPrayers.length > 0 ? (
              filteredPrayers.map((prayer) => {
                const isAnswered = prayer.status === "ANSWERED";
                return (
                  <div
                    key={prayer.id}
                    className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 md:p-6 hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="flex justify-between items-start mb-4 gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <h3 className="text-base font-semibold text-[#0C2E8A] break-words">
                            {prayer.title}
                          </h3>
                          <span
                            className={`px-3 py-1 text-sm rounded-full font-medium flex-shrink-0 ${
                              isAnswered
                                ? "bg-green-100 text-green-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {isAnswered ? "Answered" : "Praying"}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-3 leading-relaxed break-words">
                          {prayer.body}
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
                        {Array.isArray(prayer.tags) && prayer.tags.length > 0 && (
                          <div className="flex gap-2 flex-wrap mt-3">
                            {prayer.tags.map((t, i) => (
                              <span key={i} className="px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-700">
                                #{t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Bookmark (local) */}
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
                          disabled
                          title="Inline edit coming soon"
                        >
                          <Edit3 className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => setDeletePrayerId(prayer.id)}
                          className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition font-medium text-sm"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>

                      <div className="flex gap-2 w-full sm:w-auto">
                        {isAnswered ? (
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
                );
              })
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
                    onClick={() => {
                      setEditingPrayer(null);
                      setFormData({ title: "", content: "", tags: "" });
                      setShowModal(true);
                    }}
                    className="bg-[#0C2E8A] text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition font-medium"
                  >
                    Add First Prayer Point
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Create / (future edit) Modal */}
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
                      setFormData({ title: "", content: "", tags: "" });
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
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
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
                      Tags (comma separated)
                    </label>
                    <input
                      type="text"
                      placeholder="faith, family, provision"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0C2E8A] focus:border-transparent"
                    />
                  </div>

                  <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => {
                        setShowModal(false);
                        setEditingPrayer(null);
                        setFormData({ title: "", content: "", tags: "" });
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
      </main>

      <style>{`
        @keyframes slide-in {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in { animation: slide-in 0.3s ease-out; }
      `}</style>
    </div>
  );
};

export default MyPrayerPoint;
