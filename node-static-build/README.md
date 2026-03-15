# node-static-build

Node.js app with a build step. The Aseva deploy engine detects `package.json` with a `build` script, runs `npm run build` (which generates `dist/index.html`), then starts Express to serve the static output.

## Local testing

```bash
npm install
npm run build
PORT=3000 npm start
curl http://localhost:3000/
curl http://localhost:3000/healthz
```
