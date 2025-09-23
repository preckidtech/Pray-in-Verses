import React, { useState } from 'react';
import { Plus, Clock, Bell, Calendar, Edit3, Trash2, Play, Pause, Settings, Sun, Moon, Sunset, Volume2 } from 'lucide-react';

const Reminder = () => {
  const [reminders, setReminders] = useState([
    {
      id: 1,
      title: "Morning Prayer",
      time: "07:00",
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      isActive: true,
      sound: "gentle-chime",
      prayer: "Lord, thank You for this new day. Guide my steps and fill my heart with Your peace.",
      icon: "sunrise",
      createdAt: "2024-03-10"
    },
    {
      id: 2,
      title: "Lunch Break Prayer",
      time: "12:30",
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      isActive: true,
      sound: "soft-bell",
      prayer: "Father, bless this food and this moment of rest. Strengthen me for the rest of the day.",
      icon: "sun",
      createdAt: "2024-03-08"
    },
    {
      id: 3,
      title: "Evening Gratitude",
      time: "20:00",
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      isActive: false,
      sound: "peaceful-tone",
      prayer: "Thank You, Lord, for all Your blessings today. Help me rest in Your love.",
      icon: "sunset",
      createdAt: "2024-03-05"
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingReminder, setEditingReminder] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    time: '',
    days: [],
    sound: 'gentle-chime',
    prayer: '',
    icon: 'sun'
  });

  const soundOptions = [
    { value: 'gentle-chime', label: 'Gentle Chime' },
    { value: 'soft-bell', label: 'Soft Bell' },
    { value: 'peaceful-tone', label: 'Peaceful Tone' },
    { value: 'quiet-chime', label: 'Quiet Chime' },
    { value: 'nature-sounds', label: 'Nature Sounds' },
    { value: 'hymn-melody', label: 'Hymn Melody' }
  ];

  const iconOptions = [
    { value: 'sun', icon: Sun, label: 'Sun' },
    { value: 'sunrise', icon: Sun, label: 'Sunrise' },
    { value: 'sunset', icon: Sunset, label: 'Sunset' },
    { value: 'moon', icon: Moon, label: 'Moon' }
  ];

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const getIconComponent = (iconName) => {
    const iconMap = {
      sun: Sun,
      sunrise: Sun,
      sunset: Sunset,
      moon: Moon
    };
    return iconMap[iconName] || Sun;
  };

  const formatTime = (time24) => {
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const getDaysText = (days) => {
    if (days.length === 7) return 'Daily';
    if (days.length === 5 && !days.includes('Saturday') && !days.includes('Sunday')) return 'Weekdays';
    if (days.length === 2 && days.includes('Saturday') && days.includes('Sunday')) return 'Weekends';
    if (days.length <= 3) return days.join(', ');
    return `${days.length} days`;
  };

  const toggleReminder = (id) => {
    setReminders(prev => prev.map(reminder => 
      reminder.id === id ? { ...reminder, isActive: !reminder.isActive } : reminder
    ));
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.time || formData.days.length === 0) return;
    
    const newReminder = {
      id: editingReminder ? editingReminder.id : Date.now(),
      title: formData.title,
      time: formData.time,
      days: formData.days,
      isActive: true,
      sound: formData.sound,
      prayer: formData.prayer,
      icon: formData.icon,
      createdAt: editingReminder ? editingReminder.createdAt : new Date().toISOString().split('T')[0]
    };

    if (editingReminder) {
      setReminders(reminders.map(reminder => reminder.id === editingReminder.id ? newReminder : reminder));
    } else {
      setReminders([newReminder, ...reminders]);
    }

    setFormData({ title: '', time: '', days: [], sound: 'gentle-chime', prayer: '', icon: 'sun' });
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
      icon: reminder.icon
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this reminder?')) {
      setReminders(reminders.filter(reminder => reminder.id !== id));
    }
  };

  const handleDayToggle = (day) => {
    setFormData(prev => ({
      ...prev,
      days: prev.days.includes(day) 
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day]
    }));
  };

  const activeReminders = reminders.filter(r => r.isActive).length;
  const upcomingReminder = reminders
    .filter(r => r.isActive)
    .sort((a, b) => a.time.localeCompare(b.time))[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50 pt-16 pl-0 lg:pl-[224px]">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900 mb-2">
              Prayer Reminders
            </h1>
            <p className="text-gray-600 text-lg">Set regular reminders for Scripture-based prayer time</p>
          </div>
          <button
            onClick={() => {
              setEditingReminder(null);
              setFormData({ title: '', time: '', days: [], sound: 'gentle-chime', prayer: '', icon: 'sun' });
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-6 py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
          >
            <Plus className="w-5 h-5" />
            New Reminder
          </button>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Bell className="w-6 h-6 text-blue-700" />
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-semibold text-gray-900">{activeReminders}</h3>
                <p className="text-gray-600 font-medium">Active Reminders</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-semibold text-gray-900">{reminders.length}</h3>
                <p className="text-gray-600 font-medium">Total Reminders</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Calendar className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {upcomingReminder ? formatTime(upcomingReminder.time) : 'None'}
                </h3>
                <p className="text-gray-600 font-medium">Next Prayer</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <h2 className="text-xl font-medium text-gray-900 mb-4">Quick Setup</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { title: 'Morning Prayer', time: '07:00', icon: Sun, color: 'blue' },
              { title: 'Midday Prayer', time: '12:00', icon: Sun, color: 'yellow' },
              { title: 'Evening Prayer', time: '18:00', icon: Sunset, color: 'orange' },
              { title: 'Night Prayer', time: '22:00', icon: Moon, color: 'indigo' }
            ].map((preset, index) => {
              const Icon = preset.icon;
              return (
                <button
                  key={index}
                  onClick={() => {
                    setFormData({
                      title: preset.title,
                      time: preset.time,
                      days: daysOfWeek,
                      sound: 'gentle-chime',
                      prayer: '',
                      icon: preset.title.includes('Morning') ? 'sunrise' : 
                            preset.title.includes('Evening') ? 'sunset' :
                            preset.title.includes('Night') ? 'moon' : 'sun'
                    });
                    setShowModal(true);
                  }}
                  className={`p-4 border-2 border-gray-200 rounded-lg hover:border-${preset.color}-300 hover:bg-${preset.color}-50 transition-all duration-200 text-center`}
                >
                  <Icon className={`w-8 h-8 text-${preset.color}-600 mx-auto mb-2`} />
                  <p className="font-medium text-gray-900">{preset.title}</p>
                  <p className="text-sm text-gray-600">{formatTime(preset.time)}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Reminders List */}
        <div className="space-y-4">
          {reminders.map(reminder => {
            const IconComponent = getIconComponent(reminder.icon);
            
            return (
              <div key={reminder.id} className={`bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 ${!reminder.isActive ? 'opacity-60' : ''}`}>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-lg ${
                        reminder.isActive 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'bg-gray-100 text-gray-400'
                      }`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-medium text-gray-900">{reminder.title}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {formatTime(reminder.time)}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {getDaysText(reminder.days)}
                          </div>
                          <div className="flex items-center">
                            <Volume2 className="w-4 h-4 mr-1" />
                            {soundOptions.find(s => s.value === reminder.sound)?.label}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleReminder(reminder.id)}
                        className={`p-2 rounded-lg transition-all duration-200 ${
                          reminder.isActive
                            ? 'text-green-600 bg-green-100 hover:bg-green-200'
                            : 'text-gray-400 bg-gray-100 hover:bg-gray-200'
                        }`}
                        title={reminder.isActive ? 'Pause reminder' : 'Activate reminder'}
                      >
                        {reminder.isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                      </button>
                      <button
                        onClick={() => handleEdit(reminder)}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                        title="Edit reminder"
                      >
                        <Edit3 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(reminder.id)}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                        title="Delete reminder"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {reminder.prayer && (
                    <div className="bg-gradient-to-r from-blue-50 to-yellow-50 rounded-lg p-4 mb-4 border border-blue-100">
                      <p className="text-gray-700 italic">{reminder.prayer}</p>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {reminder.days.map(day => (
                      <span key={day} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-md">
                        {day.slice(0, 3)}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {reminders.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-10 h-10 text-blue-700" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No reminders set</h3>
            <p className="text-gray-600 mb-6">Create your first prayer reminder to build a consistent Scripture-based prayer habit</p>
            <button
              onClick={() => setShowModal(true)}
              className="px-6 py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors duration-200 font-medium"
            >
              Create First Reminder
            </button>
          </div>
        )}

        {/* Modal for Adding/Editing Reminder */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  {editingReminder ? 'Edit Reminder' : 'New Prayer Reminder'}
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Reminder Title</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Morning Prayer"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                      <input
                        type="time"
                        value={formData.time}
                        onChange={(e) => setFormData({...formData, time: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Sound</label>
                      <select
                        value={formData.sound}
                        onChange={(e) => setFormData({...formData, sound: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {soundOptions.map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Days to Repeat</label>
                    <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
                      {daysOfWeek.map(day => (
                        <button
                          key={day}
                          type="button"
                          onClick={() => handleDayToggle(day)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                            formData.days.includes(day)
                              ? 'bg-blue-700 text-white shadow-md'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {day.slice(0, 3)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Icon</label>
                    <div className="grid grid-cols-4 gap-3">
                      {iconOptions.map(option => {
                        const Icon = option.icon;
                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => setFormData({...formData, icon: option.value})}
                            className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                              formData.icon === option.value
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <Icon className={`w-6 h-6 mx-auto ${
                              formData.icon === option.value ? 'text-blue-600' : 'text-gray-600'
                            }`} />
                            <p className="text-xs mt-1">{option.label}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Prayer Text (Optional)</label>
                    <textarea
                      value={formData.prayer}
                      onChange={(e) => setFormData({...formData, prayer: e.target.value})}
                      rows="4"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      placeholder="Add a short prayer or verse to display with this reminder..."
                    />
                  </div>

                  <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="px-6 py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors duration-200 font-medium"
                    >
                      {editingReminder ? 'Update Reminder' : 'Create Reminder'}
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