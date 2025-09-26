// src/App.jsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import { useUIStore } from "./store";
import { PrayersProvider } from "./context/PrayerContext";

// Layout
import Header from "./components/layout/Header";

// Pages
import Welcome from "./pages/onboarding/Welcome";
import Login from "./pages/onboarding/Login";
import SignUp from "./pages/onboarding/Signup";
import ForgotPassword from "./pages/onboarding/ForgotPassword";
import Home from "./pages/Home";
import Journal from "./pages/Journal";
import Explore from "./pages/Explore";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import SavedPrayers from "./pages/SavedPrayers";
import AnsweredPrayers from "./pages/AnsweredPrayers";
import Reminders from "./pages/Reminders";
import PrayerWalls from "./pages/PrayerWalls";
import Mission from "./pages/Mission";
import About from "./pages/About";
import GuidedPrayer from "./pages/GuidedPrayer";
import BrowsePrayers from "./pages/BrowsePrayers";
import BibleVerse from "./pages/BibleVerse";

// New pages
import BookPage from "./pages/BookPage";
import ChapterPage from "./pages/ChapterPage";
import VerseDetails from "./pages/VerseDetails";

// Admin dashboard
import AdminForm from "./pages/admin/AdminForm";

// Toaster
import { Toaster } from "react-hot-toast";

function AppContent() {
  const { theme } = useUIStore();
  const location = useLocation();

  const authFreePaths = ["/", "/login", "/signup", "/forgot-password"];
  const isLoggedInView = !authFreePaths.includes(location.pathname);

  return (
    <div className={theme === "dark" ? "dark" : ""}>
      {isLoggedInView && <Header />}
      <div className="min-h-screen flex flex-col bg-white dark:bg-primary text-primary dark:text-white font-sans">
        <main className="flex-1 pb-14 md:pb-0">
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/home" element={<Home />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/guided-prayer" element={<GuidedPrayer />} />
            <Route path="/browse-prayers" element={<BrowsePrayers />} />
            <Route path="/bible-verse" element={<BibleVerse />} />
            <Route path="/answered-prayers" element={<AnsweredPrayers />} />
            <Route path="/saved-prayers" element={<SavedPrayers />} />
            <Route path="/reminders" element={<Reminders />} />
            <Route path="/prayer-wall" element={<PrayerWalls />} />
            <Route path="/about" element={<About />} />
            <Route path="/mission" element={<Mission />} />

            {/* Bible dynamic routes */}
            <Route path="/book/:bookSlug" element={<BookPage />} />
            <Route path="/book/:bookSlug/chapter/:chapterNumber" element={<ChapterPage />} />
            <Route path="/book/:bookSlug/chapter/:chapterNumber/verse/:verseNumber" element={<VerseDetails />} />

            {/* Admin dashboard Route */}
            <Route path="/admin" element={<AdminForm />} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          <Toaster position="top-right" reverseOrder={false} />
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <PrayersProvider>
        <AppContent />
      </PrayersProvider>
    </Router>
  );
}

export default App;
