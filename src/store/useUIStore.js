// useUIStore.js
import { create } from "zustand"; // named import, not default

export const useUIStore = create((set) => ({
  theme: "light",          // default theme
  setTheme: (theme) => set({ theme }),
  sidebarOpen: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}));
