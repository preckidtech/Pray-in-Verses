import React from "react";
import { Heart, BookOpen, Users, Shield, Star, Zap } from "lucide-react";

export default function About() {
  const features = [
    {
      icon: BookOpen,
      title: "Scripture-Centered",
      description:
        "Every prayer is rooted in biblical verses, connecting your heart to God's eternal truth.",
    },
    {
      icon: Heart,
      title: "Personal Journey",
      description:
        "Track your spiritual growth with personalized prayer journals and progress insights.",
    },
    {
      icon: Users,
      title: "Community Support",
      description:
        "Join a loving community of believers sharing prayers, testimonies, and encouragement.",
    },
    {
      icon: Shield,
      title: "Safe & Sacred",
      description:
        "Your prayers and personal reflections are protected in a secure, reverent environment.",
    },
  ];

  const stats = [
    { number: "50K+", label: "Active Users", icon: Users },
    { number: "1M+", label: "Prayers Offered", icon: Heart },
    { number: "10K+", label: "Verses Explored", icon: BookOpen },
    { number: "95%", label: "User Satisfaction", icon: Star },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50 lg:ml-[224px] pt-20 pb-12 font-['Poppins']">
      <div className="max-w-6xl mx-auto px-6">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-700 to-blue-800 rounded-full mb-6 shadow-lg">
            <BookOpen className="w-8 h-8 text-yellow-100" />
          </div>
          <h1 className="text-3xl font-semibold text-gray-900 mb-4 leading-tight">
            About{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-blue-600">
              Pray the Bible
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed font-normal">
            Connecting hearts to heaven through the timeless wisdom of
            Scripture. Your digital sanctuary for prayer, reflection, and
            spiritual growth rooted in God's Word.
          </p>
        </div>

        {/* Story Section */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 md:p-10 mb-12">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
                <Zap className="w-4 h-4 mr-2" />
                Our Story
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Born from a Heart for Prayer
              </h2>
              <p className="text-gray-600 mb-4 leading-relaxed font-normal">
                Pray the Bible was born from a simple yet profound realization:
                prayer becomes more meaningful when anchored in God's own words.
                We believe that Scripture-based prayer transforms not just our
                requests, but our entire relationship with the Divine.
              </p>
              <p className="text-gray-600 leading-relaxed font-normal">
                What started as a personal journey of discovery has grown into a
                platform that helps thousands of believers worldwide deepen
                their prayer life through the beautiful marriage of Scripture
                and supplication.
              </p>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-r from-blue-700 to-blue-600 rounded-xl p-6 text-white">
                <blockquote className="text-lg italic mb-3 font-normal">
                  "Your word is a lamp for my feet, a light on my path."
                </blockquote>
                <cite className="text-blue-200 font-medium">
                  — Psalm 119:105
                </cite>
              </div>
              <div className="absolute -bottom-3 -right-3 w-20 h-20 bg-yellow-400 rounded-full opacity-20"></div>
              <div className="absolute -top-3 -left-3 w-12 h-12 bg-green-400 rounded-full opacity-20"></div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-center text-gray-900 mb-8">
            Why Choose Pray the Bible?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-700 to-blue-600 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-yellow-100" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-sm font-normal">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-blue-700 to-blue-800 rounded-xl p-8 md:p-10 text-white mb-12">
          <h2 className="text-2xl font-semibold text-center mb-8 text-yellow-100">
            Growing Together in Faith
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-white bg-opacity-20 rounded-full mb-3">
                    <Icon className="w-7 h-7 text-yellow-100" />
                  </div>
                  <div className="text-xl font-semibold mb-1 text-yellow-100">{stat.number}</div>
                  <div className="text-blue-200 font-medium text-sm">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Vision Section */}
        <div className="text-center">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 md:p-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Our Vision
            </h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed mb-6 font-normal">
              We envision a world where every believer has access to meaningful,
              Scripture-based prayer resources that nurture spiritual growth,
              foster community connection, and deepen their relationship with
              God through His eternal Word.
            </p>
            <button className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-700 to-blue-600 text-white rounded-full font-medium hover:from-blue-800 hover:to-blue-700 transition-all duration-300 shadow-lg">
              <Heart className="w-5 h-5 mr-2" />
              Join Our Community
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}