"""Extract EPUB spine text into a traceable Markdown review file."""

from __future__ import annotations

import argparse
import hashlib
import posixpath
import re
import zipfile
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
from xml.etree import ElementTree as ET


class TextExtractor(HTMLParser):
    BLOCKS = {
        "address", "article", "blockquote", "br", "dd", "div", "dl", "dt", "h1", "h2",
        "h3", "h4", "h5", "h6", "li", "ol", "p", "section", "table", "tr", "td", "th",
    }
    HIDDEN = {"head", "script", "style", "svg"}

    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.parts: list[str] = []
        self.hidden_depth = 0

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if tag in self.HIDDEN:
            self.hidden_depth += 1
        if not self.hidden_depth and tag in self.BLOCKS:
            self.parts.append("\n")
        if not self.hidden_depth and tag == "img":
            alt = dict(attrs).get("alt")
            if alt:
                self.parts.append(f" [{alt}] ")

    def handle_endtag(self, tag: str) -> None:
        if tag in self.HIDDEN and self.hidden_depth:
            self.hidden_depth -= 1
        if not self.hidden_depth and tag in self.BLOCKS:
            self.parts.append("\n")

    def handle_data(self, data: str) -> None:
        if not self.hidden_depth:
            self.parts.append(data)

    def text(self) -> str:
        text = "".join(self.parts).replace("\xa0", " ")
        text = re.sub(r"[ \t]+", " ", text)
        text = re.sub(r" *\n *", "\n", text)
        text = re.sub(r"\n{3,}", "\n\n", text)
        return text.strip()


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("epub", type=Path)
    parser.add_argument("output", type=Path)
    args = parser.parse_args()

    raw = args.epub.read_bytes()
    with zipfile.ZipFile(args.epub) as archive:
        container = ET.fromstring(archive.read("META-INF/container.xml"))
        rootfile = container.find(".//{*}rootfile")
        if rootfile is None or not rootfile.attrib.get("full-path"):
            raise SystemExit("EPUB container.xml has no OPF rootfile")
        opf_path = rootfile.attrib["full-path"]
        opf_dir = posixpath.dirname(opf_path)
        opf = ET.fromstring(archive.read(opf_path))
        manifest: dict[str, str] = {}
        for item in opf.findall(".//{*}manifest/{*}item"):
            manifest[item.attrib["id"]] = item.attrib["href"]

        spine = opf.findall(".//{*}spine/{*}itemref")
        paths: list[str] = []
        for itemref in spine:
            href = manifest.get(itemref.attrib.get("idref", ""))
            if not href:
                continue
            href_path = unquote(urlsplit(href).path)
            path = posixpath.normpath(posixpath.join(opf_dir, href_path))
            if path in archive.namelist():
                paths.append(path)
        if not paths:
            paths = [p for p in archive.namelist() if p.lower().endswith((".xhtml", ".html", ".htm"))]

        chunks = [
            "# EPUB Source Text Extraction\n",
            f"**EPUB file:** `{args.epub}`  \n**SHA-256:** `{hashlib.sha256(raw).hexdigest()}`\n",
            "> Extracted in EPUB reading order for source review. This is raw source material, not manuscript text.\n",
        ]
        for index, member in enumerate(paths, 1):
            parser_html = TextExtractor()
            parser_html.feed(archive.read(member).decode("utf-8", errors="replace"))
            text = parser_html.text()
            if text:
                chunks.append(f"## EPUB item {index}: `{member}`\n\n{text}\n")

    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text("\n".join(chunks), encoding="utf-8")
    print(f"Extracted {len(paths)} spine items to {args.output}")


if __name__ == "__main__":
    main()
