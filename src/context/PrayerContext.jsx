// context/PrayerContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import {
  getPrayers,
  addPrayer as addPrayerData,
  editPrayer as editPrayerData,
  deletePrayer as deletePrayerData,
  toggleSaved as toggleSavedData,
  toggleAnswered as toggleAnsweredData,
} from "../data/prayers";

const PrayerContext = createContext();

export const usePrayers = () => {
  const context = useContext(PrayerContext);
  if (!context) {
    throw new Error("usePrayers must be used within a PrayersProvider");
  }
  return context;
};

export const PrayersProvider = ({ children }) => {
  const [prayers, setPrayers] = useState([]);

  // Load prayers initially
  const loadPrayers = () => {
    const allPrayers = getPrayers();
    setPrayers(allPrayers);
  };

  useEffect(() => {
    loadPrayers();
  }, []);

  const addPrayer = (data) => {
    addPrayerData(data); // save data in storage/database
    loadPrayers(); // reload to update global state
  };

  const editPrayer = (id, data) => {
    editPrayerData(id, data);
    loadPrayers();
  };

  const deletePrayer = (id) => {
    deletePrayerData(id);
    loadPrayers();
  };

  const toggleSaved = (id) => {
    toggleSavedData(id);
    loadPrayers();
  };

  const toggleAnswered = (id) => {
    toggleAnsweredData(id);
    loadPrayers();
  };

  return (
    <PrayerContext.Provider
      value={{
        prayers,
        addPrayer,
        editPrayer,
        deletePrayer,
        toggleSaved,
        toggleAnswered,
      }}
    >
      {children}
    </PrayerContext.Provider>
  );
};
