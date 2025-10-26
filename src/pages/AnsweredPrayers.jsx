import React, { useEffect, useState, useCallback } from "react";
import { Trash2, Search, X, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

/** tiny API helper (cookie-auth) */
const API_BASE = import.meta.env.VITE_API_BASE || "/api";
async function request(path, { method = "GET", body, headers = {} } = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...headers },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text().catch(() => "");
  let payload = {};
  try { payload = text ? JSON.parse(text) : {}; } catch {}
  if (!res.ok) {
    const err = new Error(payload?.message || res.statusText || "Request failed");
    err.status = res.status;
    err.payload = payload;
    throw err;
  }
  return payload;
}

/** Toast */
const Toast = ({ message }) => (
  <div className="fixed top-24 right-6 bg-white shadow-lg rounded-lg px-4 py-3 border-l-4 border-green-500 z-50 animate-slide-in">
    <div className="flex items-center gap-2">
      <Check className="w-5 h-5 text-green-500" />
      <span className="text-gray-800 font-medium">{message}</span>
    </div>
  </div>
);

const AnsweredPrayers = () => {
  const nav = useNavigate();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [toastVisible, setToastVisible] = useState(false);

  const showToast = (message) => {
    setToastMessage(message);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2800);
  };

  const loadList = useCallback(async () => {
    setLoading(true);
    try {
      const q = searchTerm.trim();
      const url = `/my-prayers?status=ANSWERED${q ? `&q=${encodeURIComponent(q)}` : ""}`;
      const res = await request(url);
      setItems(res?.data ?? []);
    } catch (e) {
      if (e.status === 401) nav("/login", { replace: true });
      else showToast(e.message || "Failed to load answered prayers");
    } finally {
      setLoading(false);
    }
  }, [searchTerm, nav]);

  useEffect(() => {
    loadList();
  }, [loadList]);

  const handleRemove = async (id) => {
    try {
      await request(`/my-prayers/${id}`, { method: "DELETE" });
      setItems((prev) => prev.filter((p) => p.id !== id));
      showToast("Answered prayer removed successfully");
    } catch (e) {
      if (e.status === 401) nav("/login", { replace: true });
      else showToast(e.message || "Failed to remove");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50 pt-24 pl-0 lg:pl-[224px] font-['Poppins']">
      {toastVisible && <Toast message={toastMessage} />}

      <main className="flex-1 space-y-10 px-4 lg:px-6 pb-10">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <h1 className="text-base font-semibold text-[#0C2E8A]">
              Answered Prayers
            </h1>

            {/* Search */}
            <div className="relative w-full md:w-1/3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search answered prayers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && loadList()}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0C2E8A]"
              />
              {searchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    // trigger fresh load after clearing
                    setTimeout(loadList, 0);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Cards */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-40 bg-white rounded-lg shadow border border-gray-100 animate-pulse" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <p className="text-gray-600 mt-6">No answered prayers found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((p) => (
                <div
                  key={p.id}
                  className="bg-white rounded-lg shadow p-6 border border-gray-100 relative hover:shadow-lg transition"
                >
                  <button
                    onClick={() => handleRemove(p.id)}
                    className="absolute top-3 right-3 text-gray-400 hover:text-red-600"
                    title="Remove answered prayer"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>

                  <h3 className="text-base font-semibold text-[#0C2E8A]">
                    {p.title}
                  </h3>
                  {p.body && <p className="text-gray-600 mt-2">{p.body}</p>}

                  <p className="text-sm text-gray-400 mt-3">
                    Answered:{" "}
                    {p.answeredAt
                      ? new Date(p.answeredAt).toLocaleDateString()
                      : p.updatedAt
                      ? new Date(p.updatedAt).toLocaleDateString()
                      : ""}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Animations */}
      <style>{`
        @keyframes slide-in {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in { animation: slide-in 0.3s ease-out; }
      `}</style>
    </div>
  );
};

export default AnsweredPrayers;
