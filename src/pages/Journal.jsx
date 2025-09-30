  import React, { useState } from "react";
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
      } else {
        setEntries([newEntry, ...entries]);
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
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-center  mb-8">
            <div className="grid  align-middle text-center md:text-left mb-8">
              <h1 className="text-2xl md:text-2xl font-bold text-[#0C2E8A] mb-2 ">
                My Prayer Journal
              </h1>
              <p className="text-sm md:text-lg text-[#0C2E8A]">
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
              className="flex items-center gap-2 px-6 py-3 bg-[#0C2E8A] text-white rounded-lg hover:bg-[#0C2E8A] transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
            >
              <Plus className="w-5 h-5" />
              New Entry
            </button>
          </div>

          {/* Search and Filter Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search your journal entries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0C2E8A] focus:border-transparent bg-gray-50"
                />
              </div>
              <select
                value={selectedMood}
                onChange={(e) => setSelectedMood(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0C2E8A] focus:border-transparent bg-gray-50 font-medium"
              >
                {moods.map((mood) => (
                  <option key={mood} value={mood}>
                    {mood === "All" ? "All Moods" : mood}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <div className="flex items-center">
                <div className="p-3 bg-[#FCCF3A] rounded-lg">
                  <BookOpen className="w-6 h-6 text-[#0C2E8A]" />
                </div>
                <div className="ml-4">
                  <h3 className="text-2xl font-semibold text-[#0C2E8A]">
                    {entries.length}
                  </h3>
                  <p className="text-gray-600 font-medium">Total Entries</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <div className="flex items-center">
                <div className="p-3 bg-[#FCCF3A] rounded-lg">
                  <Calendar className="w-6 h-6 text-[#0C2E8A]" />
                </div>
                <div className="ml-4">
                  <h3 className="text-2xl font-semibold text-[#0C2E8A]">
                    {new Set(entries.map((e) => e.date)).size}
                  </h3>
                  <p className="text-gray-600 font-medium">Days Journaled</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <div className="flex items-center">
                <div className="p-3 bg-[#FCCF3A] rounded-lg">
                  <Heart className="w-6 h-6 text-[#0C2E8A]" />
                </div>
                <div className="ml-4">
                  <h3 className="text-2xl font-semibold text-[#0C2E8A]">
                    {
                      entries.filter(
                        (e) => e.mood === "Grateful" || e.mood === "Joyful"
                      ).length
                    }
                  </h3>
                  <p className="text-gray-600 font-medium">Grateful Moments</p>
                </div>
              </div>
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
                        onClick={() => handleEdit(entry)}
                        className="p-2 text-gray-500 hover:text-[#0C2E8A] hover:bg-blue-50 rounded-lg transition-all duration-200"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(entry.id)}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
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

                  <p className="text-gray-700 leading-relaxed mb-4">
                    {entry.content}
                  </p>

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

          {/* Empty State */}
          {filteredEntries.length === 0 && (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-10 h-10 text-blue-700" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                No journal entries found
              </h3>
              <p className="text-gray-600 mb-6">
                Start documenting your spiritual journey today
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="px-6 py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors duration-200 font-medium"
              >
                Create Your First Entry
              </button>
            </div>
          )}

          {/* Modal for Adding/Editing Entry */}
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                    {editingEntry ? "Edit Entry" : "New Journal Entry"}
                  </h2>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Content
                      </label>
                      <textarea
                        value={formData.content}
                        onChange={(e) =>
                          setFormData({ ...formData, content: e.target.value })
                        }
                        rows="8"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        placeholder="Write about your spiritual journey, prayers, reflections..."
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Mood
                        </label>
                        <select
                          value={formData.mood}
                          onChange={(e) =>
                            setFormData({ ...formData, mood: e.target.value })
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          {moods
                            .filter((mood) => mood !== "All")
                            .map((mood) => (
                              <option key={mood} value={mood}>
                                {mood}
                              </option>
                            ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Bible Verse (Optional)
                        </label>
                        <input
                          type="text"
                          value={formData.verse}
                          onChange={(e) =>
                            setFormData({ ...formData, verse: e.target.value })
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="e.g., John 3:16"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tags (Optional)
                      </label>
                      <input
                        type="text"
                        value={formData.tags}
                        onChange={(e) =>
                          setFormData({ ...formData, tags: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Separate tags with commas (e.g., prayer, healing, gratitude)"
                      />
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="private"
                        checked={formData.isPrivate}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            isPrivate: e.target.checked,
                          })
                        }
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor="private"
                        className="ml-2 text-sm text-gray-700"
                      >
                        Keep this entry private
                      </label>
                    </div>

                    <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                      <button
                        type="button"
                        onClick={() => setShowModal(false)}
                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors duration-200 font-medium"
                      >
                        {editingEntry ? "Update Entry" : "Save Entry"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  export default Journal;