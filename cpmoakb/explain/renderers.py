"""Deterministic plain-text rendering of structured explanations."""

from __future__ import annotations

from .errors import ExplanationRenderingError
from .models import Explanation


def render_explanation(explanation: Explanation) -> str:
    if not isinstance(explanation, Explanation):
        raise ExplanationRenderingError("renderer requires an Explanation")
    lines = [
        f"Type: {explanation.explanation_type.value}",
        f"Availability: {explanation.availability.value}",
    ]
    if explanation.subject_reference is not None:
        subject = explanation.subject_reference
        lines.append(f"Subject: {subject.reference_type.value}:{subject.identifier}")
    if explanation.summary is not None:
        lines.append(f"Summary: {explanation.summary}")
    lines.append("Facts:")
    lines.extend(
        f"- {fact.field_path} | {fact.role} | {fact.value}"
        for fact in explanation.facts
    )
    lines.append("Supporting references:")
    lines.extend(
        f"- {reference.reference_type.value} | {reference.identifier} | {reference.field_path or '-'}"
        for reference in explanation.supporting_references
    )
    lines.append("Limitations:")
    lines.extend(
        f"- {limitation.code} | {limitation.message} | {limitation.missing_input or '-'}"
        for limitation in explanation.limitations
    )
    return "\n".join(lines)
