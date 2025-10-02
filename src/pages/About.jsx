import React from "react";
import { getDefaultAboutContent } from "../data/defaultContent";
import { Info, BookOpen, Users, CheckCircle2 } from "lucide-react";

export default function About() {
  const content = getDefaultAboutContent();

  return (
    <div className="md:ml-56 pt-16 bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20 px-8">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl font-bold">{content.hero.title}</h1>
          <h2 className="text-2xl mt-2 font-semibold text-yellow-300">
            {content.hero.highlight}
          </h2>
          <p className="mt-4 text-lg max-w-2xl mx-auto">{content.hero.description}</p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 px-8 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
          <Info size={28} className="text-blue-600" /> {content.story.title}
        </h2>
        {content.story.paragraphs.map((para, idx) => (
          <p key={idx} className="mb-4 text-gray-700 leading-relaxed">
            {para}
          </p>
        ))}
        <blockquote className="border-l-4 border-blue-600 pl-4 italic text-gray-800 mt-6">
          "{content.story.quote}" — <span className="font-semibold">{content.story.quoteAuthor}</span>
        </blockquote>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16 px-8">
        <h2 className="text-3xl font-bold text-center mb-10">Our Features</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {content.features.map((feature, idx) => (
            <div key={idx} className="bg-gray-50 rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle2 size={24} className="text-blue-600" />
                <h3 className="text-xl font-semibold">{feature.title}</h3>
              </div>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white py-16 px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {content.stats.map((stat, idx) => (
            <div key={idx}>
              <h3 className="text-3xl font-bold">{stat.number}</h3>
              <p className="mt-2">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-16 px-8 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
          <Users size={28} className="text-blue-600" /> {content.vision.title}
        </h2>
        <p className="text-gray-700 leading-relaxed">{content.vision.description}</p>
      </section>
    </div>
  );
}
