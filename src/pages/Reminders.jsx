// Reminder.jsx
import React, { useState, useEffect } from "react";
import {
  Plus,
  Clock,
  Bell,
  Calendar,
  Edit3,
  Trash2,
  Play,
  Pause,
  Sun,
  Moon,
  Sunset,
  Volume2,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const Reminder = () => {
  const [reminders, setReminders] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingReminder, setEditingReminder] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    time: "",
    days: [],
    sound: "gentle-chime",
    prayer: "",
    icon: "sun",
  });

  const soundOptions = [
    { value: "gentle-chime", label: "Gentle Chime" },
    { value: "soft-bell", label: "Soft Bell" },
    { value: "peaceful-tone", label: "Peaceful Tone" },
    { value: "quiet-chime", label: "Quiet Chime" },
    { value: "nature-sounds", label: "Nature Sounds" },
    { value: "hymn-melody", label: "Hymn Melody" },
  ];

  const iconOptions = [
    { value: "sun", icon: Sun, label: "Sun" },
    { value: "sunrise", icon: Sun, label: "Sunrise" },
    { value: "sunset", icon: Sunset, label: "Sunset" },
    { value: "moon", icon: Moon, label: "Moon" },
  ];

  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  // Load reminders from localStorage on mount
  useEffect(() => {
    const savedReminders = JSON.parse(localStorage.getItem("reminders") || "[]");
    
    // If no saved reminders, load default ones
    if (savedReminders.length === 0) {
      const defaultReminders = [
        {
          id: 1,
          title: "Morning Prayer",
          time: "07:00",
          days: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
          isActive: true,
          sound: "gentle-chime",
          prayer:
            "Lord, thank You for this new day. Guide my steps and fill my heart with Your peace.",
          icon: "sunrise",
          createdAt: "2024-03-10",
        },
        {
          id: 2,
          title: "Lunch Break Prayer",
          time: "12:30",
          days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          isActive: true,
          sound: "soft-bell",
          prayer:
            "Father, bless this food and this moment of rest. Strengthen me for the rest of the day.",
          icon: "sun",
          createdAt: "2024-03-08",
        },
        {
          id: 3,
          title: "Evening Gratitude",
          time: "20:00",
          days: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
          isActive: false,
          sound: "peaceful-tone",
          prayer:
            "Thank You, Lord, for all Your blessings today. Help me rest in Your love.",
          icon: "sunset",
          createdAt: "2024-03-05",
        },
      ];
      setReminders(defaultReminders);
      localStorage.setItem("reminders", JSON.stringify(defaultReminders));
    } else {
      setReminders(savedReminders);
    }

    const savedBookmarks = JSON.parse(localStorage.getItem("reminderBookmarks") || "[]");
    setBookmarks(savedBookmarks);
  }, []);

  // Save reminders to localStorage whenever they change
  useEffect(() => {
    if (reminders.length > 0) {
      localStorage.setItem("reminders", JSON.stringify(reminders));
      // Dispatch event to notify Header component
      window.dispatchEvent(new Event("reminderUpdated"));
    }
  }, [reminders]);

  const getIconComponent = (iconName) => {
    const iconMap = {
      sun: Sun,
      sunrise: Sun,
      sunset: Sunset,
      moon: Moon,
    };
    return iconMap[iconName] || Sun;
  };

  const formatTime = (time24) => {
    if (!time24) return "";
    const [hours, minutes] = time24.split(":");
    const hour = parseInt(hours || "0", 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const getDaysText = (days) => {
    if (!days) return "";
    if (days.length === 7) return "Daily";
    if (
      days.length === 5 &&
      !days.includes("Saturday") &&
      !days.includes("Sunday")
    )
      return "Weekdays";
    if (
      days.length === 2 &&
      days.includes("Saturday") &&
      days.includes("Sunday")
    )
      return "Weekends";
    if (days.length <= 3) return days.join(", ");
    return `${days.length} days`;
  };

  const toggleReminder = (id) => {
    setReminders((prev) =>
      prev.map((reminder) =>
        reminder.id === id
          ? { ...reminder, isActive: !reminder.isActive }
          : reminder
      )
    );
    toast.success("Reminder toggled");
  };

  const trackBookmark = (reminder) => {
    let bookmarks = JSON.parse(localStorage.getItem("reminderBookmarks") || "[]");

    if (!bookmarks.find((b) => b.id === reminder.id)) {
      bookmarks.push({
        id: reminder.id,
        title: reminder.title,
        time: reminder.time,
        days: reminder.days,
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem("reminderBookmarks", JSON.stringify(bookmarks));
      setBookmarks(bookmarks);
    }
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.time || formData.days.length === 0) {
      toast.error("Please fill in title, time and at least one day.");
      return;
    }

    const newReminder = {
      id: editingReminder ? editingReminder.id : Date.now(),
      title: formData.title,
      time: formData.time,
      days: formData.days,
      isActive: true,
      sound: formData.sound,
      prayer: formData.prayer,
      icon: formData.icon,
      createdAt: editingReminder
        ? editingReminder.createdAt
        : new Date().toISOString().split("T")[0],
    };

    if (editingReminder) {
      setReminders(
        reminders.map((reminder) =>
          reminder.id === editingReminder.id ? newReminder : reminder
        )
      );
      toast.success("Reminder updated");
    } else {
      setReminders([newReminder, ...reminders]);
      toast.success("Reminder created");
    }

    trackBookmark(newReminder);

    setFormData({
      title: "",
      time: "",
      days: [],
      sound: "gentle-chime",
      prayer: "",
      icon: "sun",
    });
    setEditingReminder(null);
    setShowModal(false);
  };

  const handleEdit = (reminder) => {
    setEditingReminder(reminder);
    setFormData({
      title: reminder.title,
      time: reminder.time,
      days: reminder.days,
      sound: reminder.sound,
      prayer: reminder.prayer,
      icon: reminder.icon,
    });
    setShowModal(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id) => {
    toast((t) => (
      <div className="max-w-xs">
        <div className="text-sm mb-3">Delete this reminder?</div>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => {
              setReminders((prev) => prev.filter((r) => r.id !== id));
              toast.dismiss(t.id);
              toast.success("Reminder deleted", { duration: 2000 });
            }}
            className="px-3 py-1 rounded bg-red-600 text-white text-sm hover:bg-red-700 transition-colors"
          >
            Delete
          </button>

          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1 rounded bg-gray-100 text-gray-800 text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    ));
  };

  const handleDayToggle = (day) => {
    setFormData((prev) => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter((d) => d !== day)
        : [...prev.days, day],
    }));
  };

  const activeReminders = reminders.filter((r) => r.isActive).length;
  const upcomingReminder = reminders
    .filter((r) => r.isActive)
    .sort((a, b) => a.time.localeCompare(b.time))[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50 pt-32 pl-0 lg:pl-[224px] font-['Poppins']">
      <Toaster position="top-right" />
      <div className="container mx-auto px-3 sm:px-4 md:px-6 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <div className="text-center md:text-left">
            <h1 className="text-base font-semibold text-[#0C2E8A] mb-1">
              Prayer Reminders
            </h1>
            <p className="text-sm  text-[#0C2E8A]">
              Set regular reminders for Scripture-based prayer time
            </p>
          </div>

          <button
            onClick={() => {
              setEditingReminder(null);
              setFormData({
                title: "",
                time: "",
                days: [],
                sound: "gentle-chime",
                prayer: "",
                icon: "sun",
              });
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-4 sm:px-6 py-2.5 bg-[#0C2E8A] text-white rounded-lg hover:bg-[#0B2870] transition-shadow shadow"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm sm:text-base">New Reminder</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#FCCF3A] rounded-lg">
                <Bell className="w-6 h-6 text-[#0C2E8A]" />
              </div>
              <div>
                <div className="text-2xl font-semibold text-[#0C2E8A]">
                  {activeReminders}
                </div>
                <div className="text-sm text-gray-600">Active Reminders</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#FCCF3A] rounded-lg">
                <Clock className="w-6 h-6 text-[#0C2E8A]" />
              </div>
              <div>
                <div className="text-2xl font-semibold text-[#0C2E8A]">
                  {reminders.length}
                </div>
                <div className="text-sm text-gray-600">Total Reminders</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#FCCF3A] rounded-lg">
                <Calendar className="w-6 h-6 text-[#0C2E8A]" />
              </div>
              <div>
                <div className="text-lg font-semibold text-[#0C2E8A]">
                  {upcomingReminder
                    ? formatTime(upcomingReminder.time)
                    : "None"}
                </div>
                <div className="text-sm text-gray-600">Next Prayer</div>
              </div>
            </div>
          </div>
        </div>

        {/* Reminders List */}
        <div className="space-y-4">
          {reminders.map((reminder) => {
            const IconComponent = getIconComponent(reminder.icon);
            return (
              <div
                key={reminder.id}
                className={`bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-lg transition duration-200 ${
                  !reminder.isActive ? "opacity-70" : ""
                }`}
              >
                <div className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-start sm:items-center gap-4 min-w-0">
                      <div
                        className={`p-3 rounded-lg shrink-0 ${
                          reminder.isActive
                            ? "bg-blue-100 text-[#0C2E8A]"
                            : "bg-gray-100 text-[#ABBC6B]"
                        }`}
                      >
                        <IconComponent className="w-6 h-6" />
                      </div>

                      <div className="min-w-0">
                        <h3 className="text-base sm:text-xl font-semibold text-[#0C2E8A] truncate">
                          {reminder.title}
                        </h3>

                        <div className="flex flex-wrap items-center gap-3 text-sm text-[#ABBC6B] mt-1">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span className="truncate">
                              {formatTime(reminder.time)}
                            </span>
                          </div>

                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span className="truncate">
                              {getDaysText(reminder.days)}
                            </span>
                          </div>

                          <div className="flex items-center gap-1">
                            <Volume2 className="w-4 h-4" />
                            <span className="truncate">
                              {
                                soundOptions.find(
                                  (s) => s.value === reminder.sound
                                )?.label
                              }
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap md:flex-nowrap items-center justify-end gap-2 max-w-full">
                      <button
                        onClick={() => toggleReminder(reminder.id)}
                        className={`p-2 rounded-lg transition ${
                          reminder.isActive
                            ? "text-[#ABBC6B] bg-green-100 hover:bg-green-200"
                            : "text-gray-400 bg-gray-100 hover:bg-gray-200"
                        }`}
                        title={
                          reminder.isActive
                            ? "Pause reminder"
                            : "Activate reminder"
                        }
                      >
                        {reminder.isActive ? (
                          <Pause className="w-5 h-5" />
                        ) : (
                          <Play className="w-5 h-5" />
                        )}
                      </button>

                      <button
                        onClick={() => handleEdit(reminder)}
                        className="p-2 text-gray-600 hover:text-[#0C2E8A] hover:bg-blue-50 rounded-lg transition"
                        title="Edit reminder"
                      >
                        <Edit3 className="w-5 h-5" />
                      </button>

                      <button
                        onClick={() => handleDelete(reminder.id)}
                        className="p-2 text-gray-600 hover:text-[#BA1A1A] hover:bg-red-50 rounded-lg transition"
                        title="Delete reminder"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {reminder.prayer && (
                    <div className="bg-gradient-to-r from-blue-50 to-yellow-50 rounded-lg p-3 mt-4 border border-blue-100">
                      <p className="text-sm text-[#3FCBFF] italic">
                        {reminder.prayer}
                      </p>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 mt-3">
                    {reminder.days.map((day) => (
                      <span
                        key={day}
                        className="px-3 py-1 bg-[#FCCF3A] text-[#0C2E8A] text-sm rounded-md"
                      >
                        {day.slice(0, 3)}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bookmarks List */}
        {bookmarks.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-[#0C2E8A] mb-3">
              Bookmarked Reminders
            </h3>
            <div className="space-y-2">
              {bookmarks.map((b) => (
                <div
                  key={b.id}
                  className="bg-white rounded-lg p-3 border border-gray-100 shadow-sm"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{b.title}</span>
                    <span className="text-sm text-gray-500">
                      {formatTime(b.time)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {getDaysText(b.days)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal for creating/editing reminders */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg relative max-h-[90vh] overflow-y-auto">
            <h2 className="text-base font-semibold text-[#0C2E8A] mb-4">
              {editingReminder ? "Edit Reminder" : "New Reminder"}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  placeholder="Reminder title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Time
                </label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) =>
                    setFormData({ ...formData, time: e.target.value })
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Days
                </label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {daysOfWeek.map((day) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => handleDayToggle(day)}
                      className={`px-3 py-1 rounded-full border ${
                        formData.days.includes(day)
                          ? "bg-[#0C2E8A] text-white"
                          : "bg-white text-gray-700 border-gray-300"
                      }`}
                    >
                      {day.slice(0, 3)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Sound
                </label>
                <select
                  value={formData.sound}
                  onChange={(e) =>
                    setFormData({ ...formData, sound: e.target.value })
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                >
                  {soundOptions.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Prayer
                </label>
                <textarea
                  value={formData.prayer}
                  onChange={(e) =>
                    setFormData({ ...formData, prayer: e.target.value })
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  placeholder="Enter your prayer"
                  rows="3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Icon
                </label>
                <select
                  value={formData.icon}
                  onChange={(e) =>
                    setFormData({ ...formData, icon: e.target.value })
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                >
                  {iconOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                {editingReminder ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reminder;