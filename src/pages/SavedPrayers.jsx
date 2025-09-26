import React, { useEffect, useState } from "react";
import { Bookmark, X, Clock, CheckCircle, Heart, Share2 } from "lucide-react";

const SavedPrayers = () => {
  const [savedPrayers, setSavedPrayers] = useState([]);
  const [showToast, setShowToast] = useState("");

  // Mock data for demonstration - in real app, this would come from localStorage
  const mockSavedPrayers = [
    {
      id: 1,
      title: "Guidance for Career Decision",
      content:
        "Lord, I come before you seeking wisdom and guidance as I face this important career decision. Help me to discern your will and choose the path that brings glory to your name and serves others well. I trust in your perfect timing and plan for my life.",
      category: "Career",
      verse:
        "Proverbs 3:5-6 - Trust in the Lord with all your heart and lean not on your own understanding",
      tags: ["guidance", "career", "wisdom", "trust"],
      timeAgo: "2 hours ago",
      savedAt: Date.now() - 2 * 60 * 60 * 1000,
    },
    {
      id: 2,
      title: "Healing for Family Member",
      content:
        "Heavenly Father, I lift up my beloved family member to you. You are the great physician and I trust in your healing power. Please bring comfort, restoration, and strength to their body, mind, and spirit. Surround them with your peace.",
      category: "Health",
      verse:
        "Jeremiah 17:14 - Heal me, Lord, and I will be healed; save me and I will be saved",
      tags: ["healing", "family", "health", "restoration"],
      timeAgo: "1 day ago",
      savedAt: Date.now() - 24 * 60 * 60 * 1000,
    },

  ];

  useEffect(() => {
    // In a real app, this would get data from localStorage
    // const saved = JSON.parse(localStorage.getItem("savedPrayers")) || [];
    // setSavedPrayers(saved);

    // For demo purposes, using mock data
    setSavedPrayers(mockSavedPrayers);
  }, []);

  const showToastMessage = (message) => {
    setShowToast(message);
    setTimeout(() => setShowToast(""), 3000);
  };

  const handleRemovePrayer = (prayerId) => {
    const updated = savedPrayers.filter((p) => p.id !== prayerId);
    setSavedPrayers(updated);
    // In real app: localStorage.setItem("savedPrayers", JSON.stringify(updated));
    showToastMessage("Removed from Journal 🗑️");
  };

  const handleMarkAnswered = (prayerId) => {
    const prayer = savedPrayers.find((p) => p.id === prayerId);
    if (prayer) {
      // Remove from saved prayers
      const updated = savedPrayers.filter((p) => p.id !== prayerId);
      setSavedPrayers(updated);

      // In real app, add to answered prayers
      // const answeredPrayers = JSON.parse(localStorage.getItem("answeredPrayers")) || [];
      // const answeredPrayer = { ...prayer, answeredAt: Date.now() };
      // answeredPrayers.push(answeredPrayer);
      // localStorage.setItem("answeredPrayers", JSON.stringify(answeredPrayers));
      // localStorage.setItem("savedPrayers", JSON.stringify(updated));

      showToastMessage("Marked as Answered ✅");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-20 lg:pl-[224px] px-4 pb-8">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-24 right-6 bg-white shadow-lg rounded-lg px-4 py-3 border-l-4 border-blue-500 z-50 animate-slide-in">
          <div className="flex items-center gap-2">
            <div className="text-blue-600">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <span className="text-gray-800 font-medium">{showToast}</span>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-[#FCCF3A] rounded-full">
              <Bookmark className="w-8 h-8 text-[#0C2E8A]" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-[#0C2E8A] mb-2">
            Prayer Journal
          </h1>
          <p className="text-[#0C2E8A] text-lg">
            Your saved prayers for reflection and remembrance
          </p>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#0C2E8A] font-bold mb-1">
                Showing {savedPrayers.length} saved prayer
                {savedPrayers.length !== 1 ? "s" : ""}
              </p>
              <p className="text-sm text-gray-500">
                Keep building your personal prayer collection
              </p>
            </div>
            <div className="flex gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#0C2E8A]">
                  {savedPrayers.length}
                </div>
                <div className="text-xs text-gray-500">Saved</div>
              </div>
            </div>
          </div>
        </div>

        {savedPrayers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedPrayers.map((prayer) => (
              <div
                key={prayer.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 p-6 relative flex flex-col group"
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <span className="px-3 py-1.5 bg-gradient-to-r from-blue-100 to-purple-100 text-[#0C2E8A] rounded-full text-xs font-semibold">
                    {prayer.category}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center text-sm text-[#ABBC6B]">
                      <Clock className="w-4 h-4 mr-1" />
                      {prayer.timeAgo}
                    </div>
                    <button
                      onClick={() => handleRemovePrayer(prayer.id)}
                      className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all p-1 rounded-full hover:bg-red-50"
                      title="Remove prayer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold mb-3 text-[#0C2E8A] leading-tight">
                  {prayer.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-4 leading-relaxed text-sm">
                  {prayer.content}
                </p>

                {/* Bible Verse */}
                {prayer.verse && (
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3 mb-4 border-l-4 border-[#0C2E8A]">
                    <div className="flex items-start gap-2">
                      <span className="text-[#0C2E8A] text-lg">📖</span>
                      <span className="text-sm text-gray-700 italic leading-relaxed">
                        {prayer.verse}
                      </span>
                    </div>
                  </div>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {prayer.tags &&
                    prayer.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-[#FCCF3A] hover:bg-gray-200 text-xs rounded-md text-[#0C2E8A] transition-colors cursor-pointer"
                      >
                        #{tag}
                      </span>
                    ))}
                </div>

                {/* Footer Actions */}
                <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
                  <div className="flex gap-3">
                    <div className="text-[#0C2E8A] flex items-center gap-1 text-sm font-medium">
                      <Bookmark className="w-4 h-4" />
                      Saved
                    </div>
                    <button
                      onClick={() => handleMarkAnswered(prayer.id)}
                      className="text-[#0C2E8A] hover:text-[#0C2E8A] flex items-center gap-1 text-sm transition-all p-1 rounded hover:bg-green-50"
                      title="Mark as answered"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Answered
                    </button>
                  </div>
                  <span className="text-xs text-[#0C2E8A]">
                    {new Date(prayer.savedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <div className="w-14 h-14 mx-auto mb-6 bg-gradient-to-br from-[#FCCF3A] to-[#FCCF3A] rounded-full flex items-center justify-center">
              <Bookmark className="w-8 h-8 text-[#0C2E8A]" />
            </div>
            <h2 className="text-2xl font-bold text-[#0C2E8A] mb-4">
              No Saved Prayers Yet
            </h2>
            <p className="text-gray-600 text-lg max-w-md mx-auto mb-8 leading-relaxed">
              Start saving prayers that resonate with your heart, and they will
              appear here for easy access and reflection anytime.
            </p>
            <div className="flex gap-4 justify-center">
              <button className="bg-gradient-to-r from-[#0C2E8A] to-[#0C2E8A] text-white px-8 py-3 rounded-lg hover:from-[#0C2E8A]hover:to-[#0C2E8A] transition-all flex items-center gap-2 shadow-lg">
                <Bookmark className="w-4 h-4" />
                Browse Prayers  
              </button>
            </div>
          </div>
        )}
      </div>

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

export default SavedPrayers;
