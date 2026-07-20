# Publication Runbook

No gate in this runbook is automated or approved by repository evidence. Each
gate needs a distinct owner decision, recorded evidence, and a check that later
actions were not silently bundled with it.

## Gate 1 — Release-candidate acceptance

Owner approval accepts one exact clean commit after all checklist evidence and
known limitations are reviewed. It authorizes review status only. Rollback is a
new corrective commit; acceptance must not create a tag, release, upload, or
publication.

## Gate 2 — Version and tag decision

Owner approval resolves the tag name against package `0.1.0`, independent `1.0`
schema/design authorities, and historical `v0.8.0`. Evidence includes the
version audit and candidate commit. The decision may be withdrawn before tag
creation; it must not silently create the tag.

## Gate 3 — Git tag creation

Owner approval names the exact candidate commit and exact tag after Gate 2.
Evidence includes a clean synchronized branch and final CI. A mistaken public
tag should not be silently moved; correction requires an explicit incident and
rollback decision. Tagging must not create a GitHub Release.

## Gate 4 — GitHub Release creation

Owner approval identifies the existing approved tag, reviewed draft text,
security link, limitations, and release status. Deleting or correcting a release
does not erase downloaded source archives. Creation must not upload artifacts or
publish a package unless those later gates are separately approved.

## Gate 5 — Artifact upload

Owner approval identifies exact locally verified wheel/sdist files and recorded
SHA-256 checksums. Evidence includes repeat-build, content, metadata, and
installation verification. A bad upload may require removal and disclosure; it
must not trigger package-index publication.

## Gate 6 — Package-index publication

This optional gate requires separate owner authority, an approved index,
credential/trusted-publishing governance outside this repository, name-ownership
confirmation, and exact artifact identity. Publication may be irreversible for a
version; recovery usually requires a new governed version. No current workflow,
secret, token, or trusted-publishing configuration implements this gate.

## Shared rollback boundary

Never rewrite Git history or move public identities silently. Preserve audit
evidence, assess consumers, revoke or remove only where the external service and
owner decision permit, and publish corrections through an explicit governed
event. A rollback cannot make previously downloaded material disappear.
