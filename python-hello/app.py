import os
import json
import time
from http.server import HTTPServer, BaseHTTPRequestHandler

START_TIME = time.time()


class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == "/healthz":
            self._respond(200, {"status": "ok"})
        elif self.path == "/":
            self._respond(200, {
                "app": "python-hello",
                "message": "Hello from Python on Aseva!",
                "python": os.sys.version,
                "uptime": round(time.time() - START_TIME, 2),
            })
        else:
            self._respond(404, {"error": "Not found"})

    def _respond(self, status, body):
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(json.dumps(body).encode())

    def log_message(self, format, *args):
        print(f"{self.address_string()} - {format % args}")


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 3000))
    server = HTTPServer(("0.0.0.0", port), Handler)
    print(f"python-hello listening on port {port}")
    server.serve_forever()
