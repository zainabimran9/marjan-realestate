require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const propertiesRouter = require("./routes/properties");
const inquiriesRouter = require("./routes/inquiries");
const authRouter = require("./routes/auth");
const { DATA_DIR } = require("./db");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Make sure the data folder + starter files exist so a fresh clone works
// without a manual seed step.
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(path.join(DATA_DIR, "properties.json"))) {
  require("./data/seed");
}

app.use("/api/auth", authRouter);
app.use("/api/properties", propertiesRouter);
app.use("/api/inquiries", inquiriesRouter);

app.get("/api/health", (req, res) => res.json({ ok: true }));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Something went wrong on the server." });
});

app.listen(PORT, () => {
  console.log(`Marjan Real Estate API running on http://localhost:${PORT}`);
});
