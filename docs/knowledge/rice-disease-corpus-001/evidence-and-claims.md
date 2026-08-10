# Evidence and Claim Register

Status: Evidence visually/textually checked against fixed artifacts; Claims accepted for bounded source-backed use

Each Evidence ID resolves to the exact Source version, one-based PDF page range,
slide heading/context, and a bounded disease-specific passage. Each row creates
three versioned Claims: `I` identity, `C` cause/etiologic context, and `O`
observation/biology context. A dash means that Source does not support that row.

| Key | Primary Evidence / locator | Supporting Evidence / locator | Claim IDs | Governed summary of supported fields |
| --- | --- | --- | --- | --- |
| BLAST | `EV-RDC-001A/v1`; KU pp.5-10, headings เชื้อสาเหตุ/ลักษณะอาการ/การระบาด | `EV-RDC-001B/v1`; RRC pp.2-3, โรคไหม้ | `CL-RDC-001-I/C/O/v1` | Pyricularia name as stated; leaf eye-shaped brown lesion with gray center; neck lesion/breakage; humid-outbreak context |
| SHEATH-BLIGHT | `EV-RDC-002A/v1`; KU pp.11-14 | `EV-RDC-002B/v1`; RRC p.4 | `CL-RDC-002-I/C/O/v1` | Rhizoctonia solani; sheath near water level; gray-green expanding lesion; tillering to near harvest |
| BROWN-SPOT | `EV-RDC-003A/v1`; KU pp.15-18 | `EV-RDC-003B/v1`; RRC pp.3-4 | `CL-RDC-003-I/C/O/v1` | Bipolaris oryzae; round/oval brown leaf spots; grain discoloration/quality context |
| NARROW-BROWN-SPOT | `EV-RDC-004A/v1`; KU pp.19-21 | `EV-RDC-004B/v1`; RRC p.4 | `CL-RDC-004-I/C/O/v1` | Cercospora oryzae; narrow brown streaks parallel to veins; lower-leaf progression and neck damage context |
| BAKANAE | `EV-RDC-005A/v1`; KU pp.22-25 | - | `CL-RDC-005-I/C/O/v1` | Fusarium fujikuroi Nirenberg; seedborne/residue/soil context; seedling elongation, pale plants, root rot and pink mycelial sign |
| DIRTY-PANICLE | `EV-RDC-006A/v1`; KU pp.26-29 | `EV-RDC-006B/v1`; RRC p.5 | `CL-RDC-006-I/C/O/v1` | multiple named fungi; wind/seed/storage spread context; brown/black or gray-pink grain lesions around heading |
| FALSE-SMUT | `EV-RDC-007A/v1`; KU pp.30-32 | - | `CL-RDC-007-I/C/O/v1` | Ustilaginoidea virens; wind/water/seed context; enlarged grain with yellow-to-orange-to-dark-green spore mass |
| BACTERIAL-BLIGHT | `EV-RDC-008A/v1`; KU pp.33-38 | `EV-RDC-008B/v1`; RRC p.6 | `CL-RDC-008-I/C/O/v1` | Xanthomonas oryzae pv. oryzae; water/rain/wind/contact context; water-soaked leaf edge, yellowing and cream exudate |
| BACTERIAL-STREAK | `EV-RDC-009A/v1`; KU pp.39-40 | `EV-RDC-009B/v1`; RRC pp.6-7 | `CL-RDC-009-I/C/O/v1` | Xanthomonas oryzae pv. oryzicola; translucent water-soaked streak parallel to veins, becoming yellow/orange |
| RAGGED-STUNT | `EV-RDC-010A/v1`; KU pp.41-43 | `EV-RDC-010B/v1`; RRC p.8 | `CL-RDC-010-I/C/O/v1` | existing disease identity reused; Ragged Stunt virus/RRSV wording; brown planthopper vector; stunting, dark narrow leaves, ragged margins, swollen veins |
| ROOT-KNOT | `EV-RDC-011A/v1`; KU pp.44-47 | `EV-RDC-011B/v1`; RRC p.9 | `CL-RDC-011-I/C/O/v1` | Meloidogyne graminicola; upland/rainfed and dry-seedbed context; root galls and yellow seedlings |
| AKIOCHI | `EV-RDC-012A/v1`; KU pp.48-50 | `EV-RDC-012B/v1`; RRC pp.9-10 | `CL-RDC-012-I/C/O/v1` | incomplete residue decomposition/hydrogen sulfide context; tillering-stage stunting, lower-leaf yellowing, black root rot and new roots above soil |
| SHEATH-ROT | - | `EV-RDC-013B/v1`; RRC pp.4-5 | `CL-RDC-013-I/C/O/v1` | Sarocladium oryzae; brown-black flag-leaf sheath lesion with white-pink mycelium; booting-stage context |
| ORANGE-LEAF | - | `EV-RDC-014B/v1`; RRC pp.7-8 | `CL-RDC-014-I/C/O/v1` | phytoplasma; zigzag-wing leafhopper vector as named; orange color beginning at lower-leaf tip and progressing across leaf |
| GRASSY-STUNT | - | `EV-RDC-015B/v1`; RRC p.8 | `CL-RDC-015-I/C/O/v1` | Rice Grassy Stunt Virus (RGSV); brown planthopper vector; identity/vector scope only |
| YELLOW-ORANGE | - | `EV-RDC-016B/v1`; RRC p.8 | `CL-RDC-016-I/C/O/v1` | existing orange-leaf-of-rice identity reused; RTBV and RTSV named; green leafhopper vector; terminology scope recorded |

Claims preserve each Source's spelling and taxonomic scope. Differences such as
`Pyricularia grisea` versus `Pyricularia oryzae Cavara` remain Source-scoped and
are not silently normalized. No row creates a field Diagnosis or Recommendation.
