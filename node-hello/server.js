const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

function getDisplayName(req) {
  const jwt = req.headers["cf-access-jwt-assertion"];
  if (jwt) {
    try {
      const payload = JSON.parse(
        Buffer.from(jwt.split(".")[1], "base64").toString(),
      );
      const fields = payload.oidc_fields || payload.custom || {};
      const params = fields.params || fields;
      const given = params.given_name || payload.given_name;
      const family = params.family_name || payload.family_name;
      if (given || family) return [given, family].filter(Boolean).join(" ");
      if (payload.name) return payload.name;
    } catch {
      // Invalid JWT, fall through
    }
  }
  return req.headers["cf-access-authenticated-user-email"] || "stranger";
}

app.get("/", (req, res) => {
  const name = getDisplayName(req);
  res.json({
    app: "node-hello",
    message: `Hello, ${name}! Welcome to Aseva!`,
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
