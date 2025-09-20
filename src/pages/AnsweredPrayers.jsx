import React, { useEffect, useState } from "react";
import { CheckCircle, X, Clock } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const AnsweredPrayers = () => {
  const [answeredPrayers, setAnsweredPrayers] = useState([]);

  useEffect(() => {
    const answered = JSON.parse(localStorage.getItem("answeredPrayers")) || [];
    setAnsweredPrayers(answered);
  }, []);

  const handleUnmarkAnswered = (prayerId) => {
    const updated = answeredPrayers.filter(p => p.id !== prayerId);
    setAnsweredPrayers(updated);
    localStorage.setItem("answeredPrayers", JSON.stringify(updated));
    toast("Marked as Unanswered ↩️");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-20 lg:pl-40 px-4 pb-8">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="container mx-auto px-4 py-6">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Answered Prayers</h1>
          <p className="text-gray-600 text-lg">Testimonies of God's faithfulness</p>
        </div>

        <p className="text-gray-600 mb-6">
          Showing {answeredPrayers.length} answered prayer{answeredPrayers.length !== 1 ? 's' : ''}
        </p>

        {answeredPrayers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {answeredPrayers.map((prayer) => (
              <div key={prayer.id} className="bg-white rounded-2xl shadow border p-6 relative flex flex-col">
                <span className="absolute top-3 right-3 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                  Answered
                </span>

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
                      onClick={() => handleUnmarkAnswered(prayer.id)}
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
                    <div className="text-green-600 flex gap-1">
                      <CheckCircle className="w-4 h-4" />
                      Answered
                    </div>
                  </div>
                  <span>
                    Answered {new Date(prayer.answeredAt || Date.now()).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">No Answered Prayers Yet</h2>
            <p className="text-gray-600 text-lg max-w-md mx-auto">
              Mark prayers as answered and they will appear here as testimonies of God's faithfulness.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnsweredPrayers;