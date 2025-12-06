const express = require("express");
const cors = require("cors");

const uploadRouter = require("./routes/upload");
const dashboardRouter = require("./routes/dashboard");
const previewRouter = require("./routes/preview");
const analyzeRouter = require("./routes/analyze");
const workerStarter = require("./worker");

const app = express();

app.use(
  cors({
    origin: true,          // reflect request origin
    credentials: true,     // allow credentials if needed
  })
);
app.options("*", cors());

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
