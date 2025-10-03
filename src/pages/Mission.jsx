import React from "react";
import { getDefaultMissionContent } from "../data/defaultContent";
import { Info, BookOpen, Users, CheckCircle2 } from "lucide-react";

export default function Mission() {
  const content = getDefaultMissionContent();

  return (
    <div className="md:ml-56 pt-16 bg-gray-50 min-h-screen font-['Poppins']">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#0C2E8A] to-[#0C2E8A] text-white py-20 px-8">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl font-bold">{content.hero.title}</h1>
          <h2 className="text-2xl mt-2 font-semibold text-yellow-300">
            {content.hero.highlight}
          </h2>
          <p className="mt-4 text-lg max-w-2xl mx-auto">
            {content.hero.description}
          </p>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-16 px-8 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
          <BookOpen size={28} className="text-[#0C2E8A]" /> Mission Statement
        </h2>
        <p className="text-gray-700 leading-relaxed">
          {content.missionStatement}
        </p>
      </section>

      {/* Core Values */}
      <section className="bg-white py-16 px-8">
        <h2 className="text-3xl font-bold text-center mb-10">Core Values</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {content.coreValues.map((value, idx) => (
            <div
              key={idx}
              className="bg-gray-50 rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle2 size={24} className="text-[#0C2E8A]" />
                <h3 className="text-xl font-semibold">{value.title}</h3>
              </div>
              <p className="text-gray-600">{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Initiatives Section */}
      <section className="py-16 px-8 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
          <Users size={28} className="text-[#0C2E8A]" /> Initiatives
        </h2>
        <div className="space-y-6">
          {content.initiatives.map((initiative, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
            >
              <h3 className="text-2xl font-bold">{initiative.title}</h3>
              <p className="mt-2 text-gray-700">{initiative.description}</p>
              <p className="mt-2 font-semibold text-[#0C2E8A]">
                {initiative.impact}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Goals Section */}
      <section className="bg-gradient-to-r from-[#0C2E8A] to-[#0C2E8A] text-white py-16 px-8">
        <h2 className="text-3xl font-bold text-center mb-10">Goals</h2>
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          {content.goals.map((goal, idx) => (
            <div
              key={idx}
              className="bg-white text-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-bold">
                {goal.year} - {goal.title}
              </h3>
              <p className="mt-2">{goal.description}</p>
              <span className="mt-2 inline-block px-3 py-1 bg-[#0C2E8A] text-white rounded-full text-xs">
                {goal.status}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
