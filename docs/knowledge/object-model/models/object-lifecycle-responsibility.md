# Object Lifecycle Responsibility

Status: Active

## Purpose

Assign conceptual lifecycle custody without forcing one state vocabulary across
objects with different semantics.

## Responsibility Matrix

| Object group | Lifecycle owner | Review and acceptance authority | Correction and supersession | Archive behavior |
| --- | --- | --- | --- | --- |
| Concept, Claim, Relationship | Domain Editor or delegated steward | Competent domain, scientific, evidence, ontology, and governance authorities as applicable | New Knowledge Version; preserve dispute and predecessor | Preserve all accepted and published states |
| Terminology | Terminology steward | Terminology and nomenclatural competence | New term/version or explicit deprecation mapping | Preserve language, status, and mapping history |
| Source, Evidence, Authority | Assigned custodian | Evidence, rights, source, and authority competence | New version or correcting object; never rewrite original basis | Preserve access, rights, correction, and retirement history |
| Review, Finding, Decision | Managing Editor or deciding body recorder | Review Board and competent deciding authority | Reopen or append successor; never edit historical outcome | Preserve assignments, dissent, response, and rationale |
| Unresolved Issue | Managing Editor and accountable issue owner | Competent authority for the blocking scope | Explicit disposition or successor issue | Preserve unresolved and closed states |
| Lifecycle Event | Governance recorder | Authority that authorizes the transition | Append correcting event | Immutable chronological retention |
| Publication Record | Release Editor | Knowledge Board and Project Owner under KGS-005 plus channel authority | Correction, withdrawal, or retraction record | Preserve prior public disposition |
| Representation | Representation owner | Semantic, language, accessibility, and publication reviewers as applicable | New Representation Version | Preserve fidelity basis where relied upon |
| Package Membership | Package owner | Package review and inclusion authority | New Package Version or successor membership | Preserve inclusion, exclusion, and replacement history |

## Rules

Lifecycle owner does not automatically possess review, acceptance, correction,
deprecation, supersession, publication, or archive authority. Each action MUST
use the competent authority for the object and scope. Object-specific states MAY
differ; mappings MUST NOT falsely equate “withdrawn Source,” “closed Finding,”
“accepted Claim,” and “published Package.”

## Future Implementation and Change Control

This matrix defines responsibility, not workflow or permission code. Changes
require KGS and object-model review and MUST preserve historical accountability.
