# Aseva Sample Apps

Minimal sample applications for the [Aseva hosting platform](https://github.com/Impulse-Engineering/aseva-hosting-conductor). Each directory is a self-contained app ready to deploy on the LXC tier.

## Apps

| Directory | Framework | Description |
|-----------|-----------|-------------|
| `node-hello` | Node.js + Express | HTTP server with `package.json` start script |
| `node-static-build` | Node.js + Vite | Build step produces static `dist/` served by Express |
| `python-hello` | Python + Flask | Minimal Flask app detected via `app.py` |
| `static-hello` | Static HTML | Plain HTML/CSS/JS served automatically |

## How to deploy

1. Register an app on the Aseva platform (tier: `lxc`)
2. Set the `git_repo_url` to this repo's URL
3. Set `git_default_ref` to `main`
4. The deploy engine clones the repo, detects the app type, installs dependencies, and starts the service

Since each sample is in a subdirectory, you would typically fork this repo and keep only the directory you need at the root, or point your app's git repo directly at a fork with the sample at the root level.

Alternatively, each directory can be pushed to its own repo.

## Requirements

All apps read the `PORT` environment variable (assigned by the platform) and bind to `0.0.0.0`.

## Currently supported app types

- **Node.js** -- Detected via `package.json`. Runs `npm install`, optional `npm run build`, then `npm start`.
- **Python** -- Detected via `app.py`, `main.py`, or `manage.py`. Runs with `python3`.
- **Static HTML** -- Detected via `index.html` at root or in `public/`, `dist/`, `build/`. Served with `python3 -m http.server`.
