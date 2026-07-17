// api.js — fetch wrapper for the live Railway backend. Same backend,
// same endpoints as the previous plain-JS frontend — only the frontend
// architecture changed, nothing on the server needed to change.
const API_BASE = "https://marjan-realestate-production.up.railway.app/api";

async function apiRequest(path, { method = "GET", body, auth = false } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (auth) {
    const token = localStorage.getItem("marjan_admin_token");
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });

  let data = null;
  try { data = await res.json(); } catch { /* no body */ }

  if (!res.ok) {
    throw new Error(data?.error || `Request failed (${res.status})`);
  }
  return data;
}

export const Api = {
  getProperties: (params = {}) => {
    const qs = new URLSearchParams(Object.entries(params).filter(([, v]) => v !== "" && v != null));
    return apiRequest(`/properties?${qs.toString()}`);
  },
  getProperty: (id) => apiRequest(`/properties/${id}`),
  createProperty: (body) => apiRequest("/properties", { method: "POST", body, auth: true }),
  updateProperty: (id, body) => apiRequest(`/properties/${id}`, { method: "PUT", body, auth: true }),
  deleteProperty: (id) => apiRequest(`/properties/${id}`, { method: "DELETE", auth: true }),

  submitInquiry: (body) => apiRequest("/inquiries", { method: "POST", body }),
  getInquiries: () => apiRequest("/inquiries", { auth: true }),
  updateInquiry: (id, status) => apiRequest(`/inquiries/${id}`, { method: "PATCH", body: { status }, auth: true }),

  getReviews: () => apiRequest("/reviews"),
  submitReview: (body) => apiRequest("/reviews", { method: "POST", body }),
  getAllReviews: () => apiRequest("/reviews/all", { auth: true }),
  updateReviewStatus: (id, status) => apiRequest(`/reviews/${id}`, { method: "PATCH", body: { status }, auth: true }),
  deleteReview: (id) => apiRequest(`/reviews/${id}`, { method: "DELETE", auth: true }),

  login: (username, password) => apiRequest("/auth/login", { method: "POST", body: { username, password } })
};

export function formatPrice(num) {
  if (num == null) return "Price on request";
  if (num >= 10000000) return `PKR ${(num / 10000000).toFixed(2).replace(/\.00$/, "")} Crore`;
  if (num >= 100000) return `PKR ${(num / 100000).toFixed(2).replace(/\.00$/, "")} Lac`;
  return `PKR ${num.toLocaleString()}`;
}

export function statusLabel(s) {
  return { available: "Available", reserved: "Reserved", sold: "Sold" }[s] || s;
}

// ---- Favorites (stored client-side, no account needed) ----
const FAV_KEY = "marjan_favorites";
export const Favorites = {
  all() {
    try { return JSON.parse(localStorage.getItem(FAV_KEY)) || []; } catch { return []; }
  },
  has(id) { return this.all().includes(id); },
  toggle(id) {
    let list = this.all();
    if (list.includes(id)) list = list.filter((x) => x !== id);
    else list.push(id);
    localStorage.setItem(FAV_KEY, JSON.stringify(list));
    return list.includes(id);
  }
};
