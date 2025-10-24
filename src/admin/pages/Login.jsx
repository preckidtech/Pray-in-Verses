import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { api } from "../api";

export default function Login() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const nav = useNavigate();
  const loc = useLocation();

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    const res = await api.login(email, password);
    if (res?.status === 200 && res?.user?.id) {
        const to = loc.state?.from?.pathname || "/admin";
        nav(to, { replace: true });
    } else if (res?.status === 401) {
        setError("Invalid credentials");
    } else {
        setError("Login failed. Try again.");
    }
  }

  return (
    <div className="min-h-screen grid place-items-center">
      <form onSubmit={onSubmit} className="w-full max-w-md border rounded-xl p-6 bg-white space-y-4">
        <h1 className="text-xl font-semibold">Admin Login</h1>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <input className="w-full border rounded-md px-3 py-2" placeholder="Email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} />
        <input className="w-full border rounded-md px-3 py-2" placeholder="Password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
        <button className="w-full px-3 py-2 rounded-md bg-gray-900 text-white">Login</button>
      </form>
    </div>
  );
}
