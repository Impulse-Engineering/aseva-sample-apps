# python-hello

Minimal Python HTTP server (stdlib only, no pip dependencies). The Aseva deploy engine detects `app.py` and runs it with `python3`.

## Local testing

```bash
PORT=3000 python3 app.py
curl http://localhost:3000/healthz
```
