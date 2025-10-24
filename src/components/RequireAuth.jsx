import React from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

export default function RequireAuth({ roles }) {
  const [state, setState] = React.useState({ loading: true, user: null });
  const loc = useLocation();

  React.useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/auth/me`, {
          credentials: "include",
        });
        if (res.status === 401) {
          if (active) setState({ loading: false, user: null });
          return;
        }
        const data = await res.json();
        if (active) setState({ loading: false, user: data || null });
      } catch {
        if (active) setState({ loading: false, user: null });
      }
    })();
    return () => {
      active = false;
    };
  }, [loc.pathname]);

  if (state.loading) return <div className="p-6">Loading…</div>;
  if (!state.user?.id) return <Navigate to="/login" state={{ from: loc }} replace />;

  // Optional role check for app sections (most of your app doesn’t need this)
  if (roles && roles.length && !roles.includes(state.user.role)) {
    return <div className="p-6 text-red-600">Permission denied.</div>;
  }

  return <Outlet />;
}
