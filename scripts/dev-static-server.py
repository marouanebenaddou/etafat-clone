# Dev-only static server with caching disabled, for previewing public/xr ES modules:
#   python3 scripts/dev-static-server.py 8767 public
import http.server, sys, functools
class H(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, must-revalidate")
        super().end_headers()
    def log_message(self, *a): pass
port, root = int(sys.argv[1]), sys.argv[2]
http.server.ThreadingHTTPServer.request_queue_size = 64
http.server.ThreadingHTTPServer(("127.0.0.1", port), functools.partial(H, directory=root)).serve_forever()
