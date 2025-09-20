import React from "react";
import { Play, Bookmark, Share2, Star } from "lucide-react";

const DailyPrayerVerse = () => (
  <div className="bg-gradient-to-r from-blue-400 to-purple-600 rounded-lg p-6 text-white">
    <div className="flex items-center gap-2 mb-4">
      <Star size={16} className="text-yellow-300" />
      <span className="text-sm opacity-90">Today's Prayer Verse</span>
    </div>
    <h1 className="text-2xl font-bold mb-4">Philippians 4:6</h1>
    <p className="mb-6 text-lg">"Be anxious for nothing..."</p>
    <div className="flex gap-3">
      <button className="bg-white bg-opacity-20 px-4 py-2 rounded">Pray Now</button>
      <button className="bg-white bg-opacity-20 px-4 py-2 rounded">Save to Journal</button>
      <button className="bg-white bg-opacity-20 px-4 py-2 rounded">Share</button>
    </div>
  </div>
);

export default DailyPrayerVerse;
