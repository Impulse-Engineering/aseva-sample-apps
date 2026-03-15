# static-hello

Plain HTML/CSS page. The Aseva deploy engine detects `index.html` at the root and serves it with `python3 -m http.server`.

No build step, no dependencies.

## Local testing

```bash
PORT=3000 python3 -m http.server 3000
# Open http://localhost:3000
```
