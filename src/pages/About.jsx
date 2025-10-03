import React from "react";
import { getDefaultAboutContent } from "../data/defaultContent";
import { Info, BookOpen, Users, CheckCircle2 } from "lucide-react";

export default function About() {
  const content = getDefaultAboutContent();

  return (
    <div className="md:ml-56 pt-16 bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="  text-white py-20 px-8">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-3xl text-[#0C2E8A] font-bold">{content.hero.title}</h1>
          <h2 className="text-2xl mt-1 font-semibold text-yellow-300">
            {content.hero.highlight}
          </h2>
          <p className="italic text-gray-600 text-lg max-w-2xl mx-auto">
            {content.hero.description}
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16 px-8">
        <h2 className="text-3xl font-bold text-center mb-10">What You Will Get</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {content.features.map((feature, idx) => (
            <div
              key={idx}
              className="bg-gray-50 rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle2 size={24} className="text-blue-600" />
                <h3 className="text-xl font-semibold">{feature.title}</h3>
              </div>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-16 px-8 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
          <Users size={28} className="text-blue-600" /> {content.vision.title}
        </h2>
        <p className="text-gray-700 leading-relaxed">
          {content.vision.description}
        </p>
      </section>
    </div>
  );
}
