// api.js — small fetch wrapper shared by every page.
// Change API_BASE if the backend is deployed somewhere other than
// the same machine on port 4000.
const API_BASE = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
  ? "http://localhost:4000/api"
  : "/api"; // when frontend + backend are served from the same domain in production

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
  try { data = await res.json(); } catch (_) { /* no body */ }

  if (!res.ok) {
    const message = data?.error || `Request failed (${res.status})`;
    throw new Error(message);
  }
  return data;
}

const Api = {
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

  login: (username, password) => apiRequest("/auth/login", { method: "POST", body: { username, password } })
};

function formatPrice(num) {
  if (num == null) return "Price on request";
  if (num >= 10000000) return `PKR ${(num / 10000000).toFixed(2).replace(/\.00$/, "")} Crore`;
  if (num >= 100000) return `PKR ${(num / 100000).toFixed(2).replace(/\.00$/, "")} Lac`;
  return `PKR ${num.toLocaleString()}`;
}

function toast(message) {
  let el = document.querySelector(".toast");
  if (!el) {
    el = document.createElement("div");
    el.className = "toast";
    document.body.appendChild(el);
  }
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(el._timer);
  el._timer = setTimeout(() => el.classList.remove("show"), 3200);
}

// ---- Favorites (stored client-side, no account needed) ----
const Favorites = {
  key: "marjan_favorites",
  all() {
    try { return JSON.parse(localStorage.getItem(this.key)) || []; } catch { return []; }
  },
  has(id) { return this.all().includes(id); },
  toggle(id) {
    let list = this.all();
    if (list.includes(id)) list = list.filter((x) => x !== id);
    else list.push(id);
    localStorage.setItem(this.key, JSON.stringify(list));
    return list.includes(id);
  }
};

// ---- Mobile nav toggle (shared header behavior) ----
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", () => links.classList.toggle("open"));
  }
});
