import React, { useState, useEffect } from "react";
import {
  Search,
  Edit,
  Trash2,
  Plus,
  BookOpen,
  X,
  Save,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { usePrayers } from "../../context/PrayerContext";

const bibleBooks = [
  "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy", "Joshua",
  "Judges", "Ruth", "1 Samuel", "2 Samuel", "1 Kings", "2 Kings",
  "1 Chronicles", "2 Chronicles", "Ezra", "Nehemiah", "Esther", "Job",
  "Psalms", "Proverbs", "Ecclesiastes", "Song of Solomon", "Isaiah",
  "Jeremiah", "Lamentations", "Ezekiel", "Daniel", "Hosea", "Joel",
  "Amos", "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk",
  "Zephaniah", "Haggai", "Zechariah", "Malachi", "Matthew", "Mark",
  "Luke", "John", "Acts", "Romans", "1 Corinthians", "2 Corinthians",
  "Galatians", "Ephesians", "Philippians", "Colossians", "1 Thessalonians",
  "2 Thessalonians", "1 Timothy", "2 Timothy", "Titus", "Philemon",
  "Hebrews", "James", "1 Peter", "2 Peter", "1 John", "2 John", "3 John",
  "Jude", "Revelation",
];

const AdminForm = () => {
  const {
    prayers,
    addPrayer,
    editPrayer,
    deletePrayer,
    toggleSaved,
    toggleAnswered,
  } = usePrayers();

  const [book, setBook] = useState("");
  const [chapter, setChapter] = useState("");
  const [verse, setVerse] = useState("");
  const [themeFocus, setThemeFocus] = useState("");
  const [scripturalReference, setScripturalReference] = useState("");
  const [shortInsight, setShortInsight] = useState("");
  const [keyLessonInput, setKeyLessonInput] = useState("");
  const [keyLessons, setKeyLessons] = useState([]);
  const [prayerPointInput, setPrayerPointInput] = useState("");
  const [prayerPoints, setPrayerPoints] = useState([]);
  const [closingPrayer, setClosingPrayer] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [filteredPrayers, setFilteredPrayers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBookFilter, setSelectedBookFilter] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);

  useEffect(() => {
    filterPrayers();
  }, [prayers, searchQuery, selectedBookFilter]);

  const filterPrayers = () => {
    let filtered = prayers;
    if (searchQuery) {
      filtered = prayers.filter(
        (p) =>
          p.themeFocus.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.book.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (p.scripturalReference &&
            p.scripturalReference
              .toLowerCase()
              .includes(searchQuery.toLowerCase()))
      );
    }
    if (selectedBookFilter) {
      filtered = filtered.filter((p) => p.book === selectedBookFilter);
    }
    setFilteredPrayers(filtered);
    setCurrentPage(1);
  };

  const handleAddKeyLesson = () => {
    if (keyLessonInput.trim()) {
      setKeyLessons([...keyLessons, keyLessonInput.trim()]);
      setKeyLessonInput("");
    }
  };

  const handleRemoveKeyLesson = (index) => {
    setKeyLessons(keyLessons.filter((_, i) => i !== index));
  };

  const handleAddPrayerPoint = () => {
    if (prayerPointInput.trim()) {
      setPrayerPoints([...prayerPoints, prayerPointInput.trim()]);
      setPrayerPointInput("");
    }
  };

  const handleRemovePrayerPoint = (index) => {
    setPrayerPoints(prayerPoints.filter((_, i) => i !== index));
  };

  const handleEdit = (prayer) => {
    setEditingId(prayer.id);
    setBook(prayer.book);
    setChapter(prayer.chapter?.toString() || "");
    setVerse(prayer.verse?.toString() || "");
    setThemeFocus(prayer.themeFocus || "");
    setScripturalReference(prayer.scripturalReference || "");
    setShortInsight(prayer.shortInsight || "");
    setKeyLessons(prayer.keyLessons || []);
    setPrayerPoints(prayer.prayerPoints || []);
    setClosingPrayer(prayer.closingPrayer || "");
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this prayer?")) {
      deletePrayer(id);
      toast.success("Prayer deleted successfully!");
    }
  };

  const handleSubmit = () => {
    if (!book || !chapter || !themeFocus || !scripturalReference || !shortInsight) {
      toast.error(
        "Please fill in all required fields (Book, Chapter, Theme/Focus, Scriptural Reference, Short Insight)"
      );
      return;
    }

    const prayerData = {
      book,
      chapter: parseInt(chapter),
      verse: verse ? parseInt(verse) : null,
      themeFocus,
      scripturalReference,
      shortInsight,
      keyLessons,
      prayerPoints,
      closingPrayer,
    };

    try {
      if (editingId) {
        editPrayer(editingId, prayerData);
        toast.success("Prayer updated successfully!");
      } else {
        addPrayer(prayerData);
        toast.success("Prayer added successfully!");
      }
      resetForm();
    } catch {
      toast.error("Error saving prayer. Please try again.");
    }
  };

  const resetForm = () => {
    setBook("");
    setChapter("");
    setVerse("");
    setThemeFocus("");
    setScripturalReference("");
    setShortInsight("");
    setKeyLessons([]);
    setPrayerPoints([]);
    setClosingPrayer("");
    setKeyLessonInput("");
    setPrayerPointInput("");
    setEditingId(null);
    setShowForm(false);
  };

  const totalPages = Math.ceil(filteredPrayers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPrayers = filteredPrayers.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const getPrayerCounts = () => {
    const counts = {};
    prayers.forEach((p) => {
      counts[p.book] = (counts[p.book] || 0) + 1;
    });
    return counts;
  };
  const prayerCounts = getPrayerCounts();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-20 lg:pl-[224px] px-4 pb-8">
      <Toaster position="top-right" reverseOrder={false} />

      {/* Header */}
      {/* Form Section */}
      {/* Search & Filter */}
      {/* Prayer List */}
      {/* Pagination */}
    </div>
  );
};

export default AdminForm;
