import { create } from "zustand";

const useVerseStore = create((set) => ({
  verseOfDay: {
    reference: "John 3:16",
    text: "For God so loved the world that he gave his one and only Son...",
  },
  setVerseOfDay: (verse) => set({ verseOfDay: verse }),
}));

export default useVerseStore;
