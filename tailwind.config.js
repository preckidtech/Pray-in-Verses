// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#0C2E8A",     // Deep Royal Blue
        secondary: "#FCCF3A",   // Sunrise Gold
        olive: "#ABBC6B",       // Olive Green
        cream: "#FFFEF0",       // So Cream
        crimson: "#BA1A1A",     // Crimson Red
        sky: "#3FCBFF",         // Sky Blue
      },
      fontFamily: {
        primary: ["'Playfair Display'", "serif"], // Elegant, classical, spiritual
        secondary: ["Roboto", "sans-serif"],      // Clean, readable, modern
        sans: ["Open Sans", "sans-serif"],        // Alternative secondary font
      },
      fontSize: {
        scripture: ["1.125rem", { lineHeight: "1.75rem" }], // Slightly larger scripture style
      },
      fontStyle: {
        scripture: "italic",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },
      boxShadow: {
        soft: "0 2px 8px rgba(0,0,0,0.08)",
      },
    },
  },
  plugins: [],
};
