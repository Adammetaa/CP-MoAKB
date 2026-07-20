# Release Security Checklist

- [ ] Review every exact direct dependency against an authoritative advisory source.
- [ ] Confirm FastAPI remains optional and `httpx2` remains development-only.
- [ ] Confirm action SHAs match their documented official release tags.
- [ ] Run `scripts/verify_security_contract.py` with no violations.
- [ ] Run `scripts/verify_release_readiness.py` with no violations.
- [ ] Confirm fixed HTTP/CLI errors contain no traceback, path, module, class, repr,
      or underlying exception text.
- [ ] Confirm strict bounded HTTP and CLI input tests pass.
- [ ] Confirm no secrets, private keys, local configuration, database, generated CSV,
      cache, build directory, or distribution artifact is tracked.
- [ ] Confirm wheel and sdist exclusion checks pass.
- [ ] Confirm workflow permissions are read-only and no publishing step exists.
- [ ] Record known limitations without certification or production-security claims.
- [ ] Obtain explicit approval before any tag, release, or publication.
