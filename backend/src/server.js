// src/server.js
const express = require("express");
const cors = require("cors");

const uploadRouter = require("./routes/upload");
const dashboardRouter = require("./routes/dashboard");
const previewRouter = require("./routes/preview");
const analyzeRouter = require("./routes/analyze");
const workerStarter = require("./worker"); // starts worker when required

const app = express();

// MIDDLEWARE — apply CORS before any route registration
const corsOptions = {
  origin: ['http://localhost:3001', 'http://localhost:3000', 'http://localhost:5000'], // front-end dev & optional same-origin
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization','X-Requested-With'],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // preflight handler

app.use(express.json()); // JSON body parser (keep after CORS but before routes)

// ROUTES (mount routers)
app.use("/upload", uploadRouter);          // POST /upload
app.use("/api", dashboardRouter);          // /api/*
app.use("/preview", previewRouter);        // POST /preview  (router should use router.post('/', ...))
app.use("/analyze", analyzeRouter);        // POST /analyze

// health
app.get("/health", (req, res) => res.json({ status: "ok" }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});