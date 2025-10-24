import React from "react";
import { api } from "../api";
import RequireAuth from "../RequireAuth";

export default function Invites() {
  const [email, setEmail] = React.useState("");
  const [role, setRole] = React.useState("EDITOR");
  const [rows, setRows] = React.useState([]);

  async function load() {
    const res = await api.listInvites();
    setRows(res?.data || []);
  }
  React.useEffect(() => { load(); }, []);

  async function create(e) {
    e.preventDefault();
    await api.createInvite(email, role);
    setEmail("");
    setRole("EDITOR");
    load();
  }

  return (
    <RequireAuth roles={["SUPER_ADMIN"]}>
      <div className="space-y-4">
        <h1 className="text-xl font-semibold">Invites</h1>
        <form onSubmit={create} className="flex gap-2">
          <input className="border rounded-md px-3 py-2" placeholder="email@example.com" value={email} onChange={(e)=>setEmail(e.target.value)} />
          <select className="border rounded-md px-3 py-2" value={role} onChange={(e)=>setRole(e.target.value)}>
            <option>EDITOR</option>
            <option>MODERATOR</option>
            <option>SUPER_ADMIN</option>
          </select>
          <button className="px-3 py-2 rounded-md bg-gray-900 text-white">Send</button>
        </form>

        <div className="space-y-2">
          {rows.map(inv => (
            <div key={inv.id} className="border rounded-md p-3 bg-white">
              <div className="font-semibold">{inv.email} • {inv.role}</div>
              <div className="text-xs text-gray-500">
                Token: <code>{inv.token}</code> • Expires: {new Date(inv.expiresAt).toLocaleString()} • {inv.acceptedAt ? "ACCEPTED" : "PENDING"}
              </div>
            </div>
          ))}
        </div>
      </div>
    </RequireAuth>
  );
}
