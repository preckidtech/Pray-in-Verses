// src/pages/Journal.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Plus,
  Search,
  Calendar,
  Edit3,
  Trash2,
  Clock,
  Check,
  X,
  Save,
} from "lucide-react";

/* -------------------------- fetch helper (cookie auth) -------------------------- */
const API_BASE = import.meta.env.VITE_API_BASE || "";
async function request(path, { method = "GET", body, headers = {} } = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...headers },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text().catch(() => "");
  let payload = {};
  try {
    payload = text ? JSON.parse(text) : {};
  } catch {
    // ignore parse error, will fail loudly if !res.ok
  }
  if (!res.ok) {
    const err = new Error(payload?.message || res.statusText || "Request failed");
    // @ts-ignore
    err.status = res.status;
    // @ts-ignore
    err.payload = payload;
    throw err;
  }
  return payload;
}

/* ------------------------------------ UI bits ----------------------------------- */
const Toast = ({ message }) => (
  <div className="fixed top-20 right-4 md:right-6 bg-white shadow-lg rounded-lg px-4 py-3 border-l-4 border-[#0C2E8A] z-50 animate-slide-in max-w-sm">
    <div className="flex items-center gap-2">
      <Check className="w-5 h-5 text-[#0C2E8A] flex-shrink-0" />
      <span className="text-[#0C2E8A] font-semibold text-sm md:text-base">
        {message}
      </span>
    </div>
  </div>
);

const DeleteModal = ({ onConfirm, onCancel }) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
      <h3 className="text-base font-semibold text-gray-900 mb-2">Delete Journal Entry</h3>
      <p className="text-gray-600 mb-6">
        Are you sure you want to delete this journal entry? This action cannot be undone.
      </p>
      <div className="flex gap-3 justify-end">
        <button
          onClick={onCancel}
          className="px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-700"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
);

/* ----------------------------------- component ---------------------------------- */
export default function Journal() {
  const [searchParams] = useSearchParams();
  const prefillRef = searchParams.get("ref") || ""; // optional ?ref=Genesis 1:1

  // server list
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  // UI state
  const [showModal, setShowModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [deleteEntryId, setDeleteEntryId] = useState(null);
  const [toastMessage, setToastMessage] = useState("");

  // filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMood, setSelectedMood] = useState("All");

  // form aligns to DTO: title, body, mood?
  const [formData, setFormData] = useState({
    title: "",
    body: "",
    mood: "Grateful",
  });

  const moods = [
    "All",
    "Grateful",
    "Joyful",
    "Peaceful",
    "Seeking",
    "Hopeful",
    "Reflective",
    "Blessed",
  ];

  const moodColors = {
    Grateful: "bg-green-100 text-green-800",
    Joyful: "bg-yellow-100 text-yellow-800",
    Peaceful: "bg-blue-100 text-blue-800",
    Seeking: "bg-purple-100 text-purple-800",
    Hopeful: "bg-indigo-100 text-indigo-800",
    Reflective: "bg-gray-100 text-gray-800",
    Blessed: "bg-pink-100 text-pink-800",
  };

  function showToast(msg) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 2500);
  }

  /* ------------------------------- load from API ------------------------------- */
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await request("/journals");
        const list = res?.data ?? res ?? [];
        if (!alive) return;
        setEntries(Array.isArray(list) ? list : []);
      } catch (e) {
        showToast(e.message || "Failed to load journals");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  /* ----------------------------- optional prefill ------------------------------ */
  useEffect(() => {
    if (prefillRef) {
      setEditingEntry(null);
      setFormData((f) => ({
        ...f,
        title: f.title || `Reflection on ${prefillRef}`,
        body:
          f.body ||
          `My thoughts and prayers about ${prefillRef}...\n\n`,
      }));
      setShowModal(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefillRef]);

  /* --------------------------------- filtering -------------------------------- */
  const filteredEntries = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return (entries || []).filter((entry) => {
      const matchesSearch =
        (entry.title || "").toLowerCase().includes(q) ||
        (entry.body || "").toLowerCase().includes(q);
      const matchesMood =
        selectedMood === "All" || (entry.mood || "Grateful") === selectedMood;
      return matchesSearch && matchesMood;
    });
  }, [entries, searchTerm, selectedMood]);

  /* --------------------------------- actions ---------------------------------- */
  function startNew() {
    setEditingEntry(null);
    setFormData({
      title: "",
      body: "",
      mood: "Grateful",
    });
    setShowModal(true);
  }

  function startEdit(entry) {
    setEditingEntry(entry);
    setFormData({
      title: entry.title || "",
      body: entry.body || "",
      mood: entry.mood || "Grateful",
    });
    setShowModal(true);
  }

  function buildPayload() {
    const title = (formData.title || "").trim();
    const body = (formData.body || "").trim();
    if (!title) throw new Error("Title is required.");
    if (!body) throw new Error("Body is required.");

    const payload = { title, body };
    if (formData.mood) payload.mood = formData.mood; // optional
    return payload;
  }

  async function saveForm(e) {
    e?.preventDefault?.();
    let payload;
    try {
      payload = buildPayload();
    } catch (err) {
      showToast(err.message || "Please complete required fields.");
      return;
    }

    try {
      if (editingEntry) {
        const res = await request(`/journals/${editingEntry.id}`, {
          method: "PATCH",
          body: payload,
        });
        const row = res?.data ?? res;
        setEntries((prev) => prev.map((it) => (it.id === row.id ? row : it)));
        showToast("Journal entry updated!");
      } else {
        const res = await request(`/journals`, { method: "POST", body: payload });
        const row = res?.data ?? res;
        setEntries((prev) => [row, ...prev]);
        showToast("New journal entry created!");
      }
      setShowModal(false);
      setEditingEntry(null);
    } catch (e) {
      const msg = e?.payload?.message || e.message || "Save failed";
      showToast(msg);
      // eslint-disable-next-line no-console
      console.error("Journal save failed:", { payloadSent: payload, error: e });
    }
  }

  function askDelete(id) {
    setDeleteEntryId(id);
  }

  async function confirmDelete() {
    try {
      const id = deleteEntryId;
      await request(`/journals/${id}`, { method: "DELETE" });
      setEntries((prev) => prev.filter((e) => e.id !== id));
      showToast("Journal entry deleted");
    } catch (e) {
      const msg = e?.payload?.message || e.message || "Delete failed";
      showToast(msg);
    } finally {
      setDeleteEntryId(null);
    }
  }

  /* ---------------------------------- render ---------------------------------- */
  return (
    <div className="flex bg-gradient-to-br from-blue-50 via-white to-yellow-50 min-h-screen pt-24 pb-10 font-['Poppins']">
      <div className="hidden lg:block w-56" />

      {toastMessage && <Toast message={toastMessage} />}
      {deleteEntryId && (
        <DeleteModal onConfirm={confirmDelete} onCancel={() => setDeleteEntryId(null)} />
      )}

      <div className="flex-1 space-y-10 px-4 lg:px-6 pb-10">
        <div className="container mx-auto py-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <div className="w-full md:w-auto">
              <h1 className="text-center md:text-left text-base font-semibold text-[#0C2E8A] mb-2">
                My Prayer Journal
              </h1>
              <p className="text-sm mb-2 text-[#0C2E8A] text-center md:text-left">
                Record your spiritual journey and God's faithfulness
              </p>
            </div>
            <button
              onClick={startNew}
              className="flex items-center gap-2 px-6 py-3 bg-[#0C2E8A] text-white rounded-lg shadow-lg hover:bg-blue-800 transition w-full md:w-auto justify-center"
            >
              <Plus className="w-5 h-5" /> New Entry
            </button>
          </div>

          {/* Search + mood filter */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 md:p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search your journal entries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0C2E8A]"
                />
              </div>
              <select
                value={selectedMood}
                onChange={(e) => setSelectedMood(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
              >
                {moods.map((mood) => (
                  <option key={mood} value={mood}>
                    {mood === "All" ? "All Moods" : mood}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* List */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-28 rounded-lg bg-gray-100 animate-pulse" />
              ))}
            </div>
          ) : filteredEntries.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-10 text-center">
              <div className="text-gray-500 mb-2">No journal entries yet.</div>
              <button
                onClick={startNew}
                className="px-3 py-2 rounded-md bg-[#0C2E8A] text-white"
              >
                <Plus className="inline w-4 h-4 mr-1" /> New entry
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300"
                >
                  <div className="p-4 md:p-6">
                    <div className="flex justify-between items-start mb-4 flex-wrap gap-2">
                      <div className="flex items-center space-x-3 flex-wrap">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            moodColors[entry.mood] || "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {entry.mood || "Grateful"}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => startEdit(entry)}
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => askDelete(entry.id)}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <h2 className="text-base font-semibold text-gray-900 mb-3">
                      {entry.title || "Untitled"}
                    </h2>

                    <div className="flex items-center text-[#ABBC6B] text-sm mb-4 flex-wrap gap-2">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        {new Date(entry.createdAt || Date.now()).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        {new Date(entry.createdAt || Date.now()).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>

                    <p className="text-gray-700 text-sm mb-2 whitespace-pre-wrap">
                      {entry.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Modal editor */}
          {showModal && (
            <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
              <form
                onSubmit={saveForm}
                className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-semibold text-gray-900">
                    {editingEntry ? "Edit Journal Entry" : "New Journal Entry"}
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingEntry(null);
                    }}
                    className="p-2 rounded hover:bg-gray-100"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3">
                  <input
                    className="w-full border rounded-md px-3 py-2"
                    placeholder="Title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />

                  <textarea
                    className="w-full border rounded-md px-3 py-2 min-h-32"
                    placeholder="Write your thoughts, prayers, or reflections…"
                    value={formData.body}
                    onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                  />

                  <select
                    className="w-full border rounded-md px-3 py-2"
                    value={formData.mood}
                    onChange={(e) => setFormData({ ...formData, mood: e.target.value })}
                  >
                    {moods.filter((m) => m !== "All").map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2 mt-5">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingEntry(null);
                    }}
                    className="px-3 py-2 rounded-md border"
                  >
                    <X className="inline w-4 h-4 mr-1" /> Cancel
                  </button>
                  <button type="submit" className="px-3 py-2 rounded-md bg-[#0C2E8A] text-white">
                    <Save className="inline w-4 h-4 mr-1" /> Save
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slide-in {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in { animation: slide-in 0.3s ease-out; }
      `}</style>
    </div>
  );
}
