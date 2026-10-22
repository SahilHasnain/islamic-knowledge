# Sirat-ul-Jinan Roman Urdu Transliteration Style Guide

## Scope

Convert the Urdu-script tafseer into Roman script. **This is transliteration, not translation.** Keep the author's exact Urdu words, grammar, and sentence order; change only the script. Do not paraphrase, reword into English, summarize, or silently merge source content.

## Source Handling

- Use `source/siratul-jinan.db` as the source of truth.
- Use `tafseerTextPlain` for transliteration and retain the source IDs in working batches.
- Preserve the ordering of para, surah, ayat, and tafseer entries.
- Preserve `{Arabic phrase: Urdu meaning}` blocks. Keep the Arabic phrase in Arabic script and convert only the Urdu meaning to Roman script.
- Preserve numbered references such as `(1)…` and all citations.

## Arabic and Adab

- Preserve Quranic Arabic exactly as supplied by the database.
- Preserve Arabic duas, hadith quotations, Islamic phrases, and honorifics in Arabic script. Never romanize them.
- Preserve `ﷺ` wherever it occurs.
- Never attribute death directly to the Prophet ﷺ in any surrounding documentation. Use a reverent expression; preserve Arabic honorifics as-is.
- Avoid diminishing phrasing for the Prophet ﷺ.
- Use elevated Ahlus-Sunnah terminology for Allah, the Prophets, the Companions, scholars, and the righteous.

## Roman Urdu (Romanization)

- Convert Urdu script to Roman letters using consistent spellings; record approved spellings in `notes/glossary.md`.
- Keep familiar Islamic terms in their established Roman Urdu forms (e.g., `Allah`, `Ta'ala`, `quran`).
- Follow the Maktaba-tul-Madina / Dawat-e-Islami Roman Urdu convention where the source style matches it.
- Retain Urdu sentence structure; do not reorder or reword to make it "more English".
- Preserve the author's explanatory, devotional, and scholarly tone.
- Do not introduce translator commentary into the transliterated body.

## Review

Every batch must be checked against its Urdu source for completeness, faithfulness, Arabic preservation, citations, and honorifics before approval.
