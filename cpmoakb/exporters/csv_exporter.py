"""Export normalized IRAC classifications as Knowledge Freeze CSV files."""

from __future__ import annotations

from pathlib import Path
import re

import pandas as pd

from cpmoakb.parsers.models import IRACDocument, IRACNode


def export_irac_csv(document: IRACDocument, output_dir: str | Path) -> dict[str, Path]:
    """Write the three frozen IRAC CSV datasets and return their paths.

    IDs are deterministic, source-scoped identifiers. They are export values
    only; this function neither opens SQLite nor invokes the import engine.
    """

    destination = Path(output_dir)
    destination.mkdir(parents=True, exist_ok=True)
    version = _version_token(document.version)

    groups = [node for node in document.nodes if node.level == 1]
    classes = [node for node in document.nodes if node.level == 2]
    ingredients = [node for node in document.nodes if node.level == 3]

    group_rows = [
        {"moa_group_id": _group_id(version, node.code), "group_code": node.code,
         "group_name": node.name, "source_version": document.version or ""}
        for node in groups
    ]
    class_rows = [
        {"chemical_class_id": _class_id(version, node.code),
         "moa_group_id": _group_id(version, node.parent_code), "class_name": node.name}
        for node in classes
    ]
    ingredient_rows = [
        {"active_ingredient_id": _ingredient_id(version, node),
         "chemical_class_id": _class_id(version, node.parent_code), "iso_common_name": node.name}
        for node in ingredients
    ]

    paths = {
        "moa_group": destination / "MoA_Group.csv",
        "chemical_class": destination / "Chemical_Class.csv",
        "active_ingredient": destination / "Active_Ingredient.csv",
    }
    _write_csv(group_rows, ["moa_group_id", "group_code", "group_name", "source_version"], paths["moa_group"])
    _write_csv(class_rows, ["chemical_class_id", "moa_group_id", "class_name"], paths["chemical_class"])
    _write_csv(ingredient_rows, ["active_ingredient_id", "chemical_class_id", "iso_common_name"], paths["active_ingredient"])
    return paths


def _write_csv(rows: list[dict[str, str]], columns: list[str], path: Path) -> None:
    pd.DataFrame(rows, columns=columns).to_csv(path, index=False, encoding="utf-8")


def _version_token(version: str | None) -> str:
    return re.sub(r"[^A-Z0-9]+", "-", (version or "unknown").upper()).strip("-")


def _group_id(version: str, code: str | None) -> str:
    return f"IRAC-{version}-GROUP-{code.upper()}" if code else ""


def _class_id(version: str, code: str | None) -> str:
    return f"IRAC-{version}-CLASS-{code.upper()}" if code else ""


def _ingredient_id(version: str, node: IRACNode) -> str:
    name = re.sub(r"[^a-z0-9]+", "-", node.name.casefold()).strip("-")
    return f"IRAC-{version}-INGREDIENT-{node.parent_code or 'UNASSIGNED'}-{name}"
