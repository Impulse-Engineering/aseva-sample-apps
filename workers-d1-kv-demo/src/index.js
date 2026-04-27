// Cloudflare Workers demo for the Aseva platform.
// Demonstrates read/write access to a managed D1 database and a KV namespace.
//
// Bindings (configured in wrangler.toml):
//   env.DB    -- D1 database (binding name "DB")
//   env.CACHE -- KV namespace (binding name "CACHE")

const KV_COUNTER_KEY = "visit_counter";
const KV_LAST_UA_KEY = "last_user_agent";

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    try {
      if (url.pathname === "/healthz") {
        return await healthCheck(env);
      }

      if (url.pathname === "/" && request.method === "GET") {
        return await recordAndListVisits(request, env);
      }

      return json({ error: "Not found" }, 404);
    } catch (err) {
      console.error("Request error:", err && err.message);
      return json({ error: (err && err.message) || String(err) }, 500);
    }
  },
};

async function healthCheck(env) {
  const dbResult = await env.DB.prepare("SELECT 1 AS ok").first();
  // KV has no native ping; a get on a sentinel key is the cheapest probe.
  await env.CACHE.get("__healthz_probe");
  return json({
    status: "ok",
    db: dbResult && dbResult.ok === 1,
    kv: true,
  });
}

async function recordAndListVisits(request, env) {
  const ua = request.headers.get("user-agent") || "unknown";

  await env.DB.prepare("INSERT INTO visits (user_agent) VALUES (?)")
    .bind(ua)
    .run();

  const recent = await env.DB.prepare(
    "SELECT id, visited_at, user_agent FROM visits ORDER BY id DESC LIMIT 99"
  ).all();

  const prevCounter = parseInt((await env.CACHE.get(KV_COUNTER_KEY)) || "0", 10);
  const nextCounter = prevCounter + 1;
  await env.CACHE.put(KV_COUNTER_KEY, String(nextCounter));
  await env.CACHE.put(KV_LAST_UA_KEY, ua);

  return json({
    app: "workers-d1-kv-demo",
    message: "Hello from Cloudflare Workers + D1 + KV on Aseva!",
    app_version: env.APP_VERSION || null,
    kv_visit_counter: nextCounter,
    kv_last_user_agent: ua,
    recent_visits: recent.results || [],
    total_recent: (recent.results || []).length,
  });
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body, null, 2), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
