# Hotfix and Rollback

An urgent fix should minimize scope, reproduce the defect, identify affected
contracts, add a regression test, and run the same security/compatibility gates as
ordinary work. Urgency does not authorize bypassing Design Freeze, changing public
behavior silently, or publishing without approval.

Rollback means selecting a previously reviewed safe state and restoring it through
the repository's normal review history. Before any destructive source-control or
external release action, identify the exact target, impact, artifact/version
relationship, and recovery path, then obtain explicit approval. This repository
does not claim automated deployment rollback infrastructure.
