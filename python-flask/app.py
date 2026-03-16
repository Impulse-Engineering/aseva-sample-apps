import os
import time
from flask import Flask, jsonify

app = Flask(__name__)
START_TIME = time.time()


@app.route("/")
def index():
    return jsonify(
        app="python-flask",
        message="Hello from Flask on Aseva!",
        uptime=round(time.time() - START_TIME, 2),
    )


@app.route("/healthz")
def healthz():
    return jsonify(status="ok")


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 3000))
    app.run(host="0.0.0.0", port=port)
