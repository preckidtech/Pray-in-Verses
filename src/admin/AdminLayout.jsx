import React from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { api } from "./api";
import { useMe } from "./RequireAuth";

export default function AdminLayout() {
  const { me } = useMe();
  return (
    <div className="min-h-screen grid grid-rows-[auto,1fr]">
      <header className="border-b bg-white">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/admin" className="font-semibold">Pray in Verses — Admin</Link>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">{me?.displayName} <span className="text-xs text-gray-400">({me?.role})</span></span>
            <button
              onClick={() => api.logout().then(()=>window.location.assign("/admin/login"))}
              className="px-3 py-1 rounded-md border"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      <div className="max-w-5xl mx-auto w-full grid grid-cols-12 gap-6 px-4 py-6">
        <aside className="col-span-3">
          <nav className="space-y-2">
            <NavLink to="/admin" end className={({isActive}) => `block px-3 py-2 rounded-md ${isActive?'bg-gray-900 text-white':'border'}`}>Dashboard</NavLink>
            <NavLink to="/admin/curated" className={({isActive}) => `block px-3 py-2 rounded-md ${isActive?'bg-gray-900 text-white':'border'}`}>Curated Prayers</NavLink>
            {me?.role === "SUPER_ADMIN" && (
              <NavLink to="/admin/invites" className={({isActive}) => `block px-3 py-2 rounded-md ${isActive?'bg-gray-900 text-white':'border'}`}>Invites</NavLink>
            )}
          </nav>
        </aside>
        <main className="col-span-9">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
