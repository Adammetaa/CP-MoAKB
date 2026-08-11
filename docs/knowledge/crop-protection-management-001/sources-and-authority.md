# Sources and Authority Separation

| Source | Exact identity / locator | Accepted authority | Excluded inference |
| --- | --- | --- | --- |
| `GS-IRAC-MOA-2026-11.5-001/v1` | IRAC Mode of Action Classification Scheme, v11.5, February 2026; PDF pp.7, 8, 11, 13; SHA-256 `74641b0f56bcfb46574fd0dc815ee136170af66385950ad61045a0692ea750d6` | insecticide active-ingredient identity, IRAC group and official MoA/primary site | pest efficacy, Thai registration, safety, Recommendation |
| `GS-FRAC-MOA-2026-001/v1` | FRAC Code List 2026, last update May 2026; official PDF; SHA-256 `18147746e0da078c5e0047a4820cdc00faa09772d7002b84135ee159e589987e` | fungicide identity, FRAC group and official target/MoA | disease efficacy, Thai registration, Recommendation |
| `GS-HRAC-MOA-2026-001/v1` | HRAC Global Mode of Action Classification 2026 poster; official PDF; SHA-256 `e37ae859739f24c4c4a4abd8ad2be9e11d2408e7d4a1654638541a213adecdc9` | herbicide identity, HRAC/WSSA numerical group, legacy code and official MoA | weed efficacy, Thai registration, Recommendation |
| `GS-RD-RICE-PESTS-2007-001/v1` | Rice Department, *แมลง-สัตว์ศัตรูข้าว และการป้องกันกำจัด*, first printing July 2007; evidence locators retained in `EV-RIC-001/v1`-`EV-RIC-019/v1` and natural-enemy printed pp.71-88 / PDF pp.82-99 | rice-pest observation/monitoring context and named natural enemies | current chemical guidance or guaranteed control |
| `GS-DOA-HAZARDOUS-SALES-2019-001/v1` | DOA training manual, first printing November 2019; Chapter 3, printed pp.3-46-3-55 / PDF pp.51-60; SHA-256 `9b2a14d7ba2bcc5bc6bde236af406df64d42f9ac109c1f43b3e7923113b0ff22` | weed prevention, cultural/mechanical/biological classes, follow-up factors, historical herbicide/MoA context | current registration, HRAC group, case selection |
| `GS-KU-RICE-DISEASES-2018-001/v1` | Kasetsart University rice-disease artifact; existing `EV-RDC-*A/v1` locators | disease identity, symptoms, cause/spread and context | management option or FRAC mapping absent direct evidence |
| `GS-RRC-PRACHIN-RICE-DISEASES-2025-001/v1` | Prachin Buri Rice Research Center, 2025; existing `EV-RDC-*B/v1` locators | complementary disease identity/observation context | chemical efficacy or current registration |
| `GS-DOA-HAZARDOUS-REGISTRY-2026-001/v1` | DOA registration snapshot, metadata 2026-07-16; 3,501 pages; SHA-256 `8b28fcfa31a40a021645645a33864fe858769af8f2264db22776e549df6916fe` | dated administrative registration records | rice use, target, efficacy, crop safety, rate or Recommendation |

Official FRAC 2026 and HRAC 2026 artifacts were retrieved from their authority
websites on 2026-08-11. `UI-CPM-001/v1` and `UI-CPM-002/v1` are resolved. The DOA
manual's herbicide families are not converted to HRAC groups; exact identity
classification is supported independently by HRAC Evidence.

All PDFs remain local and uncommitted where rights require it. No pages, source
images, copied tables, substantial passages, or copyrighted layouts are exposed.
