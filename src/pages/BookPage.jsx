import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { chapterCounts } from "../utils/bible";
import { usePageLogger } from "../hooks/usePageLogger";

const BookPage = () => {
  const { bookSlug } = useParams();
  const navigate = useNavigate();

  if (!bookSlug) {
    return (
      <div className="min-h-screen pt-[100px] p-4 bg-gray-50">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-red-600 font-semibold mb-4">
            Book not specified in URL.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-white rounded-md border shadow-sm"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  const formatTitleFromSlug = (s) =>
    String(s || "")
      .split("-")
      .map((t) =>
        t.length ? t.charAt(0).toUpperCase() + t.slice(1).toLowerCase() : ""
      )
      .join(" ");

  const bookTitle = formatTitleFromSlug(bookSlug);

  const chaptersTotal = chapterCounts[bookTitle] ?? 50;
  const chapters = Array.from({ length: chaptersTotal }, (_, i) => i + 1);

  useEffect(() => {
    if (bookTitle) document.title = `${bookTitle} – Book`;
  }, [bookTitle]);

  // Log this page visit
  usePageLogger(bookTitle, "book", `/book/${bookSlug}`, "", "Bible Books");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 
      pt-[100px] px-4 lg:pl-[224px] lg:pr-6 lg:pb-8">
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
            {bookTitle}
          </h1>
          <div className="w-20" />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.01 }}
          className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-14 xl:grid-cols-16 gap-1 justify-items-center"
        >
          {chapters.map((chapter) => (
            <motion.div
              key={chapter}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                to={`/book/${bookSlug}/chapter/${chapter}`}
                aria-label={`Chapter ${chapter}`}
              >
                <div className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-full bg-white shadow-sm border border-gray-200 text-[#0C2E8A] font-semibold text-sm sm:text-base transition transform hover:-translate-y-0.5 hover:bg-[#0C2E8A] hover:text-white cursor-pointer">
                  {chapter}
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default BookPage;
