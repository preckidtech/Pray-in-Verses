import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (userData) => set({ user: userData, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
      signup: (userData) => set({ user: userData, isAuthenticated: true }),
    }),
    { name: "auth-storage" }
  )
);

export default useAuthStore;
