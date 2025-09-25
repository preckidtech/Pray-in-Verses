import React from "react";
import { useVerseStore } from "../store";
import Button from "../components/ui/Button";
import FeaturedVerseCards from "../components/ui/FeaturedVerseCards";
import QuickActionsGrid from "../components/ui/QuickActionsGrid";
import SuggestedVerses from "../components/ui/SuggestedVerses";
import { Link } from "react-router-dom";


import welcomeBg from "../assets/images/home/hero/a-group-of-young-christians-holding-hands-in-praye-2025-03-26-18-07-58-utc.jpg";

const Home = () => {
  const verseOfDay = useVerseStore((s) => s.verseOfDay) || {
    reference: "John 3:16",
    text: "For God so loved the world...",
  };

  return (
    <div className="flex bg-gradient-to-br from-blue-50 via-white to-yellow-50 min-h-screen pt-20 font-['Poppins']">
      {/* Sidebar Spacer */}
      <div className="hidden lg:block w-56"></div>

      {/* Main Content */}
      <main className="flex-1 space-y-10 px-4 lg:px-6 pb-10 max-w-7xl">
        {/* Welcome Section */}
        <section
          className="relative rounded-xl overflow-hidden shadow-lg border border-gray-100"
          style={{
            backgroundImage: `url(${welcomeBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 to-blue-800/60" />
          <div className="relative p-8 lg:p-12 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 text-white">
            <div className="flex-1 max-w-2xl">
              <h1 className="text-2xl lg:text-3xl font-semibold mb-4 leading-tight text-yellow-50">
                Welcome to Pray in Verses
              </h1>
              <p className="text-base lg:text-lg leading-relaxed text-blue-100 font-normal">
                Turn every verse into prayers
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="text-sm font-medium text-yellow-200 mb-2">
                Today's Verse
              </div>
              <div className="text-white font-medium">
                {verseOfDay.reference}
              </div>
            </div>
          </div>
        </section>

        {/* Featured Verses */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 tracking-wide">
              Today's Featured Verse
            </h2>
            <div className="w-12 h-0.5 bg-gradient-to-r from-blue-600 to-yellow-500 rounded-full"></div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-1">
            <FeaturedVerseCards />
          </div>
        </section>

        {/* Quick Actions */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 tracking-wide">
              Quick Actions
            </h2>
            <div className="w-12 h-0.5 bg-gradient-to-r from-green-600 to-blue-500 rounded-full"></div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <QuickActionsGrid />
          </div>
        </section>

        {/* Popular Scriptures */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 tracking-wide">
              Popular Scriptures
            </h2>
            <div className="w-12 h-0.5 bg-gradient-to-r from-yellow-500 to-red-400 rounded-full"></div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-1">
            <SuggestedVerses />
          </div>
        </section>

        {/* Scripture Foundation Call-to-Action */}
        <section className="bg-gradient-to-r from-blue-700 to-blue-800 rounded-xl shadow-lg text-white p-8 lg:p-10 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4 text-yellow-100">
              Build Your Prayer Life on Scripture
            </h2>
            <p className="text-lg leading-relaxed text-blue-100 mb-6 font-normal">
              Every prayer begins with God's Word. Let Scripture guide your
              conversations with the Divine and transform your spiritual
              journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {/* ✅ Explore Prayers Link */}
              <Link
                to="/browse-prayers"
                className="px-6 py-3 bg-yellow-500 text-blue-900 rounded-lg font-medium hover:bg-yellow-400 transition-colors duration-300 shadow-lg text-center"
              >
                Explore Prayers
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
