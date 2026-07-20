# Runtime Installation

CP-MoAKB publishes the distribution name `cp-moakb` and import package
`cpmoakb`. Version `0.1.0` supports Python 3.11 and 3.12.

```shell
pip install cp-moakb
pip install "cp-moakb[http]"
pip install -e ".[dev]"
```

The base dependencies are pinned `pandas`, `pdfplumber`, and `PyYAML`, preserving
the packaged legacy and Runtime import surfaces. The `http` extra adds pinned
FastAPI. `httpx2`, build, packaging, and quality tools are development-only.
Neither Uvicorn nor Gunicorn is included.

Safe base imports are `cpmoakb`, `cpmoakb.runtime_api`, `cpmoakb.application`,
`cpmoakb.serialization`, `cpmoakb.cli`, and `cpmoakb.composition`. Importing
`cpmoakb.http_api` is also lazy; invoking `create_http_app` without the `http`
extra raises Python's missing-FastAPI dependency error. Installation does not
provide data or construct a usable knowledge base. Consumers explicitly supply
all governed services.

Package version `0.1.0` describes the distribution. It does not replace Runtime
API `0.1`, YAML schema `1.0`, JSON projection `1.0`, Application API `0.1`, HTTP
API `0.1`, CLI API `0.1`, or Composition API `0.1`.

No installer receives credentials or release authority. Exact pins and the
supported Python range are checked by the release-readiness verifier. Review
[the dependency policy](../security/dependency-policy.md) before changing any
pin; vulnerability remediation requires evidence and full regression checks.
