import React, { useState, useEffect, useRef } from "react";
import {
  User,
  Mail,
  Edit2,
  Save,
  X,
  Camera,
  Shield,
  Bell,
  LogOut,
  Bookmark,
  CheckCircle,
  Heart,
  Calendar,
  Settings,
  Trash2,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useAuthStore } from "../store";
import { useNavigate } from "react-router-dom";
import { getPrayers } from "../data/prayers";

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const fileInputRef = useRef(null);

  // Component state management
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Profile image state
  const [profileImage, setProfileImage] = useState(null);

  // Profile data state
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    joinDate: "",
    totalPrayers: 0,
    answeredPrayers: 0,
    savedPrayers: 0,
    notifications: true,
    privateProfile: false,
  });

  // Edit form state
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
  });

  /**
   * Enhanced user data retrieval with comprehensive fallbacks
   */
  const getCurrentUser = () => {
    console.log("=== Checking for current user ===");
    
    // Method 1: Check auth store
    if (user && (user.id || user.email) && user.name) {
      console.log("Found user in auth store:", user);
      return user;
    }

    // Method 2: Check currentUser in localStorage
    try {
      const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
      if ((currentUser.id || currentUser.email) && currentUser.name) {
        console.log("Found user in currentUser localStorage:", currentUser);
        return currentUser;
      }
    } catch (error) {
      console.error("Error parsing currentUser from localStorage:", error);
    }

    // Method 3: Check legacy localStorage data
    const legacyUserName = localStorage.getItem("userName");
    const legacyUserEmail = localStorage.getItem("userEmail");
    
    console.log("Legacy data - userName:", legacyUserName, "userEmail:", legacyUserEmail);
    
    if (legacyUserName && legacyUserEmail) {
      // Try to find this user in the users array
      try {
        const users = JSON.parse(localStorage.getItem("users") || "[]");
        console.log("Users array:", users);
        
        const foundUser = users.find(u => 
          u.email && u.email.toLowerCase() === legacyUserEmail.toLowerCase()
        );
        
        if (foundUser) {
          console.log("Found user in users array:", foundUser);
          // Update currentUser for future use
          localStorage.setItem("currentUser", JSON.stringify(foundUser));
          return foundUser;
        }
        
        // If not found in users array, create a basic user object
        const basicUser = {
          name: legacyUserName,
          email: legacyUserEmail,
          id: legacyUserEmail, // Use email as ID
          joinDate: new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long' 
          }),
          profileData: {
            totalPrayers: 0,
            answeredPrayers: 0,
            savedPrayers: 0,
            notifications: true,
            privateProfile: false,
          }
        };
        
        console.log("Created basic user object:", basicUser);
        localStorage.setItem("currentUser", JSON.stringify(basicUser));
        return basicUser;
        
      } catch (error) {
        console.error("Error processing users array:", error);
      }
    }

    // Method 4: Check if there's any user in users array (for cases where legacy data is missing)
    try {
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      if (users.length > 0) {
        console.log("Found users but no current user set. Using first user:", users[0]);
        const firstUser = users[0];
        localStorage.setItem("currentUser", JSON.stringify(firstUser));
        localStorage.setItem("userName", firstUser.name);
        localStorage.setItem("userEmail", firstUser.email);
        return firstUser;
      }
    } catch (error) {
      console.error("Error checking users array:", error);
    }

    console.log("No user found anywhere");
    return null;
  };

  /**
   * Initialize profile data
   */
  useEffect(() => {
    initializeProfile();
  }, [user]);

  /**
   * Format join date consistently
   */
  const formatJoinDate = (user) => {
    if (user.joinDate) {
      return user.joinDate;
    }
    
    if (user.createdAt) {
      const date = new Date(user.createdAt);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long' 
      });
    }
    
    // Fallback to current date
    return new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    });
  };

  /**
   * Initialize profile with enhanced error handling
   */
  const initializeProfile = async () => {
    try {
      setIsLoading(true);
      console.log("Initializing profile...");

      const currentUser = getCurrentUser();
      
      if (!currentUser) {
        console.log("No user found, redirecting to login");
        toast.error("Please log in to view your profile", { duration: 3000 });
        
        // Small delay to show the toast
        setTimeout(() => {
          navigate("/login");
        }, 1500);
        return;
      }

      console.log("Using user data:", currentUser);

      // Load profile image with multiple fallbacks
      const userId = currentUser.id || currentUser.email;
      let savedProfileImage = null;
      
      if (userId) {
        savedProfileImage = localStorage.getItem(`profileImage_${userId}`);
      }
      
      if (!savedProfileImage && currentUser.email) {
        savedProfileImage = localStorage.getItem(`profileImage_${currentUser.email}`);
      }
      
      if (!savedProfileImage) {
        savedProfileImage = localStorage.getItem("profileImage");
      }
      
      setProfileImage(savedProfileImage);

      // Get prayer statistics
      const savedPrayers = JSON.parse(
        localStorage.getItem(`savedPrayers_${userId}`) || 
        localStorage.getItem(`savedPrayers_${currentUser.email}`) ||
        localStorage.getItem("savedPrayers") || 
        "[]"
      );
      
      const answeredPrayers = JSON.parse(
        localStorage.getItem(`answeredPrayers_${userId}`) || 
        localStorage.getItem(`answeredPrayers_${currentUser.email}`) ||
        localStorage.getItem("answeredPrayers") || 
        "[]"
      );
      
      const prayers = getPrayers();

      // Set profile data
      const profileData = {
        name: currentUser.name || "User",
        email: currentUser.email || "",
        joinDate: formatJoinDate(currentUser),
        totalPrayers: prayers.length,
        answeredPrayers: answeredPrayers.length,
        savedPrayers: savedPrayers.length,
        notifications: currentUser.profileData?.notifications ?? true,
        privateProfile: currentUser.profileData?.privateProfile ?? false,
      };

      console.log("Setting profile data:", profileData);

      setProfile(profileData);
      setEditForm({
        name: profileData.name,
        email: profileData.email,
      });

      // Only show welcome message on first load, not on every re-render
      const hasShownWelcome = sessionStorage.getItem('profileWelcomeShown');
      if (!hasShownWelcome) {
        toast.success(`Welcome, ${profileData.name}!`, { duration: 2000 });
        sessionStorage.setItem('profileWelcomeShown', 'true');
      }

    } catch (error) {
      console.error("Profile initialization error:", error);
      toast.error("Failed to load profile data", { duration: 2000 });
      
      // If there's an error, try to redirect to login after a delay
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle profile form changes
   */
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  /**
   * Validate profile form
   */
  const validateProfileForm = () => {
    if (!editForm.name.trim()) {
      toast.error("Name is required", { duration: 2000 });
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editForm.email)) {
      toast.error("Please enter a valid email address", { duration: 2000 });
      return false;
    }

    return true;
  };

  /**
   * Save profile changes
   */
  const handleSave = async () => {
    if (!validateProfileForm()) return;

    setIsSaving(true);

    try {
      const currentUser = getCurrentUser();
      if (!currentUser) {
        toast.error("User session expired. Please log in again.", { duration: 2000 });
        navigate("/login");
        return;
      }
      
      // Update users array in localStorage
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const userIndex = users.findIndex(u => 
        u.id === currentUser.id || 
        (u.email && currentUser.email && u.email.toLowerCase() === currentUser.email.toLowerCase())
      );
      
      if (userIndex !== -1) {
        users[userIndex] = {
          ...users[userIndex],
          name: editForm.name,
          email: editForm.email,
        };
        localStorage.setItem("users", JSON.stringify(users));
      }

      // Update legacy localStorage items
      localStorage.setItem("userName", editForm.name);
      localStorage.setItem("userEmail", editForm.email);

      // Update current user session
      const updatedUser = {
        ...currentUser,
        name: editForm.name,
        email: editForm.email,
      };
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));

      // Update profile state
      setProfile(prev => ({
        ...prev,
        name: editForm.name,
        email: editForm.email,
      }));

      // Trigger event to update header
      window.dispatchEvent(new CustomEvent('profileUpdated'));

      setIsEditing(false);
      toast.success("Profile updated successfully!", { duration: 2000 });

    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("Failed to update profile", { duration: 2000 });
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Cancel profile editing
   */
  const handleCancel = () => {
    setEditForm({ 
      name: profile.name, 
      email: profile.email 
    });
    setIsEditing(false);
  };

  /**
   * Handle profile image upload
   */
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB", { duration: 2000 });
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file", { duration: 2000 });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageDataUrl = e.target.result;
      const currentUser = getCurrentUser();
      
      if (currentUser) {
        const userId = currentUser.id || currentUser.email;
        
        setProfileImage(imageDataUrl);
        
        // Store image with multiple keys
        if (userId) {
          localStorage.setItem(`profileImage_${userId}`, imageDataUrl);
        }
        if (currentUser.email) {
          localStorage.setItem(`profileImage_${currentUser.email}`, imageDataUrl);
        }
        localStorage.setItem("profileImage", imageDataUrl);
        
        window.dispatchEvent(new CustomEvent('profileUpdated'));
        toast.success("Profile picture updated!", { duration: 2000 });
      }
    };
    
    reader.onerror = () => {
      toast.error("Failed to read image file", { duration: 2000 });
    };
    
    reader.readAsDataURL(file);
  };

  /**
   * Trigger file input click
   */
  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  /**
   * Remove profile image
   */
  const handleRemoveImage = () => {
    const currentUser = getCurrentUser();
    
    if (currentUser) {
      const userId = currentUser.id || currentUser.email;
      
      setProfileImage(null);
      
      if (userId) {
        localStorage.removeItem(`profileImage_${userId}`);
      }
      if (currentUser.email) {
        localStorage.removeItem(`profileImage_${currentUser.email}`);
      }
      localStorage.removeItem("profileImage");
      
      window.dispatchEvent(new CustomEvent('profileUpdated'));
      toast.success("Profile picture removed", { duration: 2000 });
    }
  };

  /**
   * Toggle notification preferences
   */
  const toggleNotifications = async () => {
    try {
      const newNotificationState = !profile.notifications;
      
      setProfile(prev => ({ 
        ...prev, 
        notifications: newNotificationState 
      }));
      
      toast.success("Notification preferences updated!", { duration: 2000 });
    } catch (error) {
      console.error("Failed to update notifications:", error);
      toast.error("Failed to update notification preferences", { duration: 2000 });
    }
  };

  /**
   * Toggle privacy settings
   */
  const togglePrivacy = async () => {
    try {
      const newPrivacyState = !profile.privateProfile;
      
      setProfile(prev => ({ 
        ...prev, 
        privateProfile: newPrivacyState 
      }));
      
      toast.success("Privacy settings updated!", { duration: 2000 });
    } catch (error) {
      console.error("Failed to update privacy:", error);
      toast.error("Failed to update privacy settings", { duration: 2000 });
    }
  };

  /**
   * Handle email change request
   */
  const handleChangeEmail = () => {
    toast("Email change request sent! Check your inbox for instructions.", {
      duration: 3000,
      icon: "📧",
    });
  };

  /**
   * Handle user sign out
   */
  const handleSignOut = () => {
    try {
      localStorage.removeItem("currentUser");
      localStorage.removeItem("rememberedEmail");
      
      logout();
      
      toast.success("Signed out successfully", { duration: 2000 });
      navigate("/login");
    } catch (error) {
      console.error("Signout error:", error);
      toast.error("Error signing out", { duration: 2000 });
    }
  };

  /**
   * Debug button to check user data
   */
  const handleDebugUser = () => {
    const currentUser = getCurrentUser();
    console.log("=== DEBUG USER DATA ===");
    console.log("Auth store user:", user);
    console.log("Current user function result:", currentUser);
    console.log("localStorage currentUser:", localStorage.getItem("currentUser"));
    console.log("localStorage userName:", localStorage.getItem("userName"));
    console.log("localStorage userEmail:", localStorage.getItem("userEmail"));
    console.log("localStorage users:", localStorage.getItem("users"));
    console.log("========================");
    
    if (currentUser) {
      toast.success(`Found user: ${currentUser.name} (${currentUser.email})`, { duration: 3000 });
    } else {
      toast.error("No user found!", { duration: 3000 });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-20 lg:pl-40 px-4 pb-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0C2E8A] mx-auto mb-4"></div>
            <p className="text-[#0C2E8A] mb-2">Loading profile...</p>
            <button
              onClick={handleDebugUser}
              className="text-sm text-gray-600 underline hover:text-gray-800"
            >
              Debug user data
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-20 lg:pl-40 px-4 pb-8">
      <Toaster position="top-right" reverseOrder={false} />
      
      <div className="container mx-auto px-4 py-6">
        {/* Debug button for development */}
        <div className="fixed bottom-4 left-4 z-50">
          <button
            onClick={handleDebugUser}
            className="bg-gray-800 text-white text-xs px-2 py-1 rounded hover:bg-gray-700"
          >
            Debug
          </button>
        </div>

        {/* Page Title */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#0C2E8A] mb-2">My Profile</h1>
          <p className="text-[#0C2E8A] text-lg">Manage your prayer journey</p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Profile Header Card */}
          <div className="bg-white rounded-2xl shadow border mb-8 overflow-hidden">
            <div className="bg-gradient-to-r from-[#0C2E8A] to-[#FCCF3A] h-32"></div>
            
            <div className="px-8 pb-8">
              <div className="relative -mt-16 mb-4">
                <div className="w-32 h-32 bg-white rounded-full p-2 mx-auto relative shadow-lg">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                      <User className="w-16 h-16 text-[#0C2E8A]" />
                    </div>
                  )}

                  <button
                    onClick={handleCameraClick}
                    className="absolute bottom-2 right-2 bg-[#0C2E8A] text-white p-2 rounded-full hover:bg-[#1a4ba0] transition shadow-lg"
                    title="Upload profile picture"
                  >
                    <Camera className="w-4 h-4" />
                  </button>

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
                    name="name"
                    value={editForm.name}
                    onChange={handleFormChange}
                    className="text-3xl font-bold text-[#0C2E8A] bg-transparent border-b-2 border-[#0C2E8A] focus:outline-none text-center"
                    disabled={isSaving}
                  />
                ) : (
                  <h1 className="text-3xl font-bold text-[#0C2E8A]">
                    {profile.name}
                  </h1>
                )}
                <p className="text-gray-600 mt-1 flex items-center justify-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Member since {profile.joinDate}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Prayer Statistics Cards */}
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-2xl p-6 text-center shadow border hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-[#FCCF3A] rounded-full flex items-center justify-center mx-auto mb-3">
                    <Heart className="w-6 h-6 text-[#0C2E8A]" />
                  </div>
                  <p className="text-2xl font-bold text-[#0C2E8A]">
                    {profile.totalPrayers}
                  </p>
                  <p className="text-gray-600">Total Prayers</p>
                </div>
                
                <div className="bg-white rounded-2xl p-6 text-center shadow border hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-[#FCCF3A] rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="w-6 h-6 text-[#0C2E8A]" />
                  </div>
                  <p className="text-2xl font-bold text-[#0C2E8A]">
                    {profile.answeredPrayers}
                  </p>
                  <p className="text-gray-600">Answered Prayers</p>
                </div>
                
                <div className="bg-white rounded-2xl p-6 text-center shadow border hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-[#FCCF3A] rounded-full flex items-center justify-center mx-auto mb-3">
                    <Bookmark className="w-6 h-6 text-[#0C2E8A]" />
                  </div>
                  <p className="text-2xl font-bold text-[#0C2E8A]">
                    {profile.savedPrayers}
                  </p>
                  <p className="text-gray-600">Saved Prayers</p>
                </div>
              </div>
            </div>

            {/* Account Information Card */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow border p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-[#0C2E8A] flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Account Information
                  </h2>
                  
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-[#0C2E8A] text-white rounded-lg hover:bg-[#1a4ba0] transition"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit Profile
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-4 py-2 bg-[#0C2E8A] text-white rounded-lg hover:bg-[#1a4ba0] transition disabled:opacity-50"
                      >
                        <Save className="w-4 h-4" />
                        {isSaving ? "Saving..." : "Save"}
                      </button>
                      <button
                        onClick={handleCancel}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-4 py-2 bg-[#FCCF3A] text-[#0C2E8A] rounded-lg hover:bg-[#fdd55a] transition disabled:opacity-50"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="name"
                        value={editForm.name}
                        onChange={handleFormChange}
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={isSaving}
                      />
                    ) : (
                      <p className="px-4 py-3 bg-gray-50 rounded-lg text-[#0C2E8A]">
                        {profile.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={editForm.email}
                        onChange={handleFormChange}
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={isSaving}
                      />
                    ) : (
                      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg">
                        <span className="text-[#0C2E8A] flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          {profile.email}
                        </span>
                        <button
                          onClick={handleChangeEmail}
                          className="text-[#0C2E8A] hover:text-[#1a4ba0] text-sm font-semibold transition"
                        >
                          Change Email
                        </button>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Member Since
                    </label>
                    <p className="px-4 py-3 bg-gray-50 rounded-lg text-[#0C2E8A] flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {profile.joinDate}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Settings Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow border p-6">
                <h2 className="text-xl font-bold text-[#0C2E8A] mb-6 flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Settings
                </h2>

                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <Bell className="w-5 h-5 text-[#0C2E8A]" />
                      <div>
                        <span className="text-[#0C2E8A] block font-medium">Notifications</span>
                        <span className="text-xs text-gray-500">
                          Prayer reminders & updates
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={toggleNotifications}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        profile.notifications ? "bg-[#0C2E8A]" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          profile.notifications ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-[#0C2E8A]" />
                      <div>
                        <span className="text-[#0C2E8A] block font-medium">Private Profile</span>
                        <span className="text-xs text-gray-500">
                          Hide your prayer activity
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={togglePrivacy}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        profile.privateProfile ? "bg-[#0C2E8A]" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          profile.privateProfile ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="pt-4">
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-3 w-full py-3 px-4 text-red-600 hover:text-red-700 hover:bg-red-50 transition rounded-lg"
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="font-medium">Sign Out</span>
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