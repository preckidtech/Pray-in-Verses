// src/pages/VerseDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Bookmark } from "lucide-react";
import banner from "../assets/images/suggest/two-lovers-studying-the-bible-it-is-god-s-love-for-2022-06-18-20-18-08-utc.jpg";
import { usePageLogger } from "../hooks/usePageLogger";
import { logPrayer } from "../utils/historyLogger";

const VerseDetails = () => {
  const { bookSlug, chapterNumber, verseNumber } = useParams();
  const navigate = useNavigate();

  // Format book slug to proper title
  const formatTitleFromSlug = (s) =>
    String(s || "")
      .split("-")
      .map((t) =>
        t.length > 0 ? t.charAt(0).toUpperCase() + t.slice(1).toLowerCase() : ""
      )
      .join(" ");

  const bookTitle = bookSlug ? formatTitleFromSlug(bookSlug) : "Unknown Book";

  const [savedPoints, setSavedPoints] = useState([]);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVisible, setToastVisible] = useState(false);

  // Load saved prayer points from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("savedPrayers") || "[]");
    setSavedPoints(saved.map((p) => p.prayerPoint));
  }, []);

  // Update tab title dynamically
  useEffect(() => {
    if (bookTitle && chapterNumber && verseNumber) {
      document.title = `${bookTitle} – ${chapterNumber}:${verseNumber}`;
    }
  }, [bookTitle, chapterNumber, verseNumber]);

  // Track verse visit in history
  usePageLogger({
    title: `${bookTitle} ${chapterNumber}:${verseNumber}`,
    type: "verse",
    reference: `${bookTitle} ${chapterNumber}:${verseNumber}`,
    content: "Viewed Bible verse details and reflections",
    category: "Bible Study"
  });

  // Example verse data
  const verseData = {
    themeFocus: "God's Guidance in Decisions",
    reference: `${bookTitle} ${chapterNumber}:${verseNumber}`,
    reflection:
      "This verse reminds us to fully rely on God when making important choices, trusting that His plan is greater than ours.",
    keyLessons: [
      "Trust in God's timing",
      "Avoid leaning on human understanding",
      "Seek God in all decisions",
    ],
    prayerPoints: [
      "Lord, guide me in every decision I take",
      "Help me to trust Your wisdom over mine",
    ],
    closingPrayer:
      "Father, I commit my path into Your hands. Lead me always in truth. Amen.",
  };

  // Save prayer point
  const handleSavePoint = (point) => {
    const saved = JSON.parse(localStorage.getItem("savedPrayers") || "[]");

    const newEntry = {
      id: Date.now() + Math.random(),
      title: `Prayer for ${verseData.reference}`,
      content: point,
      themeFocus: verseData.themeFocus,
      verse: verseData.reference,
      prayerPoint: point,
      savedAt: Date.now(),
    };

    saved.push(newEntry);
    localStorage.setItem("savedPrayers", JSON.stringify(saved));
    setSavedPoints((prev) => [...prev, point]);
    showToast("Prayer point saved successfully ✅");

    // Log to history when user saves a prayer point
    logPrayer(
      `Prayer Point Saved`,
      point,
      verseData.reference
    );
  };

  // Check if point is already saved
  const isSaved = (point) => savedPoints.includes(point);

  // Toast notification
  const showToast = (message) => {
    setToastMessage(message);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-20 lg:pl-[224px] pb-12">
      {/* Toast */}
      {toastVisible && (
        <div className="fixed top-24 right-6 bg-white shadow-lg rounded-lg px-4 py-3 border-l-4 border-green-500 z-50 animate-slide-in">
          <span className="text-gray-800 font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Banner */}
      <div className="relative w-full h-48 md:h-64 flex items-center justify-center text-white">
        <img
          src={banner}
          alt="Bible Banner"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <h1 className="relative z-10 text-2xl md:text-3xl font-bold text-center px-4">
          {bookTitle} – Chapter {chapterNumber}, Verse {verseNumber}
        </h1>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 -mt-12 relative z-10">
        <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-100">
          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 mb-6 text-[#0C2E8A] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Chapter
          </button>

          {/* Theme */}
          <h2 className="text-xl font-bold text-[#0C2E8A] mb-4">{verseData.themeFocus}</h2>
          <p className="text-gray-600 italic mb-6">Reference: {verseData.reference}</p>

          {/* Reflection */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-lg font-semibold text-[#0C2E8A] mb-2">Reflection</h3>
            <p className="text-gray-700 leading-relaxed">{verseData.reflection}</p>
          </motion.div>

          {/* Key Lessons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold text-[#0C2E8A] mb-2">Key Lessons</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              {verseData.keyLessons.map((lesson, i) => (
                <li key={i}>{lesson}</li>
              ))}
            </ul>
          </motion.div>

          {/* Prayer Points */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-lg font-semibold text-[#0C2E8A] mb-2 flex items-center gap-2">
              Prayer Points
            </h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              {verseData.prayerPoints.map((point, i) => (
                <li key={i} className="flex justify-between items-center">
                  <span>{point}</span>
                  <button
                    onClick={() => handleSavePoint(point)}
                    title={isSaved(point) ? "Already saved" : "Save prayer point"}
                  >
                    <Bookmark
                      className={`w-6 h-6 transition-transform ${
                        isSaved(point)
                          ? "text-yellow-500 scale-110 font-bold"
                          : "text-gray-400 hover:text-yellow-500"
                      }`}
                    />
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Closing Prayer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-lg font-semibold text-[#0C2E8A] mb-2">Closing Prayer</h3>
            <p className="text-gray-700 leading-relaxed">{verseData.closingPrayer}</p>
          </motion.div>
        </div>
      </div>

      {/* Animations */}
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

export default VerseDetails;