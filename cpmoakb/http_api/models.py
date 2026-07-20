"""Strict transport-only request models for the approved HTTP operations."""

from __future__ import annotations

from typing import Annotated, Literal

from pydantic import BaseModel, ConfigDict, Field, StringConstraints, field_validator

BoundedText = Annotated[str, StringConstraints(min_length=1, max_length=256)]
BoundedTag = Annotated[str, StringConstraints(min_length=1, max_length=64)]


class QueryHttpRequest(BaseModel):
    """Narrow primitive subset of the existing QueryCriteria contract."""

    model_config = ConfigDict(extra="forbid", frozen=True, strict=True)

    domain_type: BoundedText | None = None
    label_text: BoundedText | None = None
    label_scope: Literal["any", "preferred", "alternative"] = "any"
    language: BoundedTag | None = None
    locale: BoundedTag | None = None
    match_mode: Literal["exact", "case_insensitive", "conservative_normalized"] = (
        "exact"
    )
    predicate: BoundedText | None = None

    @field_validator("domain_type", "label_text", "predicate")
    @classmethod
    def reject_ascii_whitespace_only(cls, value: str | None) -> str | None:
        if value is not None and not value.strip(" \t\r\n\f\v"):
            raise ValueError("text must contain a non-whitespace character")
        return value


class QueryAndExplainHttpRequest(QueryHttpRequest):
    match_index: Annotated[int, Field(ge=0, le=10_000)]
