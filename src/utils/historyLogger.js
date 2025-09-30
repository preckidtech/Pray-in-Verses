// src/utils/historyLogger.js
export const logPageVisit = (
  title,
  type = "page",
  reference = "",
  content = "",
  category = ""
) => {
  try {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    const userId = currentUser.id || currentUser.email || "guest";

    const existing = JSON.parse(localStorage.getItem(`history_${userId}`) || "[]");

    const newEntry = {
      id: Date.now() + Math.random(),
      title,
      type,
      reference,
      content,
      category,
      timestamp: Date.now(),
    };

    existing.push(newEntry);
    localStorage.setItem(`history_${userId}`, JSON.stringify(existing));

    // Notify History page about update
    window.dispatchEvent(new Event("historyUpdated"));
  } catch (error) {
    console.error("Error logging page visit:", error);
  }
};
