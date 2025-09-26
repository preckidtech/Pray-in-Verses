// src/pages/VerseDetails.jsx
import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import banner from "../assets/images/suggest/two-lovers-studying-the-bible-it-is-god-s-love-for-2022-06-18-20-18-08-utc.jpg";

const VerseDetails = () => {
  const { bookSlug, chapterNumber, verseNumber } = useParams(); // ✅ FIXED param names
  const navigate = useNavigate();

  // ✅ Format book title from slug
  const formatTitleFromSlug = (s) =>
    String(s || "")
      .split("-")
      .map((t) =>
        t.length > 0 ? t.charAt(0).toUpperCase() + t.slice(1).toLowerCase() : ""
      )
      .join(" ");

  const bookTitle = bookSlug ? formatTitleFromSlug(bookSlug) : "Unknown Book";

  // ✅ Update browser tab title
  useEffect(() => {
    if (bookTitle && chapterNumber && verseNumber) {
      document.title = `${bookTitle} – Chapter ${chapterNumber}, Verse ${verseNumber}`;
    }
  }, [bookTitle, chapterNumber, verseNumber]);

  // Example placeholder verse data (replace with API later)
  const verseData = {
    themeFocus: "God’s Guidance in Decisions",
    reference: `${bookTitle} ${chapterNumber}:${verseNumber}`,
    reflection:
      "This verse reminds us to fully rely on God when making important choices, trusting that His plan is greater than ours.",
    keyLessons: [
      "Trust in God’s timing",
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-20 lg:pl-[224px] pb-12">
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
          {/* Back */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 mb-6 text-[#0C2E8A] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Chapter
          </button>

          {/* Theme */}
          <h2 className="text-xl font-bold text-[#0C2E8A] mb-4">
            {verseData.themeFocus}
          </h2>
          <p className="text-gray-600 italic mb-6">
            Reference: {verseData.reference}
          </p>

          {/* Reflection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <h3 className="text-lg font-semibold text-[#0C2E8A] mb-2">
              Reflection
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {verseData.reflection}
            </p>
          </motion.div>

          {/* Key Lessons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <h3 className="text-lg font-semibold text-[#0C2E8A] mb-2">
              Key Lessons
            </h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              {verseData.keyLessons.map((lesson, i) => (
                <li key={i}>{lesson}</li>
              ))}
            </ul>
          </motion.div>

          {/* Prayer Points */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-6"
          >
            <h3 className="text-lg font-semibold text-[#0C2E8A] mb-2">
              Prayer Points
            </h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              {verseData.prayerPoints.map((point, i) => (
                <li key={i}>{point}</li>
              ))}
            </ul>
          </motion.div>

          {/* Closing Prayer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-lg font-semibold text-[#0C2E8A] mb-2">
              Closing Prayer
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {verseData.closingPrayer}
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default VerseDetails;
