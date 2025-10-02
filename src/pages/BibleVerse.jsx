import React from "react";
import { useParams } from "react-router-dom";
import { usePageLogger } from "../hooks/usePageLogger";

const BibleVerse = () => {
  const { bookSlug, chapterNumber, verseNumber } = useParams();

  const formatTitleFromSlug = (s) =>
    String(s || "")
      .split("-")
      .map((t) => (t.length > 0 ? t.charAt(0).toUpperCase() + t.slice(1).toLowerCase() : ""))
      .join(" ");

  const bookTitle = bookSlug ? formatTitleFromSlug(bookSlug) : "Unknown Book";

  usePageLogger({
    title: bookTitle,
    type: "verse",
    reference: `/book/${bookSlug}/chapter/${chapterNumber}/verse/${verseNumber}`,
    content: "",
    category: "Bible Verses"
  });

  return (
    <div className="min-h-screen pt-[100px] p-4 bg-gray-50">
      <h1 className="text-xl font-bold text-[#0C2E8A]">
        {bookTitle} – Chapter {chapterNumber}, Verse {verseNumber}
      </h1>
      <p className="mt-4">Verse content will appear here.</p>
    </div>
  );
};

export default BibleVerse;
