# Installation

CP-MoAKB package `0.1.0` supports Python `>=3.11,<3.13`. This repository does not
claim a PyPI publication. Install from a trusted local clone or a locally built
artifact.

```shell
git clone https://github.com/Adammetaa/CP-MoAKB.git
cd CP-MoAKB
python -m venv .venv
python -m pip install .
```

For the optional injected FastAPI adapter:

```shell
python -m pip install ".[http]"
```

For contribution work, install the exact governed tools and libraries:

```shell
python -m pip install -r requirements-dev.txt
```

To test the artifact path, build with `python -m build --no-isolation`, then
install the wheel from `dist`. Installation adds code contracts only: no knowledge
base, service instance, server, database, or configuration is created. Import
errors for FastAPI are expected only when an HTTP app is explicitly created
without the extra. See [Runtime installation](../runtime/installation.md).
