from pathlib import Path
from typing import Any
import tomllib

ROOT = Path(__file__).parents[2]


def metadata() -> dict[str, Any]:
    return tomllib.loads((ROOT / "pyproject.toml").read_text(encoding="utf-8"))


def test_pep_517_518_and_621_metadata_is_exact() -> None:
    document = metadata()
    assert document["build-system"] == {
        "requires": ["setuptools==83.0.0"],
        "build-backend": "setuptools.build_meta",
    }
    project = document["project"]
    assert project["name"] == "cp-moakb"
    assert project["dynamic"] == ["version"]
    assert project["readme"] == "README.md"
    assert project["requires-python"] == ">=3.11,<3.13"
    assert project["license"] == "Apache-2.0"
    assert project["license-files"] == ["LICENSE"]
    assert "Typing :: Typed" not in project["classifiers"]
    assert project["dependencies"] == [
        "pandas==3.0.3",
        "pdfplumber==0.11.10",
        "PyYAML==6.0.3",
    ]


def test_optional_and_development_dependencies_are_separated() -> None:
    extras = metadata()["project"]["optional-dependencies"]
    assert extras["http"] == ["fastapi==0.139.2"]
    assert "httpx2==2.7.0" in extras["dev"]
    assert "build==1.5.0" in extras["dev"]
    assert "packaging==26.2" in extras["dev"]
    assert "setuptools==83.0.0" in extras["dev"]
    assert all(
        "uvicorn" not in item and "gunicorn" not in item for item in extras["dev"]
    )


def test_version_has_one_static_authoritative_source() -> None:
    document = metadata()
    assert document["tool"]["setuptools"]["dynamic"]["version"] == {
        "attr": "cpmoakb._version.__version__"
    }
    assert (ROOT / "cpmoakb" / "_version.py").read_text(encoding="utf-8").count(
        '__version__ = "0.1.0"'
    ) == 1
    assert "version" not in document["project"]


def test_readme_and_unmodified_standard_license_exist() -> None:
    assert (ROOT / "README.md").is_file()
    license_text = (ROOT / "LICENSE").read_text(encoding="utf-8")
    assert (
        "Apache License\n                           Version 2.0, January 2004"
        in license_text
    )
    assert "Copyright [yyyy] [name of copyright owner]" in license_text
