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
import BottomNavigation from "./components/layout/ButtomNavigation";

// Auth guard (APP)
import RequireAuth from "./components/RequireAuth";

// Pages (public)
import Welcome from "./pages/onboarding/Welcome";
import Login from "./pages/onboarding/Login";
import SignUp from "./pages/onboarding/Signup";
import ForgotPassword from "./pages/onboarding/ForgotPassword";

// Pages (app, require auth)
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
import Bookmarks from "./pages/Bookmark";
import MyPrayerPoint from "./pages/MyPrayerPoint";
import History from "./pages/History";

// Browse flow (app, require auth)
import BookPage from "./pages/BookPage";
import ChapterPage from "./pages/ChapterPage";
import VerseDetails from "./pages/VerseDetails";

// --------------------
// Admin (separate auth)
// --------------------
import AdminLayout from "./admin/AdminLayout";
import AdminRequireAuth from "./admin/RequireAuth"; // aliased to avoid clash
import AdminLogin from "./admin/pages/Login";
import AdminDashboard from "./admin/pages/Dashboard";
import CuratedList from "./admin/pages/CuratedList";
import CuratedEdit from "./admin/pages/CuratedEdit"; // if your file is CuratedEdit.jsx, keep that name; shown aliased here to avoid collision below
import Invites from "./admin/pages/Invites";
import AcceptInvite from "./admin/pages/AcceptInvite";
// Toaster
import { Toaster } from "react-hot-toast";

function AppContent() {
  const { theme } = useUIStore();
  const location = useLocation();

  // Public routes (no header / bottom nav)
  const publicPaths = ["/", "/login", "/signup", "/forgot-password", "/admin/login"];

  const isAppLoggedInView = !publicPaths.includes(location.pathname)
    // treat /admin/* as separate layout (no app header/footer)
    && !location.pathname.startsWith("/admin");

  return (
    <div className={theme === "dark" ? "dark" : ""}>
      {/* APP Header (not shown on admin pages or public pages) */}
      {isAppLoggedInView && <Header />}

      <div className="min-h-screen flex flex-col bg-white dark:bg-primary text-primary dark:text-white font-sans">
        <main className="flex-1 pb-14 md:pb-0">
          <Routes>
            {/* Public / onboarding */}
            <Route path="/" element={<Welcome />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Protected APP routes */}
            <Route element={<RequireAuth />}>
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
              <Route path="/bookmarks" element={<Bookmarks />} />
              <Route path="/my-prayer-point" element={<MyPrayerPoint />} />
              <Route path="/history" element={<History />} />

              {/* Browse flow (books → chapters → verses) */}
              <Route path="/book/:bookSlug" element={<BookPage />} />
              <Route path="/book/:bookSlug/chapter/:chapterNumber" element={<ChapterPage />} />
              <Route path="/book/:bookSlug/chapter/:chapterNumber/verse/:verseNumber" element={<VerseDetails />} />
            </Route>

            {/* ------------------ */}
            {/* Admin auth & routes */}
            {/* ------------------ */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/accept" element={<AcceptInvite />} />
            
            <Route
              path="/admin"
              element={
                <AdminRequireAuth>
                  <AdminLayout />
                </AdminRequireAuth>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="curated" element={<CuratedList />} />
              <Route path="curated/new" element={<CuratedEdit />} />
              <Route path="curated/:id" element={<CuratedEdit />} />
              <Route
                path="invites"
                element={
                  <AdminRequireAuth roles={["SUPER_ADMIN"]}>
                    <Invites />
                  </AdminRequireAuth>
                }
              />
            </Route>

            {/* Redirect unknown routes */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* APP Bottom Navigation - only visible on app-logged-in views (not admin/public) */}
        {isAppLoggedInView && <BottomNavigation />}

        {/* Notifications */}
        <Toaster position="top-right" reverseOrder={false} />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <PrayersProvider>
        <AppContent />
      </PrayersProvider>
    </Router>
  );
}
