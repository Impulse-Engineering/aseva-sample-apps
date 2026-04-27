# workers-d1-kv-demo

Cloudflare Workers app demonstrating the managed D1 database and KV namespace
provided by the Aseva platform's `workers` tier. Counterpart to `node-pg-demo`
(which targets the `lxc` tier with PostgreSQL).

## How it works

When a Workers-tier app is provisioned, the platform automatically creates:

1. A D1 database (resource type `cf_d1_database`)
2. A KV namespace (resource type `cf_kv_namespace`)
3. A worker script + route + DNS record + CF Access app/policy

Unlike the LXC tier (which injects `*_DATABASE_URL` into the container env),
Workers bind resources at deploy time via `wrangler.toml`. The deploy engine
runs `wrangler deploy` against the cloned repo, so the toml must reference the
real provisioned resource IDs.

After provisioning, fetch the IDs with `platform_get_app` and paste them into
`wrangler.toml`:

- `[[d1_databases]] database_id` <- `external_id` of the `cf_d1_database` resource
- `[[kv_namespaces]] id` <- `external_id` of the `cf_kv_namespace` resource

Then commit and trigger `platform_deploy_workers`.

## Endpoints

- `GET /` -- Inserts a visit row into D1, increments a KV counter, and returns
  recent visits along with the current KV state.
- `GET /healthz` -- Verifies D1 connectivity (`SELECT 1`) and KV reachability.

## First deploy: applying migrations

D1 schema is managed via `migrations/`. The first deploy must run them against
the remote database:

```bash
npx wrangler d1 migrations apply DB --remote
```

(Replace `DB` if you change the binding name in `wrangler.toml`.) The Aseva
deploy engine does **not** auto-run D1 migrations -- this is intentional, since
schema changes are not always safe to apply on every deploy.

## Local testing

```bash
npm install
# Apply migrations to the local miniflare D1 instance
npm run migrate:local
# Start a local dev server (KV + D1 are emulated locally)
npm run dev
curl http://localhost:8787/
curl http://localhost:8787/healthz
```

## Deploying on the platform

1. `platform_register_app` with `tier: workers`, `visibility: internal`,
   `git_repo_url` pointing at your fork of this repo.
2. `platform_provision` -- creates the D1 database, KV namespace, worker
   script, DNS, and CF Access app.
3. `platform_get_app` -- copy the `cf_d1_database` and `cf_kv_namespace`
   `external_id` values into `wrangler.toml`, then commit + push.
4. `platform_deploy_workers` -- clones the repo and runs `wrangler deploy`.
5. Apply migrations once (`wrangler d1 migrations apply DB --remote`) using a
   local checkout authenticated to the same Cloudflare account.
