const express = require("express");
const { readTable, writeTable, nextId } = require("../db");
const { requireAdmin } = require("../middleware/auth");

const router = express.Router();

// GET /api/properties — public, supports filtering + search
// Query params: city, type, status, minPrice, maxPrice, bedrooms, featured, q
router.get("/", (req, res) => {
  let rows = readTable("properties");
  const { city, type, status, minPrice, maxPrice, bedrooms, featured, q } = req.query;

  if (city) rows = rows.filter((p) => p.city?.toLowerCase() === city.toLowerCase());
  if (type) rows = rows.filter((p) => p.type === type);
  if (status) rows = rows.filter((p) => p.status === status);
  if (minPrice) rows = rows.filter((p) => p.price >= Number(minPrice));
  if (maxPrice) rows = rows.filter((p) => p.price <= Number(maxPrice));
  if (bedrooms) rows = rows.filter((p) => p.bedrooms === Number(bedrooms));
  if (featured) rows = rows.filter((p) => p.featured === (featured === "true"));
  if (q) {
    const needle = q.toLowerCase();
    rows = rows.filter(
      (p) =>
        p.title.toLowerCase().includes(needle) ||
        p.address.toLowerCase().includes(needle) ||
        p.project.toLowerCase().includes(needle)
    );
  }

  rows = rows.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(rows);
});

// GET /api/properties/:id — public
router.get("/:id", (req, res) => {
  const rows = readTable("properties");
  const property = rows.find((p) => p.id === Number(req.params.id));
  if (!property) return res.status(404).json({ error: "Listing not found." });
  res.json(property);
});

// POST /api/properties — admin only
router.post("/", requireAdmin, (req, res) => {
  const rows = readTable("properties");
  const body = req.body || {};

  if (!body.title || !body.price || !body.type) {
    return res.status(400).json({ error: "title, type, and price are required." });
  }

  const property = {
    id: nextId(rows),
    project: body.project || "Independent Listing",
    title: body.title,
    type: body.type,
    status: body.status || "available",
    price: Number(body.price),
    priceLabel: body.priceLabel || "",
    areaSqft: body.areaSqft ? Number(body.areaSqft) : null,
    bedrooms: body.bedrooms ? Number(body.bedrooms) : null,
    bathrooms: body.bathrooms ? Number(body.bathrooms) : null,
    floor: body.floor || null,
    city: body.city || "",
    address: body.address || "",
    mapQuery: body.mapQuery || body.address || "",
    description: body.description || "",
    images: Array.isArray(body.images) ? body.images : [],
    amenities: Array.isArray(body.amenities) ? body.amenities : [],
    featured: Boolean(body.featured),
    createdAt: new Date().toISOString()
  };

  rows.push(property);
  writeTable("properties", rows);
  res.status(201).json(property);
});

// PUT /api/properties/:id — admin only
router.put("/:id", requireAdmin, (req, res) => {
  const rows = readTable("properties");
  const idx = rows.findIndex((p) => p.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: "Listing not found." });

  rows[idx] = { ...rows[idx], ...req.body, id: rows[idx].id };
  writeTable("properties", rows);
  res.json(rows[idx]);
});

// DELETE /api/properties/:id — admin only
router.delete("/:id", requireAdmin, (req, res) => {
  const rows = readTable("properties");
  const idx = rows.findIndex((p) => p.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: "Listing not found." });

  const [removed] = rows.splice(idx, 1);
  writeTable("properties", rows);
  res.json({ deleted: removed.id });
});

module.exports = router;
