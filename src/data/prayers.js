const STORAGE_KEY = "prayers";

export const loadPrayers = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error("Error loading prayers:", e);
    return [];
  }
};

const savePrayers = (prayers) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prayers));
  } catch (e) {
    console.error("Error saving prayers:", e);
  }
};

export const getPrayers = () => loadPrayers();

export const addPrayer = (prayerData) => {
  const prayers = loadPrayers();

  const prayer = {
    id: Date.now(),
    book: prayerData.book,
    chapter: prayerData.chapter,
    verse: prayerData.verse,
    title: prayerData.title,
    contents: prayerData.contents || [],
    insights: prayerData.insights || [],
    saved: false,
    answered: false,
    createdAt: new Date().toISOString(),
  };

  prayers.push(prayer);
  savePrayers(prayers);
  return prayers;
};

export const editPrayer = (id, updatedData) => {
  const prayers = loadPrayers();
  const updated = prayers.map((p) =>
    p.id === id ? { ...p, ...updatedData } : p
  );
  savePrayers(updated);
  return updated;
};

export const deletePrayer = (id) => {
  const prayers = loadPrayers();
  const updated = prayers.filter((p) => p.id !== id);
  savePrayers(updated);
  return updated;
};

export const toggleSaved = (id) => {
  const prayers = loadPrayers();
  const updated = prayers.map((p) =>
    p.id === id ? { ...p, saved: !p.saved } : p
  );
  savePrayers(updated);
  return updated;
};

export const toggleAnswered = (id) => {
  const prayers = loadPrayers();
  const updated = prayers.map((p) =>
    p.id === id ? { ...p, answered: !p.answered } : p
  );
  savePrayers(updated);
  return updated;
};

export const getSavedPrayers = () =>
  loadPrayers().filter((p) => p.saved);

export const getAnsweredPrayers = () =>
  loadPrayers().filter((p) => p.answered);

export const getRecentPrayers = (limit = 5) =>
  loadPrayers()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, limit);

export const getPrayersByBook = (book) =>
  loadPrayers().filter((p) => p.book === book);

export const searchPrayers = (query) => {
  query = query.toLowerCase();
  return loadPrayers().filter(
    (p) =>
      p.book.toLowerCase().includes(query) ||
      p.chapter.toString().includes(query) ||
      p.verse.toString().includes(query) ||
      p.title.toLowerCase().includes(query) ||
      (p.contents?.join(" ") || "").toLowerCase().includes(query) ||
      (p.insights?.join(" ") || "").toLowerCase().includes(query)
  );
};
