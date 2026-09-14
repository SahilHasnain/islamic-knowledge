# Muntakhab Ahadees Standard English

## Scope

This is a complete standard-English translation of Book 10, `Muntakhab Ahadees`, from `db/hadees_content.db`. It is not a summary. Preserve every translation, explanation, belief, ruling, example, quotation, citation, narrator detail, and numbered note.

## Workflow

- Subagents are the default workflow.
- One session processes 20 hadith in four sequential sub-batches of 5; complete and verify each sub-batch before starting the next.
- Extract complete source records into Markdown before translation. Translate only from that extraction, never from terminal previews or summaries.

## Text Rules

- Preserve Arabic hadith text exactly as stored in the database, including Arabic quotations, duas, citations, honorifics, and `ﷺ`.
- Translate the Urdu content into clear standard English without summarizing or weakening certainty.
- Preserve every numbered translation marker in its source position as `**1**`, `**2**`, and so on.
- Preserve quotation boundaries and respectful wording for the Prophet ﷺ, Ambiya, Sahaba, Ahl-e-Bait, and scholars.
- Explain necessary technical terms at first useful occurrence in brackets.
- Remove only export noise such as `€`, `∞`, `¥`, `α`, stray tabs, and obvious spacing artifacts.
