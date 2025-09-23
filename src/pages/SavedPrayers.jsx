import React, { useEffect, useState } from "react";
import { Bookmark, X, Clock } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const SavedPrayers = () => {
  const [savedPrayers, setSavedPrayers] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("savedPrayers")) || [];
    setSavedPrayers(saved);
  }, []);

  const handleRemovePrayer = (prayerId) => {
    const updated = savedPrayers.filter(p => p.id !== prayerId);
    setSavedPrayers(updated);
    localStorage.setItem("savedPrayers", JSON.stringify(updated));
    toast("Removed from Journal 🗑️");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-20 lg:pl-[224px] px-4 pb-8">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="container mx-auto px-4 py-6">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Prayer Journal</h1>
          <p className="text-gray-600 text-lg">Your saved prayers for reflection</p>
        </div>

        <p className="text-gray-600 mb-6">
          Showing {savedPrayers.length} saved prayer{savedPrayers.length !== 1 ? 's' : ''}
        </p>

        {savedPrayers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedPrayers.map((prayer) => (
              <div key={prayer.id} className="bg-white rounded-2xl shadow border p-6 relative flex flex-col">
                <div className="flex justify-between mb-3">
                  <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-semibold">
                    {prayer.category}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      {prayer.timeAgo}
                    </div>
                    <button
                      onClick={() => handleRemovePrayer(prayer.id)}
                      className="text-gray-400 hover:text-red-500 transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="text-xl font-bold mb-3">{prayer.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {prayer.content}
                </p>
                
                {prayer.verse && (
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-2 mb-4">
                    📖 {prayer.verse}
                  </div>
                )}

                <div className="flex flex-wrap gap-2 mb-4">
                  {prayer.tags && prayer.tags.map((tag) => (
                    <span key={tag} className="px-2 py-1 bg-gray-100 text-xs rounded-md">
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="flex justify-between items-center text-sm text-gray-500 mt-auto">
                  <div className="flex gap-4">
                    <div className="text-blue-600 flex gap-1">
                      <Bookmark className="w-4 h-4" />
                      Saved
                    </div>
                  </div>
                  <span>
                    Saved {new Date(prayer.savedAt || Date.now()).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
              <Bookmark className="w-12 h-12 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">No Saved Prayers Yet</h2>
            <p className="text-gray-600 text-lg max-w-md mx-auto">
              Start saving prayers you love, and they will appear here for easy access anytime.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedPrayers;