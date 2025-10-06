import React from "react";
import { getDefaultAboutContent } from "../data/defaultContent";
import { Info, BookOpen, Users, CheckCircle2 } from "lucide-react";

export default function About() {
  const content = getDefaultAboutContent();

  return (
    <div className="pt-20 pb-8 md:ml-56 bg-gray-50 min-h-screen font-['Poppins']">
      {/* Hero Section */}
      <section className=" text-white px-8 py-5">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-xl text-[#0C2E8A] font-bold">{content.hero.title}</h1>
          <h2 className="text-sm mt-1 font-semibold text-yellow-300">
            {content.hero.highlight}
          </h2>
          <p className="italic text-sm text-[#FCCF3A]  max-w-2xl mx-auto">
            {content.hero.description}
          </p>
          <p className="text-gray-700 text-base">
            {content.hero.motivation} <strong>Luke 18: 1</strong>
          </p>
          <p className="text-gray-600 text-base mt-10 ">
            {content.hero.about}
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-8 px-8">
        <h2 className="text-base font-bold text-center mb-10">What You Will Get</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {content.features.map((feature, idx) => (
            <div
              key={idx}
              className="bg-gray-50 rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle2 size={24} className="text-blue-600" />
                <h3 className="text-lg font-semibold">{feature.title}</h3>
              </div>
              <p className=" text-sm md:text-[16px]  text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-16 px-8 max-w-5xl mx-auto">
        <h2 className="text-base font-bold mb-4 flex items-center gap-3">
          <Users size={20} className="text-blue-600" /> {content.vision.title}
        </h2>
        <p className="text-gray-700 text-sm md:text-[16px] leading-relaxed">
          {content.vision.description}
        </p>
      </section>
    </div>
  );
}
