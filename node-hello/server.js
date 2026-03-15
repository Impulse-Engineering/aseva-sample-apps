const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.json({
    app: "node-hello",
    message: "Hello from Node.js on Aseva!",
    node: process.version,
    uptime: process.uptime(),
  });
});

app.get("/healthz", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`node-hello listening on port ${PORT}`);
});
