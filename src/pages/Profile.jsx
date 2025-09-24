import React, { useState, useEffect, useRef } from "react";
import { User, Mail, Edit2, Save, X, Camera, Shield, Bell, LogOut, Bookmark, CheckCircle, Heart } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { getPrayers } from "../data/prayers";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(localStorage.getItem("profileImage") || null);
  const fileInputRef = useRef(null);
  const [profile, setProfile] = useState({
    name: localStorage.getItem("userName") || "John Smith",
    email: localStorage.getItem("userEmail") || "john.smith@email.com",
    joinDate: "January 2024",
    totalPrayers: 0,
    answeredPrayers: 0,
    savedPrayers: 0,
    notifications: true,
    privateProfile: false
  });

  // Update stats from localStorage and prayers data
  useEffect(() => {
    const savedPrayers = JSON.parse(localStorage.getItem("savedPrayers")) || [];
    const answeredPrayers = JSON.parse(localStorage.getItem("answeredPrayers")) || [];
    
    setProfile(prev => ({
      ...prev,
      totalPrayers: prayers.length, // Total prayers from the prayers data
      answeredPrayers: answeredPrayers.length,
      savedPrayers: savedPrayers.length
    }));
  }, []);
  const [editForm, setEditForm] = useState({
    name: profile.name,
    email: profile.email
  });

  const handleSave = () => {
    setProfile(prev => ({...prev, name: editForm.name, email: editForm.email}));
    // Save to localStorage for persistence
    localStorage.setItem("userName", editForm.name);
    localStorage.setItem("userEmail", editForm.email);
    setIsEditing(false);
    toast.success("Profile updated successfully!");
  };

  const handleCancel = () => {
    setEditForm({name: profile.name, email: profile.email});
    setIsEditing(false);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        toast.error("Please select a valid image file");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const imageDataUrl = e.target.result;
        setProfileImage(imageDataUrl);
        localStorage.setItem("profileImage", imageDataUrl);
        toast.success("Profile picture updated!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
    localStorage.removeItem("profileImage");
    toast("Profile picture removed");
  };

  const toggleNotifications = () => {
    setProfile(prev => ({...prev, notifications: !prev.notifications}));
    toast.success("Notification preferences updated!");
  };

  const togglePrivacy = () => {
    setProfile(prev => ({...prev, privateProfile: !prev.privateProfile}));
    toast.success("Privacy settings updated!");
  };

  const handleChangeEmail = () => {
    toast("Email change request sent! Check your inbox for instructions.", {
      duration: 4000,
      icon: "📧"
    });
  };

  const handleSignOut = () => {
    toast("Signing out...", {
      icon: "👋"
    });
    // Handle sign out logic here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-20 lg:pl-40 px-4 pb-8">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="container mx-auto px-4 py-6">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600 text-lg">Manage your prayer journey</p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="bg-white rounded-2xl shadow border mb-8 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-32"></div>
            <div className="px-8 pb-8">
              <div className="relative -mt-16 mb-4">
                <div className="w-32 h-32 bg-white rounded-full p-2 mx-auto relative">
                  {profileImage ? (
                    <img 
                      src={profileImage} 
                      alt="Profile" 
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                      <User className="w-16 h-16 text-blue-600" />
                    </div>
                  )}
                  
                  {/* Camera Button */}
                  <button 
                    onClick={handleCameraClick}
                    className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition shadow-lg"
                    title="Upload profile picture"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                  
                  {/* Remove Image Button (only show if image exists) */}
                  {profileImage && (
                    <button 
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700 transition shadow-lg"
                      title="Remove profile picture"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
                
                {/* Hidden File Input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>
              
              <div className="text-center">
                {isEditing ? (
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    className="text-3xl font-bold text-gray-900 bg-transparent border-b-2 border-blue-600 focus:outline-none text-center"
                  />
                ) : (
                  <h1 className="text-3xl font-bold text-gray-900">{profile.name}</h1>
                )}
                <p className="text-gray-600 mt-1">Member since {profile.joinDate}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Stats Cards */}
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-2xl p-6 text-center shadow border">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Heart className="w-6 h-6 text-blue-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{profile.totalPrayers}</p>
                  <p className="text-gray-600">Total Prayers</p>
                </div>
                <div className="bg-white rounded-2xl p-6 text-center shadow border">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{profile.answeredPrayers}</p>
                  <p className="text-gray-600">Answered Prayers</p>
                </div>
                <div className="bg-white rounded-2xl p-6 text-center shadow border">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Bookmark className="w-6 h-6 text-purple-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{profile.savedPrayers}</p>
                  <p className="text-gray-600">Saved Prayers</p>
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow border p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Account Information</h2>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit Profile
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={handleSave}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                      >
                        <Save className="w-4 h-4" />
                        Save
                      </button>
                      <button
                        onClick={handleCancel}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">{profile.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-900">{profile.email}</span>
                        <button 
                          onClick={handleChangeEmail}
                          className="text-blue-600 hover:text-blue-700 text-sm font-semibold"
                        >
                          Change Email
                        </button>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Member Since</label>
                    <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">{profile.joinDate}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Settings */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow border p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Settings</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <Bell className="w-5 h-5 text-gray-600" />
                      <div>
                        <span className="text-gray-700 block">Notifications</span>
                        <span className="text-xs text-gray-500">Prayer reminders & updates</span>
                      </div>
                    </div>
                    <button
                      onClick={toggleNotifications}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        profile.notifications ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          profile.notifications ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-gray-600" />
                      <div>
                        <span className="text-gray-700 block">Private Profile</span>
                        <span className="text-xs text-gray-500">Hide your prayer activity</span>
                      </div>
                    </div>
                    <button
                      onClick={togglePrivacy}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        profile.privateProfile ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          profile.privateProfile ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="pt-4 border-t">
                    <button 
                      onClick={handleSignOut}
                      className="flex items-center gap-3 w-full py-3 text-red-600 hover:text-red-700 transition"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;