#!/usr/bin/env python3
"""
Manuscript Audiobook Reader
Starts a local server and opens the browser for TTS reading.

Usage:
    python scripts/read_manuscript.py                          # interactive
    python scripts/read_manuscript.py tazkiratul-ambiya-english  # open book directly
    python scripts/read_manuscript.py --port 8393              # custom port
"""

import os
import sys
import json
import argparse
import webbrowser
import threading
from pathlib import Path
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs, unquote

PUBLISHING_DIR = Path(__file__).resolve().parent.parent / "publishing"
SCRIPTS_DIR = Path(__file__).resolve().parent
SKIP_FILES = {"README.md", "MIGRATION_STATUS.md"}
DEFAULT_PORT = 8393


# ---------------------------------------------------------------------------
# Data helpers
# ---------------------------------------------------------------------------

def find_english_books():
    books = []
    for entry in sorted(PUBLISHING_DIR.iterdir()):
        if entry.is_dir() and entry.name.endswith("-english"):
            md = entry / "manuscript"
            if md.exists():
                files = collect_files(md)
                if files:
                    books.append({"slug": entry.name, "file_count": len(files)})
    return books


def collect_files(manuscript_dir):
    files = []
    for root, _, fnames in os.walk(manuscript_dir):
        for fn in sorted(fnames):
            if fn.endswith(".md") and fn not in SKIP_FILES:
                files.append(Path(root) / fn)
    return sorted(files)


def get_book_files(slug):
    md = PUBLISHING_DIR / slug / "manuscript"
    if not md.exists():
        return None
    files = collect_files(md)
    return [{"path": str(f.relative_to(md)).replace(os.sep, "/"), "name": f.name} for f in files]


def get_book_all(slug):
    """Return all files with content in one response."""
    md = PUBLISHING_DIR / slug / "manuscript"
    if not md.exists():
        return None
    files = collect_files(md)
    result = []
    for f in files:
        result.append({
            "path": str(f.relative_to(md)).replace(os.sep, "/"),
            "name": f.name,
            "content": f.read_text(encoding="utf-8", errors="replace"),
        })
    return result


def get_book_file_content(slug, rel_path):
    md = PUBLISHING_DIR / slug / "manuscript"
    # Normalize path separators (browser sends /, OS may use \)
    fp = md / rel_path.replace("/", os.sep)
    if not fp.exists() or not fp.is_file():
        return None
    return fp.read_text(encoding="utf-8", errors="replace")


# ---------------------------------------------------------------------------
# HTTP handler
# ---------------------------------------------------------------------------

_handler_lock = threading.Lock()
_initial_book = None


class ReaderHandler(BaseHTTPRequestHandler):
    def log_message(self, fmt, *args):
        pass  # suppress request logs

    def _send_json(self, data, status=200):
        body = json.dumps(data).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", len(body))
        self.end_headers()
        self.wfile.write(body)

    def _send_html(self, filepath):
        try:
            body = filepath.read_bytes()
        except FileNotFoundError:
            self.send_error(404)
            return
        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", len(body))
        self.end_headers()
        self.wfile.write(body)

    def _send_text(self, text, content_type="text/plain"):
        body = text.encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", f"{content_type}; charset=utf-8")
        self.send_header("Content-Length", len(body))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        parsed = urlparse(self.path)
        path = unquote(parsed.path)
        qs = parse_qs(parsed.query)

        if path == "/":
            self._send_html(SCRIPTS_DIR / "reader.html")

        elif path == "/api/books":
            self._send_json(find_english_books())

        elif path.startswith("/api/books/") and path.endswith("/files"):
            slug = path.split("/")[3]
            files = get_book_files(slug)
            if files is None:
                self._send_json({"error": "Book not found"}, 404)
            else:
                self._send_json(files)

        elif path.startswith("/api/books/") and path.endswith("/all"):
            slug = path.split("/")[3]
            data = get_book_all(slug)
            if data is None:
                self._send_json({"error": "Book not found"}, 404)
            else:
                self._send_json(data)

        elif path.startswith("/api/books/") and path.endswith("/file"):
            slug = path.split("/")[3]
            rel_path = qs.get("path", [None])[0]
            if not rel_path:
                self._send_json({"error": "Missing path parameter"}, 400)
                return
            content = get_book_file_content(slug, rel_path)
            if content is None:
                self._send_json({"error": "File not found"}, 404)
            else:
                self._send_text(content)

        else:
            self.send_error(404)


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    global _initial_book

    parser = argparse.ArgumentParser(
        description="Manuscript Audiobook Reader \u2014 opens a browser-based TTS reader.",
    )
    parser.add_argument("book", nargs="?", default=None, help="Book slug to open directly")
    parser.add_argument("--port", type=int, default=DEFAULT_PORT, help=f"Port (default: {DEFAULT_PORT})")
    args = parser.parse_args()

    _initial_book = args.book

    server = HTTPServer(("127.0.0.1", port := args.port), ReaderHandler)
    url = f"http://127.0.0.1:{port}"
    print(f"  Manuscript Reader running at {url}")
    print(f"  Press Ctrl+C to stop.\n")

    # Open browser after a short delay
    def open_browser():
        time.sleep(0.5)
        webbrowser.open(url)

    import time
    threading.Thread(target=open_browser, daemon=True).start()

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n  Stopped.")
        server.server_close()


if __name__ == "__main__":
    main()
