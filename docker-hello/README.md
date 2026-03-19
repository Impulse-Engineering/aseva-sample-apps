# docker-hello

Minimal Node.js app packaged as a Dockerfile for testing Podman container deploys on Aseva LXC tier.

- No external dependencies (stdlib `http` only)
- Reads `PORT` env var (default 8080)
- `/healthz` returns `{"status":"ok"}`
- `/` returns a greeting with uptime info
