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
import { useAuthStore } from "../../store";
import logo from "../../assets/images/prayinverse2.png";

export default function Header() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [prayerWallOpen, setPrayerWallOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [userName, setUserName] = useState("User");
  const location = useLocation();
  const { user } = useAuthStore();

  /**
   * Get current user data from multiple sources with fallbacks
   */
  const getCurrentUser = () => {
    // First try to get from auth store
    if (user && user.id && user.name) {
      return user;
    }

    // Then try current user from localStorage
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    if (currentUser.id && currentUser.name) {
      return currentUser;
    }

    // If no current user, check if we have legacy data (backward compatibility)
    const legacyUserName = localStorage.getItem("userName");
    const legacyUserEmail = localStorage.getItem("userEmail");
    
    if (legacyUserName && legacyUserEmail) {
      // Try to find this user in the users array
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const foundUser = users.find(u => 
        u.email.toLowerCase() === legacyUserEmail.toLowerCase()
      );
      
      if (foundUser) {
        return foundUser;
      }
      
      // If not found in users array, create a basic user object
      return {
        name: legacyUserName,
        email: legacyUserEmail,
        id: legacyUserEmail
      };
    }

    return null;
  };

  /**
   * Update profile data from user information
   */
  const updateProfileData = () => {
    const currentUser = getCurrentUser();
    
    if (currentUser) {
      // Update user name
      setUserName(currentUser.name || "User");
      
      // Update profile image with multiple fallback options
      const userId = currentUser.id || currentUser.email;
      let savedProfileImage = null;
      
      // Try user ID-based storage first
      if (userId) {
        savedProfileImage = localStorage.getItem(`profileImage_${userId}`);
      }
      
      // Fallback to email-based storage for backward compatibility
      if (!savedProfileImage && currentUser.email) {
        savedProfileImage = localStorage.getItem(`profileImage_${currentUser.email}`);
      }
      
      // Final fallback to legacy storage
      if (!savedProfileImage) {
        savedProfileImage = localStorage.getItem("profileImage");
      }
      
      setProfileImage(savedProfileImage);
    } else {
      // Reset to defaults if no user found
      setUserName("User");
      setProfileImage(null);
    }
  };

  /**
   * Initialize and listen for profile updates
   */
  useEffect(() => {
    // Initial profile data load
    updateProfileData();
    
    // Listen for storage changes (when user updates profile in another tab)
    const handleStorageChange = (e) => {
      if (e.key === "profileImage" || 
          e.key === "userName" || 
          e.key === "currentUser" || 
          e.key === "userEmail" ||
          e.key?.startsWith("profileImage_")) {
        updateProfileData();
      }
    };
    
    // Listen for custom profile update events (from within the same tab)
    const handleCustomEvent = () => {
      updateProfileData();
    };
    
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("profileUpdated", handleCustomEvent);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("profileUpdated", handleCustomEvent);
    };
  }, [user]); // Re-run when user from auth store changes

  // Sample notifications data
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

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifOpen && !event.target.closest('.notification-dropdown') && !event.target.closest('.notification-button')) {
        setNotifOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [notifOpen]);

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
      path: "#prayer-wall",
      hasDropdown: true,
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
      id: "history",
      title: "History",
      icon: Clock,
      path: "/history",
    },
    {
      id: "bookmarks",
      title: "Bookmarks",
      icon: BookMarked,
      path: "/bookmarks",
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
            className="lg:hidden p-2 rounded-md hover:bg-white hover:bg-opacity-10 text-[#FCCF3A] transition-colors duration-200"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-6 h-6" />
          </button>
          <Link to="/home" className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-[#FCCF3A]">Pray in Verses</h1>
          </Link>
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
        </div>

        {/* Right: Notifications + User */}
        <div className="flex items-center space-x-3 relative">
          {/* Notification Bell */}
          <button
            onClick={() => setNotifOpen((n) => !n)}
            className="notification-button p-2 rounded-full hover:bg-white hover:bg-opacity-10 relative transition-colors duration-200"
            aria-label="Toggle notifications"
          >
            <Bell className="w-6 h-6 text-white" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs flex items-center justify-center rounded-full font-semibold">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          {notifOpen && (
            <div className="notification-dropdown absolute right-0 top-12 w-80 bg-white shadow-2xl rounded-xl border border-gray-200 z-50">
              <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100">
                <h3 className="text-sm font-semibold text-gray-700">
                  Notifications
                </h3>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-xs text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                  >
                    Mark all as read
                  </button>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <Link
                      key={n.id}
                      to={n.link}
                      onClick={() => {
                        markAsRead(n.id);
                        setNotifOpen(false);
                      }}
                      className={`block px-4 py-3 border-b border-gray-50 transition ${
                        n.read
                          ? "bg-gray-50 text-gray-600"
                          : "bg-white font-medium text-gray-900"
                      } hover:bg-blue-50 last:border-b-0`}
                    >
                      <div className="flex items-start gap-3">
                        {!n.read ? (
                          <Bell className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                        ) : (
                          <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm truncate">{n.title}</h4>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                            {n.description}
                          </p>
                          <span className="text-xs text-gray-400 mt-1 block">
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

          {/* User Profile Link */}
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
            <div className="absolute right-0 top-12 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
              {userName}
            </div>
          </Link>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={`bg-[#2c3E91] shadow-md w-56 h-screen fixed top-16 left-0 z-40 pb-28
                    border-r border-gray-200 overflow-y-auto scrollbar-thin 
                    scrollbar-thumb-gray-400 scrollbar-track-transparent 
                    transform lg:translate-x-0 
                    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
                    transition-transform duration-300 flex flex-col justify-between`}
      >
        <nav className="mt-6 flex-1 relative">
          <ul className="flex flex-col items-center space-y-4 pb-6">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.path !== "#" && item.path !== "#about" && item.path !== "#prayer-wall" && location.pathname === item.path;

              if (item.hasDropdown) {
                // About dropdown
                if (item.id === "about") {
                  return (
                    <li key={item.id} className="w-full px-2">
                      <button
                        onClick={() => setAboutOpen((prev) => !prev)}
                        className={`w-full flex items-center justify-between gap-2 px-3 py-2 transition-all duration-200 hover:bg-[#FCCF3A] hover:text-[#0C2E8A] rounded-md ${
                          aboutOpen || isActive
                            ? "text-white font-semibold"
                            : "text-white"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Icon size={14} />
                          <span className="text-xs">{item.title}</span>
                        </div>
                        <ChevronDown 
                          size={14} 
                          className={`transition-transform duration-200 ${aboutOpen ? 'rotate-180' : ''}`}
                        />
                      </button>

                      {aboutOpen && (
                        <ul className="ml-6 mt-2 space-y-2">
                          <li>
                            <Link
                              to="/about"
                              className={`block px-2 py-1 text-xs text-white hover:bg-[#3C4FA3] rounded transition-colors ${
                                location.pathname === "/about" ? "bg-[#3C4FA3] font-semibold" : ""
                              }`}
                              onClick={() => {
                                setAboutOpen(false);
                                setSidebarOpen(false);
                              }}
                            >
                              About PIV
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/mission"
                              className={`block px-2 py-1 text-xs text-white hover:bg-[#3C4FA3] rounded transition-colors ${
                                location.pathname === "/mission" ? "bg-[#3C4FA3] font-semibold" : ""
                              }`}
                              onClick={() => {
                                setAboutOpen(false);
                                setSidebarOpen(false);
                              }}
                            >
                              Mission
                            </Link>
                          </li>
                        </ul>
                      )}
                    </li>
                  );
                }

                // Prayer Wall dropdown
                if (item.id === "prayer-wall") {
                  return (
                    <li key={item.id} className="w-full px-2">
                      <button
                        onClick={() => setPrayerWallOpen((prev) => !prev)}
                        className={`w-full flex items-center justify-between gap-2 px-3 py-2 transition-all duration-200 hover:bg-[#FCCF3A] hover:text-[#0C2E8A] rounded-md ${
                          prayerWallOpen || ["/prayer-wall", "/my-prayer-point"].includes(location.pathname)
                            ? "text-white font-semibold"
                            : "text-white"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Icon size={14} />
                          <span className="text-xs">{item.title}</span>
                        </div>
                        <ChevronDown 
                          size={14} 
                          className={`transition-transform duration-200 ${prayerWallOpen ? 'rotate-180' : ''}`}
                        />
                      </button>

                      {prayerWallOpen && (
                        <ul className="ml-6 mt-2 space-y-2">
                          <li>
                            <Link
                              to="/prayer-wall"
                              className={`block px-2 py-1 text-xs text-white hover:bg-[#3C4FA3] rounded transition-colors ${
                                location.pathname === "/prayer-wall" ? "bg-[#3C4FA3] font-semibold" : ""
                              }`}
                              onClick={() => {
                                setPrayerWallOpen(false);
                                setSidebarOpen(false);
                              }}
                            >
                              Pray with Me
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/my-prayer-point"
                              className={`block px-2 py-1 text-xs text-white hover:bg-[#3C4FA3] rounded transition-colors ${
                                location.pathname === "/my-prayer-point" ? "bg-[#3C4FA3] font-semibold" : ""
                              }`}
                              onClick={() => {
                                setPrayerWallOpen(false);
                                setSidebarOpen(false);
                              }}
                            >
                              My Prayer Point
                            </Link>
                          </li>
                        </ul>
                      )}
                    </li>
                  );
                }
              }

              return (
                <li key={item.id} className="w-full px-2">
                  <Link
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`w-full flex gap-2 pl-3 items-center py-2 transition-all duration-200 hover:bg-[#FCCF3A] hover:text-[#0C2E8A] rounded-md ${
                      isActive
                        ? "text-[#0C2E8A] font-semibold bg-[#FCCF3A]"
                        : "text-white"
                    }`}
                  >
                    <Icon size={14} />
                    <span className="text-xs">{item.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </> 
  );
}