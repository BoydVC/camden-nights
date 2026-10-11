#!/usr/bin/env python3
"""Camden Nights — Oriole Park night-game fan desk (stdlib only). Serves on 127.0.0.1:4290."""
import json, os
from http.server import ThreadingHTTPServer, BaseHTTPRequestHandler
HERE = os.path.dirname(os.path.abspath(__file__))
PORT = int(os.environ.get("PORT", 4290))

def page():
    rd = lambda p: open(os.path.join(HERE, p), encoding="utf-8").read()
    return rd("web/index.html").replace("/*__CSS__*/", rd("web/app.css")).replace("/*__APP__*/", rd("web/app.js").replace("</script", "<\\/script"))

class H(BaseHTTPRequestHandler):
    def send(self, code, body, ctype):
        b = body.encode() if isinstance(body, str) else body
        self.send_response(code); self.send_header("Content-Type", ctype); self.send_header("Content-Length", str(len(b)))
        self.send_header("Cache-Control", "no-store"); self.end_headers(); self.wfile.write(b)
    def do_GET(self):
        path = self.path.split("?")[0]
        try:
            if path in ("/", "/index.html", "/camden-nights.html"): self.send(200, page(), "text/html; charset=utf-8")
            elif path == "/health": self.send(200, json.dumps({"ok": True, "port": PORT, "app": "camden-nights"}), "application/json")
            else: self.send(404, "not found", "text/plain")
        except Exception as ex: self.send(500, f"error: {ex}", "text/plain")
    def log_message(self, *a): pass

if __name__ == "__main__":
    print(f"Camden Nights on http://127.0.0.1:{PORT}/", flush=True)
    ThreadingHTTPServer(("127.0.0.1", PORT), H).serve_forever()
