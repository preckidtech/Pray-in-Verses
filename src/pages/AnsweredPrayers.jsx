import React, { useEffect, useState } from "react";
import { Trash2, Search, X } from "lucide-react";

const AnsweredPrayers = () => {
  const [answeredPrayers, setAnsweredPrayers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [toastVisible, setToastVisible] = useState(false);

  useEffect(() => {
    const savedAnswered = JSON.parse(
      localStorage.getItem("answeredPrayers") || "[]"
    );
    setAnsweredPrayers(savedAnswered);
  }, []);

  // Remove prayer from answered list with toast
  const handleRemove = (prayerId) => {
    const updated = answeredPrayers.filter((p) => p.id !== prayerId);
    localStorage.setItem("answeredPrayers", JSON.stringify(updated));
    setAnsweredPrayers(updated);
    showToast("Answered prayer removed successfully");
  };

  // Show toast
  const showToast = (message) => {
    setToastMessage(message);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
  };

  // Filter prayers
  const filteredPrayers = answeredPrayers.filter(
    (prayer) =>
      prayer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prayer.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50 pt-24 pl-0 lg:pl-[224px] font-['Poppins']">
      {/* Toast Notification */}
      {toastVisible && (
        <div className="fixed top-24 right-6 bg-white shadow-lg rounded-lg px-4 py-3 border-l-4 border-green-500 z-50 animate-slide-in">
          <span className="text-gray-800 font-medium">{toastMessage}</span>
        </div>
      )}
      <main className="flex-1 space-y-10 px-4  lg:px-6 pb-10">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <h1 className="text-base font-semibold text-[#0C2E8A]">
              Answered Prayers
            </h1>

            {/* Search Input */}
            <div className="relative w-full md:w-1/3 mt-4 md:mt-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search answered prayers..."
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

          {/* Prayer Cards */}
          {filteredPrayers.length === 0 ? (
            <p className="text-gray-600 mt-6">No answered prayers found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPrayers.map((prayer) => (
                <div
                  key={prayer.id}
                  className="bg-white rounded-lg shadow p-6 border border-gray-100 relative hover:shadow-lg transition"
                >
                  {/* Remove button */}
                  <button
                    onClick={() => handleRemove(prayer.id)}
                    className="absolute top-3 right-3 text-gray-400 hover:text-red-600"
                    title="Remove answered prayer"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>

                  <h3 className="text-base font-semibold text-[#0C2E8A]">
                    {prayer.title}
                  </h3>
                  <p className="text-gray-600 mt-2">{prayer.content}</p>
                  <p className="text-sm text-gray-400 mt-3">
                    Answered: {new Date(prayer.answeredAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Animation Styles */}
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

export default AnsweredPrayers;
