import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { getBookName, getVersesInChapter, isValidReference } from "../data/bibleStructure";

const ChapterPage = () => {
  const { bookSlug, chapterNumber } = useParams();
  const navigate = useNavigate();

  // Get actual book name from Bible structure
  const bookTitle = getBookName(bookSlug) || "Unknown Book";
  
  // Get accurate number of verses for this specific chapter
  const verseCount = getVersesInChapter(bookSlug, parseInt(chapterNumber));
  
  // Validate the reference
  const isValid = isValidReference(bookSlug, chapterNumber);

  useEffect(() => {
    if (bookTitle && chapterNumber) {
      document.title = `${bookTitle} – Chapter ${chapterNumber}`;
    }
  }, [bookTitle, chapterNumber]);

  // If invalid reference, show error
  if (!isValid || verseCount === 0) {
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
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h2 className="text-xl font-semibold text-red-800 mb-2">Invalid Reference</h2>
            <p className="text-red-600">
              {bookSlug && bookTitle !== "Unknown Book" 
                ? `Chapter ${chapterNumber} does not exist in ${bookTitle}.`
                : `The book "${bookSlug}" was not found.`}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Generate verses array based on actual verse count
  const verses = Array.from({ length: verseCount }, (_, i) => i + 1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 pt-[100px] px-4 lg:pl-[224px] lg:pr-6 lg:pb-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white shadow-sm border border-gray-200 text-[#0C2E8A] font-medium transition hover:bg-gray-50"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <h1 className="text-base font-semibold text-[#0C2E8A] text-center truncate">
            {bookTitle} – Chapter {chapterNumber}
          </h1>
          <div className="text-xs text-gray-500 w-20 text-right">
            {verseCount} verses
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.01 }}
          className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-14 xl:grid-cols-16 gap-1 justify-items-center"
        >
          {verses.map((verse) => (
            <motion.div 
              key={verse} 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: verse * 0.005 }}
              whileHover={{ scale: 1.06 }} 
              whileTap={{ scale: 0.98 }}
            >
              <Link 
                to={`/book/${bookSlug}/chapter/${chapterNumber}/verse/${verse}`} 
                aria-label={`${bookTitle} Chapter ${chapterNumber} Verse ${verse}`}
              >
                <div className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-full bg-white shadow-sm border border-gray-200 text-[#0C2E8A] font-semibold text-sm sm:text-base transition transform hover:-translate-y-0.5 hover:bg-[#0C2E8A] hover:text-white cursor-pointer">
                  {verse}
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Info section */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>Select a verse to view its content and study notes</p>
        </div>
      </div>
    </div>
  );
};

export default ChapterPage;