import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { api } from "../api";

export default function AcceptInvite() {
  const [sp] = useSearchParams();
  const token = sp.get("token") || "";
  const nav = useNavigate();

  const [name, setName] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [msg, setMsg] = React.useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setMsg("");
    const res = await api.acceptInvite(token, password, name);
    if (res?.ok) {
      setMsg("Invite accepted! Redirecting to login…");
      setTimeout(() => nav("/admin/login", { replace: true }), 700);
    } else {
      setMsg(res?.message || "Failed to accept invite.");
    }
  }

  if (!token) return <div className="p-6 text-red-600">Missing invite token.</div>;

  return (
    <div className="min-h-screen grid place-items-center">
      <form onSubmit={onSubmit} className="w-full max-w-md border rounded-xl p-6 bg-white space-y-4">
        <h1 className="text-xl font-semibold">Accept Invite</h1>
        {msg && <div className="text-sm">{msg}</div>}
        <input className="w-full border rounded-md px-3 py-2" placeholder="Full name" value={name} onChange={(e)=>setName(e.target.value)} />
        <input className="w-full border rounded-md px-3 py-2" placeholder="Choose password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
        <button className="w-full px-3 py-2 rounded-md bg-gray-900 text-white">Create account</button>
      </form>
    </div>
  );
}
