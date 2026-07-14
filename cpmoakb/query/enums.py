"""Controlled values for explicit query semantics."""

from enum import Enum


class TextMatchMode(str, Enum):
    EXACT = "exact"
    CASE_INSENSITIVE = "case_insensitive"
    CONSERVATIVE_NORMALIZED = "conservative_normalized"


class LabelScope(str, Enum):
    PREFERRED = "preferred"
    ALTERNATIVE = "alternative"
    ANY = "any"
