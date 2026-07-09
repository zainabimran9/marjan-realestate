const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const router = express.Router();

// Single admin account, credentials come from environment variables.
// The password is hashed once at startup for comparison — it is never
// stored or logged in plain text beyond the .env file itself.
let adminPasswordHash = null;

function getAdminPasswordHash() {
  if (!adminPasswordHash) {
    adminPasswordHash = bcrypt.hashSync(process.env.ADMIN_PASSWORD || "admin", 10);
  }
  return adminPasswordHash;
}

router.post("/login", (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required." });
  }

  const validUsername = username === (process.env.ADMIN_USERNAME || "admin");
  const validPassword = bcrypt.compareSync(password, getAdminPasswordHash());

  if (!validUsername || !validPassword) {
    return res.status(401).json({ error: "Incorrect username or password." });
  }

  const token = jwt.sign({ role: "admin", username }, process.env.JWT_SECRET, {
    expiresIn: "12h"
  });

  res.json({ token, expiresIn: "12h" });
});

module.exports = router;
