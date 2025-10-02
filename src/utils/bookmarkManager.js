// utils/bookmarkManager.js
export const getCurrentUser = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
  return currentUser.id || currentUser.email || "guest";
};

export const toggleBookmark = (bookmark) => {
  const userId = getCurrentUser();
  const key = `bookmarks_${userId}`;
  const stored = JSON.parse(localStorage.getItem(key) || "[]");

  const exists = stored.find(b => b.id === bookmark.id);

  let updated;
  if (exists) {
    updated = stored.filter(b => b.id !== bookmark.id);
  } else {
    updated = [...stored, bookmark];
  }

  localStorage.setItem(key, JSON.stringify(updated));
  window.dispatchEvent(new Event("bookmarkUpdated"));
};

export const isBookmarked = (id) => {
  const userId = getCurrentUser();
  const stored = JSON.parse(localStorage.getItem(`bookmarks_${userId}`) || "[]");
  return stored.some(b => b.id === id);
};
