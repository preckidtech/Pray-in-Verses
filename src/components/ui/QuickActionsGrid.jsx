import React from "react";
import {
  BookOpen,
  Bell,
  Book,
  Heart,
  CheckCircle,
  Calendar,
  Play,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

// Define actions in the order that makes sense for user workflow
const actions = [
  { title: "Browse by Book", icon: BookOpen, path: "/browse-prayers" },
  { title: "Daily Verse", icon: Calendar, path: "/" },
  { title: "Pray Now", icon: Play, path: "/" },
  { title: "Prayer Reminders", icon: Bell, path: "/reminders" },
  { title: "My Journal", icon: Book, path: "/journal" },
  { title: "Saved Prayer", icon: Heart, path: "/saved-prayers" },
  { title: "Answered Prayers", icon: CheckCircle, path: "/answered-prayers" },
];

const QuickActionsGrid = () => (
  <div className="flex flex-wrap justify-between gap-4">
    {actions.map((action, index) => {
      const Icon = action.icon;
      return (
        <div
          key={index}
          className="flex-1 min-w-[120px] max-w-[160px] bg-gray-50 p-4 flex flex-col items-center justify-center shadow hover:shadow-md cursor-pointer transition rounded-none"
          // Placeholder for real functionality
        >
          <Link to={action.path} />
          <Icon size={28} className="text-blue-500 mb-2" />
          <span className="text-gray-900 font-medium text-sm text-center">
            {action.title}
          </span>
          
        </div>
      );
    })}
  </div>
);

export default QuickActionsGrid;
