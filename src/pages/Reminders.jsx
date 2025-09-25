// Reminder.jsx
import React, { useState } from "react";
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
  const [reminders, setReminders] = useState([
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
  ]);

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
    // Toast-based confirmation (non-blocking)
    toast((t) => (
      <div className="max-w-xs">
        <div className="text-sm mb-3">Delete this reminder?</div>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => {
              setReminders((prev) => prev.filter((r) => r.id !== id));
              toast.dismiss(t.id);
              toast.success("Reminder deleted");
            }}
            className="px-3 py-1 rounded bg-red-600 text-white text-sm"
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50 pt-16 pl-0 lg:pl-[224px]">
      {/* Toaster mounted here so file is self-contained */}
      <Toaster position="top-right" />
      <div className="container mx-auto px-3 sm:px-4 md:px-6 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <div className="text-center md:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0C2E8A] mb-1">
              Prayer Reminders
            </h1>
            <p className="text-sm sm:text-base text-[#0C2E8A]">
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
                  {upcomingReminder ? formatTime(upcomingReminder.time) : "None"}
                </div>
                <div className="text-sm text-gray-600">Next Prayer</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Setup */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 sm:p-6 mb-6">
          <h2 className="text-lg sm:text-xl font-medium text-[#0C2E8A] mb-3">
            Quick Setup
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { title: "Morning Prayer", time: "07:00", icon: Sun },
              { title: "Midday Prayer", time: "12:00", icon: Sun },
              { title: "Evening Prayer", time: "18:00", icon: Sunset },
              { title: "Night Prayer", time: "22:00", icon: Moon },
            ].map((preset, idx) => {
              const Icon = preset.icon;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    setFormData({
                      title: preset.title,
                      time: preset.time,
                      days: daysOfWeek,
                      sound: "gentle-chime",
                      prayer: "",
                      icon: preset.title.includes("Morning")
                        ? "sunrise"
                        : preset.title.includes("Evening")
                        ? "sunset"
                        : preset.title.includes("Night")
                        ? "moon"
                        : "sun",
                    });
                    setEditingReminder(null);
                    setShowModal(true);
                  }}
                  className="flex flex-col items-center gap-2 p-3 border rounded-lg hover:shadow-sm transition"
                >
                  <Icon className="w-8 h-8 text-[#0C2E8A]" />
                  <div className="text-sm font-medium text-gray-900">
                    {preset.title}
                  </div>
                  <div className="text-xs text-gray-500">{formatTime(preset.time)}</div>
                </button>
              );
            })}
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
                          reminder.isActive ? "bg-blue-100 text-[#0C2E8A]" : "bg-gray-100 text-[#ABBC6B]"
                        }`}
                      >
                        <IconComponent className="w-6 h-6" />
                      </div>

                      <div className="min-w-0">
                        <h3 className="text-lg sm:text-xl font-medium text-[#0C2E8A] truncate">
                          {reminder.title}
                        </h3>

                        <div className="flex flex-wrap items-center gap-3 text-sm text-[#ABBC6B] mt-1">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span className="truncate">{formatTime(reminder.time)}</span>
                          </div>

                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span className="truncate">{getDaysText(reminder.days)}</span>
                          </div>

                          <div className="flex items-center gap-1">
                            <Volume2 className="w-4 h-4" />
                            <span className="truncate">
                              {soundOptions.find((s) => s.value === reminder.sound)?.label}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons - responsive: will wrap on small screens */}
                    <div className="flex flex-wrap md:flex-nowrap items-center justify-end gap-2 max-w-full">
                      <button
                        onClick={() => toggleReminder(reminder.id)}
                        className={`p-2 rounded-lg transition ${
                          reminder.isActive ? "text-[#ABBC6B] bg-green-100 hover:bg-green-200" : "text-gray-400 bg-gray-100 hover:bg-gray-200"
                        }`}
                        title={reminder.isActive ? "Pause reminder" : "Activate reminder"}
                      >
                        {reminder.isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
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
                      <p className="text-sm text-[#3FCBFF] italic">{reminder.prayer}</p>
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

          {/* Empty state */}
          {reminders.length === 0 && (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="w-10 h-10 text-[#0C2E8A]" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">No reminders set</h3>
              <p className="text-gray-600 mb-6">Create your first prayer reminder to build a consistent Scripture-based habit</p>
              <button
                onClick={() => setShowModal(true)}
                className="px-6 py-3 bg-[#0C2E8A] text-white rounded-lg hover:bg-[#0B2870] transition"
              >
                Create First Reminder
              </button>
            </div>
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-3 sm:p-6">
            <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-4 sm:p-6">
                <h2 className="text-xl sm:text-2xl font-semibold text-[#0C2E8A] mb-4">
                  {editingReminder ? "Edit Reminder" : "New Prayer Reminder"}
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Reminder Title</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0C2E8A] focus:outline-none"
                      placeholder="e.g., Morning Prayer"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                      <input
                        type="time"
                        value={formData.time}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0C2E8A] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Sound</label>
                      <select
                        value={formData.sound}
                        onChange={(e) => setFormData({ ...formData, sound: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0C2E8A] focus:outline-none"
                      >
                        {soundOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Days to Repeat</label>
                    <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
                      {daysOfWeek.map((day) => (
                        <button
                          key={day}
                          type="button"
                          onClick={() => handleDayToggle(day)}
                          className={`px-2 py-2 rounded-lg text-xs sm:text-sm font-medium transition ${
                            formData.days.includes(day)
                              ? "bg-[#0C2E8A] text-white shadow"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {day.slice(0, 3)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
                    <div className="grid grid-cols-4 gap-3">
                      {iconOptions.map((option) => {
                        const Icon = option.icon;
                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => setFormData({ ...formData, icon: option.value })}
                            className={`p-2 sm:p-3 rounded-lg border-2 transition ${
                              formData.icon === option.value ? "border-[#0C2E8A] bg-blue-50" : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <Icon className={`w-5 h-5 sm:w-6 sm:h-6 mx-auto ${formData.icon === option.value ? "text-[#0C2E8A]" : "text-gray-600"}`} />
                            <p className="text-xs mt-1">{option.label}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Prayer Text (Optional)</label>
                    <textarea
                      value={formData.prayer}
                      onChange={(e) => setFormData({ ...formData, prayer: e.target.value })}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0C2E8A] focus:outline-none resize-none"
                      placeholder="Add a short prayer or verse to display with this reminder..."
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row justify-end gap-3 mt-3 pt-3 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 text-sm bg-gray-100 rounded-lg hover:bg-gray-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="px-4 py-2 text-sm bg-[#0C2E8A] text-white rounded-lg hover:bg-[#0B2870]"
                    >
                      {editingReminder ? "Update Reminder" : "Create Reminder"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reminder;
