import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../api";
import toast from "react-hot-toast";

export default function AdminAcceptInvite() {
  const [sp] = useSearchParams();
  const token = sp.get("token") || "";
  const nav = useNavigate();

  const [name, setName] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    if (!token) return toast.error("Invite token missing.");
    if (!name.trim() || !password.trim()) return toast.error("Fill all fields.");

    setSubmitting(true);
    const res = await api.acceptInvite(token, password, name);
    setSubmitting(false);

    if (res?.ok || res?.status === 200) {
      toast.success("Invite accepted. You can now sign in.");
      nav("/admin/login", { replace: true });
    } else {
      toast.error(res?.message || "Could not accept invite");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md border rounded-xl p-6 space-y-4 bg-white"
      >
        <h1 className="text-xl font-semibold">Accept Admin Invite</h1>
        {!token ? (
          <p className="text-red-600">No invite token provided.</p>
        ) : (
          <>
            <div className="space-y-1">
              <label className="text-sm text-gray-700">Full name</label>
              <input
                className="w-full border rounded-md px-3 py-2"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-gray-700">Password</label>
              <input
                type="password"
                className="w-full border rounded-md px-3 py-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Choose a strong password"
              />
            </div>
            <button
              className="w-full px-3 py-2 rounded-md bg-gray-900 text-white"
              disabled={submitting}
            >
              {submitting ? "Setting up…" : "Accept Invite"}
            </button>
          </>
        )}
      </form>
    </div>
  );
}
