# node-pg-demo

Node.js HTTP server demonstrating the managed PostgreSQL database provided by the Aseva platform.

## How it works

When an LXC app is provisioned, the platform automatically:
1. Creates a PostgreSQL database (`app_node_pg_demo`)
2. Creates a database user (`app_node_pg_demo`)
3. Writes the connection string to the app's `.env` as `NODE_PG_DEMO_DATABASE_URL`

The env var follows the pattern `<APP_NAME_UPPER>_DATABASE_URL` where hyphens become underscores.

## Endpoints

- `GET /` -- Records a visit and returns the 99 most recent visits from PostgreSQL
- `GET /healthz` -- Health check that verifies database connectivity

## Local testing

```bash
# Start a local PostgreSQL (e.g. via Docker)
docker run -d --name pg-demo -e POSTGRES_DB=node_pg_demo -e POSTGRES_HOST_AUTH_METHOD=trust -p 5432:5432 postgres:16

npm install
DATABASE_URL=postgresql://postgres@localhost:5432/node_pg_demo PORT=3000 node server.js
curl http://localhost:3000/
curl http://localhost:3000/healthz
```

## On the platform

The `visits` table is created automatically on first startup. Each request to `/` inserts a row and returns recent entries, demonstrating full read/write database access.
