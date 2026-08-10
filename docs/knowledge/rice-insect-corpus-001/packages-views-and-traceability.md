# Packages, Website Views, and Traceability

## Reusable pest packaging

`CKP-RIC-001/v1` through `CKP-RIC-019/v1` package the matching pest Concept,
current Claim versions, Evidence references, terminology, relationships,
limitations, and unresolved issues by reference. Objects are not copied into a
Package. Each package is `accepted-internal-not-published`.

## Website and SP Assistant views

`WV-RIC-001/v1` through `WV-RIC-019/v1` consume matching CKPs. The Thai-first
Explorer representation may show independently authored identity, life-stage,
plant-structure, observation/damage, rice-stage/context, natural-enemy, management
history, limitation, and source summaries only when governed content exists.

SP Assistant may surface the same views as “องค์ความรู้ที่ควรตรวจต่อ” after a
user chooses the insect starter or enters a relevant deterministic demo prompt.
Presentation order is demonstrative, not scientific ranking. It must retain
“ยังไม่ยืนยันสาเหตุ” and cannot create Diagnosis or Recommendation.

## Bidirectional traceability

> SP Assistant/Website card -> `WV-RIC-NNN/v1` -> `CKP-RIC-NNN/v1` ->
> `CL-RIC-NNN-I/B/O/v1` -> `EV-RIC-NNN/v1` ->
> `GS-RD-RICE-PESTS-2007-001/v1` -> printed page + PDF page + subject section

Mechanism detail branches only to `CL-RIC-MECH-*` -> `EV-RIC-MECH-*` -> Chapman
chapter 2 and remains explicitly general. Regulatory detail branches only to
`EV-RIC-REG-001/v1` and never implies crop use or current case suitability.
