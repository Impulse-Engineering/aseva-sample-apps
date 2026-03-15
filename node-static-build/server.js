const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "dist")));

app.get("/healthz", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`node-static-build listening on port ${PORT}`);
});
