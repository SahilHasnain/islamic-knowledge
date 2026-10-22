# Migration Status

Source: `content/books/shifa-shareef.json` (Roman Urdu edition, 371 sections) — PDF: `source/Shifa Shareef Hindi.pdf` (306 pages).

Workflow: manual Hindi/Devanagari transliteration in batches. No automated transliteration script is used.

Honorifics: render common honorifics in Arabic superscript form, e.g. `<sup>عز وجل</sup>`, `<sup>رحمة الله تعالى عليه</sup>`, `<sup>رضي الله تعالى عنه</sup>`, `<sup>عليه السلام</sup>`.

## Batch architecture (decided 2026-08-22)

**One Markdown file per baab**, not per fasl. Per-fasl files (~4 KB each) caused excessive file switching; baab-level files keep review/export simple while preserving every fasl as an H1 section inside the file.

- `01-frontmatter.md` — Nashir ka note + Musannif ke baare mein + Urdu tarjama karne waale (printed 12–20)
- `02-muqaddima.md` — Muqaddima (printed 21–23)
- `03-qism1-pehla-baab.md` — Pehli Qism opening + complete Pehla Baab, all 10 fasls pehli → duswi (printed 24–56)
- `04-qism1-dusra-baab.md` — complete Dusra Baab, introduction + 26 fasls pehli → chhabbiswi (printed 57–97)
- Future: `04-qism1-dusra-baab.md`, `05-qism1-teesra-baab.md`, `06-qism1-chautha-baab.md`, then Qism 2 files.

Baab boundaries per TOC (printed pages): Pehli Qism — Pehla Baab 25–56, Dusra Baab 57–97, Teesra Baab 98–117, Chautha Baab 118–152; Dusri Qism starts 153.

## Current Progress

Started. Manually transliterated:

- `01-frontmatter.md` — Publisher's Note (`publisher-s-note`, printed page 12); About the Author / `Musannif ke baare mein` (printed 14–18, covers `taleemo-tarbiyat` … `wisaal`); Urdu Translator / `urdu-tarjama-karne-waale` (printed 19–20, covers `sadrul-afazil-ki-aap-par-inayaat`) — complete
- `02-muqaddima.md` — Muqaddima (printed 21–23) — complete
- `03-qism1-pehla-baab.md` — Pehla Baab of Pehli Qism (printed 24–56) — complete:
  - `pehli-qism` opening + `pehli-fasl-huzoor-alaihissalam-ki-shaan-mein-naazil-hone-waali-aayaat` incl. continuation (Noor aayaat, Alam Nashrah tafseer, zikr buland, itaa'at aayaat)
  - `dusri-fasl-allah-tala-ne-huzoor-alaihissalam-ko-shahid-banaya-aur-aapki-sana-farmai` (Shahid/Haazir-o-Naazir, Taurait ke awsaaf, ummat par gawahi)
  - `teesri-fasl-allah-ka-huzoor-ko-bade-ehsan-ke-saath-yaad-karna` (Tauba:43 izn, itaab bayan, takzeeb par tasalli)
  - `chauthi-fasl-allah-ka-huzoor-ke-maratib-ki-qasam-yaad-farmana` (Hijr:72 qasam, Yaseen/Taaha, Balad, Qaaf, Najm, Fajr)
  - `paanchwi-fasl-huzoor-ke-maqame-buland-ki-qasam-farmana` (Surah Duha tafseer, Najm 1-18, Takweer 15-25)
  - Chhati Fasl (Taaha 1-2, Kahaf 6, Shu'ara 3-4, Hijr 94-99, Anaam 10, Zaariyaat 52). JSON sections list omits a `chhati-fasl` slug — numbering jumps from `paanchwi-fasl` to `saatwi-fasl`; printed book has the heading on printed page 43.
  - `saatwi-fasl-quran-mein-ambiya-par-huzoor-alaihissalam-ke-fazail` (printed 45–47; Adam/Nooh/Ibrahim/Moosa/Eesa par hukm, Ambiya:69 aag ne kaha, Maaida:110 mojizaat, Aaraf:143 rooyat, Bani-Israel:79 tahajjud)
  - Aathwi Fasl (printed 47–50; Anfaal:33 azaab dafa, Abu Burda hadith Tirmizi, Ambiya:107 rahmat, Ahzaab:56 durood, Salaat = rahmat/barkat, Kaaf-Haa-Yaa-Ayen-Saad tafseer)
  - Nawi'n Fasl (printed 50–53; Fateh:1-10 buzurgiya, faisle ilahi, haaziro naazir, Ibne Ataa, Hazrate Jafar bin Muhammad, bai'ate rizwan Fateh:10, Anfaal:17)
  - Duswi Fasl (printed 53–56; Meraj waqia Maaidah:67, Anfaal:30, Tauba:40, Kausar:1-3, Hijr:87 saat aayatein, Nehal:44, Saba:28, Aaraf:158 ammi ke liye rasool, Ibrahim:4 har qaum ki zubaan, Ahzaab:6 jaan se zyada maalik + bibiyan maaein, Nisa:113 fazle azeem, Waasti alaihirrehma)

- `04-qism1-dusra-baab.md` — Dusra Baab of Pehli Qism (printed 57–97) — complete: introduction; Pehli through Chhabbiswi Fasl covering the Prophet's <sup>عليه السلام</sup> complete qualities, blessed appearance, purity, intelligence, eloquence, lineage, essential and acquired qualities, generosity, courage, modesty, conduct, mercy, loyalty, humility, justice, dignity, asceticism, worship, and the qualities of the Ambiya. Source numbering is preserved where the printed text labels both the joodo-karam and haya sections as `Pandrahwi fasl`.

## Continue In

Next file: `manuscript/00-pilot/05-qism1-teesra-baab.md`

Next source point: Teesra Baab of Pehli Qism (printed page 98), section slug `teesra-baab-huzoor-ki-qadro-manzilat-ahadees-ki-raushni-mein` — pull with `d['pages'][98:N]`.
