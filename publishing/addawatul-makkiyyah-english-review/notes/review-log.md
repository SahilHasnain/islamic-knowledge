# Review Log — Existing Addawatul Makkiyyah English Edition

**Review target:** `publishing/addawatul-makkiyyah-english/`
**Authoritative source:** `content/books/addawatul-makkiyyah.json`
**Review mode:** Findings only; existing English manuscript has not been edited.

## Range Reviewed

- `manuscript/00-front-matter/01-title-page.md`
- `manuscript/00-front-matter/02-hamd.md`
- `manuscript/00-front-matter/03-arze-nashir.md`
- `manuscript/00-front-matter/04-background.md`
- `manuscript/01-nazre-awwal.md`
- Compared with JSON records for source pages 2–28, with detailed paragraph-level checks over
  the background and the first *Nazre Awwal* material.

## Definite Translation / Accuracy Findings

### R-001 — Incorrect weekday

- **Severity:** High
- **Location:** `manuscript/00-front-matter/04-background.md:13`
- **Source:** JSON page 14 (printed page 10): `Ye peer ka din tha` — “It was Monday.”
- **Current English:** “It was Thursday, the twenty-fifth of Zulhijjah 1323 Hijri...”
- **Finding:** The weekday is wrong. The source says Monday, not Thursday.

### R-002 — “Kuji” mistranslated as fatigue

- **Severity:** High
- **Location:** `manuscript/00-front-matter/04-background.md:3`
- **Source:** JSON page 13 (printed page 9): `chashme mubarak mein na kuji paida hoti hai aur na kotahi paida hoti hai`.
- **Current English:** “neither does fatigue enter his blessed eye nor does any shortcoming occur.”
- **Finding:** “Fatigue” does not match `kuji` (crookedness/distortion). The wording concerns the
  absence of crookedness or deficiency in the blessed sight, not tiredness.

### R-003 — “Amaan” rendered as “trust”

- **Severity:** Medium
- **Location:** `manuscript/00-front-matter/04-background.md:25`
- **Source:** JSON page 15 (printed page 11): `main deene mateen ki amaan mein hoon`.
- **Current English:** “I am in the trust of the firm Deen.”
- **Finding:** In this context `amaan` means protection/refuge/safety, not “trust.” The sentence
  should convey that the author was under the protection of the firm religion.

### R-004 — “Dus lakh” mistranslated as ten million

- **Severity:** High
- **Location:** `manuscript/01-nazre-awwal.md:139, 143`
- **Source:** JSON pages 23–24 (printed pages 19–20): `dus lakh samundar` means one million
  oceans (ten lakh in South Asian numbering).
- **Current English:** “ten million oceans.”
- **Finding:** The quantity is ten times too large. The second occurrence is also part of a
  duplicated passage (see R-005).

### R-005 — Duplicated ocean comparison

- **Severity:** High
- **Location:** `manuscript/01-nazre-awwal.md:139, 143`
- **Source:** JSON pages 23–24 contain this comparison once.
- **Finding:** The finite-oceans comparison and the conclusion that created knowledge cannot
  reach the infinite are translated at line 139 and then repeated substantially at line 143.
  The source has no second occurrence. Line 143 also says “less than limited,” which is not a
  coherent rendering of the source’s “less [than a drop] and finite.”

### R-006 — “Events” translated as “limits”

- **Severity:** High
- **Location:** `manuscript/01-nazre-awwal.md:111`
- **Source:** JSON page 21 (printed page 17): `un tamam hadiso ko` in context means all events/occurrences.
- **Current English:** “knows all those limits that exist...”
- **Finding:** “Limits” changes the subject of the sentence. The source describes every event or
  occurrence in existence, past or future, along with possibilities and impossibilities.

### R-007 — Meaning changed in the “kul ho ya baaz” distinction

- **Severity:** Medium
- **Location:** `manuscript/01-nazre-awwal.md:103`
- **Source:** JSON page 20 (printed page 16): `juz'i ho ya kulli, kul ho ya baaz` — whether particular
  or universal, all or some.
- **Current English:** “whether partial or total, complete or incomplete.”
- **Finding:** “Complete or incomplete” does not preserve “all or some,” and partially repeats the
  earlier contrast. The logical categories should remain distinct.

### R-008 — Individual particles described as containing unlimited knowledge

- **Severity:** Medium
- **Location:** `manuscript/01-nazre-awwal.md:113`
- **Source:** JSON page 21 describes Allah Almighty’s infinite knowledge concerning every particle
  and its relations to every other particle.
- **Current English:** “for Allah, every single particle contains unlimited knowledge.”
- **Finding:** This wording makes the particle sound like the possessor/container of knowledge.
  The source attributes the knowledge to Allah Almighty and says His knowledge encompasses each
  particle and its relations.

### R-009 — Unmarked additions to the source

- **Severity:** Medium
- **Location:** `manuscript/01-nazre-awwal.md:171, 173`
- **Source:** JSON pages 25–26.
- **Current English at line 171:** adds “whether it is the knowledge of the rulings of Shariah or
  other matters”; the source instead says whether it is *mutlaq ijmali* or *mutlaq tafseeli*.
- **Current English at line 173:** adds an explanation that confusion arose because people mixed
  the two types and adds “May Allah guide whom He wills.” These statements do not appear in the
  source passage.
- **Finding:** Remove or separately identify these additions if the edition is intended to remain
  a faithful translation.

### R-010 — Missing source text silently supplied

- **Severity:** Medium
- **Location:** `manuscript/01-nazre-awwal.md:92`
- **Source:** JSON page 20 contains the literal gap `----` in the sentence about proving knowledge
  through the existence of a single individual.
- **Current English:** supplies a complete sentence without indicating the source gap.
- **Finding:** The manuscript silently reconstructs text missing from the JSON. The completion
  should be checked against the source edition or marked as an editorial reconstruction.

### R-011 — Wording about the Prophet’s ﷺ own “demise”

- **Severity:** Respect/adab review
- **Location:** `manuscript/01-nazre-awwal.md:193, 201`
- **Source:** JSON pages 27–28: the opponents are reported as claiming that the Prophet ﷺ did not
  know the circumstances of his `khatimah` (end/conclusion) or the end of his Ummah.
- **Current English:** “his own demise.”
- **Finding:** This is an opponents’ claim, not the narrator’s belief, and the source term can be
  rendered as “his own ultimate end” without explicitly attributing a death reference to the
  Prophet ﷺ. Review the wording for the project’s adab standard while preserving the reported claim.

### R-012 — Quranic translation shifts the referent

- **Severity:** Medium
- **Location:** `manuscript/01-nazre-awwal.md:215` (Al-Fath: 1)
- **Source:** JSON page 28: `aapke sabab aapke aglo aur pichhlo ke gunah`—the wording refers to
  “your earlier and later sins” / sins forgiven through the Prophet ﷺ, according to the supplied
  source translation.
- **Current English:** “the sins of those before and those after [you].”
- **Finding:** The English makes the referents people who came before and after the Prophet ﷺ,
  rather than preserving the source wording about “your” earlier and later sins. Check against the
  source phrasing and its cited Quran translation.

## Items to Confirm as Editorial Omissions

- The JSON title/credits page (JSON page 3) includes Urdu-translator and Roman-Urdu-transliterator
  credits, publisher details, edition/publication data, and copyright information. These are not
  all present in the English title page or the visible metadata. Confirm whether the omission is
  intentional.
- JSON pages 8–9 contain the Abde Mustafa Organisation profile and service descriptions. No
  corresponding section appears in the current manuscript map. This may be an intentional decision
  to omit publisher promotional material; record that choice explicitly if so.

## Respect / Adab Checks

- The reviewed material preserves `ﷺ` and uses reverential titles for the Prophet ﷺ.
- “Demise” at R-011 is the only specific Prophet-death wording flagged in this range; it occurs
  while reporting an opponents’ claim and can be made more source-precise as “ultimate end.”
- No other definite disrespectful or diminishing wording was found in the reviewed range.
