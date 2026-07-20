# Development Setup

Use Python 3.11 or 3.12. From a trusted clone:

```shell
python -m venv .venv
python -m pip install -r requirements-dev.txt
python -m pytest -q
```

The requirements file contains exact governed pins. Do not add an alternative
index, editable release dependency, or unreviewed tool. The project imports from
`cpmoakb`; no data service, server, or database is started. See
[local verification](../getting-started/verification.md) for the full gate and
[dependency policy](../security/dependency-policy.md) before changing a pin.
