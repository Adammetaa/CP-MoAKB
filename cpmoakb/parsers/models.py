"""Normalized, persistence-free objects produced by source parsers."""

from __future__ import annotations

from dataclasses import dataclass

import pandas as pd


@dataclass(frozen=True, slots=True)
class IRACNode:
    """One member of the IRAC classification hierarchy.

    Levels are source-oriented: 1 is a mode-of-action group, 2 is a chemical
    class, and 3 is an active ingredient.
    """

    code: str
    name: str
    level: int
    parent_code: str | None
    page: int


@dataclass(frozen=True, slots=True)
class IRACDocument:
    """The parsed, versioned contents of an IRAC classification PDF."""

    version: str | None
    nodes: tuple[IRACNode, ...]

    def to_dataframe(self) -> pd.DataFrame:
        """Return nodes as a consistently ordered pandas data frame."""

        return pd.DataFrame(
            [
                {
                    "code": node.code,
                    "name": node.name,
                    "level": node.level,
                    "parent_code": node.parent_code,
                    "page": node.page,
                }
                for node in self.nodes
            ],
            columns=["code", "name", "level", "parent_code", "page"],
            dtype=object,
        )
