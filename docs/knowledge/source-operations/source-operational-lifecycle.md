# Source Operational Lifecycle

Status: Active

Version: 1.0

> Official Source -> Acquire -> Integrity Verification -> Rights Verification ->
> Catalog Registration -> Ready for Extraction -> Archive / Superseded

No transition is automatic. A failure returns the Source to the responsible
prior stage or records rejection without erasing history.

| Stage | Responsible role | Required outcome |
|---|---|---|
| nomination/acquire | Source Curator | official origin, acquisition authority, custody and retrieval evidence |
| integrity verification | Source Custodian | exact artifact/version identity and integrity disposition |
| rights verification | Rights Reviewer | permitted citation, quotation, storage, review, redistribution and public use |
| catalog registration | Source Curator and reviewer | manifest responsibilities complete; exact catalog identity and status |
| ready for extraction | Evidence Reviewer | KES inputs accessible, fixed, bounded and approved for extraction purpose |
| archive/superseded | Source Custodian | retained history, replacement link, affected-use review and access treatment |

Integrity verification conceptually uses a strong checksum for retained immutable
artifacts where appropriate. Changed content, checksum, version, correction,
retraction, replacement, or rights creates an explicit review event; nothing is
silently overwritten.

Archive preserves identity, manifest, provenance, review, prior status and audit.
Supersession identifies the exact predecessor/replacement and effective purpose;
it does not rewrite downstream Evidence or Claims.
