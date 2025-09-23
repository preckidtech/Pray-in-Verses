// src/pages/BrowsePrayers.jsx

import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  Filter,
  Heart,
  Share2,
  Bookmark,
  Clock,
  ChevronDown,
  CheckCircle,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { prayers } from "../data/prayers";

const BrowsePrayers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedTag, setSelectedTag] = useState("All");
  const [filterOpen, setFilterOpen] = useState(false);
  const [savedPrayers, setSavedPrayers] = useState([]);
  const [answeredPrayers, setAnsweredPrayers] = useState([]);

  useEffect(() => {
    const sp = JSON.parse(localStorage.getItem("savedPrayers")) || [];
    const ap = JSON.parse(localStorage.getItem("answeredPrayers")) || [];
    setSavedPrayers(sp);
    setAnsweredPrayers(ap);
  }, []);

  const categories = ["All", "New Testament", "Old Testament"];

  const tags = useMemo(() => {
    const s = new Set();
    prayers.forEach((p) => s.add(p.category));
    return ["All", ...Array.from(s)];
  }, []);

  const filteredPrayers = prayers.filter((prayer) => {
    const matchesSearch =
      prayer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prayer.content.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || prayer.tags.includes(selectedCategory);

    const matchesTag = selectedTag === "All" || prayer.category === selectedTag;

    return matchesSearch && matchesCategory && matchesTag;
  });

  const handleSavePrayer = (prayer) => {
    const already = savedPrayers.some((p) => p.id === prayer.id);
    let updated;
    if (already) {
      updated = savedPrayers.filter((p) => p.id !== prayer.id);
      toast("Removed from Journal 🗑️");
    } else {
      updated = [...savedPrayers, prayer];
      toast.success("Saved to Journal!");
    }
    setSavedPrayers(updated);
    localStorage.setItem("savedPrayers", JSON.stringify(updated));
  };

  const handleMarkAnswered = (prayer) => {
    const already = answeredPrayers.some((p) => p.id === prayer.id);
    let updated;
    if (already) {
      updated = answeredPrayers.filter((p) => p.id !== prayer.id);
      toast("Marked as Unanswered ↩️");
    } else {
      updated = [...answeredPrayers, prayer];
      toast.success("Marked as Answered!");
    }
    setAnsweredPrayers(updated);
    localStorage.setItem("answeredPrayers", JSON.stringify(updated));
  };

  const handleLikePrayer = (id) => toast("Liked prayer ❤️");
  const handleSharePrayer = (id) => toast("Link copied to clipboard 📋");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-20 lg:pl-[224px] px-4 pb-8">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="container mx-auto px-4 py-6">
        {/* Title + filters */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Browse Prayers</h1>
          <p className="text-gray-600 text-lg">Discover inspiring prayers</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search prayers, verses, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Filter className="w-5 h-5" />
              Filters
              <ChevronDown className={`w-4 h-4 transition ${filterOpen ? "rotate-180" : ""}`} />
            </button>
          </div>

          {filterOpen && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-6">
              <div>
                <label className="block text-sm font-semibold mb-3">Categories</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedCategory(c)}
                      className={`px-3 py-1.5 rounded-full text-sm ${
                        selectedCategory === c ? "bg-blue-600 text-white" : "bg-gray-100 hover:bg-gray-200"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-3">Tags</label>
                <div className="flex flex-wrap gap-2">
                  {tags.map((t) => (
                    <button
                      key={t}
                      onClick={() => setSelectedTag(t)}
                      className={`px-3 py-1.5 rounded-full text-sm ${
                        selectedTag === t ? "bg-purple-600 text-white" : "bg-gray-100 hover:bg-gray-200"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <p className="text-gray-600 mb-6">
          Showing {filteredPrayers.length} of {prayers.length} prayers
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrayers.map((prayer) => {
            const isSaved = savedPrayers.some((p) => p.id === prayer.id);
            const isAnswered = answeredPrayers.some((p) => p.id === prayer.id);

            return (
              <div key={prayer.id} className="bg-white rounded-2xl shadow border p-6 relative flex flex-col">
                {isAnswered && (
                  <span className="absolute top-3 right-3 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                    Answered
                  </span>
                )}

                <div className="flex justify-between mb-3">
                  <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-semibold">
                    {prayer.category}
                  </span>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-1" />
                    {prayer.timeAgo}
                  </div>
                </div>

                <h3 className="text-xl font-bold mb-3">{prayer.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {prayer.content}
                </p>
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-2 mb-4">
                  📖 {prayer.verse}
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {prayer.tags.map((tag) => (
                    <span key={tag} className="px-2 py-1 bg-gray-100 text-xs rounded-md">
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="flex justify-between items-center text-sm text-gray-500 mt-auto">
                  <div className="flex gap-4">
                    <button
                      onClick={() => handleLikePrayer(prayer.id)}
                      className="hover:text-red-500 flex gap-1"
                    >
                      <Heart className="w-4 h-4" /> {prayer.likes}
                    </button>
                    <button
                      onClick={() => handleSavePrayer(prayer)}
                      className={`flex gap-1 ${
                        isSaved ? "text-blue-600" : "hover:text-blue-500"
                      }`}
                    >
                      <Bookmark className="w-4 h-4" />
                      {isSaved ? "Saved" : "Save"}
                    </button>
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={() => handleSharePrayer(prayer.id)}
                      className="hover:text-green-500 flex gap-1"
                    >
                      <Share2 className="w-4 h-4" /> Share
                    </button>
                    <button
                      onClick={() => handleMarkAnswered(prayer)}
                      className={`flex gap-1 ${
                        isAnswered ? "text-green-600" : "hover:text-green-500"
                      }`}
                    >
                      <CheckCircle className="w-4 h-4" />
                      {isAnswered ? "Answered" : "Mark"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BrowsePrayers;
