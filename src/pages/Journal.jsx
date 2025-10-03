// src/pages/Journal.jsx
import React, { useState } from "react";
import { usePageLogger } from "../hooks/usePageLogger";
import { logJournal } from "../utils/historyLogger";
import {
  Plus,
  Search,
  Calendar,
  Heart,
  Edit3,
  Trash2,
  BookOpen,
  Clock,
} from "lucide-react";

// Bookmark handler
const handleBookmark = (entry) => {
  const userId =
    JSON.parse(localStorage.getItem("currentUser") || "{}").id || "guest";
  const bookmarks = JSON.parse(
    localStorage.getItem(`bookmarks_${userId}`) || "[]"
  );

  const isAlreadyBookmarked = bookmarks.some(
    (b) => b.id === entry.id && b.type === "journal"
  );

  if (isAlreadyBookmarked) {
    alert("This journal entry is already bookmarked.");
    return;
  }

  const newBookmark = {
    id: entry.id || Date.now().toString(),
    type: "journal",
    title: entry.title,
    content: entry.content,
    mood: entry.mood,
    tags: entry.tags,
    verse: entry.verse,
    date: entry.date,
    createdAt: entry.createdAt,
    isPrivate: entry.isPrivate,
  };

  localStorage.setItem(
    `bookmarks_${userId}`,
    JSON.stringify([...bookmarks, newBookmark])
  );

  window.dispatchEvent(new Event("bookmarkUpdated"));
  alert("Journal entry bookmarked!");
};

const Journal = () => {
  const [entries, setEntries] = useState([
    {
      id: 1,
      title: "God's Grace in Difficult Times",
      content:
        "Today I experienced God's incredible grace when I was facing a challenging situation at work. Despite feeling overwhelmed, I felt His peace washing over me during my morning prayer...",
      date: "2024-03-15",
      mood: "Grateful",
      tags: ["Grace", "Work", "Peace"],
      verse: "Philippians 4:19",
      createdAt: "2024-03-15T08:30:00",
      isPrivate: false,
    },
    {
      id: 2,
      title: "Answered Prayer - Family Healing",
      content:
        "I'm so thankful to record this miracle! My mother's health has improved significantly after weeks of prayer. The doctors are amazed by her recovery...",
      date: "2024-03-12",
      mood: "Joyful",
      tags: ["Healing", "Family", "Miracle"],
      verse: "Jeremiah 17:14",
      createdAt: "2024-03-12T19:45:00",
      isPrivate: false,
    },
    {
      id: 3,
      title: "Seeking Direction",
      content:
        "I find myself at a crossroads, Lord. Help me discern Your will for my future. I'm praying for clarity and wisdom as I make important decisions about my career path...",
      date: "2024-03-10",
      mood: "Seeking",
      tags: ["Guidance", "Career", "Decision"],
      verse: "Proverbs 3:5-6",
      createdAt: "2024-03-10T12:15:00",
      isPrivate: true,
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMood, setSelectedMood] = useState("All");
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    mood: "Grateful",
    tags: "",
    verse: "",
    isPrivate: false,
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

  usePageLogger({
    title: "Journal Page",
    type: "page",
    reference: "Journal Section",
    content: "Browsing prayer journal entries",
    category: "Journal",
  });

  const filteredEntries = entries.filter((entry) => {
    const matchesSearch =
      entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMood = selectedMood === "All" || entry.mood === selectedMood;
    return matchesSearch && matchesMood;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEntry = {
      id: editingEntry ? editingEntry.id : Date.now(),
      title: formData.title,
      content: formData.content,
      date: new Date().toISOString().split("T")[0],
      mood: formData.mood,
      tags: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag),
      verse: formData.verse,
      createdAt: editingEntry
        ? editingEntry.createdAt
        : new Date().toISOString(),
      isPrivate: formData.isPrivate,
    };

    if (editingEntry) {
      setEntries(
        entries.map((entry) =>
          entry.id === editingEntry.id ? newEntry : entry
        )
      );
      logJournal(
        `Updated: ${formData.title}`,
        formData.content.substring(0, 100),
        formData.mood
      );
    } else {
      setEntries([newEntry, ...entries]);
      logJournal(
        formData.title,
        formData.content.substring(0, 100),
        formData.mood
      );
    }

    setFormData({
      title: "",
      content: "",
      mood: "Grateful",
      tags: "",
      verse: "",
      isPrivate: false,
    });
    setEditingEntry(null);
    setShowModal(false);
  };

  const handleEdit = (entry) => {
    setEditingEntry(entry);
    setFormData({
      title: entry.title,
      content: entry.content,
      mood: entry.mood,
      tags: entry.tags.join(", "),
      verse: entry.verse,
      isPrivate: entry.isPrivate,
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this journal entry?")) {
      setEntries(entries.filter((entry) => entry.id !== id));
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50 pt-16 pl-0 lg:pl-[224px]">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="">
            <h1 className="text-center md:text-left text-2xl font-bold text-[#0C2E8A] mb-2">
              My Prayer Journal
            </h1>
            <p className="text-sm mb-2 text-[#0C2E8A]">
              Record your spiritual journey and God's faithfulness
            </p>
          </div>
          <button
            onClick={() => {
              setEditingEntry(null);
              setFormData({
                title: "",
                content: "",
                mood: "Grateful",
                tags: "",
                verse: "",
                isPrivate: false,
              });
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-6 py-3 bg-[#0C2E8A] text-white rounded-lg shadow-lg"
          >
            <Plus className="w-5 h-5" /> New Entry
          </button>
        </div>

        {/* Search Filter */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
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

        {/* Journal Entries */}
        <div className="space-y-6">
          {filteredEntries.map((entry) => (
            <div
              key={entry.id}
              className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        moodColors[entry.mood] || "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {entry.mood}
                    </span>
                    {entry.isPrivate && (
                      <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                        Private
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleBookmark(entry)}
                      className="p-2 text-gray-500 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg"
                      title="Bookmark this entry"
                    >
                      <BookOpen className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEdit(entry)}
                      className="p-2 text-gray-500 hover:text-blue-600 rounded-lg"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(entry.id)}
                      className="p-2 text-gray-500 hover:text-red-600 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h2 className="text-xl font-medium text-[#0C2E8A] mb-3">
                  {entry.title}
                </h2>

                <div className="flex items-center text-[#ABBC6B] text-sm mb-4">
                  <Calendar className="w-4 h-4 mr-2" />
                  {formatDate(entry.date)}
                  <Clock className="w-4 h-4 ml-4 mr-2" />
                  {new Date(entry.createdAt).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>

                <p className="text-gray-700 mb-4">{entry.content}</p>

                {entry.verse && (
                  <div className="bg-gradient-to-r from-blue-50 to-yellow-50 rounded-lg p-4 mb-4 border border-blue-100">
                    <p className="text-[#0C2E8A] font-medium text-sm">
                      📖 {entry.verse}
                    </p>
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  {entry.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-[#FCCF3A] text-[#0C2E8A] text-sm rounded-md"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Journal;
