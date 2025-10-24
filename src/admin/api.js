// src/admin/api.js

// Point straight to your API in dev (no proxy).
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

/**
 * request(path, { method, body, headers, allow401 })
 * - credentials: 'include' so cookies flow
 * - allow401: if true, don't auto-redirect on 401 (used by /auth/login)
 */
async function request(path, { method = "GET", body, headers = {}, allow401 = false } = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...headers },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401 && !allow401) {
    // not logged in → send to admin login (but don't break the login call itself)
    window.location.assign("/admin/login");
    return;
  }

  // Try to parse JSON; fall back to raw text
  const text = await res.text();
  let data;
  try { data = text ? JSON.parse(text) : {}; } catch { data = { data: text }; }

  // Return both status and data so callers can branch on codes
  return { status: res.status, ...data };
}

export const api = {
  me: () => request("/auth/me"),

  // Note allow401 so the login page can show "invalid credentials" instead of redirecting
  login: (email, password) =>
    request("/auth/login", { method: "POST", body: { email, password }, allow401: true }),

  logout: () => request("/auth/logout", { method: "POST" }),

  // Admin invites
  createInvite: (email, role) => request("/admin/invites", { method: "POST", body: { email, role } }),
  listInvites: () => request("/admin/invites"),
  acceptInvite: (token, password, name) =>
    request("/admin/invites/accept", { method: "POST", body: { token, password, name }, allow401: true }),
  listUsers: () => request("/admin/users"),
  updateUserRole: (id, role) => request(`/admin/users/${id}/role`, { method: "PATCH", body: { role } }),

  // Admin curated CRUD
  listCurated: (q, state, book, limit = 20, cursor) => {
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    if (state) p.set("state", state);
    if (book) p.set("book", book);
    if (limit) p.set("limit", String(limit));
    if (cursor) p.set("cursor", cursor);
    return request(`/admin/curated-prayers?${p.toString()}`);
  },
  getCurated: (id) => request(`/admin/curated-prayers/${id}`),
  createCurated: (payload) => request(`/admin/curated-prayers`, { method: "POST", body: payload }),
  updateCurated: (id, payload) => request(`/admin/curated-prayers/${id}`, { method: "PATCH", body: payload }),
  transitionCurated: (id, target) => request(`/admin/curated-prayers/${id}/transition`, { method: "POST", body: { target } }),
  deleteCurated: (id) => request(`/admin/curated-prayers/${id}`, { method: "DELETE" }),

  bibleBooks: () => request(`/admin/bible/books`),
  bibleChapters: (book) => request(`/admin/bible/books/${encodeURIComponent(book)}/chapters`),
  bibleVerses: (book, chapter) => request(`/admin/bible/books/${encodeURIComponent(book)}/chapters/${chapter}/verses`),

  // Browse helpers
  books: () => request(`/browse/books`),
  chapters: (book) => request(`/browse/books/${encodeURIComponent(book)}/chapters`),
  verses: (book, chapter) => request(`/browse/books/${encodeURIComponent(book)}/chapters/${chapter}/verses`),

};

