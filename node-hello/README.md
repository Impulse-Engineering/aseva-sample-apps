# node-hello

Minimal Node.js + Express app. The Aseva deploy engine detects `package.json`, runs `npm install`, and starts with `npm start`.

## Local testing

```bash
npm install
PORT=3000 npm start
curl http://localhost:3000/healthz
```
