# python-flask

Flask HTTP server with `requirements.txt`. The Aseva deploy engine detects `requirements.txt`, runs `pip3 install -r requirements.txt`, then starts `app.py`.

## Local testing

```bash
pip3 install -r requirements.txt
PORT=3000 python3 app.py
curl http://localhost:3000/healthz
```
