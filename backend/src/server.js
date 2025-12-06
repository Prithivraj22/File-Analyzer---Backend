const express = require("express");
const cors = require("cors");

const uploadRouter = require("./routes/upload");
const dashboardRouter = require("./routes/dashboard");
const previewRouter = require("./routes/preview");
const analyzeRouter = require("./routes/analyze");
const workerStarter = require("./worker");

const app = express();

const corsOptions = {
  origin: ['http://localhost:3001', 'http://localhost:3000', 'http://localhost:5000', 'https://file-analyzer-frontend.onrender.com'], // front-end dev & optional same-origin
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization','X-Requested-With'],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // preflight handler

app.use(express.json());

app.use("/upload", uploadRouter);
app.use("/api", dashboardRouter);
app.use("/preview", previewRouter);
app.use("/analyze", analyzeRouter);

app.get("/health", (req, res) => res.json({ status: "ok" }));
app.get("/healthz", (req, res) => res.json({ status: "okiiiiiiiiii" }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
