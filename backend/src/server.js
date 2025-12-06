// src/server.js
const express = require("express");
const cors = require("cors");

const uploadRouter = require("./routes/upload");
const dashboardRouter = require("./routes/dashboard");
const previewRouter = require("./routes/preview");
const analyzeRouter = require("./routes/analyze");
const workerStarter = require("./worker");

const app = express();

/**
 * CORS – allow any origin (for dev + Render), but reflect the actual origin
 * This will make the backend send:
 *   Access-Control-Allow-Origin: <request origin>
 *   Access-Control-Allow-Credentials: true
 */
app.use(
  cors({
    origin: true,          // reflect request origin
    credentials: true,     // allow cookies/credentials if needed
  })
);
// handle preflight
app.options("*", cors());

app.use(express.json());

// ROUTES
app.use("/upload", uploadRouter);
app.use("/api", dashboardRouter);
app.use("/preview", previewRouter);
app.use("/analyze", analyzeRouter);

// health
app.get("/health", (req, res) => res.json({ status: "ok" }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
