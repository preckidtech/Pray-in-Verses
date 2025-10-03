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
import { Link } from "react-router-dom";

const actions = [
  { title: "Bookmark", icon: BookOpen, path: "/bookmarks" },
  // { title: "Daily Verse", icon: Calendar, path: "/" },
  { title: "Explore Prayers", icon: Play, path: "/browse-prayers" },
  { title: "Prayer Reminders", icon: Bell, path: "/reminders" },
  { title: "My Journal", icon: Book, path: "/journal" },
  { title: "Saved Prayer", icon: Heart, path: "/saved-prayers" },
  { title: "Answered Prayers", icon: CheckCircle, path: "/answered-prayers" },
];

const QuickActionsGrid = () => (
  <div className="flex flex-wrap justify-between gap-2 md:gap-4">
    {actions.map((action, index) => {
      const Icon = action.icon;
      return (
        <Link
          to={action.path}
          key={index}
          className="flex-1 min-w-[120px] max-w-[160px] bg-gray-50 p-2 flex flex-col items-center justify-center shadow hover:shadow-md cursor-pointer transition rounded-lg"
        >
          <Icon size={20} className="text-blue-500 mb-2" />
          <span className="text-gray-900 font-medium text-sm text-center">
            {action.title}
          </span>
        </Link>
      );
    })}
  </div>
);

export default QuickActionsGrid;
