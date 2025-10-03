import React, { useEffect, useState } from "react";
import { Trash2, Search, X, Bookmark } from "lucide-react";

const SavedPrayers = () => {
  const [savedPrayers, setSavedPrayers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [toastVisible, setToastVisible] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("savedPrayers") || "[]");
    setSavedPrayers(saved);
  }, []);

  const handleRemove = (prayerId) => {
    const updated = savedPrayers.filter((p) => p.id !== prayerId);
    localStorage.setItem("savedPrayers", JSON.stringify(updated));
    setSavedPrayers(updated);
    showToast("Prayer removed successfully 🗑️");
  };

  const showToast = (message) => {
    setToastMessage(message);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
  };

  const filteredPrayers = savedPrayers.filter(
    (prayer) =>
      prayer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prayer.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (prayer.themeFocus &&
        prayer.themeFocus.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50 pt-16 pl-0 lg:pl-[224px] px-4 pb-8 font-['Poppins']">
      {/* Toast */}
      {toastVisible && (
        <div className="fixed top-24 right-6 bg-white shadow-lg rounded-lg px-4 py-3 border-l-4 border-green-500 z-50 animate-slide-in">
          <span className="text-gray-800 font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#0C2E8A]">Saved Prayers</h1>
          <div className="relative w-full md:w-1/3 mt-4 md:mt-0">
            <input
              type="text"
              placeholder="Search saved prayers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0C2E8A]"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Prayers List */}
        {filteredPrayers.length === 0 ? (
          <p className="text-gray-600 mt-6">No saved prayers found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrayers.map((prayer) => (
              <div
                key={prayer.id}
                className="bg-white rounded-lg shadow p-6 border border-gray-100 relative hover:shadow-lg transition"
              >
                <button
                  onClick={() => handleRemove(prayer.id)}
                  className="absolute top-3 right-3 text-gray-400 hover:text-red-600"
                  title="Remove prayer"
                >
                  <Trash2 className="w-5 h-5" />
                </button>

                <h3 className="text-lg font-bold text-[#0C2E8A]">{prayer.title}</h3>

                {prayer.themeFocus && (
                  <div className="mb-2 p-2 bg-blue-50 rounded text-sm font-semibold text-blue-800">
                    Theme: {prayer.themeFocus}
                  </div>
                )}

                <p className="text-gray-600 mt-2">{prayer.content}</p>

                {prayer.verse && (
                  <p className="text-sm text-gray-500 mt-2">Reference: {prayer.verse}</p>
                )}

                {/* Prayer Points */}
                {prayer.prayerPoints && prayer.prayerPoints.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-semibold text-[#0C2E8A] mb-1">Prayer Points:</h4>
                    <ul className="list-disc pl-6 text-sm text-gray-700">
                      {prayer.prayerPoints.map((point, index) => (
                        <li key={index} className="flex justify-between items-center">
                          <span>{point}</span>
                          <Bookmark className="w-4 h-4 text-yellow-500" />
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <p className="text-xs text-gray-400 mt-3">
                  Saved: {new Date(prayer.savedAt).toLocaleDateString()}
                </p>
              </div>
            ))}
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
