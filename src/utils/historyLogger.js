// src/utils/historyLogger.js
export const logPageVisit = (
  title,
  type = "page",
  reference = "",
  content = "",
  category = ""
) => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const userId = currentUser.id || currentUser.email || "guest";

  const existing = JSON.parse(localStorage.getItem(`history_log_${userId}`) || "[]");

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
  localStorage.setItem(`history_log_${userId}`, JSON.stringify(existing));
};
