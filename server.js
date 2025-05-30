const express = require("express");
const dotenv = require("dotenv");
const { LedgerClient } = require("@minka/ledger-sdk");

dotenv.config();
const app = express();
app.use(express.json());

const ledger = new LedgerClient({
  ledger: { handle: process.env.LEDGER_HANDLE },
  server: process.env.LEDGER_SERVER,
  bridge: { signer: { public: process.env.BRIDGE_PUBLIC_KEY, secret: process.env.BRIDGE_SECRET_KEY } },
});

app.post("/transfer", async (req, res) => {
  try {
    const { source, target, amount, symbol } = req.body;
    const intent = await ledger.intent.create({
      action: "transfer",
      source,
      target,
      amount,
      symbol,
    });
    res.json({ success: true, intent });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => console.log("Gateway running on port 3000"));

