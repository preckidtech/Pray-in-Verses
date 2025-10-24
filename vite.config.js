import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@/components": path.resolve(__dirname, "./src/components"),
      "@/pages": path.resolve(__dirname, "./src/pages"),
      "@/hooks": path.resolve(__dirname, "./src/hooks"),
      "@/store": path.resolve(__dirname, "./src/store"),
      "@/services": path.resolve(__dirname, "./src/services"),
      "@/utils": path.resolve(__dirname, "./src/utils"),
      "@/constants": path.resolve(__dirname, "./src/constants"),
      "@/types": path.resolve(__dirname, "./src/types"),
      "@/assets": path.resolve(__dirname, "./src/assets"),
    },
  },
  server: {
    port: 3000,
    open: true,
    proxy: {
      // Add whichever API roots you use
      "/auth": { target: "http://localhost:4000", changeOrigin: true, secure: false },
      "/browse": { target: "http://localhost:4000", changeOrigin: true, secure: false },
      "/saved-prayers": { target: "http://localhost:4000", changeOrigin: true, secure: false },
      "/journals": { target: "http://localhost:4000", changeOrigin: true, secure: false },
      "/admin/": { target: "http://localhost:4000", changeOrigin: true, secure: false },
    },
  },
  build: {
    outDir: "dist",
    sourcemap: true,
  },
});
