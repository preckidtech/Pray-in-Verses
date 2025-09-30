// src/pages/History.jsx
import React, { useState, useEffect } from "react";
import {
  Clock,
  Search,
  Calendar,
  Trash2,
  BookMarked,
  BookOpen,
  Check,
} from "lucide-react";

export default function History() {
  const [history, setHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [notification, setNotification] = useState(null);

  const getCurrentUser = () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    return currentUser.id || currentUser.email || "guest";
  };

  const loadHistory = () => {
    setLoading(true);
    try {
      const userId = getCurrentUser();
      const savedHistory = JSON.parse(localStorage.getItem(`history_${userId}`) || "[]");
      setHistory(savedHistory);
    } catch (error) {
      console.error("Error loading history:", error);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
    window.addEventListener("historyUpdated", loadHistory);
    return () => window.removeEventListener("historyUpdated", loadHistory);
  }, []);

  const saveHistory = (updatedHistory) => {
    const userId = getCurrentUser();
    localStorage.setItem(`history_${userId}`, JSON.stringify(updatedHistory));
    setHistory(updatedHistory);
    window.dispatchEvent(new Event("historyUpdated"));
  };

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const getDateRanges = () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);
    const lastMonth = new Date(today);
    lastMonth.setDate(lastMonth.getDate() - 30);

    const counts = {
      all: history.length,
      today: 0,
      yesterday: 0,
      lastWeek: 0,
      lastMonth: 0,
      older: 0
    };

    history.forEach(item => {
      const itemDate = new Date(item.timestamp);
      if (itemDate.toDateString() === today.toDateString()) {
        counts.today++;
      } else if (itemDate.toDateString() === yesterday.toDateString()) {
        counts.yesterday++;
      } else if (itemDate >= lastWeek) {
        counts.lastWeek++;
      } else if (itemDate >= lastMonth) {
        counts.lastMonth++;
      } else {
        counts.older++;
      }
    });

    return [
      { value: "all", label: "All Time", count: counts.all },
      { value: "today", label: "Today", count: counts.today },
      { value: "yesterday", label: "Yesterday", count: counts.yesterday },
      { value: "lastWeek", label: "Last 7 Days", count: counts.lastWeek },
      { value: "lastMonth", label: "Last 30 Days", count: counts.lastMonth },
      { value: "older", label: "Older", count: counts.older },
    ];
  };

  const typeOptions = [
    { value: "all", label: "All Types" },
    { value: "prayer", label: "Prayers" },
    { value: "verse", label: "Verses" },
    { value: "journal", label: "Journal Entries" },
  ];

  const filteredHistory = history
    .filter((item) => {
      const matchesSearch =
        item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.reference?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = selectedType === "all" || item.type === selectedType;

      let matchesDate = true;
      if (selectedDate !== "all") {
        const itemDate = new Date(item.timestamp);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const lastWeek = new Date(today);
        lastWeek.setDate(lastWeek.getDate() - 7);
        const lastMonth = new Date(today);
        lastMonth.setDate(lastMonth.getDate() - 30);

        switch (selectedDate) {
          case "today":
            matchesDate = itemDate >= today;
            break;
          case "yesterday":
            matchesDate = itemDate >= yesterday && itemDate < today;
            break;
          case "lastWeek":
            matchesDate = itemDate >= lastWeek;
            break;
          case "lastMonth":
            matchesDate = itemDate >= lastMonth;
            break;
          case "older":
            matchesDate = itemDate < lastMonth;
            break;
        }
      }

      return matchesSearch && matchesType && matchesDate;
    })
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  const handleSelectItem = (id) => {
    setSelectedItems(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleDeleteSelected = () => {
    const updatedHistory = history.filter(
      item => !selectedItems.includes(item.id)
    );
    saveHistory(updatedHistory);
    setSelectedItems([]);
    setShowDeleteModal(false);
    showNotification(`Deleted ${selectedItems.length} item${selectedItems.length > 1 ? 's' : ''}`);
  };

  const handleDeleteSingle = (id) => {
    const updatedHistory = history.filter(item => item.id !== id);
    saveHistory(updatedHistory);
    showNotification("Item deleted from history");
  };

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to clear all history? This action cannot be undone.")) {
      saveHistory([]);
      setSelectedItems([]);
      showNotification("History cleared");
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;

    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const groupedHistory = filteredHistory.reduce((groups, item) => {
    const date = new Date(item.timestamp);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let label;
    if (date >= today) {
      label = "Today";
    } else if (date >= yesterday) {
      label = "Yesterday";
    } else {
      label = date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }

    if (!groups[label]) {
      groups[label] = [];
    }
    groups[label].push(item);
    return groups;
  }, {});

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pl-0 lg:pl-56">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pl-0 lg:pl-56">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Notification */}
        {notification && (
          <div className={`fixed top-24 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg ${
            notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-white`}>
            <Check className="w-5 h-5" />
            <span>{notification.message}</span>
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-[#2c3E91]" />
              <h1 className="text-3xl font-bold text-[#2c3E91]">History</h1>
            </div>
            {history.length > 0 && (
              <button
                onClick={handleClearAll}
                className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Clear All
              </button>
            )}
          </div>
          <p className="text-gray-600">Track your prayer journey and spiritual activities</p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search history..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2c3E91] focus:border-transparent"
              />
            </div>

            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2c3E91] focus:border-transparent"
            >
              {getDateRanges().map(range => (
                <option key={range.value} value={range.value}>
                  {range.label} ({range.count})
                </option>
              ))}
            </select>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2c3E91] focus:border-transparent"
            >
              {typeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {selectedItems.length > 0 && (
              <button
                onClick={() => setShowDeleteModal(true)}
                className="px-4 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete ({selectedItems.length})
              </button>
            )}
          </div>
        </div>

        {/* History Timeline */}
        {Object.keys(groupedHistory).length > 0 ? (
          <div className="space-y-8">
            {Object.entries(groupedHistory).map(([dateLabel, items]) => (
              <div key={dateLabel}>
                <div className="flex items-center gap-3 mb-4">
                  <Calendar className="w-5 h-5 text-[#2c3E91]" />
                  <h2 className="text-lg font-semibold text-[#2c3E91]">{dateLabel}</h2>
                  <div className="flex-1 h-px bg-gray-200"></div>
                </div>

                <div className="space-y-3">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item.id)}
                          onChange={() => handleSelectItem(item.id)}
                          className="w-4 h-4 text-[#2c3E91] focus:ring-[#2c3E91] border-gray-300 rounded mt-1"
                        />

                        <div className="flex-shrink-0 w-10 h-10 bg-[#2c3E91]/10 rounded-full flex items-center justify-center">
                          {item.type === 'prayer' ? (
                            <BookOpen className="w-5 h-5 text-[#2c3E91]" />
                          ) : item.type === 'verse' ? (
                            <BookMarked className="w-5 h-5 text-[#2c3E91]" />
                          ) : (
                            <Clock className="w-5 h-5 text-[#2c3E91]" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <h3 className="text-base font-semibold text-gray-900 mb-1">
                                {item.title}
                              </h3>
                              {item.content && (
                                <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                                  {item.content}
                                </p>
                              )}
                              {item.reference && (
                                <p className="text-sm text-[#2c3E91] font-medium">
                                  {item.reference}
                                </p>
                              )}
                            </div>

                            <button
                              onClick={() => handleDeleteSingle(item.id)}
                              className="p-2 rounded-full text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors flex-shrink-0"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatTimestamp(item.timestamp)}
                            </span>
                            <span className="capitalize px-2 py-0.5 bg-gray-100 rounded">
                              {item.type}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
              <Clock className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {searchQuery || selectedDate !== "all" || selectedType !== "all"
                ? "No history found"
                : "No history yet"
              }
            </h3>
            <p className="text-gray-500">
              Start browsing prayers, verses, and journal entries to see your history here.
            </p>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-80">
              <h3 className="text-lg font-semibold mb-4">Delete Selected Items</h3>
              <p className="mb-6">Are you sure you want to delete {selectedItems.length} item(s)? This action cannot be undone.</p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteSelected}
                  className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
