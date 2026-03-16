const http = require("http");
const { Pool } = require("pg");

const PORT = parseInt(process.env.PORT || "3000", 10);

// The platform writes DATABASE_URL as <APP_NAME_UPPER>_DATABASE_URL.
// For this app ("node-pg-demo") it becomes NODE_PG_DEMO_DATABASE_URL.
// We also check the generic DATABASE_URL as a fallback for local dev.
const DATABASE_URL =
  process.env.NODE_PG_DEMO_DATABASE_URL ||
  process.env.DATABASE_URL ||
  "postgresql://localhost:5432/node_pg_demo";

const pool = new Pool({ connectionString: DATABASE_URL });

const startTime = Date.now();

// Ensure the demo table exists on startup
async function migrate() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS visits (
      id SERIAL PRIMARY KEY,
      visited_at TIMESTAMPTZ DEFAULT NOW(),
      user_agent TEXT
    )
  `);
}

async function handleRequest(req, res) {
  try {
    if (req.url === "/healthz") {
      // Verify DB connectivity
      const result = await pool.query("SELECT 1 AS ok");
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ status: "ok", db: result.rows[0].ok === 1 }));
      return;
    }

    if (req.url === "/" && req.method === "GET") {
      // Record the visit
      const ua = req.headers["user-agent"] || "unknown";
      await pool.query("INSERT INTO visits (user_agent) VALUES ($1)", [ua]);

      // Read recent visits
      const result = await pool.query(
        "SELECT id, visited_at, user_agent FROM visits ORDER BY id DESC LIMIT 10"
      );

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          app: "node-pg-demo",
          message: "Hello from Node.js + PostgreSQL on Aseva!",
          uptime: Math.round((Date.now() - startTime) / 1000),
          recent_visits: result.rows,
          total_visits: result.rowCount,
        })
      );
      return;
    }

    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Not found" }));
  } catch (err) {
    console.error("Request error:", err.message);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: err.message }));
  }
}

migrate()
  .then(() => {
    const server = http.createServer(handleRequest);
    server.listen(PORT, "0.0.0.0", () => {
      console.log(`node-pg-demo listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Migration failed:", err.message);
    process.exit(1);
  });
