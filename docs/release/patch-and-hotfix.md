# Patch and Hotfix Releases

A patch or urgent fix begins with a reproducible defect and the smallest governed
change. Classify public and contract impact, add a regression test, update accurate
documentation, and rerun the full candidate process. Security fixes follow private
coordination under `SECURITY.md`.

Urgency does not grant version, publication, or Design Freeze authority. If a fix
requires a dependency upgrade, API break, or contract-version change, stop for the
corresponding decision rather than silently expanding scope.
