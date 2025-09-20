import React from "react";
import { useParams } from "react-router-dom";
import { useVerseStore } from "../store";

const VerseDetails = () => {
  const { id } = useParams();
  const verses = useVerseStore((s) => s.verses);
  const verse = verses.find(v => v.id === id) || useVerseStore((s)=>s.verseOfDay);

  return (
    <div className="bg-white p-6 rounded shadow-sm">
      <h2 className="text-2xl font-semibold mb-2">{verse.reference}</h2>
      <p className="text-gray-700">{verse.text}</p>
    </div>
  );
};

export default VerseDetails;
