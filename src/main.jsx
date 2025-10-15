import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

// IMPORTANT: import the store, do NOT redefine it here
import useAuthStore  from './store/useAuthStore.js';

function Boot() {
  const initAuth = useAuthStore((s) => s.initAuth);
  const initialized = useAuthStore((s) => s.initialized);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  if (!initialized) {
    return <div className="p-6 text-sm opacity-70">Loading…</div>;
  }

  return <App />;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Boot />
  </React.StrictMode>
);
