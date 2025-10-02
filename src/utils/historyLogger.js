// src/utils/historyLogger.js

/**
 * Logs a page visit or user activity to the history
 * @param {Object} params - The logging parameters
 * @param {string} params.title - Title of the activity
 * @param {string} params.type - Type of activity (prayer, verse, journal, page)
 * @param {string} params.reference - Reference information (e.g., Bible verse)
 * @param {string} params.content - Content description
 * @param {string} params.category - Category of the activity
 */
export const logToHistory = ({
  title = "Untitled",
  type = "page",
  reference = "",
  content = "",
  category = "General"
}) => {
  try {
    // Get current user ID
    const getCurrentUser = () => {
      const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
      return currentUser.id || currentUser.email || "guest";
    };

    const userId = getCurrentUser();
    
    // Create the history entry
    const historyEntry = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title,
      type,
      reference,
      content,
      category,
      timestamp: new Date().toISOString()
    };

    // Get existing history for this user
    const existingHistory = JSON.parse(
      localStorage.getItem(`history_${userId}`) || "[]"
    );

    // Check if similar entry exists in last 5 seconds (prevent duplicates)
    const recentDuplicate = existingHistory.find(item => {
      const timeDiff = new Date() - new Date(item.timestamp);
      return (
        item.title === title &&
        item.type === type &&
        item.reference === reference &&
        timeDiff < 5000
      );
    });

    if (recentDuplicate) {
      console.log("Duplicate entry prevented:", title);
      return;
    }

    // Add new entry at the beginning
    existingHistory.unshift(historyEntry);

    // Keep only last 500 entries to prevent storage overflow
    const trimmedHistory = existingHistory.slice(0, 500);

    // Save to localStorage
    localStorage.setItem(`history_${userId}`, JSON.stringify(trimmedHistory));

    // Dispatch custom event to notify History component
    window.dispatchEvent(new Event("historyUpdated"));

    console.log("History logged:", historyEntry);
  } catch (error) {
    console.error("Error logging to history:", error);
  }
};

/**
 * Log a prayer-related activity
 */
export const logPrayer = (title, content, reference = "") => {
  logToHistory({
    title,
    type: "prayer",
    reference,
    content,
    category: "Prayer"
  });
};

/**
 * Log a Bible verse visit
 */
export const logVerse = (bookTitle, chapter, verse, content = "") => {
  logToHistory({
    title: `${bookTitle} ${chapter}:${verse}`,
    type: "verse",
    reference: `${bookTitle} ${chapter}:${verse}`,
    content,
    category: "Bible Study"
  });
};

/**
 * Log a journal entry
 */
export const logJournal = (title, content, mood = "") => {
  logToHistory({
    title,
    type: "journal",
    reference: mood ? `Mood: ${mood}` : "",
    content,
    category: "Journal"
  });
};

/**
 * Log a page visit
 */
export const logPageVisit = (pageName, description = "") => {
  logToHistory({
    title: pageName,
    type: "page",
    reference: window.location.pathname,
    content: description,
    category: "Navigation"
  });
};