import React, { useEffect, useState } from "react";
import { CheckCircle, X, Clock, Heart, Share2, Star } from "lucide-react";

const AnsweredPrayers = () => {
  const [answeredPrayers, setAnsweredPrayers] = useState([]);
  const [showToast, setShowToast] = useState("");

  // Mock data for demonstration - in real app, this would come from localStorage
  const mockAnsweredPrayers = [
    {
      id: 1,
      title: "Safe Travel Prayer",
      content:
        "Thank you Lord for protecting me and my family during our recent cross-country trip. Your angels watched over us through every mile, and you brought us home safely. I'm so grateful for your faithful protection and care over our journey.",
      category: "Travel",
      verse:
        "Psalm 121:8 - The Lord will watch over your coming and going both now and forevermore",
      tags: ["travel", "protection", "thanksgiving", "family"],
      timeAgo: "1 week ago",
      answeredAt: Date.now() - 7 * 24 * 60 * 60 * 1000,
    },
    {
      id: 2,
      title: "Job Interview Success",
      content:
        "I prayed for favor, confidence, and the right words during my job interview, and God answered abundantly! Not only did I get the position, but they offered me more than I expected. I'm so grateful for His provision and perfect timing in my career.",
      category: "Career",
      verse:
        "Philippians 4:19 - And my God will meet all your needs according to the riches of his glory",
      tags: ["job", "favor", "provision", "career"],
      timeAgo: "2 weeks ago",
      answeredAt: Date.now() - 14 * 24 * 60 * 60 * 1000,
    },
  ];

  useEffect(() => {
    // In a real app, this would get data from localStorage
    // const answered = JSON.parse(localStorage.getItem("answeredPrayers")) || [];
    // setAnsweredPrayers(answered);

    // For demo purposes, using mock data
    setAnsweredPrayers(mockAnsweredPrayers);
  }, []);

  const showToastMessage = (message) => {
    setShowToast(message);
    setTimeout(() => setShowToast(""), 3000);
  };

  const handleUnmarkAnswered = (prayerId) => {
    const updated = answeredPrayers.filter((p) => p.id !== prayerId);
    setAnsweredPrayers(updated);
    // In real app: localStorage.setItem("answeredPrayers", JSON.stringify(updated));
    showToastMessage("Marked as Unanswered ↩️");
  };

  const handleShareTestimony = (prayerId) => {
    // In a real app, this would open a share dialog or copy link
    showToastMessage("Testimony ready to share! 🔗");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 pt-20 lg:pl-[224px] px-4 pb-8">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-24 right-6 bg-white shadow-lg rounded-lg px-4 py-3 border-l-4 border-[#0C2E8A] z-50 animate-slide-in">
          <div className="flex items-center gap-2">
            <div className="text-[#0C2E8A]">
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
              <CheckCircle className="w-8 h-8 text-[#0C2E8A]" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-[#0C2E8A] mb-2">
            Answered Prayers
          </h1>
          <p className="text-[#0C2E8A] text-lg">
            Testimonies of God's faithfulness and goodness
          </p>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#0C2E8A] font-bold mb-1">
                Showing {answeredPrayers.length} answered prayer
                {answeredPrayers.length !== 1 ? "s" : ""}
              </p>
              <p className="text-sm text-gray-500">
                Each one a testament to God's loving care
              </p>
            </div>
            <div className="flex gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#0C2E8A]">
                  {answeredPrayers.length}
                </div>
                <div className="text-xs text-gray-500">Answered</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#FCCF3A]">
                  {
                    answeredPrayers.filter((p) => p.tags?.includes("miracle"))
                      .length
                  }
                </div>
                <div className="text-xs text-gray-500">Miracles</div>
              </div>
            </div>
          </div>
        </div>

        {answeredPrayers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {answeredPrayers.map((prayer) => (
              <div
                key={prayer.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 p-6 relative flex flex-col group"
              >
                {/* Answered Badge */}
                <span className="absolute top-3 right-3 px-3 py-1.5 bg-gradient-to-r from-green-100 to-emerald-100 text-[#0C2E8A] text-xs rounded-full font-semibold flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  Answered
                </span>

                {/* Header */}
                <div className="flex justify-between items-start mb-4 pr-20">
                  <span className="px-3 py-1.5 bg-gradient-to-r from-[#0C2E8A] to-[#0C2E8A] text-[#FCCF3A] rounded-full text-xs font-semibold">
                    {prayer.category}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center text-sm text-[#0C2E8A]">
                      <Clock className="w-4 h-4 mr-1" />
                      {prayer.timeAgo}
                    </div>
                    <button
                      onClick={() => handleUnmarkAnswered(prayer.id)}
                      className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all p-1 rounded-full hover:bg-red-50"
                      title="Unmark as answered"
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
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-3 mb-4 border-l-4 border-[#FCCF3A]">
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
                        className={`px-2 py-1 text-xs rounded-md transition-colors cursor-pointer ${
                          tag === "miracle"
                            ? "bg-[#FCCF3A] text-amber-700 hover:bg-amber-200"
                            : tag === "testimony"
                            ? "bg-[#FCCF3A] text-[#0C2E8A] hover:bg-purple-200"
                            : "bg-[#FCCF3A] text-[#0C2E8A] hover:bg-gray-200"
                        }`}
                      >
                        #{tag}
                      </span>
                    ))}
                </div>

                {/* Footer Actions */}
                <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
                  <div className="flex gap-3">
                    <div className="text-[#0C2E8A] flex items-center gap-1 text-sm font-medium">
                      <CheckCircle className="w-4 h-4" />
                      Answered
                    </div>
                    <button
                      onClick={() => handleShareTestimony(prayer.id)}
                      className="text-[#0C2E8A] hover:text-blue-700 flex items-center gap-1 text-sm transition-all p-1 rounded hover:bg-blue-50"
                      title="Share testimony"
                    >
                      <Share2 className="w-4 h-4" />
                      Share
                    </button>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(prayer.answeredAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <div className="h-14 w-14 mx-auto mb-6 bg-gradient-to-br from-[#FCCF3A] to-[#FCCF3A] rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-[#0C2E8A]" />
            </div>
            <h2 className="text-2xl font-bold text-[#0C2E8A] mb-4">
              No Answered Prayers Yet
            </h2>
            <p className="text-gray-600 text-lg max-w-md mx-auto mb-8 leading-relaxed">
              Mark prayers as answered and they will appear here as beautiful
              testimonies of God's faithfulness and love.
            </p>
            <div className="flex gap-4 justify-center">
              <button className="bg-gradient-to-r from-[#0C2E8A] to-blue-800 text-white px-8 py-3 rounded-lg hover:from-[#0C2E8A] hover:to-blue-800                                                          transition-all flex items-center gap-2 shadow-lg">
                <CheckCircle className="w-4 h-4" />
                Mark First Prayer
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

export default AnsweredPrayers;
