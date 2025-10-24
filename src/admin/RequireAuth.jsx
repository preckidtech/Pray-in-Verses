import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { api } from "./api";

export function useMe() {
  const [me, setMe] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    let mounted = true;
    api.me().then((res) => {
      if (!mounted) return;
      setMe(res || null);
      setLoading(false);
    });
    return () => (mounted = false);
  }, []);
  return { me, loading };
}

export default function RequireAuth({ children, roles }) {
  const { me, loading } = useMe();
  const loc = useLocation();
  if (loading) return <div className="p-6">Loading…</div>;
  if (!me?.id) return <Navigate to="/admin/login" state={{ from: loc }} replace />;
  if (roles && roles.length && !roles.includes(me.role)) {
    return <div className="p-6 text-red-600">Permission denied ({me.role}).</div>;
  }
  return children;
}
