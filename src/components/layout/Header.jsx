import React, { useState, useEffect } from "react";
import {
  Menu,
  Search,
  Bell,
  User,
  Home,
  BookOpen,
  Clock,
  BookmarkCheck,
  BookMarked,
  Info,
  ChevronDown,
  Users,
  CheckCircle2,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { prayers } from "../../data/prayers";

export default function Header() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [userName, setUserName] = useState("John Smith");
  const location = useLocation();

  // Listen for profile image changes in localStorage
  useEffect(() => {
    const updateProfileData = () => {
      setProfileImage(localStorage.getItem("profileImage"));
      setUserName(localStorage.getItem("userName") || "John Smith");
    };

    // Initial load
    updateProfileData();

    // Listen for storage changes (when profile is updated)
    const handleStorageChange = (e) => {
      if (e.key === "profileImage" || e.key === "userName") {
        updateProfileData();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Also listen for manual updates within the same tab
    const handleCustomEvent = () => {
      updateProfileData();
    };

    window.addEventListener("profileUpdated", handleCustomEvent);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("profileUpdated", handleCustomEvent);
    };
  }, []);

  // ✅ Notifications State
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New Prayer Added",
      description: "Check today's new prayer in Browse section.",
      link: "/browse-prayers",
      time: "2m ago",
      read: false,
    },
    {
      id: 2,
      title: "Answered Prayer",
      description: "Your prayer 'Faith & Strength' was answered.",
      link: "/answered-prayers",
      time: "1h ago",
      read: false,
    },
    {
      id: 3,
      title: "Reminder",
      description: "Prayer reminder set for 6:00 PM.",
      link: "/reminders",
      time: "Yesterday",
      read: true,
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // ✅ Search Filter
  const filteredPrayers = searchQuery
    ? prayers.filter(
        (prayer) =>
          prayer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          prayer.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  // ✅ Mark All as Read
  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // ✅ Mark Single Notification
  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const sidebarItems = [
    { id: "dashboard", title: "Dashboard", icon: Home, path: "/home" },
    {
      id: "about",
      title: "About",
      icon: Info,
      path: "#about",
      hasDropdown: true,
    },
    {
      id: "browse-prayers",
      title: "Browse Prayers",
      icon: BookMarked,
      path: "/browse-prayers",
    },
    { id: "journal", title: "My Journal", icon: BookOpen, path: "/journal" },
    {
      id: "prayer-wall",
      title: "Prayer Wall",
      icon: Users,
      path: "/prayer-wall",
    },
    {
      id: "reminder",
      title: "Prayer Reminder",
      icon: Clock,
      path: "/reminders",
    },
    {
      id: "saved-prayers",
      title: "Saved Prayer",
      icon: BookmarkCheck,
      path: "/saved-prayers",
    },
    {
      id: "answered-prayers",
      title: "Answered Prayer",
      icon: BookmarkCheck,
      path: "/answered-prayers",
    },
    { id: "profile", title: "Profile", icon: User, path: "/profile" },
  ];

  return (
    <>
      <header className="bg-[#2c3E91] shadow-sm border-b border-gray-200 px-4 py-3 fixed top-0 left-0 w-full z-50 flex justify-between items-center">
        {/* Left: Logo & Menu */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSidebarOpen((s) => !s)}
            className="lg:hidden p-2 rounded-md hover:bg-white text-[#FCCF3A] transition-colors duration-200"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-[#FCCF3A]">Pray in Verses</h1>
        </div>

        {/* Middle: Search */}
        <div className="hidden md:flex flex-1 max-w-lg mx-4 relative">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search verse, book, keyword..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 transition-all duration-200"
            />
          </div>

          {/* Live Search Dropdown */}
          {searchQuery && (
            <div className="absolute top-12 left-0 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto z-50">
              {filteredPrayers.length > 0 ? (
                filteredPrayers.map((prayer) => (
                  <Link
                    key={prayer.id}
                    to={`/browse-prayers#${prayer.id}`}
                    className="block px-4 py-2 hover:bg-blue-50 transition"
                    onClick={() => setSearchQuery("")}
                  >
                    <h4 className="font-semibold text-sm text-gray-800">
                      {prayer.title}
                    </h4>
                    <p className="text-xs text-gray-500 truncate">
                      {prayer.content}
                    </p>
                  </Link>
                ))
              ) : (
                <div className="px-4 py-3 text-gray-500 text-sm">
                  No matching prayers found.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Notifications + User */}
        <div className="flex items-center space-x-3 relative">
          {/* Notification Bell */}
          <button
            onClick={() => setNotifOpen((n) => !n)}
            className="p-2 rounded-full hover:bg-gray-100 relative transition-colors duration-200"
          >
            <Bell className="w-6 h-6 text-white" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs flex items-center justify-center rounded-full">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {notifOpen && (
            <div className="absolute right-0 top-12 w-80 bg-white shadow-2xl rounded-xl border border-gray-200 z-50 animate-in slide-in-from-top-2 duration-200">
              {/* Header */}
              <div className="flex justify-between items-center px-4 py-3 border-b">
                <h3 className="text-sm font-semibold text-gray-700">
                  Notifications
                </h3>
                {notifications.length > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Mark all as read
                  </button>
                )}
              </div>

              {/* Notification Items */}
              <div className="max-h-72 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <Link
                      key={n.id}
                      to={n.link}
                      onClick={() => markAsRead(n.id)}
                      className={`block px-4 py-3 border-b transition ${
                        n.read
                          ? "bg-gray-50 text-gray-600"
                          : "bg-white font-medium text-gray-900"
                      } hover:bg-blue-50`}
                    >
                      <div className="flex items-start gap-3">
                        {!n.read ? (
                          <Bell className="w-5 h-5 text-blue-500 mt-0.5" />
                        ) : (
                          <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                        )}
                        <div>
                          <h4 className="text-sm">{n.title}</h4>
                          <p className="text-xs text-gray-500">
                            {n.description}
                          </p>
                          <span className="text-xs text-gray-400">
                            {n.time}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="px-4 py-6 text-center text-gray-500 text-sm">
                    No notifications
                  </div>
                )}
              </div>
            </div>
          )}

          {/* User Avatar */}
          <Link to="/profile" className="relative group">
            <div className="w-10 h-10 rounded-full overflow-hidden hover:shadow-lg transition-shadow duration-200 border-2 border-transparent hover:border-blue-200">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt={userName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
              )}
            </div>

            {/* Tooltip */}
            <div className="absolute right-0 top-12 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              {userName}
            </div>
          </Link>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={`bg-[#2c3E91] shadow-md border-r border-gray-200 h-screen fixed top-16 left-0 z-40 transform lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 w-56 flex flex-col justify-between`}
      >
        <nav className="mt-6 flex-1 relative">
          <ul className="flex flex-col items-center space-y-4">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.path !== "#" && location.pathname === item.path;

              if (item.hasDropdown) {
                return (
                  <li key={item.id} className="w-full relative">
                    <button
                      onClick={() => setAboutOpen((prev) => !prev)}
                      className={`w-full flex gap-2 pl-2 items-center py-1 transition-all duration-200 hover:bg-[#FCCF3A] rounded-md group ${
                        aboutOpen || isActive
                          ? "text-white font-semibold"
                          : "text-white"
                      }`}
                    >
                      <div className="bg rounded-full p-2 text-white group-hover:bg-[#FCCF3A] transition-colors duration-200">
                        <Icon size={14} />
                      </div>
                      <div className="flex items-center justify-between flex-1">
                        <span className="text-xs text-center">
                          {item.title}
                        </span>
                        <ChevronDown
                          size={12}
                          className={`transition-transform duration-200 ${
                            aboutOpen ? "rotate-180" : ""
                          }`}
                        />
                      </div>
                    </button>

                    {aboutOpen && (
                      <div className="absolute left-full top-0 ml-2  bg-white shadow-lg rounded-lg border border-gray-200 py-2 min-w-[140px] z-50 animate-in slide-in-from-left-2 duration-200">
                        <Link
                          to="/about"
                          className="block px-3 py-2 text-sm text-gray-700 hover:bg-blue-500 hover:text-blue-600 transition-colors duration-200"
                          onClick={() => setAboutOpen(false)}
                        >
                          About PIV
                        </Link>
                        <Link
                          to="/mission"
                          className="block px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                          onClick={() => setAboutOpen(false)}
                        >
                          Mission
                        </Link>
                      </div>
                    )}
                  </li>
                );
              }

              return (
                <li key={item.id} className="w-full">
                  <Link
                    to={item.path}
                    className={`w-full flex gap-2 pl-2 items-center py-1 transition-all duration-200 hover:bg-[#FCCF3A] rounded-md group ${
                      isActive
                        ? "text-white font-semibold bg-[#FCCF3A]"
                        : "text-white"
                    }`}
                  >
                    <div
                      className={`rounded-full p-2 text-white transition-colors duration-200 ${
                        isActive
                          ? "bg-[#3FCBFF]"
                          : "bg-pink-[#ABBC6B] group-hover:bg-gray-800"
                      }`}
                    >
                      <Icon size={14} />
                    </div>
                    <span className="text-xs text-center">{item.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </>
  );
}
