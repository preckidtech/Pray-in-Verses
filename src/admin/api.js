// src/admin/api.js

// Point straight to your API in dev (no proxy).
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

/**
 * request(path, { method, body, headers, allow401 })
 * - credentials: 'include' so cookies flow
 * - allow401: if true, don't auto-redirect on 401 (used by /auth/login)
 */
async function request(
  path,
  { method = "GET", body, headers = {}, allow401 = false } = {}
) {
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
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { data: text };
  }

  // Return both status and data so callers can branch on codes
  return { status: res.status, ...data };
}

/** ---------- small normalizers so UI can rely on a stable shape ---------- */
function normalizeListPayload(payload) {
  const items =
    payload?.data ??
    payload?.items ??
    payload?.rows ??
    (Array.isArray(payload) ? payload : []);
  const nextCursor = payload?.nextCursor ?? payload?.cursor ?? null;
  return { items, nextCursor };
}

function normalizeSinglePayload(payload) {
  // Accept {data}, {item}, {row}, or a plain object
  const data =
    payload?.data ??
    payload?.item ??
    payload?.row ??
    (payload && typeof payload === "object" ? payload : null);
  return { data };
}

export const api = {
  me: () => request("/auth/me"),

  // Note allow401 so the login page can show "invalid credentials" instead of redirecting
  login: (email, password) =>
    request("/auth/login", {
      method: "POST",
      body: { email, password },
      allow401: true,
    }),

  logout: () => request("/auth/logout", { method: "POST" }),

  // Admin invites
  createInvite: (email, role) =>
    request("/admin/invites", { method: "POST", body: { email, role } }),
  listInvites: () => request("/admin/invites"),
  acceptInvite: (token, password, name) =>
    request("/admin/invites/accept", {
      method: "POST",
      body: { token, password, name },
      allow401: true,
    }),
  listUsers: () => request("/admin/users"),
  updateUserRole: (id, role) =>
    request(`/admin/users/${id}/role`, { method: "PATCH", body: { role } }),

  // ---------- Admin curated CRUD (+ normalized helpers) ----------
  // Normalized list → always returns { items, nextCursor }
  listCurated: async (q, state, book, limit = 20, cursor) => {
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    if (state) p.set("state", state);
    if (book) p.set("book", book);
    if (limit) p.set("limit", String(limit));
    if (cursor) p.set("cursor", cursor);

    const res = await request(`/admin/curated-prayers?${p.toString()}`);
    if (!res) return { items: [], nextCursor: null, status: 401 };
    const { items, nextCursor } = normalizeListPayload(res);
    return { items, nextCursor, status: res.status };
  },

  // Raw (un-normalized) getters still available if you want them:
  getCuratedRaw: (id) => request(`/admin/curated-prayers/${id}`),

  // Normalized single getter → always returns { data }
  getCurated: async (id) => {
    const res = await request(`/admin/curated-prayers/${id}`);
    if (!res) return { data: null, status: 401 };
    const { data } = normalizeSinglePayload(res);
    return { ...res, data };
  },

  createCurated: (payload) =>
    request(`/admin/curated-prayers`, { method: "POST", body: payload }),
  updateCurated: (id, payload) =>
    request(`/admin/curated-prayers/${id}`, { method: "PATCH", body: payload }),
  transitionCurated: (id, target) =>
    request(`/admin/curated-prayers/${id}/transition`, {
      method: "POST",
      body: { target },
    }),
  // optional: direct publish-state setter your controller exposes
  updatePublishState: (id, state) =>
    request(`/admin/curated-prayers/${id}/publish-state`, {
      method: "PATCH",
      body: { state },
    }),
  deleteCurated: (id) =>
    request(`/admin/curated-prayers/${id}`, { method: "DELETE" }),

  // ---------- Prayer Points (ADMIN per-point editing API) ----------
  prayerPoints: {
    // Replace the entire array (expects { items: string[] })
    replace: (id, items) =>
      request(`/admin/curated-prayers/${id}/prayer-points`, {
        method: "PATCH",
        body: { items },
      }),

    // Append a single new point (expects { text: string })
    append: (id, text) =>
      request(`/admin/curated-prayers/${id}/prayer-points`, {
        method: "POST",
        body: { text },
      }),

    // Update one item by index (0-based) (expects { text: string })
    updateOne: (id, index, text) =>
      request(`/admin/curated-prayers/${id}/prayer-points/${index}`, {
        method: "PATCH",
        body: { text },
      }),

    // Remove one item by index (0-based)
    removeOne: (id, index) =>
      request(`/admin/curated-prayers/${id}/prayer-points/${index}`, {
        method: "DELETE",
      }),

    // Reorder: move item from -> to (expects { from:number, to:number })
    reorder: (id, from, to) =>
      request(`/admin/curated-prayers/${id}/prayer-points/reorder`, {
        method: "POST",
        body: { from, to },
      }),
  },

  // Small alias to match curatedEdit.jsx usage (api.replaceCuratedPoints)
  replaceCuratedPoints: (id, items) =>
    request(`/admin/curated-prayers/${id}/prayer-points`, {
      method: "PATCH",
      body: { items },
    }),

  // ---------- Bible helpers for admin screens ----------
  bibleBooks: () => request(`/admin/bible/books`),
  bibleChapters: (book) =>
    request(`/admin/bible/books/${encodeURIComponent(book)}/chapters`),
  bibleVerses: (book, chapter) =>
    request(
      `/admin/bible/books/${encodeURIComponent(book)}/chapters/${chapter}/verses`
    ),

  // ---------- Browse helpers (shared) ----------
  books: () => request(`/browse/books`),
  chapters: (book) =>
    request(`/browse/books/${encodeURIComponent(book)}/chapters`),
  verses: (book, chapter) =>
    request(
      `/browse/books/${encodeURIComponent(book)}/chapters/${chapter}/verses`
    ),
  
  savePoint: (curatedPrayerId, index) =>
    request(`/saved-prayers/${curatedPrayerId}/points/${index}`, {method: "POST" }),
  unsavePoint: (curatedPrayerId, index) =>
    request(`/saved-prayers/${curatedPrayerId}/points/${index}`, {method: "DELETE"}),
  publishedPointsCount: () => request(`/browse/published-points-count`),
};
