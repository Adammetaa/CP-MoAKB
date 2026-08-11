# Canonical Concepts, Terminology, Relationships, and Questions

## Concepts and terminology

Weed Concepts `CO-RWC-001/v1` through `CO-RWC-008/v1` follow inventory order.
Supporting Concepts `CO-RWC-AUX-001/v1` through `CO-RWC-AUX-008/v1` represent
narrow leaf, broad leaf, grass-like jointed stem/sheath, sedge-like mostly
unjointed stem, triangular stem tendency, rice field, management context, and
application history. The eight Source labels are Terminology records
`TM-RWC-001/v1` through `TM-RWC-008/v1`; terminology never creates another identity.

Scientific names, English names and local-name equivalence are not populated.
The Source does not establish them, and model knowledge is not Evidence.

## Relationships

`RL-RWC-001/v1` through `RL-RWC-016/v1` provide two source-backed edges per weed:
weed -> group and weed -> rice-field context. `RL-RWC-017/v1` through
`RL-RWC-019/v1` are explicit group-level differential relationships:

| Relationship | Source-backed comparison | Limitation |
| --- | --- | --- |
| `RL-RWC-017/v1` | narrow-leaved vs broadleaf: blade width/venation and leaf form | group cue, not species Diagnosis |
| `RL-RWC-018/v1` | grass-like vs sedge: joints/sheath and mostly unjointed stem | requires direct observation |
| `RL-RWC-019/v1` | sedge vs grass-like: stem often more triangular than round | tendency at group level, not an automatic rule |

All relationships point to `CL-RWC-*` and `EV-RWC-*` versions. No herbicide edge
is attached to an individual case or current registration record.

## Deterministic investigation questions

`IQ-RWC-001/v1` through `IQ-RWC-013/v1` ask, without scoring:

1. ใบแคบหรือใบกว้าง?
2. เส้นใบขนานหรือเป็นร่างแห?
3. ลำต้นมีข้อและปล้องชัดเจนหรือไม่?
4. ลำต้นมีหน้าตัดเป็นเหลี่ยมหรือค่อนข้างกลม?
5. มีกาบใบหุ้มลำต้นหรือไม่?
6. ช่อดอกมีลักษณะอย่างไร?
7. ขึ้นเป็นกอ ทอดเลื้อย หรือกระจายอย่างไร?
8. พบในน้ำขังหรือดินค่อนข้างแห้ง?
9. ข้าวอายุประมาณกี่วัน และวัชพืชอยู่ระยะกี่ใบ?
10. พบทั่วแปลง เป็นแถว หรือเป็นหย่อม?
11. ก่อนหน้านี้ใช้สารออกฤทธิ์อะไร ภายใต้ฉลากใด?
12. พ่นเมื่อใด และสภาพน้ำ ฝน ลม การคลุมพื้นที่เป็นอย่างไร?
13. ชนิดอื่นตายแต่วัชพืชเป้าหมายรอด หรือมีการงอกใหม่ภายหลัง?

Answers remain observations. Failed control triggers checks for identity, growth
stage, timing, water, rainfall, coverage, label compliance, later emergence and
environmental stress. Possible resistance remains a Hypothesis requiring Evidence;
there is no numerical score, automatic Diagnosis, dose escalation or Recommendation.
