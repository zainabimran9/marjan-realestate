// db.js
// A tiny file-based JSON datastore. No native modules, no external database
// server to install — everything lives in backend/data/*.json. This keeps
// the project easy to deploy on any cheap hosting plan or shared server,
// which is what most small real-estate clients in Pakistan will have.
//
// If the site grows past a few thousand listings, swap this file out for a
// real database (Postgres/MySQL) — the route files only talk to the
// functions exported here, so that swap would not touch the rest of the app.

const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "data");

function filePath(name) {
  return path.join(DATA_DIR, `${name}.json`);
}

function readTable(name) {
  const p = filePath(name);
  if (!fs.existsSync(p)) return [];
  const raw = fs.readFileSync(p, "utf-8").trim();
  if (!raw) return [];
  return JSON.parse(raw);
}

function writeTable(name, rows) {
  fs.writeFileSync(filePath(name), JSON.stringify(rows, null, 2));
}

function nextId(rows) {
  return rows.reduce((max, r) => Math.max(max, r.id || 0), 0) + 1;
}

module.exports = { readTable, writeTable, nextId, DATA_DIR };
