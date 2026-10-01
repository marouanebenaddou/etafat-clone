# Dev-only static server with caching disabled, for previewing public/xr ES modules:
#   python3 scripts/dev-static-server.py 8767 public
import http.server, sys, functools
class H(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, must-revalidate")
        super().end_headers()
    def log_message(self, *a): pass
    def do_PUT(self):  # dev captures (e.g. the Cité tile hero shot): JPEG/PNG under /xr/ only
        path = self.translate_path(self.path)
        if not self.path.startswith("/xr/") or not path.endswith((".jpg", ".png")):
            self.send_error(403); return
        data = self.rfile.read(int(self.headers.get("Content-Length", 0)))
        with open(path, "wb") as f: f.write(data)
        self.send_response(204); self.end_headers()
port, root = int(sys.argv[1]), sys.argv[2]
http.server.ThreadingHTTPServer.request_queue_size = 64
http.server.ThreadingHTTPServer(("127.0.0.1", port), functools.partial(H, directory=root)).serve_forever()
