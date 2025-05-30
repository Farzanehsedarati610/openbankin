const express = require("express");
const router = express.Router();
const pool = require("./db");
const crypto = require("crypto");

const hashTransaction = (data) => {
  return crypto.createHash("sha256").update(JSON.stringify(data)).digest("hex");
};

router.post("/transfer", async (req, res) => {
  const { account, amount, hash } = req.body;

  const computedHash = hashTransaction({ account, amount });
  if (computedHash !== hash) {
    return res.status(400).json({ error: "Invalid hash" });
  }

  try {
    await pool.query("INSERT INTO transactions (account, amount) VALUES ($1, $2)", [account, amount]);
    res.json({ success: true, message: "Transfer initiated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

