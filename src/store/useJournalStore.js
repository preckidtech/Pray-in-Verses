import { create } from "zustand";
import { persist } from "zustand/middleware";

const useJournalStore = create(
  persist(
    (set, get) => ({
      journals: [],
      addJournal: (entry) =>
        set((state) => ({
          journals: [...state.journals, { id: Date.now(), ...entry }],
        })),
      updateJournal: (id, updated) =>
        set((state) => ({
          journals: state.journals.map((j) => (j.id === id ? { ...j, ...updated } : j)),
        })),
      deleteJournal: (id) =>
        set((state) => ({
          journals: state.journals.filter((j) => j.id !== id),
        })),
      getJournalById: (id) => get().journals.find((j) => j.id === id),
    }),
    { name: "journal-storage" }
  )
);

export default useJournalStore;
