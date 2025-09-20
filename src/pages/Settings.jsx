import React from "react";
import { useUIStore, useAuthStore } from "../store";
import Button from "../components/ui/Button";

const Settings = () => {
  const toggleTheme = useUIStore((s) => s.toggleTheme);
  const theme = useUIStore((s) => s.theme);
  const logout = useAuthStore((s) => s.logout);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Settings</h2>

      <div className="bg-white p-4 rounded shadow-sm max-w-md">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="font-semibold">Theme</h4>
            <p className="text-sm text-gray-600">Current: {theme}</p>
          </div>
          <Button onClick={toggleTheme}>Toggle Theme</Button>
        </div>

        <div className="flex justify-end">
          <Button variant="secondary" onClick={logout}>Logout</Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
