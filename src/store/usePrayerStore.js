import { create } from "zustand";

const usePrayerStore = create((set) => ({
  step: 1,
  totalSteps: 3,
  prayerPoints: [],
  affirmations: [],
  setStep: (step) => set({ step }),
  nextStep: () => set((s) => ({ step: s.step < s.totalSteps ? s.step + 1 : s.step })),
  prevStep: () => set((s) => ({ step: s.step > 1 ? s.step - 1 : s.step })),
  setPrayerPoints: (points) => set({ prayerPoints: points }),
  setAffirmations: (items) => set({ affirmations: items }),
}));

export default usePrayerStore;
