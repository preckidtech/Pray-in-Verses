// src/lib/api.js
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

async function request(path, { method = "GET", body, headers = {} } = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...headers },
    body: body ? JSON.stringify(body) : undefined,
  });

  // Optionally handle 401 globally
  // if (res.status === 401) window.location.assign("/login");

  const text = await res.text();
  try { return text ? JSON.parse(text) : {}; } catch { return { data: text }; }
}

export async function get(path) {
  return request(path, { method: "GET" });
}

export async function post(path, body) {
  return request(path, { method: "POST", body });
}

export async function patch(path, body) {
  return request(path, { method: "PATCH", body });
}

export async function del(path) {
  return request(path, { method: "DELETE" });
}

// If you also want an object-style API:
export const api = { get, post, patch, del };
export default api; // optional default export

export const journals = {
  list: () => request("/journals"),
  get: (id) => request(`/journals/${id}`),
  create: (payload) => request("/journals", { method: "POST", body: payload}),
  update: (id, payload) => request(`/journals/${id}`, {method: "PATCH", body: payload}),
  remove: (id) => request(`/journals/${id}`, {method: "DELETE"}),
};

