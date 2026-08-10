# Conceptual Source Repository Organization

Status: Active

Version: 1.0

Repository organization describes custody states, not folders or storage:

| Organization class | Meaning |
|---|---|
| Raw Sources | acquired representation awaiting identity/integrity review; not extraction-ready |
| Working Sources | controlled review copy with fixed custody; not canonical by location |
| Governed Sources | registered exact Source identity/version with completed required reviews |
| Pending Rights | access may exist but intended use is blocked by rights uncertainty |
| Rejected Sources | failed identity, authority, integrity, rights, scope or suitability review |
| Archived Sources | retained for audit and no longer active for new extraction |
| Superseded Sources | prior versions with explicit governed replacement context |

Movement between classes is a lifecycle decision recorded against the Source,
not a file move. Physical location, filename, repository presence, or download
availability never establishes identity, governance, rights, or readiness.

This model prescribes no directory, bucket, database, naming convention,
permission implementation, retention technology, or synchronization mechanism.
