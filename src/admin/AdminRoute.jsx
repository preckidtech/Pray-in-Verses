// src/admin/AdminRoute.jsx
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { api } from "./api";
import toast from "react-hot-toast";

export default function AdminRoute() {
  const [state, setState] = React.useState({ loading: true, ok: false });
  const loc = useLocation();

  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await api.me();
        const user = res?.data || res?.user || res;
        const role = user?.role;
        const allowed = ["EDITOR", "MODERATOR", "SUPER_ADMIN"];
        if (alive) setState({ loading: false, ok: allowed.includes(role) });
      } catch {
        if (alive) setState({ loading: false, ok: false });
      }
    })();
    return () => { alive = false; };
  }, [loc]);

  if (state.loading) return null; // or a spinner/skeleton
  if (!state.ok) {
    toast.error("Admins only");
    // send to admin login if you have it; else fallback to main login
    return <Navigate to="/admin/login" replace />;
  }
  return <Outlet />;
}
