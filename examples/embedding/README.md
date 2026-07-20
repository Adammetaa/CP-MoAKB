# Application Embedding

**Purpose:** embed a composed facade in caller-owned Python control flow.
**Prerequisites:** local core installation.
**Command:** `python -m examples.embedding.example`
**Expected output:** `embedded_records=1 matches=1`

The caller owns the record collection and service lifetime. The application facade
does not discover state or impose an HTTP/CLI transport. This is not a plugin or
production composition framework. See the
[Application API](../../docs/api/application-api.md).
