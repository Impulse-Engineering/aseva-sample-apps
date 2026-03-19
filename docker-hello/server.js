const http = require("node:http");

const PORT = parseInt(process.env.PORT || "8080", 10);

const server = http.createServer((req, res) => {
  if (req.url === "/healthz") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "ok" }));
    return;
  }

  const email =
    req.headers["cf-access-authenticated-user-email"] || "stranger";

  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(
    JSON.stringify({
      app: "docker-hello",
      message: `Hello from a container, ${email}!`,
      node: process.version,
      uptime: process.uptime(),
    }),
  );
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`docker-hello listening on port ${PORT}`);
});
