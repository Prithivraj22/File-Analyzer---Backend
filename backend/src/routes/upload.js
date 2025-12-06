const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { parseLogFile } = require("../services/parser");
const { computeFileHash } = require("../services/fingerprint");
const { pool } = require("../db");
const { enqueueError } = require("../queue");

const router = express.Router();
const uploadDir = path.resolve(__dirname, "../../uploads");

// Make sure directory exists
fs.mkdirSync(uploadDir, { recursive: true });

const upload = multer({
  dest: uploadDir,
});

router.post("/", upload.single("file"), async (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ error: "no file" });

  const content = await fs.readFile(file.path, "utf-8");
  const fileHash = computeFileHash(content);

  const client = await pool.connect();
  try {
    const insertUpload = await client.query(
      "INSERT INTO uploads (filename, filesize, file_hash) VALUES ($1,$2,$3) RETURNING id",
      [file.originalname, file.size, fileHash]
    );
    const uploadId = insertUpload.rows[0].id;

    const errorEntries = parseLogFile(content); // [{line_number, raw_text}]
    for (const e of errorEntries) {
      const r = await client.query(
        "INSERT INTO errors (upload_id, line_number, raw_text) VALUES ($1,$2,$3) RETURNING id",
        [uploadId, e.line_number, e.raw_text]
      );
      const errorId = r.rows[0].id;
      await enqueueError({ errorId, raw_text: e.raw_text });
    }

    res.json({ uploadId, totalErrors: errorEntries.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server_error" });
  } finally {
    client.release();
    // remove file to avoid disk fill
    await fs.unlink(file.path).catch(() => {});
  }
});

module.exports = router;
