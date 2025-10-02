// src/pages/ChapterPage.jsx
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { usePageLogger } from "../hooks/usePageLogger";

const ChapterPage = () => {
  const { bookSlug, chapterNumber } = useParams();
  const navigate = useNavigate();

  const formatTitleFromSlug = (s) =>
    String(s || "")
      .split("-")
      .map((t) => (t.length > 0 ? t.charAt(0).toUpperCase() + t.slice(1).toLowerCase() : ""))
      .join(" ");

  const bookTitle = bookSlug ? formatTitleFromSlug(bookSlug) : "Unknown Book";
  const chapters = Array.from({ length: 30 }, (_, i) => i + 1);

  useEffect(() => {
    if (bookTitle && chapterNumber) {
      document.title = `${bookTitle} – Chapter ${chapterNumber}`;
    }
  }, [bookTitle, chapterNumber]);

  // Track page visit
  usePageLogger({
    title: `${bookTitle} Chapter ${chapterNumber}`,
    type: "page",
    reference: `${bookTitle} ${chapterNumber}`,
    content: `Browsing verses in ${bookTitle} Chapter ${chapterNumber}`,
    category: "Bible Study"
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 pt-[100px] px-4 lg:pl-[224px] lg:pr-6 lg:pb-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white shadow-sm border border-gray-200 text-[#0C2E8A] font-medium transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <h1 className="text-lg sm:text-2xl font-bold text-[#0C2E8A] text-center truncate">
            {bookTitle} – Chapter {chapterNumber}
          </h1>
          <div className="w-20" />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.01 }}
          className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-14 xl:grid-cols-16 gap-1 justify-items-center"
        >
          {chapters.map((verse) => (
            <motion.div key={verse} whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.98 }}>
              <Link to={`/book/${bookSlug}/chapter/${chapterNumber}/verse/${verse}`} aria-label={`Verse ${verse}`}>
                <div className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-full bg-white shadow-sm border border-gray-200 text-[#0C2E8A] font-semibold text-sm sm:text-base transition transform hover:-translate-y-0.5 hover:bg-[#0C2E8A] hover:text-white cursor-pointer">
                  {verse}
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default ChapterPage;