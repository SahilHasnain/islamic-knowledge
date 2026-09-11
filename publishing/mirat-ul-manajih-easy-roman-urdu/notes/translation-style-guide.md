# Mirat-ul-Manajih Easy Roman Urdu

## Scope

This is a complete Easy Roman Urdu adaptation of the Urdu translation and explanation in `db/hadees_content.db`. It is not a summary. Every claim, example, quotation, citation, footnote, narrator detail, and numbered point is retained.

## Workflow

- Subagents are the default workflow for this project. Source reading, adaptation, editing, and verification must still use the complete extracted Markdown records.
- One user session begins with `next` or `continue` and covers 20 hadith. Process those 20 hadith as four sequential sub-batches of 5; complete and verify each sub-batch before starting the next.
- Extract each session's complete source records into a Markdown source file and translate from that file, not from terminal previews or shortened output.

## Text Rules

- Preserve the Arabic hadith text exactly as stored in the database.
- Translate the Urdu translation literally into Roman Urdu. Do not paraphrase its meaning.
- Rewrite the full explanation in clear, familiar Roman Urdu without omitting content or weakening certainty.
- Keep Arabic Quranic passages, hadith quotations, duas, citations, honorifics, and `ﷺ` in Arabic script.
- Preserve respectful wording for Huzoor ﷺ, Ambiya, Sahaba, Ahl-e-Bait, and scholars. Use `inteqal`, `wisaal`, or `shahadat` rather than attributing an irreverent death reference to the Prophet ﷺ.
- Preserve quotation marks around quoted beliefs, statements, books, and Arabic passages.
- Preserve every numbered footnote marker in the source translation at its corresponding location in the literal Roman Urdu translation. Never omit or renumber markers; render them as `**1**`, `**2**`, etc.
- Remove only database export noise: `€`, `∞`, `¥`, `α` markers, stray tabs, and obvious spacing artifacts.

## Roman Urdu

Use short sentences and familiar words. Retain necessary technical Islamic terms and explain them at first useful occurrence in brackets. Do not romanize Arabic passages that are preserved from the source.
