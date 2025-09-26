// context/PrayerContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import {
  getPrayers as getPrayersData,
  addPrayer as addPrayerData,
  editPrayer as editPrayerData,
  deletePrayer as deletePrayerData,
  toggleSaved as toggleSavedData,
  toggleAnswered as toggleAnsweredData,
} from "../data/prayers";

const PrayerContext = createContext();

export const usePrayers = () => {
  const context = useContext(PrayerContext);
  if (!context) throw new Error("usePrayers must be used within a PrayersProvider");
  return context;
};

export const PrayersProvider = ({ children }) => {
  const [prayers, setPrayers] = useState([]);

  useEffect(() => {
    setPrayers(getPrayersData());
  }, []);

  const refreshPrayers = () => setPrayers(getPrayersData());

  const addPrayer = (data) => {
    const updated = addPrayerData(data);
    setPrayers(updated);
    return updated;
  };

  const editPrayer = (id, data) => {
    const updated = editPrayerData(id, data);
    setPrayers(updated);
    return updated;
  };

  const deletePrayer = (id) => {
    const updated = deletePrayerData(id);
    setPrayers(updated);
    return updated;
  };

  const toggleSaved = (id) => {
    const updated = toggleSavedData(id);
    setPrayers(updated);
    return updated;
  };

  const toggleAnswered = (id) => {
    const updated = toggleAnsweredData(id);
    setPrayers(updated);
    return updated;
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
        refreshPrayers,
      }}
    >
      {children}
    </PrayerContext.Provider>
  );
};
