import React from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { api } from "../api";
import toast from "react-hot-toast";

const StateBadge = ({ state }) => {
  const colors = {
    DRAFT: "bg-gray-200 text-gray-800",
    REVIEW: "bg-yellow-100 text-yellow-800",
    PUBLISHED: "bg-green-100 text-green-800",
  };
  return (
    <span className={`px-2 py-1 text-xs rounded ${colors[state] || "bg-gray-100"}`}>
      {state}
    </span>
  );
};

export default function CuratedList() {
  const [sp, setSp] = useSearchParams();
  const nav = useNavigate();

  const [loading, setLoading] = React.useState(true);
  const [items, setItems] = React.useState([]);
  const [cursor, setCursor] = React.useState(null);

  const q = sp.get("q") || "";
  const state = sp.get("state") || "";
  const book = sp.get("book") || "";

  async function load(listCursor) {
    setLoading(true);
    const res = await api.listCurated(q, state, book, 50, listCursor || undefined);
    setLoading(false);
    if (res?.data) {
      setItems(res.data.items || res.data || []);
      setCursor(res.data.nextCursor || null);
    } else {
      setItems([]);
      setCursor(null);
    }
  }

  React.useEffect(() => {
    load(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, state, book]);

  function onFilterChange(next) {
    const nextSP = new URLSearchParams(sp);
    Object.entries(next).forEach(([k, v]) => {
      if (v) nextSP.set(k, v);
      else nextSP.delete(k);
    });
    setSp(nextSP, { replace: true });
  }

  async function onDelete(id) {
    if (!window.confirm("Delete this curated prayer? This cannot be undone.")) return;
    const res = await api.deleteCurated(id);
    if (res?.ok) {
      toast.success("Deleted");
      load(null);
    } else {
      toast.error(res?.message || "Delete failed");
    }
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Curated Prayers</h1>
        <Link
          to="/admin/curated/new"
          className="px-3 py-2 rounded-md bg-gray-900 text-white"
        >
          New Curated Prayer
        </Link>
      </div>

      {/* Filters */}
      <div className="grid gap-3 md:grid-cols-4">
        <input
          className="border rounded-md px-3 py-2"
          placeholder="Search theme or text…"
          value={q}
          onChange={(e) => onFilterChange({ q: e.target.value })}
        />
        <select
          className="border rounded-md px-3 py-2"
          value={state}
          onChange={(e) => onFilterChange({ state: e.target.value })}
        >
          <option value="">All states</option>
          <option value="DRAFT">Draft</option>
          <option value="REVIEW">Review</option>
          <option value="PUBLISHED">Published</option>
        </select>
        <input
          className="border rounded-md px-3 py-2"
          placeholder="Book (e.g., Genesis)"
          value={book}
          onChange={(e) => onFilterChange({ book: e.target.value })}
        />
        <button
          className="border rounded-md px-3 py-2"
          onClick={() => {
            setSp(new URLSearchParams(), { replace: true });
          }}
        >
          Clear
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border rounded-xl">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="text-left">
              <th className="px-4 py-3">Reference</th>
              <th className="px-4 py-3">Theme</th>
              <th className="px-4 py-3">State</th>
              <th className="px-4 py-3">Updated</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="px-4 py-6" colSpan={5}>Loading…</td></tr>
            ) : items.length === 0 ? (
              <tr><td className="px-4 py-6" colSpan={5}>No results.</td></tr>
            ) : (
              items.map((it) => (
                <tr key={it.id} className="border-t">
                  <td className="px-4 py-3">{it.book} {it.chapter}:{it.verse}</td>
                  <td className="px-4 py-3">{it.theme}</td>
                  <td className="px-4 py-3"><StateBadge state={it.state} /></td>
                  <td className="px-4 py-3">
                    {it.updatedAt ? new Date(it.updatedAt).toLocaleString() : "-"}
                  </td>
                  <td className="px-4 py-3 flex gap-2 justify-end">
                    <Link
                      to={`/admin/curated/${it.id}`}
                      className="px-2 py-1 border rounded-md"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => onDelete(it.id)}
                      className="px-2 py-1 border rounded-md text-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination (cursor) */}
      <div className="flex justify-end">
        {cursor && (
          <button
            className="px-3 py-2 border rounded-md"
            onClick={() => load(cursor)}
          >
            Load more
          </button>
        )}
      </div>
    </div>
  );
}
