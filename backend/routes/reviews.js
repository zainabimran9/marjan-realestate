const express = require("express");
const { readTable, writeTable, nextId } = require("../db");
const { requireAdmin } = require("../middleware/auth");

const router = express.Router();

// POST /api/reviews — public, anyone can submit. Goes in as "pending"
// so nothing shows on the live site until an admin approves it — keeps
// spam/junk off the public pages without silently deleting anything.
router.post("/", (req, res) => {
  const { name, rating, comment, propertyTitle } = req.body || {};

  if (!name || !rating) {
    return res.status(400).json({ error: "Name and a star rating are required." });
  }
  const numRating = Number(rating);
  if (!Number.isInteger(numRating) || numRating < 1 || numRating > 5) {
    return res.status(400).json({ error: "Rating must be a whole number from 1 to 5." });
  }

  const rows = readTable("reviews");
  const review = {
    id: nextId(rows),
    name,
    rating: numRating,
    comment: comment || "",
    propertyTitle: propertyTitle || null,
    status: "pending", // pending -> approved -> rejected
    createdAt: new Date().toISOString()
  };

  rows.push(review);
  writeTable("reviews", rows);
  res.status(201).json({ ok: true, id: review.id });
});

// GET /api/reviews — public, only approved reviews, newest first
router.get("/", (req, res) => {
  const rows = readTable("reviews")
    .filter((r) => r.status === "approved")
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(rows);
});

// GET /api/reviews/all — admin only, every review regardless of status
router.get("/all", requireAdmin, (req, res) => {
  const rows = readTable("reviews")
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(rows);
});

// PATCH /api/reviews/:id — admin only, approve/reject
router.patch("/:id", requireAdmin, (req, res) => {
  const rows = readTable("reviews");
  const idx = rows.findIndex((r) => r.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: "Review not found." });

  if (req.body?.status) rows[idx].status = req.body.status;
  writeTable("reviews", rows);
  res.json(rows[idx]);
});

// DELETE /api/reviews/:id — admin only
router.delete("/:id", requireAdmin, (req, res) => {
  const rows = readTable("reviews");
  const idx = rows.findIndex((r) => r.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: "Review not found." });

  const [removed] = rows.splice(idx, 1);
  writeTable("reviews", rows);
  res.json({ deleted: removed.id });
});

module.exports = router;
