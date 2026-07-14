"""Focused errors exposed by the constrained YAML adapter."""

from __future__ import annotations


class YamlAdapterError(Exception):
    """Base adapter failure with a deterministic representation path."""

    category = "adapter"

    def __init__(
        self,
        message: str,
        *,
        path: str = "$",
        line: int | None = None,
        column: int | None = None,
        remediation_hint: str | None = None,
    ) -> None:
        self.message = message
        self.path = path
        self.line = line
        self.column = column
        self.remediation_hint = remediation_hint
        super().__init__(str(self))

    def __str__(self) -> str:
        location = self.path
        if self.line is not None and self.column is not None:
            location = f"{location} (line {self.line}, column {self.column})"
        result = f"{self.category} error at {location}: {self.message}"
        if self.remediation_hint:
            result += f" Hint: {self.remediation_hint}"
        return result


class YamlSyntaxError(YamlAdapterError):
    category = "syntax"


class YamlRestrictionError(YamlAdapterError):
    category = "restriction"


class UnsupportedYamlFeatureError(YamlRestrictionError):
    category = "unsupported YAML feature"


class YamlSchemaVersionError(YamlAdapterError):
    category = "schema version"


class YamlStructureError(YamlAdapterError):
    category = "structure"


class YamlMappingError(YamlAdapterError):
    category = "mapping"


class YamlFileError(YamlAdapterError):
    category = "file"
