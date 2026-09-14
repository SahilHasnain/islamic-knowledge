# Translation Plan

## Session rule

Process up to 20 consecutive kalams in one session, divided into four sequential batches of five. Complete and verify each batch before beginning the next. Read the complete five-record JSON extraction before translation; never translate from previews, summaries, or guessed source positions. A subagent may report a batch complete only after independently verifying every source line, stanza boundary, slug, URL, and count, and confirming that no displaced or extra kalam was added.

## Batch 01

Translate the first five kalams from `content/books/bal-e-jibreel.json` in exact JSON order:

1. `001 meri-nawa-e-shauk` - 5 stanzas, 10 lines
2. `002 agar-kaj-ro-hain-anjum-asman-tera-hai-ya-mera` - 5 stanzas, 10 lines
3. `003 tere-shishe-mein-mai-baqi-nahin-hai` - 2 stanzas, 4 lines
4. `004 gaisu-e-tabdar-ko-aur-bhi-tabdar-kar` - 7 stanzas, 14 lines
5. `005 asar-kare-na-kare-sun-to-le-meri-faryad` - 7 stanzas, 14 lines

## Batch 02

Translate the next five kalams from `content/books/bal-e-jibreel.json` in exact JSON order:

6. `006 kya-ishq-aik-zindagi-e-mastaar-ka` - 5 stanzas, 10 lines
7. `007 dilon-ko-markaz-e-mehar-o-wafa-kar` - 2 stanzas, 4 lines
8. `008 preshaan-ho-ke-meri-khaak` - 6 stanzas, 12 lines
9. `009 digargoon-hai-jahan-taron-ki-gardish-taez-hai-saqi` - 7 stanzas, 14 lines
10. `010 la-phir-aik-bar-wohi-badah-o-jaam-ae-saqi` - 7 stanzas, 14 lines

## Batch 03

Translate the next five kalams from `content/books/bal-e-jibreel.json` in exact JSON order:

11. `011 mita-diya-mere-saqi-ne-alam-e-maan-o-tu` - 7 stanzas, 14 lines
12. `012 mata-e-bebaha-hai-dard-o-souz-e-arzoo-mandi` - 7 stanzas, 14 lines
13. `013 tujhe-yaad-kya-nahin-hai-mere-dil-ka-woh-zamana` - 7 stanzas, 14 lines
14. `014 zameer-e-lala-mai-e-laal-se-huwa-labraiz` - 7 stanzas, 14 lines
15. `015 wohi-meri-kam-naseebi-wohi-teri-be-niazi` - 7 stanzas, 14 lines

## Batch 04

Translate the next five kalams from `content/books/bal-e-jibreel.json` in exact JSON order:

16. `016 apni-jolangah-zair-e-asman-samjha-tha-main` - 6 stanzas, 12 lines
17. `017 ek-danish-e-noorani-ek-danish-e-burhani` - 7 stanzas, 14 lines
18. `018 ya-rab-ye-jahan-e-guzran-khoob-hai-lekin` - 16 stanzas, 32 lines
19. `019 sama-sakta-nahin-pehnaay-fitrat-mein-mera-soda` - 6 stanzas, 12 lines
20. `020 bohat-dekhe-hain-main-ne-mashriq-o-maghrib-ke-maikhane` - 8 stanzas, 16 lines

## Batch 05

Translate the next five kalams from `content/books/bal-e-jibreel.json` in exact JSON order:

21. `021 ghulami-kya-hai` - 11 stanzas, 22 lines
22. `022 ye-kon-ghazal-khawan-hai-pur-soz-o-nishat-angaiz` - 7 stanzas, 14 lines
23. `023 woh-harf-e-raaz-ke-mujh-ko-sikha-gaya-hai-junoon` - 9 stanzas, 18 lines
24. `024 alam-e-aab-o-khak-o-bad-sir-e-ayan-hai-tu-ke-main` - 4 stanzas, 8 lines
25. `025 tu-abhi-reh-guzar-mein-hai` - 5 stanzas, 10 lines

## Entry format

- Kalam number and JSON slug
- English title
- Source URL
- Source fields used: Urdu for meaning and transliteration for traceability
- Stanza and line counts
- Poetic English translation with unchanged stanza and line structure

## Verification

- Compare every stanza and line against both source fields.
- Confirm JSON order, slug, title, URL, stanza count, and line count.
- Confirm all questions, repetitions, imagery, emotional force, and philosophical turns remain present.
- Confirm no Urdu or Devanagari appears in the English poem.
- Confirm no prose explanation, HTML, or translator commentary appears in the poem.
- Confirm every new file is below 1,000 lines and `git diff --check` passes.

## Batch 05 Verification Record

- Coverage: JSON indices 20-24, kalams 021-025 only, in exact order.
- Source URLs, slugs, JSON titles, stanza counts, and nonblank line counts are taken from the complete source records.
- Batch total: 5 kalams, 34 stanzas, 68 lines.

## Batch 06

Translate the next five kalams from `content/books/bal-e-jibreel.json` in exact JSON order:

26. `026 amin-e-raaz-hai-mardan-e-hur-ki-darvaishi` - 5 stanzas, 10 lines
27. `027 phir-charagh-e-lala-se-roshan-huay-koh-o-daman` - 9 stanzas, 18 lines
28. `028 musalman-ke-lahoo-mein-hai-saliqa-dil-nawazi-ka` - 6 stanzas, 12 lines
29. `029 ishq-se-paida-nuwaay-zindagi-mein-zair-o-bam` - 5 stanzas, 10 lines
30. `030 dil-soz-se-khali-hai-nigah-pak-nahin-hai` - 7 stanzas, 14 lines

## Batch 06 Verification Record

- Coverage: JSON indices 25-29, kalams 026-030 only, in exact order.
- Source URLs, slugs, JSON titles, stanza counts, and nonblank line counts are taken from the complete source records.
- Batch total: 5 kalams, 32 stanzas, 64 lines.

## Batch 07

Translate the next five kalams from `content/books/bal-e-jibreel.json` in exact JSON order:

31. `031 hazar-khof-ho-lekin-zuban-ho-dil-ki-rafeeq-2` - 7 stanzas, 14 lines
32. `032 pooch-iss-se-ke-maqbool-hai-fitrat-ki-gawahi` - 5 stanzas, 10 lines
33. `033 ye-hooriyan-e-farangi` - 7 stanzas, 14 lines
34. `034 dil-e-baidar-farooqi` - 7 stanzas, 14 lines
35. `035 khudi-ki-shokhi-o-tundi-mein-kubr-o-naaz-nahin` - 7 stanzas, 14 lines

## Batch 07 Verification Record

- Coverage: JSON indices 30-34, kalams 031-035 only, in exact order.
- Manuscript: `manuscript/02-bal-e-jibreel-english-02.md` (150 lines); `manuscript/01-bal-e-jibreel-english-01.md` remains unchanged at 880 lines because the complete batch could not fit.
- Batch total: 5 kalams, 33 stanzas, 66 lines.

## Batch 08 Verification Record

- Coverage: JSON indices 35-39, kalams 036-040 only, in exact order.
- Source records: `036 mir-e-sipah-na-saza-lashkar-yaan-shakistah-saf` (7 stanzas, 14 lines), `037 zamistani-hawa-mein-garcha-thi-shamsheer-ki-taizi` (5 stanzas, 10 lines), `038 ye-dair-e-kuhan-hai-anbar-e-khas-o-khashaak` (7 stanzas, 14 lines), `039 kamal-e-tark-nahin-aab-o-gill-se-mahjoori` (7 stanzas, 14 lines), and `040 aqal-go-aastan-se-door-nahin` (9 stanzas, 18 lines).
- Batch total: 5 kalams, 35 stanzas, 70 nonblank source lines.
- Manuscript: `manuscript/02-bal-e-jibreel-english-02.md`, now 305 lines; complete kalam entries fit without creating a new file. `manuscript/01-bal-e-jibreel-english-01.md` remains unchanged at 880 lines.

## Batch 09

Translate the next five kalams from `content/books/bal-e-jibreel.json` in exact JSON order:

41. `041 khudi-woh-beher-hai-jis-ka-koi-kinara-nahin` - 7 stanzas, 14 lines
42. `042 ye-peyam-de-gayi-hai-mujhe-bad-e-subah-gahi` - 7 stanzas, 14 lines
43. `043 teri-nigah-firo-maya-hath-hai-kotah` - 7 stanzas, 14 lines
44. `044 kirad-ke-paas-khabar-ke-siwa-kuch-aur-nahin` - 7 stanzas, 14 lines
45. `045 nigah-e-faqar-mein-shan-e-sikandari-kya-hai` - 7 stanzas, 14 lines

## Batch 09 Verification Record

- Coverage: JSON indices 40-44, kalams 041-045 only, in exact order.
- Batch total: 5 kalams, 35 stanzas, 70 nonblank source lines.
- Manuscript: `manuscript/02-bal-e-jibreel-english-02.md`, now 460 lines; the complete batch was appended without creating a new file. Prior manuscript `manuscript/01-bal-e-jibreel-english-01.md` remains unchanged at 880 lines.

## Batch 10

Translate the next five kalams from `content/books/bal-e-jibreel.json` in exact JSON order:

46. `na-tu-zameen-ke-liye-hai-na-asman-ke-liye` - 8 stanzas, 16 lines
47. `tu-ae-aseer-e-makan` - 5 stanzas, 9 lines
48. `kirad-ne-mujh-ko-atta-ki-nazar-hakeemana` - 7 stanzas, 14 lines
49. `aflak-se-ata-hai-nalon-ka-jawab-akhir` - 7 stanzas, 14 lines
50. `har-cheez-hai-mehew-e-khud-numai` - 8 stanzas, 16 lines

## Batch 10 Verification Record

- Coverage: JSON indices 45-49, kalams 046-050 only, in exact order.
- Source totals: 35 stanzas, 69 nonblank lines.
- Manuscript: `manuscript/02-bal-e-jibreel-english-02.md`, now 614 lines; all five complete kalam entries fit without creating a new file. Prior manuscript `manuscript/01-bal-e-jibreel-english-01.md` remains unchanged at 880 lines.
- The one-line fourth stanza of kalam 047 is preserved exactly as separated in the JSON source.

## Batch 11 Verification Record

- Coverage: JSON indices 50-54, kalams 051-055 only, in exact order.
- Source records: `051 ejaz-hai-kissi-ka-ya-gardish-e-zamana` (7 stanzas, 14 lines), `052 khirad-mandon-se-kya-poochun-ke-meri-ibtada-kya-hai` (6 stanzas, 12 lines), `053 jab-ishq-sikhata-hai-adab-e-khud-agahi` (6 stanzas, 12 lines), `054 mujhe-aah-o-fighan-e-neem-shab-ka-phir-peyam-aya` (6 stanzas, 12 lines), and `055 na-ho-tughyan-e-mushtaqi-to-main-rehta-nahin-baqi` (7 stanzas, 14 lines).
- Batch total: 5 kalams, 32 stanzas, 64 nonblank source lines.
- Manuscript: `manuscript/02-bal-e-jibreel-english-02.md`, now 760 lines; complete kalam entries fit without creating a new file. Earlier manuscript content remains unchanged.

## Batch 12

Translate the next five kalams from `content/books/bal-e-jibreel.json` in exact JSON order:

56. `056 fitrat-ko-khirad-ke-ru-ba-ru-kar` - 5 stanzas, 10 lines
57. `057 ye-piran-e-kaleesa-o-haram-ae-waye-majboori` - 7 stanzas, 14 lines
58. `058 taza-phir-danish-e-hazir-ne-kiya-sehar-e-qadeem` - 5 stanzas, 10 lines
59. `059 sitaron-se-agay-jahan-aur-bhi-hain` - 7 stanzas, 14 lines
60. `060 dhoond-raha-hai-farang-aysh-e-jahan-ka-dawam` - 7 stanzas, 14 lines

## Batch 12 Verification Record

- Coverage: JSON indices 55-59, kalams 056-060 only, in exact order.
- Batch total: 5 kalams, 31 stanzas, 62 nonblank source lines.
- Manuscript: `manuscript/02-bal-e-jibreel-english-02.md`, now 903 lines; all five complete kalam entries fit without creating a new file. Earlier manuscript content remains unchanged.

## Batch 13

Translate the next five kalams from `content/books/bal-e-jibreel.json` in exact JSON order:

61. `khudi-ho-ilm-se-mohkam-to-ghairat-e-jibreel` - 7 stanzas, 14 lines
62. `maktabon-mein-kahin-raanai-e-afkar-bhi-hai` - 5 stanzas, 10 lines
63. `hadsa-woh-jo-abhi-pardaay-aflak-mein-hai` - 5 stanzas, 10 lines
64. `raha-na-halqa-e-sufi-mein-soz-e-mushtaqi` - 7 stanzas, 14 lines
65. `huwa-na-zor-se-uss-ke-koi-gireban-chaak` - 7 stanzas, 14 lines

## Batch 13 Verification Record

- Coverage: JSON indices 60-64, kalams 061-065 only, in exact order.
- Source totals: 29 stanzas, 58 nonblank lines.
- Manuscript: `manuscript/03-bal-e-jibreel-english-03.md`, 146 lines; all five complete kalam entries were added to the new sequential file because the prior manuscript was already 903 lines. Earlier manuscripts remain unchanged.

## Batch 14

Translate the next five kalams from `content/books/bal-e-jibreel.json` in exact JSON order:

66. `yun-hath-nahin-ata-vo-gohar-e-yak-dana` - 6 stanzas, 12 lines
67. `na-takht-o-taj-mein-ne-lashkar-o-sipah-mein-hai` - 7 stanzas, 14 lines
68. `fitrat-ne-na-bakhsha-mujhe-andeshaay-chalak` - 4 stanzas, 8 lines
69. `karain-ge-ahl-e-nazar-taza-bastiyan-abad` - 7 stanzas, 14 lines
70. `ki-haq-se-farishton-ne-iqbal-ki-ghamazi` - 3 stanzas, 6 lines

## Batch 14 Verification Record

- Coverage: JSON indices 65-69, kalams 066-070 only, in exact order.
- Source totals: 27 stanzas, 54 nonblank lines.
- Manuscript: `manuscript/03-bal-e-jibreel-english-03.md`, 277 lines; the five complete kalam entries fit in the current sequential file. Earlier manuscript content remains unchanged.

## Batch 15

Translate the next five kalams from `content/books/bal-e-jibreel.json` in exact JSON order:

71. `ne-muhrah-baqi-ne-muhrah-bazi` - 7 stanzas, 14 lines
72. `garam-e-faghan-hai-jaras-uth-ke-gya-qafla` - 5 stanzas, 10 lines
73. `meri-nawa-se-huay-zinda-arif-o-aami` - 6 stanzas, 12 lines
74. `har-ek-maqam-se-agay-guzar-gya-mah-e-nau` - 5 stanzas, 10 lines
75. `kho-na-ja-iss-sehar-o-sham-mein-ae-sahib-e-hosh` - 5 stanzas, 10 lines

## Batch 15 Verification Record

- Coverage: JSON indices 70-74, kalams 071-075 only, in exact order.
- Source totals: 27 stanzas, 54 nonblank lines.
- Manuscript: `manuscript/03-bal-e-jibreel-english-03.md`, now 411 lines; all five complete kalam entries fit without creating a new file. Earlier manuscript content remains unchanged.

## Batch 16

Translate the next five kalams from `content/books/bal-e-jibreel.json` in exact JSON order:

76. `tha-jahan-madrasa-e-sheri-o-shahanshahi` - 5 stanzas, 10 lines
77. `hai-yaad-mujhe-nuktaay-salman-e-khush-ahang` - 3 stanzas, 6 lines
78. `faqar-ke-hain-maujazat-taj-o-sareer-o-sipah` - 7 stanzas, 14 lines
79. `kamal-e-josh-e-junoon-main-raha-garam-e-tawaf` - 5 stanzas, 10 lines
80. `shaur-o-hosh-o-khird-ka-maamla-hai-ajeeb` - 5 stanzas, 10 lines

## Batch 16 Verification Record

- Coverage: JSON indices 75-79, kalams 076-080 only, in exact order.
- Batch total: 5 kalams, 25 stanzas, 50 nonblank source lines.
- Manuscript: `manuscript/03-bal-e-jibreel-english-03.md`, now 536 lines; all five complete kalam entries fit without creating a new file. Earlier manuscript content remains unchanged.
- Overall total: 80 kalams, 508 stanzas, 1,015 lines.

## Batch 17

Translate the next five kalams from `content/books/bal-e-jibreel.json` in exact JSON order:

81. `andaz-e-bayan-garcha-bohat-shokh-nahin-hai` - 3 stanzas, 6 lines
82. `reh-e-rasm-e-haram-na-mehramana` - 2 stanzas, 4 lines
83. `zulaam-e-behar-mein-kho-kar-sanbhal-ja` - 2 stanzas, 4 lines
84. `makani-hun-ke-azad-e-makan-hun` - 2 stanzas, 4 lines
85. `khudi-ki-khalwaton-mein-gum-raha-main` - 2 stanzas, 4 lines

## Batch 17 Verification Record

- Coverage: JSON indices 80-84, kalams 081-085 only, in exact order.
- Batch total: 5 kalams, 11 stanzas, 22 nonblank source lines.
- Manuscript: `manuscript/03-bal-e-jibreel-english-03.md`, now 619 lines; all five complete kalam entries fit without creating a new file. Earlier manuscript content remains unchanged.
- Overall total: 85 kalams, 519 stanzas, 1,037 lines.

## Batch 18

Translate the next five kalams from `content/books/bal-e-jibreel.json` in exact JSON order:

86. `preshan-karobar-e-aashanai` - 2 stanzas, 4 lines
87. `yaqeen-misl-e-khalil-aatish-nasheeni` - 2 stanzas, 4 lines
88. `arab-ke-soz-mein-saaz-e-ajam-hai` - 2 stanzas, 4 lines
89. `koi-dekhe-to-meri-ne-nawazi` - 2 stanzas, 4 lines
90. `har-ek-zarre-mein-hai-shaid-makeen-dil` - 2 stanzas, 4 lines

## Batch 18 Verification Record

- Coverage: JSON indices 85-89, kalams 086-090 only, in exact order.
- Batch total: 5 kalams, 10 stanzas, 20 nonblank source lines.
- Manuscript: `manuscript/03-bal-e-jibreel-english-03.md`, now 699 lines; all five complete kalam entries fit in the current sequential file. Earlier manuscript content remains unchanged.
- Overall total: 90 kalams, 529 stanzas, 1,057 lines.

## Batch 19

Translate the next five kalams from `content/books/bal-e-jibreel.json` in exact JSON order:

91. `tera-andesha-aflaki-nahin-hai` - 2 stanzas, 4 lines
92. `na-momin-hai-na-momin-ki-ameeri` - 2 stanzas, 4 lines
93. `khudi-ki-jalwaton-mein-mustafai` - 2 stanzas, 4 lines
94. `nigah-uljhi-huwi-hai-rang-o-bu-mein` - 2 stanzas, 4 lines
95. `jamal-e-ishq-o-masti-ne-nawazi` - 2 stanzas, 4 lines

## Batch 19 Verification Record

- Coverage: JSON indices 90-94, kalams 091-095 only, in exact order.
- Source totals: 10 stanzas, 20 nonblank lines.
- Batch total: 5 kalams, 10 stanzas, 20 lines.
- Manuscript: `manuscript/03-bal-e-jibreel-english-03.md`; complete kalam entries fit without creating a new sequential file. Earlier manuscript content remains unchanged.
- Overall total: 95 kalams, 539 stanzas, 1,077 lines.

## Batch 20

Translate the next five kalams from `content/books/bal-e-jibreel.json` in exact JSON order:

96. `vo-mera-ronaq-e-mehfil-kahan-hai` - 2 stanzas, 4 lines
97. `sawar-e-naqa-o-mohmil-nahin-main` - 2 stanzas, 4 lines
98. `tere-sine-mein-dam-hai-dil-nahin-hai` - 2 stanzas, 4 lines
99. `tera-johar-hai-noori-pak-hai-tu` - 2 stanzas, 4 lines
100. `mohabbat-ka-junoon-baqi-nahin-hai` - 2 stanzas, 4 lines

## Batch 20 Verification Record

- Coverage: JSON indices 95-99, kalams 096-100 only, in exact order.
- Source totals: 10 stanzas, 20 nonblank lines.
- Manuscript: `manuscript/03-bal-e-jibreel-english-03.md`, 859 lines; all five complete kalam entries fit without creating a new sequential file. Earlier manuscript content remains unchanged.
- Overall total: 100 kalams, 549 stanzas, 1,097 lines.

## Batch 21

Translate the next five kalams from `content/books/bal-e-jibreel.json` in exact JSON order:

101. `khudi-ke-zor-se-dunya-pe-cha-ja` - 2 stanzas, 4 lines
102. `chaman-mein-rakht-e-gul-shabnam-se-tar-hai` - 2 stanzas, 4 lines
103. `khirad-se-rahru-roshan-basar-hai` - 2 stanzas, 4 lines
104. `jawanon-ko-meri-aah-e-sehar-de` - 2 stanzas, 4 lines
105. `teri-dunya-jahan-e-murgh-o-mahi` - 2 stanzas, 4 lines

## Batch 21 Verification Record

- Coverage: JSON indices 100-104, kalams 101-105 only, in exact order.
- Source totals: 10 stanzas, 20 nonblank lines.
- Manuscript: `manuscript/04-bal-e-jibreel-english-04.md`, 83 lines; a new sequential file was required because `manuscript/03-bal-e-jibreel-english-03.md` already had 859 lines. Earlier manuscripts remain unchanged.
- Overall total: 105 kalams, 559 stanzas, 1,117 lines.

## Batch 22

Translate the next five kalams from `content/books/bal-e-jibreel.json` in exact JSON order:

106. `karam-tera-ke-be-johar-nahin-main` - 2 stanzas, 4 lines
107. `wohi-asal-e-makan-o-la-makan-hai` - 2 stanzas, 4 lines
108. `kabhi-awara-o-be-khanman-ishq` - 2 stanzas, 4 lines
109. `kabhi-tanhai-e-koh-o-daman-ishq` - 2 stanzas, 4 lines
110. `atta-aslaf-ka-jazb-e-darun-kar` - 2 stanzas, 4 lines

## Batch 22 Verification Record

- Coverage: JSON indices 105-109, kalams 106-110 only, in exact order.
- Source totals: 10 stanzas, 20 nonblank lines.
- Manuscript: `manuscript/04-bal-e-jibreel-english-04.md`, now 163 lines; all five complete kalam entries fit without creating a new file. Earlier manuscript content remains unchanged.
- Overall total: 110 kalams, 569 stanzas, 1,137 lines.

## Batch 23

Translate the next five kalams from `content/books/bal-e-jibreel.json` in exact JSON order:

111. `ye-nukta-main-ne-sikha-bu-al-hassan-se` - 2 stanzas, 4 lines
112. `khirad-waqif-nahin-hai-naik-o-bad-se` - 2 stanzas, 4 lines
113. `khudai-ehtemam-e-khushk-o-tar-hai` - 2 stanzas, 4 lines
114. `yehi-adam-hai-sultan-behar-o-bar-ka` - 2 stanzas, 4 lines
115. `dam-e-arif-nasim-e-subah-dam-hai` - 2 stanzas, 4 lines

## Batch 23 Verification Record

- Coverage: JSON indices 110-114, kalams 111-115 only, in exact order.
- Source totals: 10 stanzas, 20 nonblank source lines.
- Manuscript: `manuscript/04-bal-e-jibreel-english-04.md`, now 243 lines; all five complete kalam entries fit without creating a new file. Earlier manuscript content remains unchanged.
- Overall total: 115 kalams, 579 stanzas, 1,157 lines.

## Batch 24

Translate the next five kalams from `content/books/bal-e-jibreel.json` in exact JSON order:

116. `ragon-mein-vo-lahoo-baqi-nahin-hai` - 2 stanzas, 4 lines
117. `khule-jate-hain-asrar-e-nihani` - 2 stanzas, 4 lines
118. `zamane-ki-ye-gardish-javidana` - 2 stanzas, 4 lines
119. `hakeemi-na-musalmani-khudi-ki` - 2 stanzas, 4 lines
120. `tera-tan-rooh-se-na-aashna-hai` - 2 stanzas, 4 lines

## Batch 24 Verification Record

- Coverage: JSON indices 115-119, kalams 116-120 only, in exact order.
- Source totals: 10 stanzas, 20 nonblank lines.
- Manuscript: `manuscript/04-bal-e-jibreel-english-04.md`, now 323 lines; all five complete kalam entries fit without creating a new sequential file. Earlier manuscript content remains unchanged.
- Overall total: 120 kalams, 589 stanzas, 1,177 lines.

## Batch 25 Verification Record

- Coverage: JSON index 120, Kalam 121 only, in exact order.
- Source record: `iqbal-ne-kal-ahl-e-khayaban-ko-sunaya` (`https://allamaiqbal.org/bal-e-jibril/iqbal-ne-kal-ahl-e-khayaban-ko-sunaya/`), 2 stanzas, 4 nonblank source lines.
- Batch total: 1 kalam, 2 stanzas, 4 lines.
- Manuscript: `manuscript/04-bal-e-jibreel-english-04.md`, now 339 lines; the complete kalam entry fits without creating a new sequential file. Earlier manuscript content remains unchanged.
- Overall total: 121 kalams, 591 stanzas, 1,181 lines.
- Status: Complete. Kalam 121 is the final JSON record; no kalam outside index 120 was added.
