import React from "react";
import { Flame } from "lucide-react";

const PrayerStreakCard = ({ streakDays = 5 }) => (
  <div className=" w-full h-full bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 rounded-lg p-4 text-white shadow-lg flex flex-col items-center justify-center max-w-xs mx-auto">
    <div className="flex justify-center mb-3">
      <div className="bg-white bg-opacity-20 rounded-full p-2">
        <Flame size={28} className="text-white" />
      </div>
    </div>
    <h3 className="text-center text-lg font-semibold mb-2">Prayer Streak</h3>
    <div className="text-center">
      <div className="text-3xl font-bold">{streakDays}</div>
      <div className="text-sm opacity-90">days in a row</div>
    </div>
    <div className="text-center text-sm opacity-90 mt-2">Keep it going!</div>
  </div>
);

export default PrayerStreakCard;
