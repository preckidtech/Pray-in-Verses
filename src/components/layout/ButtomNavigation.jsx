// src/components/BottomNavigation.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, BookMarked, BookOpen, Users, Clock } from "lucide-react";

const BottomNavigation = () => {
  const location = useLocation();

  const navItems = [
    {
      id: "home",
      title: "Home",
      icon: Home,
      path: "/home",
    },
    {
      id: "prayers",
      title: "Prayers",
      icon: BookMarked,
      path: "/browse-prayers",
    },
    {
      id: "journal",
      title: "Journal",
      icon: BookOpen,
      path: "/journal",
    },
    {
      id: "prayer-wall",
      title: "Prayer Wall",
      icon: Users,
      path: "/prayer-wall",
    },
    {
      id: "reminder",
      title: "Reminder",
      icon: Clock,
      path: "/reminders",
    },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.id}
              to={item.path}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-all duration-200 ${
                isActive
                  ? "text-[#0C2E8A]"
                  : "text-gray-500 hover:text-[#0C2E8A]"
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-6 h-6 transition-all duration-200 ${
                    isActive ? "scale-110" : ""
                  }`}
                />
                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-[#FCCF3A] rounded-full" />
                )}
              </div>
              <span
                className={`text-xs mt-1 font-medium ${
                  isActive ? "text-[#0C2E8A]" : "text-gray-600"
                }`}
              >
                {item.title}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;