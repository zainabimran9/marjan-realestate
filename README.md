# Marjan Classic Mall & Residency — Real Estate Website

A full-stack real estate site: public listings with search/filter, a property
detail page with an inquiry form, client-side favorites, and an admin panel
for managing listings and leads.

Built for Marjan Classic Mall & Residency (Sector 16-A, Shah Latif Town,
Karachi) but the "Independent Listing" project type lets you list any other
property too — it's not locked to one building.

## Structure

```
backend/     Node.js + Express API (no external database required)
frontend/    Static HTML/CSS/JS site (no build step required)
```

## Running it locally

**1. Backend**

```bash
cd backend
npm install
cp .env.example .env
# open .env and set a real JWT_SECRET, ADMIN_USERNAME and ADMIN_PASSWORD
npm run seed     # loads starter listings — safe to skip, server auto-seeds on first run
npm start
```

The API runs on `http://localhost:4000`. Data is stored as JSON files in
`backend/data/` (`properties.json`, `inquiries.json`) — there's no database
server to install. If the site grows large, swap `db.js` for a real database;
every route already goes through that one file.

**2. Frontend**

Any static file server works — for example:

```bash
cd frontend
python3 -m http.server 8080
```

Then open `http://localhost:8080`. The frontend automatically points at
`http://localhost:4000/api` when running on localhost (see `frontend/js/api.js`).

**3. Admin panel**

Go to `http://localhost:8080/admin/login.html` and sign in with the
`ADMIN_USERNAME` / `ADMIN_PASSWORD` you set in `backend/.env`.

From there you can:
- Add, edit, and delete listings (price, photos, amenities, status)
- View and update the status of inquiries submitted from the site (New → Contacted → Closed)

## Deploying for the client

- **Backend**: any Node host (Railway, Render, a VPS, cPanel with Node support).
  Set the same environment variables from `.env.example` in the host's
  dashboard — never commit the real `.env` file.
- **Frontend**: any static host (Netlify, Vercel, or the same server via
  Nginx/Apache). Once both are deployed, update `API_BASE` in
  `frontend/js/api.js` to point at the live backend URL instead of `/api`,
  or serve both from the same domain and keep the `/api` default.
- Replace the placeholder Unsplash photos in `backend/data/seed.js` (or via
  the admin panel) with real photos of the property.
- Replace the phone number and email in `frontend/index.html`,
  `frontend/contact.html`, and the footer of every page with the client's
  real contact details.

## Notes

- Listing images are stored as URLs, not file uploads. Easiest path for a
  client with no dev support: upload photos to a free image host (or their
  own hosting) and paste the URLs into the admin form.
- Favorites are stored in the visitor's browser (`localStorage`), not on the
  server — no visitor accounts needed for a basic MVP.
- The map on each listing uses a keyless Google Maps embed based on the
  address text, so no Google Maps API key is required.
