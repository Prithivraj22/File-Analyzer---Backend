const express = require("express");
const multer = require("multer");
const fs = require("fs");
const router = express.Router();

const { parseLogFile } = require("../services/parser");
const { redact } = require("../services/redactor");

const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "no_file_uploaded" });

    const content = fs.readFileSync(req.file.path, "utf8");
    fs.unlinkSync(req.file.path); // delete temp file

    // Parse errors
    const errors = parseLogFile(content);

    // Redact each error
    const redactedErrors = errors.map(err => ({
      line_number: err.line_number,
      raw_text: err.raw_text,
      redacted_text: redact(err.raw_text)
    }));

    return res.json({
      totalErrors: redactedErrors.length,
      errors: redactedErrors
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "server_error" });
  }
});

module.exports = router;
