"""Exercise editable, wheel, sdist, core-only, and HTTP installation paths."""

from __future__ import annotations

import argparse
import site
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

SMOKE = """
import pathlib
import cpmoakb
import cpmoakb.application
import cpmoakb.cli
import cpmoakb.composition
import cpmoakb.runtime_api
import cpmoakb.serialization
assert cpmoakb.__version__ == "0.1.0"
location = pathlib.Path(cpmoakb.__file__).resolve()
"""

CORE_WITHOUT_FASTAPI = """
import importlib.abc
import sys
class BlockFastAPI(importlib.abc.MetaPathFinder):
    def find_spec(self, fullname, path=None, target=None):
        if fullname == "fastapi" or fullname.startswith("fastapi."):
            raise ModuleNotFoundError("FastAPI intentionally blocked")
        return None
sys.meta_path.insert(0, BlockFastAPI())
import cpmoakb
import cpmoakb.application
import cpmoakb.cli
import cpmoakb.composition
import cpmoakb.http_api
import cpmoakb.runtime_api
import cpmoakb.serialization
assert "fastapi" not in sys.modules
"""

HTTP_SMOKE = """
from cpmoakb.application import RuntimeApplicationService
from cpmoakb.explain import ExplanationService
from cpmoakb.http_api import create_http_app
from cpmoakb.query import QueryService
service = RuntimeApplicationService(QueryService.from_records(()), ExplanationService())
app = create_http_app(service)
assert app.version == "0.1"
"""


def _run(*command: str, cwd: Path) -> None:
    subprocess.run(command, cwd=cwd, check=True)


def _environment(root: Path, name: str) -> tuple[Path, Path]:
    directory = root / name
    _run(sys.executable, "-m", "venv", str(directory), cwd=root)
    executable = directory / (
        "Scripts/python.exe" if sys.platform == "win32" else "bin/python"
    )
    if sys.platform == "win32":
        child_site = directory / "Lib" / "site-packages"
    else:
        version = f"python{sys.version_info.major}.{sys.version_info.minor}"
        child_site = directory / "lib" / version / "site-packages"
    parent_site = next(
        Path(value).resolve()
        for value in site.getsitepackages()
        if (Path(value) / "setuptools").is_dir()
    )
    (child_site / "cpmoakb-pre-resolved-dependencies.pth").write_text(
        f"{parent_site}\n", encoding="utf-8"
    )
    for directory_name in ("setuptools", "_distutils_hack"):
        shutil.copytree(parent_site / directory_name, child_site / directory_name)
    setuptools_metadata = next(parent_site.glob("setuptools-*.dist-info"))
    shutil.copytree(setuptools_metadata, child_site / setuptools_metadata.name)
    shutil.copy2(
        parent_site / "distutils-precedence.pth",
        child_site / "distutils-precedence.pth",
    )
    return directory, executable


def _install_and_verify(
    root: Path,
    name: str,
    target: str,
    *,
    editable: bool = False,
    http: bool = False,
) -> None:
    directory, executable = _environment(root, name)
    command = [
        str(executable),
        "-m",
        "pip",
        "install",
        "--no-cache-dir",
        "--no-deps",
        "--no-build-isolation",
    ]
    if editable:
        command.append("--editable")
    command.append(target)
    _run(*command, cwd=directory)
    _run(str(executable), "-I", "-c", SMOKE, cwd=directory)
    if not editable:
        location_check = (
            "import cpmoakb,pathlib,sys;"
            "location=pathlib.Path(cpmoakb.__file__).resolve();"
            "assert pathlib.Path(sys.prefix).resolve() in location.parents,location"
        )
        _run(str(executable), "-I", "-c", location_check, cwd=directory)
    _run(
        str(executable),
        "-I",
        "-c",
        HTTP_SMOKE if http else CORE_WITHOUT_FASTAPI,
        cwd=directory,
    )
    _run(str(executable), "-m", "pip", "check", cwd=directory)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--dist-dir", type=Path, default=Path("dist"))
    arguments = parser.parse_args()
    repository = Path(__file__).resolve().parents[1]
    wheel = next(arguments.dist_dir.resolve().glob("*.whl"))
    sdist = next(arguments.dist_dir.resolve().glob("*.tar.gz"))
    with tempfile.TemporaryDirectory(prefix="cpmoakb-install-") as temporary:
        root = Path(temporary)
        _install_and_verify(root, "editable", str(repository), editable=True)
        _install_and_verify(root, "wheel", str(wheel))
        _install_and_verify(root, "sdist", str(sdist))
        _install_and_verify(root, "http", f"{wheel}[http]", http=True)
    print("verified editable, wheel, sdist, core isolation, HTTP extra, and pip check")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
