import { Rss } from "lucide-react";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

export async function api(path, { method = 'GET', body, headers } = {}) {
    const res = await fetch(`${BASE_URL}${path}`, {
        method,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...(headers || {}),
        },
        body: body ? JSON.stringify(body) : undefined,
    });

    const text = await res.text();
    const data = text ? JSON.parse(text) : null;

    if (!res.ok) {
        const err = data?.error || { code: 'HTTP_ERROR', message: res.statusText};
        err.status = res.status;
        throw err;
    }
    return data;
}    

export const get = (p, opts) => api(p, { ...(opts|| {}), method: 'GET'});
export const post = (p, body, opts) => api(p, { ...(opts||{}), method: 'POST', body });
export const patch= (p, body, opts) => api(p, { ...(opts||{}), method: 'PATCH', body });
export const del  = (p, opts) => api(p, { ...(opts||{}), method: 'DELETE' });
