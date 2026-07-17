const express = require("express");
const { readTable, writeTable, nextId } = require("../db");
const { requireAdmin } = require("../middleware/auth");

const router = express.Router();

// POST /api/inquiries — public, submitted from the contact / property forms
router.post("/", (req, res) => {
  const { name, phone, email, message, propertyId, propertyTitle, city, source, budgetRange, propertyType, siteVisitDate } = req.body || {};

  if (!name || !phone) {
    return res.status(400).json({ error: "Name and phone number are required." });
  }

  const rows = readTable("inquiries");
  const inquiry = {
    id: nextId(rows),
    name,
    phone,
    email: email || "",
    message: message || "",
    propertyId: propertyId || null,
    propertyTitle: propertyTitle || null,
    city: city || "",
    source: source || "",
    budgetRange: budgetRange || "",
    propertyType: propertyType || "",
    siteVisitDate: siteVisitDate || "",
    status: "new", // new -> contacted -> closed
    createdAt: new Date().toISOString()
  };

  rows.push(inquiry);
  writeTable("inquiries", rows);
  res.status(201).json({ ok: true, id: inquiry.id });
});

// GET /api/inquiries — admin only
router.get("/", requireAdmin, (req, res) => {
  const rows = readTable("inquiries")
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(rows);
});

// PATCH /api/inquiries/:id — admin only, update status
router.patch("/:id", requireAdmin, (req, res) => {
  const rows = readTable("inquiries");
  const idx = rows.findIndex((i) => i.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: "Inquiry not found." });

  if (req.body?.status) rows[idx].status = req.body.status;
  writeTable("inquiries", rows);
  res.json(rows[idx]);
});

module.exports = router;
