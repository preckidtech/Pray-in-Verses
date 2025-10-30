// src/pages/Reminders.jsx
import React, { useState, useEffect, useCallback, useRef } from "react";
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
  X,
} from "lucide-react";

const STORAGE_KEY = "prayinv_reminders_v1";

const Reminder = () => {
  const [reminders, setReminders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingReminder, setEditingReminder] = useState(null);
  const [notificationPermission, setNotificationPermission] = useState(
    typeof Notification !== "undefined" ? Notification.permission : "denied"
  );
  const [toasts, setToasts] = useState([]);

  const checkIntervalRef = useRef(null);
  const lastCheckedMinuteRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    time: "",
    days: [],
    sound: "gentle-chime",
    prayer: "",
    icon: "sun",
  });

  const soundOptions = [
    { value: "gentle-chime", label: "Gentle Chime", frequency: 800 },
    { value: "soft-bell", label: "Soft Bell", frequency: 1000 },
    { value: "peaceful-tone", label: "Peaceful Tone", frequency: 650 },
    { value: "quiet-chime", label: "Quiet Chime", frequency: 900 },
    { value: "nature-sounds", label: "Nature Sounds", frequency: 550 },
    { value: "hymn-melody", label: "Hymn Melody", frequency: 750 },
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

  // ---------- Toasts ----------
  const showToast = useCallback((message, type = "success") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  // ---------- Persistence ----------
  useEffect(() => {
    // load from localStorage
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setReminders(parsed);
        }
      }
    } catch {}
  }, []);

  useEffect(() => {
    // save to localStorage on change
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reminders));
    } catch {}
  }, [reminders]);

  // ---------- Notifications ----------
  const requestNotifications = useCallback(async () => {
    if (typeof Notification === "undefined") {
      showToast("Notifications not supported on this browser", "error");
      return;
    }
    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      if (permission === "granted") showToast("Notifications enabled!");
      else showToast("Notifications not enabled", "error");
    } catch {
      showToast("Could not request notifications", "error");
    }
  }, [showToast]);

  // ---------- Web Audio sound ----------
  const playSound = useCallback((soundType) => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const audioContext = new AudioContext();

      const soundConfig = soundOptions.find((s) => s.value === soundType);
      const frequency = soundConfig?.frequency || 800;

      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = "sine";

      const now = audioContext.currentTime;
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.3, now + 0.1);
      gainNode.gain.linearRampToValueAtTime(0.3, now + 0.4);
      gainNode.gain.linearRampToValueAtTime(0, now + 0.7);

      oscillator.start(now);
      oscillator.stop(now + 0.7);

      setTimeout(() => {
        const oscillator2 = audioContext.createOscillator();
        const gainNode2 = audioContext.createGain();
        oscillator2.connect(gainNode2);
        gainNode2.connect(audioContext.destination);
        oscillator2.frequency.value = frequency * 1.5;
        oscillator2.type = "sine";

        const now2 = audioContext.currentTime;
        gainNode2.gain.setValueAtTime(0, now2);
        gainNode2.gain.linearRampToValueAtTime(0.2, now2 + 0.1);
        gainNode2.gain.linearRampToValueAtTime(0, now2 + 0.5);

        oscillator2.start(now2);
        oscillator2.stop(now2 + 0.5);
      }, 200);
    } catch (error) {
      // Most browsers require user gesture before audio; ignore errors.
      console.error("Error playing sound:", error);
    }
  }, []);

  // ---------- Reminder checker ----------
  const checkReminders = useCallback(() => {
    const now = new Date();
    const currentDay = daysOfWeek[now.getDay()];
    const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
    ).padStart(2, "0")}`;
    const currentMinuteKey = `${currentDay}-${currentTime}`;

    // prevent duplicate fires inside same minute (even if interval ticks multiple times)
    if (lastCheckedMinuteRef.current === currentMinuteKey) return;
    lastCheckedMinuteRef.current = currentMinuteKey;

    reminders.forEach((reminder) => {
      if (
        reminder.isActive &&
        reminder.time === currentTime &&
        Array.isArray(reminder.days) &&
        reminder.days.includes(currentDay)
      ) {
        // sound
        playSound(reminder.sound);

        // system notification
        if (notificationPermission === "granted") {
          try {
            new Notification(reminder.title, {
              body: reminder.prayer || "Time for prayer",
              tag: `reminder-${reminder.id}`,
            });
          } catch {}
        }

        // in-app toast (longer)
        const toastId = Date.now() + Math.random();
        setToasts((prev) => [
          ...prev,
          {
            id: toastId,
            type: "reminder",
            title: reminder.title,
            prayer: reminder.prayer,
          },
        ]);
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== toastId));
        }, 10000);
      }
    });
  }, [reminders, playSound, notificationPermission, daysOfWeek]);

  // Set up/tear down interval cleanly (and when tab changes visibility)
  useEffect(() => {
    // clear any existing interval before creating a new one
    if (checkIntervalRef.current) {
      clearInterval(checkIntervalRef.current);
      checkIntervalRef.current = null;
    }

    if (reminders.some((r) => r.isActive)) {
      // run once immediately
      checkReminders();
      // then every 10s
      checkIntervalRef.current = setInterval(checkReminders, 10000);
    }

    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
        checkIntervalRef.current = null;
      }
    };
  }, [reminders, checkReminders]);

  // If user switches tabs and comes back, allow a fresh check
  useEffect(() => {
    const onVis = () => {
      lastCheckedMinuteRef.current = null;
      checkReminders();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [checkReminders]);

  // ---------- Helpers ----------
  const getIconComponent = (iconName) => {
    const iconMap = { sun: Sun, sunrise: Sun, sunset: Sunset, moon: Moon };
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
    if (!days || days.length === 0) return "";
    if (days.length === 7) return "Daily";
    if (days.length === 5 && !days.includes("Saturday") && !days.includes("Sunday"))
      return "Weekdays";
    if (days.length === 2 && days.includes("Saturday") && days.includes("Sunday"))
      return "Weekends";
    if (days.length <= 3) return days.join(", ");
    return `${days.length} days`;
  };

  // ---------- CRUD ----------
  const toggleReminder = (id) => {
    setReminders((prev) =>
      prev.map((reminder) =>
        reminder.id === id ? { ...reminder, isActive: !reminder.isActive } : reminder
      )
    );
    showToast("Reminder toggled");
  };

  const resetForm = () => {
    setFormData({
      title: "",
      time: "",
      days: [],
      sound: "gentle-chime",
      prayer: "",
      icon: "sun",
    });
    setEditingReminder(null);
  };

  const isValidTime = (t) => /^\d{2}:\d{2}$/.test(t);

  const handleSubmit = () => {
    if (!formData.title.trim()) {
      showToast("Please enter a title", "error");
      return;
    }
    if (!formData.time || !isValidTime(formData.time)) {
      showToast("Please select a valid time (HH:MM)", "error");
      return;
    }
    if (formData.days.length === 0) {
      showToast("Please select at least one day", "error");
      return;
    }

    const newReminder = {
      id: editingReminder ? editingReminder.id : Date.now(),
      title: formData.title.trim(),
      time: formData.time,
      days: [...formData.days],
      isActive: true,
      sound: formData.sound,
      prayer: formData.prayer.trim(),
      icon: formData.icon,
      createdAt: editingReminder ? editingReminder.createdAt : new Date().toISOString(),
    };

    if (editingReminder) {
      setReminders((prev) =>
        prev.map((reminder) => (reminder.id === editingReminder.id ? newReminder : reminder))
      );
      showToast("Reminder updated successfully!");
    } else {
      setReminders((prev) => [newReminder, ...prev]);
      showToast("Reminder created successfully!");
    }

    setShowModal(false);
    resetForm();
  };

  const handleEdit = (reminder) => {
    setEditingReminder(reminder);
    setFormData({
      title: reminder.title,
      time: reminder.time,
      days: [...reminder.days],
      sound: reminder.sound,
      prayer: reminder.prayer,
      icon: reminder.icon,
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    const confirmId = Date.now() + Math.random();
    setToasts((prev) => [
      ...prev,
      {
        id: confirmId,
        type: "confirm",
        message: "Delete this reminder?",
        onConfirm: () => {
          setReminders((prev) => prev.filter((r) => r.id !== id));
          setToasts((prev) => prev.filter((t) => t.id !== confirmId));
          showToast("Reminder deleted");
        },
        onCancel: () => {
          setToasts((prev) => prev.filter((t) => t.id !== confirmId));
        },
      },
    ]);
  };

  const handleDayToggle = (day) => {
    setFormData((prev) => ({
      ...prev,
      days: prev.days.includes(day) ? prev.days.filter((d) => d !== day) : [...prev.days, day],
    }));
  };

  const handleSoundPreview = () => {
    playSound(formData.sound);
    showToast("Sound preview played");
  };

  const activeReminders = reminders.filter((r) => r.isActive).length;
  const upcomingReminder = reminders
    .filter((r) => r.isActive)
    .sort((a, b) => a.time.localeCompare(b.time))[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50 pt-24  md:pl-[225px] px-4 font-sans">
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
        {toasts.map((toast) => {
          if (toast.type === "reminder") {
            return (
              <div
                key={toast.id}
                className="bg-white rounded-lg shadow-lg p-4 border-l-4 border-blue-500 animate-slide-in"
              >
                <div className="flex items-start gap-3">
                  <Bell className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{toast.title}</h3>
                    {toast.prayer && <p className="text-sm text-gray-600 mt-1">{toast.prayer}</p>}
                  </div>
                  <button
                    onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            );
          }

          if (toast.type === "confirm") {
            return (
              <div key={toast.id} className="bg-white rounded-lg shadow-lg p-4 animate-slide-in">
                <div className="text-sm font-medium mb-3">{toast.message}</div>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={toast.onConfirm}
                    className="px-3 py-1.5 rounded bg-red-600 text-white text-sm hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                  <button
                    onClick={toast.onCancel}
                    className="px-3 py-1.5 rounded bg-gray-200 text-gray-800 text-sm hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            );
          }

          return (
            <div
              key={toast.id}
              className={`px-4 py-3 rounded-lg shadow-lg text-white animate-slide-in ${
                toast.type === "error" ? "bg-red-500" : "bg-green-500"
              }`}
            >
              {toast.message}
            </div>
          );
        })}
      </div>

      <main className="max-w-6xl mx-auto py-8">
        <div className="px-3 sm:px-4 md:px-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
            <div className="text-center md:text-left">
              <h1 className="text-base font-semibold text-blue-900 mb-1">Prayer Reminders</h1>
              <p className="text-sm text-blue-700">
                Set regular reminders for Scripture-based prayer time
              </p>
            </div>

            <div className="flex items-center gap-2">
              {notificationPermission !== "granted" && (
                <button
                  onClick={requestNotifications}
                  className="flex items-center gap-2 px-4 py-3 bg-yellow-400 text-blue-900 rounded-lg hover:bg-yellow-500 transition-all shadow-sm"
                  title="Enable notifications"
                >
                  <Bell className="w-5 h-5" />
                  Enable Notifications
                </button>
              )}
              <button
                onClick={() => {
                  resetForm();
                  setShowModal(true);
                }}
                className="flex items-center gap-2 px-6 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-all shadow-md hover:shadow-lg"
              >
                <Plus className="w-5 h-5" />
                <span>New Reminder</span>
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-400 rounded-lg">
                  <Bell className="w-6 h-6 text-blue-900" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-900">{activeReminders}</div>
                  <div className="text-sm text-gray-600">Active Reminders</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-400 rounded-lg">
                  <Clock className="w-6 h-6 text-blue-900" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-900">{reminders.length}</div>
                  <div className="text-sm text-gray-600">Total Reminders</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-400 rounded-lg">
                  <Calendar className="w-6 h-6 text-blue-900" />
                </div>
                <div>
                  <div className="text-xl font-bold text-blue-900">
                    {upcomingReminder ? formatTime(upcomingReminder.time) : "None"}
                  </div>
                  <div className="text-sm text-gray-600">Next Prayer</div>
                </div>
              </div>
            </div>
          </div>

          {/* Reminders List */}
          <div className="space-y-4">
            {reminders.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
                <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No reminders yet</h3>
                <p className="text-gray-500 mb-6">
                  Create your first prayer reminder to get started
                </p>
                <button
                  onClick={() => {
                    resetForm();
                    setShowModal(true);
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-all"
                >
                  <Plus className="w-5 h-5" />
                  Create Reminder
                </button>
              </div>
            ) : (
              reminders.map((reminder) => {
                const IconComponent = getIconComponent(reminder.icon);
                return (
                  <div
                    key={reminder.id}
                    className={`bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 ${
                      !reminder.isActive ? "opacity-60" : ""
                    }`}
                  >
                    <div className="p-6">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1 min-w-0">
                          <div
                            className={`p-3 rounded-xl shrink-0 ${
                              reminder.isActive
                                ? "bg-blue-100 text-blue-900"
                                : "bg-gray-100 text-gray-400"
                            }`}
                          >
                            <IconComponent className="w-7 h-7" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <h3 className="text-xl font-semibold text-blue-900 mb-2">
                              {reminder.title}
                            </h3>

                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                              <div className="flex items-center gap-1.5">
                                <Clock className="w-4 h-4" />
                                <span className="font-medium">{formatTime(reminder.time)}</span>
                              </div>

                              <div className="flex items-center gap-1.5">
                                <Calendar className="w-4 h-4" />
                                <span>{getDaysText(reminder.days)}</span>
                              </div>

                              <div className="flex items-center gap-1.5">
                                <Volume2 className="w-4 h-4" />
                                <span>
                                  {soundOptions.find((s) => s.value === reminder.sound)?.label}
                                </span>
                              </div>
                            </div>

                            {reminder.prayer && (
                              <div className="bg-gradient-to-r from-blue-50 to-yellow-50 rounded-lg p-4 border border-blue-100">
                                <p className="text-sm text-gray-700 italic leading-relaxed">
                                  "{reminder.prayer}"
                                </p>
                              </div>
                            )}

                            <div className="flex flex-wrap gap-2 mt-4">
                              {reminder.days.map((day) => (
                                <span
                                  key={day}
                                  className="px-3 py-1 bg-yellow-400 text-blue-900 text-xs font-medium rounded-full"
                                >
                                  {day.slice(0, 3)}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 sm:flex-col sm:items-end">
                          <button
                            onClick={() => toggleReminder(reminder.id)}
                            className={`p-2.5 rounded-lg transition-all ${
                              reminder.isActive
                                ? "text-green-600 bg-green-50 hover:bg-green-100"
                                : "text-gray-400 bg-gray-100 hover:bg-gray-200"
                            }`}
                            title={reminder.isActive ? "Pause" : "Activate"}
                          >
                            {reminder.isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                          </button>

                          <button
                            onClick={() => handleEdit(reminder)}
                            className="p-2.5 text-gray-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-all"
                            title="Edit"
                          >
                            <Edit3 className="w-5 h-5" />
                          </button>

                          <button
                            onClick={() => handleDelete(reminder.id)}
                            className="p-2.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Delete"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg relative max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl">
              <h2 className="text- font-bold text-blue-900">
                {editingReminder ? "Edit Reminder" : "New Reminder"}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="e.g., Morning Prayer"
                  maxLength={50}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Time *
                </label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Days *
                </label>
                <div className="flex flex-wrap gap-2">
                  {daysOfWeek.map((day) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => handleDayToggle(day)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        formData.days.includes(day)
                          ? "bg-blue-900 text-white shadow-md"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {day.slice(0, 3)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Sound
                </label>
                <div className="flex gap-2">
                  <select
                    value={formData.sound}
                    onChange={(e) => setFormData({ ...formData, sound: e.target.value })}
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    {soundOptions.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={handleSoundPreview}
                    className="px-4 py-2.5 bg-yellow-400 text-blue-900 rounded-lg hover:bg-yellow-500 transition-all font-medium"
                    title="Preview sound"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Prayer / Scripture
                </label>
                <textarea
                  value={formData.prayer}
                  onChange={(e) => setFormData({ ...formData, prayer: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  placeholder="Enter a prayer or scripture verse..."
                  rows="4"
                  maxLength={500}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Icon
                </label>
                <select
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  {iconOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="flex-1 px-6 py-3 rounded-lg bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="flex-1 px-6 py-3 rounded-lg bg-blue-900 text-white font-semibold hover:bg-blue-800 transition-all shadow-md hover:shadow-lg"
                >
                  {editingReminder ? "Update" : "Create"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slide-in {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in { animation: slide-in 0.3s ease-out; }
      `}</style>
    </div>
  );
};

export default Reminder;
