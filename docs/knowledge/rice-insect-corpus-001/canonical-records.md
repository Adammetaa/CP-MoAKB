# Canonical Concepts, Terminology, Relationships, and Questions

## Concepts and terminology

Pest Concepts `CO-RIC-001/v1` through `CO-RIC-019/v1` follow inventory order.
The 30 supporting Concepts `CO-RIC-AUX-001/v1` through `CO-RIC-AUX-030/v1`
represent only source-named life stage, plant structure, observation/damage,
environment, or natural-enemy identities needed by accepted edges. Total Concepts:
49. No Source-specific duplicate pest Concept is created.

Thai and English common/scientific labels from the Rice Department source are
represented by `TM-RIC-001/v1` through `TM-RIC-038/v1`. The grouped stem-borer
Concept retains its four source-named taxa as terminology/qualified members; it
does not pretend they are one species.

## Relationships

`RL-RIC-001/v1` through `RL-RIC-038/v1` provide two source-supported investigation
edges per pest: one identity/cause-or-life-stage edge and one observed-damage,
affected-structure, rice-stage, or field-context edge. They point to exact
`CL-RIC-*` and `EV-RIC-*` versions.

Natural-enemy edges `RL-RIC-NE-001/v1` through `RL-RIC-NE-010/v1` are sourced to
the Rice Department natural-enemy section:

| Edge | Source locator | Accepted role/scope |
| --- | --- | --- |
| planthoppers/leafhoppers -> *Cyrtorhinus lividipennis* | printed p.71 / PDF p.82 | predator of eggs; no guaranteed control |
| planthoppers/leafhoppers -> *Tytthus chinensis* | p.72 / PDF p.83 | predator of eggs |
| flying hoppers/leafhoppers -> *Tetragnatha* spp. | p.75 / PDF p.86 | predator; leaf-folder moth also noted |
| moths and rice bugs -> *Argiope catenulata* | p.78 / PDF p.89 | web-building predator |
| hoppers/leaf-folder/caseworm/gall midge -> *Ophionea ishii ishii* | p.79 / PDF p.90 | predator across source-named prey |
| hoppers/leafhoppers/moth larvae -> *Paederus fuscipes* | p.80 / PDF p.91 | predator |
| small insect pests -> *Neurothemis tullia tullia* | p.83 / PDF p.94 | dragonfly predator, general rice-field scope |
| moth and other rice-pest eggs -> *Metioche vittaticollis* | p.85 / PDF p.96 | egg predator |
| hoppers and leaf-folder larvae -> *Conocephalus longipennis* | p.86 / PDF p.97 | predator |
| green leafhopper -> *Pipunculus* sp. | p.88 / PDF p.99 | parasitoid develops in host; source-specific scope |

## Deterministic investigation questions

`IQ-RIC-001/v1` through `IQ-RIC-009/v1` ask, without scoring:

1. พบตัวแมลงระยะใด - ไข่ ตัวอ่อน/หนอน ดักแด้ หรือตัวเต็มวัย?
2. ความเสียหายอยู่ที่ใบ กาบใบ โคนต้น ลำต้น จุดเจริญ ราก หรือรวง?
3. ใบถูกพับ ทำเป็นปลอก มีรอยขูดสีขาว มีรูเจาะ หรือถูกตัดหรือไม่?
4. พบยอดแห้งก่อนออกรวง หรือรวงขาว/คอรวงถูกตัดหลังออกรวงหรือไม่?
5. อาการเป็นหย่อม เป็นแถว หรือกระจายทั่วแปลง?
6. ข้าวอยู่ระยะกล้า แตกกอ ตั้งท้อง ออกรวง หรือน้ำนม?
7. แปลงมีน้ำขัง แห้ง ฝนหลังแล้ง หรือความชื้นสูงหรือไม่?
8. พบศัตรูธรรมชาติ ไข่ถูกทำลาย หรือตัวเบียนหรือไม่?
9. พบจำนวนแมลงประมาณเท่าใด และเคยใช้สารอะไร เมื่อใด ภายใต้ฉลากใด?

Answers remain observations. Failed control remains `Investigation required`; it
does not establish resistance and never authorizes dose escalation.
