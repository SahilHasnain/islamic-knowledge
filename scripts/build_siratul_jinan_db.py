"""
Build a trimmed SQLite database containing only the Sirat-ul-Jinan tafseer
from the Dawat-e-Islami QuranDB.db reference database.

Source: D:/Projects/live-quran/reference/decompiled/resources/assets/databases/QuranDB.db
Output: publishing/siratul-jinan-roman-urdu/source/siratul-jinan.db
"""
import sqlite3
import os
import re
import sys

SRC = r"D:\Projects\live-quran\reference\decompiled\resources\assets\databases\QuranDB.db"
HEADINGS_SRC = r"D:\Projects\live-quran\reference\decompiled\resources\assets\databases\sirat_ul_jinan.db"
OUT = os.path.join(os.path.dirname(__file__), "..", "publishing", "siratul-jinan-roman-urdu", "source", "siratul-jinan.db")
OUT = os.path.normpath(OUT)

TAFSEER_TYPE_ID = 3  # Sirat-ul-Jinan


def strip_html(html):
    if not html:
        return ""
    cleaned = html
    cleaned = re.sub(r"<!--\[if[^>]*>[\s\S]*?<!\[endif\]-->", "", cleaned, flags=re.I)
    cleaned = re.sub(r"<xml[\s\S]*?</xml>", "", cleaned, flags=re.I)
    cleaned = re.sub(r"<o:[\s\S]*?</o:[^>]+>", "", cleaned, flags=re.I)
    cleaned = re.sub(r"</p>", "\x00\x00", cleaned, flags=re.I)
    cleaned = re.sub(r"<p[^>]*>", "\x00\x00", cleaned, flags=re.I)
    cleaned = re.sub(r"<br\s*/?>", "\x00", cleaned, flags=re.I)
    text = re.sub(r"<[^>]+>", "", cleaned)
    text = (text
        .replace("&nbsp;", " ")
        .replace("&amp;", "&")
        .replace("&lt;", "<")
        .replace("&gt;", ">")
        .replace("&quot;", '"')
        .replace("\u00A0", " ")
        .replace("\u200B", ""))
    text = re.sub(r"&#(\d+);", lambda m: chr(int(m.group(1))), text)
    text = re.sub(r"\s+", " ", text)
    text = text.replace("\x00\x00", "\n\n")
    text = text.replace("\x00", "\n")
    text = re.sub(r"\s*\{", "\n\n{", text)
    text = re.sub(r"\s*\((\d+)\)…", r"\n\n(\1)…", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    text = "\n".join(l.strip() for l in text.split("\n")).strip()
    return text


def main():
    if not os.path.exists(SRC):
        print(f"Source DB not found: {SRC}", file=sys.stderr)
        sys.exit(1)

    src = sqlite3.connect(SRC)
    src.row_factory = sqlite3.Row

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    if os.path.exists(OUT):
        os.remove(OUT)
    out = sqlite3.connect(OUT)

    # Schema
    out.executescript("""
    PRAGMA journal_mode=OFF;
    PRAGMA synchronous=OFF;

    CREATE TABLE surah (
      surahId INTEGER PRIMARY KEY,
      surahName TEXT,
      roman_name TEXT,
      roman_eng_name TEXT,
      surahIntroduction TEXT,
      surahTotalRuku INTEGER,
      surahTotalAyaat INTEGER,
      surahPlace TEXT,
      surahParaId INTEGER
    );

    CREATE TABLE para (
      paraId INTEGER PRIMARY KEY,
      paraName TEXT,
      paraStartSurahId INTEGER,
      paraStartRukuId INTEGER,
      paraStartAyatId INTEGER
    );

    CREATE TABLE aayaat (
      ayatId INTEGER PRIMARY KEY,
      ayatNumber INTEGER,
      groupId INTEGER,
      surahId INTEGER,
      paraId INTEGER,
      arabicText TEXT,
      withoutAerab TEXT,
      withoutArab TEXT,
      pageNo INTEGER
    );

    CREATE TABLE tafseer (
      tafseerId INTEGER PRIMARY KEY,
      tafseerNumber INTEGER,
      ayatId INTEGER,
      tafseerText TEXT,
      tafseerTextPlain TEXT
    );

    CREATE TABLE headings (
      headingId INTEGER PRIMARY KEY,
      bookInLanguagesId INTEGER,
      pageNumber INTEGER,
      volumeNo INTEGER,
      paraNo INTEGER,
      surahNo INTEGER,
      ayatNo INTEGER,
      ayatTitle TEXT,
      heading TEXT,
      romanHeading TEXT
    );

    CREATE INDEX idx_tafseer_ayat ON tafseer(ayatId);
    CREATE INDEX idx_aayaat_surah ON aayaat(surahId);
    """)

    # surah
    rows = src.execute(
        "SELECT surahId, surahName, roman_name, roman_eng_name, surahIntroduction, "
        "surahTotalRuku, surahTotalAyaat, surahPlace, surahParaId FROM surah ORDER BY surahId"
    ).fetchall()
    out.executemany(
        "INSERT INTO surah VALUES (?,?,?,?,?,?,?,?,?)",
        [tuple(r) for r in rows]
    )
    print(f"Inserted {len(rows)} surahs")

    # para
    rows = src.execute(
        "SELECT paraId, paraName, paraStartSurahId, paraStartRukuId, paraStartAyatId FROM para ORDER BY paraId"
    ).fetchall()
    out.executemany(
        "INSERT INTO para VALUES (?,?,?,?,?)",
        [tuple(r) for r in rows]
    )
    print(f"Inserted {len(rows)} paras")

    # aayaat
    rows = src.execute(
        "SELECT ayatId, ayatNumber, groupId, surahId, paraId, arabicText, "
        "withoutAerab, withoutArab, pageNo FROM aayaat ORDER BY ayatId"
    ).fetchall()
    out.executemany(
        "INSERT INTO aayaat VALUES (?,?,?,?,?,?,?,?,?)",
        [tuple(r) for r in rows]
    )
    print(f"Inserted {len(rows)} aayaat")

    # tafseer (Sirat-ul-Jinan only)
    rows = src.execute(
        "SELECT tafseerId, tafseerNumber, ayatId, tafseerText FROM tafseer "
        "WHERE tafseertypeId = ? AND tafseerText IS NOT NULL",
        (TAFSEER_TYPE_ID,),
    ).fetchall()
    inserted = 0
    for r in rows:
        plain = strip_html(r["tafseerText"])
        out.execute(
            "INSERT INTO tafseer VALUES (?,?,?,?,?)",
            (r["tafseerId"], r["tafseerNumber"], r["ayatId"], r["tafseerText"], plain),
        )
        inserted += 1
    print(f"Inserted {inserted} Sirat-ul-Jinan tafseer entries")

    # Printed-book headings and volume/para structure from the companion DB.
    if os.path.exists(HEADINGS_SRC):
        headings_src = sqlite3.connect(HEADINGS_SRC)
        headings_src.row_factory = sqlite3.Row
        rows = headings_src.execute(
            "SELECT id, book_in_languages_id, page_number, volume_no, parah_no, "
            "surah_no, ayat_no, ayat_title, heading, roman_heading "
            "FROM book_heading ORDER BY volume_no, page_number, id"
        ).fetchall()
        out.executemany(
            "INSERT INTO headings VALUES (?,?,?,?,?,?,?,?,?,?)",
            [tuple(r) for r in rows]
        )
        headings_src.close()
        print(f"Inserted {len(rows)} printed-book headings")
    else:
        print(f"Headings DB not found; skipped: {HEADINGS_SRC}")

    src.close()
    out.commit()
    out.close()

    size = os.path.getsize(OUT) / (1024 * 1024)
    print(f"\nWrote {OUT} ({size:.1f} MB)")


if __name__ == "__main__":
    main()
