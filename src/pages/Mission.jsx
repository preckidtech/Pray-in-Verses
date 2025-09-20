import React from "react";
import {
  Target,
  Compass,
  Globe,
  Lightbulb,
  Users,
  Heart,
  BookOpen,
  Star,
  ArrowRight,
} from "lucide-react";

export default function Mission() {
  const coreValues = [
    {
      icon: BookOpen,
      title: "Scripture Foundation",
      description:
        "Every feature, prayer, and interaction is built upon the solid foundation of Biblical truth.",
      color: "from-blue-700 to-blue-800",
    },
    {
      icon: Heart,
      title: "Authentic Connection",
      description:
        "Fostering genuine relationships between believers and their Creator through heartfelt prayer.",
      color: "from-red-600 to-pink-600",
    },
    {
      icon: Users,
      title: "Community Unity",
      description:
        "Building bridges between believers worldwide, creating a global family united in faith.",
      color: "from-green-600 to-emerald-600",
    },
    {
      icon: Star,
      title: "Excellence in Service",
      description:
        "Delivering exceptional spiritual tools that honor God and serve His people with distinction.",
      color: "from-yellow-500 to-orange-500",
    },
  ];

  const initiatives = [
    {
      title: "Global Prayer Network",
      description:
        "Connecting believers across continents for unified prayer and spiritual support.",
      impact: "150+ Countries Reached",
      icon: Globe,
    },
    {
      title: "Youth Prayer Movement",
      description:
        "Empowering the next generation with Scripture-based prayer habits and spiritual disciplines.",
      impact: "25K+ Young Believers",
      icon: Users,
    },
    {
      title: "Multilingual Access",
      description:
        "Breaking language barriers to make prayer resources accessible to all nations and tongues.",
      impact: "12 Languages Supported",
      icon: BookOpen,
    },
  ];

  const goals = [
    {
      year: "2024",
      title: "Community Expansion",
      description:
        "Reach 100,000 active users and launch advanced community features",
      status: "In Progress",
    },
    {
      year: "2025",
      title: "Global Outreach",
      description:
        "Expand to 25 languages and establish regional prayer leaders",
      status: "Planned",
    },
    {
      year: "2026",
      title: "Educational Integration",
      description:
        "Partner with seminaries and churches for structured prayer education",
      status: "Vision",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50 lg:ml-40 pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-6">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-700 to-blue-800 rounded-full mb-6 shadow-lg">
            <Target className="w-8 h-8 text-yellow-100" />
          </div>
          <h1 className="text-3xl font-semibold text-gray-900 mb-4 leading-tight">
            Our{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-blue-600">
              Mission
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            To revolutionize the way believers engage with prayer by seamlessly
            weaving Scripture into every spiritual conversation with God.
          </p>
        </div>

        {/* Mission Statement */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 md:p-10 mb-12">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
              <Compass className="w-4 h-4 mr-2" />
              Our Mission Statement
            </div>
            <blockquote className="text-xl font-medium text-gray-900 leading-relaxed mb-6">
              "To empower believers worldwide with Scripture-centered prayer
              tools that deepen their relationship with God, strengthen their
              faith community, and transform their spiritual journey."
            </blockquote>
            <div className="w-16 h-1 bg-gradient-to-r from-blue-700 to-yellow-500 mx-auto rounded-full"></div>
          </div>
        </div>

        {/* Core Values */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-center text-gray-900 mb-3">
            Our Core Values
          </h2>
          <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
            These fundamental principles guide every decision we make and every
            feature we build.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {coreValues.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 group"
                >
                  <div
                    className={`w-12 h-12 bg-gradient-to-r ${value.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Current Initiatives */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-center text-gray-900 mb-8">
            Current Initiatives
          </h2>
          <div className="space-y-6">
            {initiatives.map((initiative, index) => {
              const Icon = initiative.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-700 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-yellow-100" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-lg font-medium text-gray-900">
                            {initiative.title}
                          </h3>
                          <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                            {initiative.impact}
                          </div>
                        </div>
                        <p className="text-gray-600 leading-relaxed">
                          {initiative.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Future Goals */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-center text-gray-900 mb-8">
            Our Roadmap
          </h2>
          <div className="space-y-4">
            {goals.map((goal, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex items-center space-x-4">
                  <div className="text-xl font-semibold text-blue-700 bg-blue-100 rounded-full w-14 h-14 flex items-center justify-center">
                    {goal.year}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-medium text-gray-900">
                        {goal.title}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          goal.status === "In Progress"
                            ? "bg-blue-100 text-blue-800"
                            : goal.status === "Planned"
                            ? "bg-orange-100 text-orange-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {goal.status}
                      </span>
                    </div>
                    <p className="text-gray-600">{goal.description}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-blue-700 to-blue-800 rounded-xl p-8 md:p-10 text-white text-center">
          <div className="max-w-3xl mx-auto">
            <Lightbulb className="w-14 h-14 mx-auto mb-4 text-yellow-200" />
            <h2 className="text-2xl font-semibold mb-4 text-yellow-100">Join Our Mission</h2>
            <p className="text-lg mb-6 text-blue-100 leading-relaxed">
              Every prayer offered, every verse shared, and every heart touched
              brings us closer to our vision of a world transformed by
              Scripture-centered prayer. Be part of this divine movement.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 bg-yellow-500 text-blue-900 rounded-full font-medium hover:bg-yellow-400 transition-colors duration-300 flex items-center justify-center">
                <Users className="w-5 h-5 mr-2" />
                Join Our Community
              </button>
              <button className="px-8 py-3 border-2 border-blue-300 text-blue-100 rounded-full font-medium hover:bg-blue-600 transition-all duration-300 flex items-center justify-center">
                <Heart className="w-5 h-5 mr-2" />
                Support Our Mission
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}