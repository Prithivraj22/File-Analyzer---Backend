// src/server.js
const express = require("express");
const cors = require("cors");

const uploadRouter = require("./routes/upload");
const dashboardRouter = require("./routes/dashboard");
const previewRouter = require("./routes/preview");
const analyzeRouter = require("./routes/analyze");
const workerStarter = require("./worker");

const app = express();

// FRONTEND ORIGINS (local + deployed)
const allowedOrigins = [
  "http://localhost:3001",                 // React dev
  "http://localhost:3000",                 // optional
  "http://localhost:5000",                 // optional
  process.env.FRONTEND_ORIGIN              // e.g. https://file-analyzer-frontend.onrender.com
].filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    // allow non-browser / curl (no origin) and allowed origins
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    console.log("CORS blocked origin:", origin);
    return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  credentials: true,
  optionsSuccessStatus: 200
};

// apply CORS BEFORE routes
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json());

// ROUTES
app.use("/upload", uploadRouter);
app.use("/api", dashboardRouter);
app.use("/preview", previewRouter);
app.use("/analyze", analyzeRouter);

app.get("/health", (req, res) => res.json({ status: "ok" }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
