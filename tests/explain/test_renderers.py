import pytest

from cpmoakb.explain import (
    ExplanationRenderingError,
    ExplanationService,
    render_explanation,
)

from ._support import record


def test_renderer_is_deterministic_and_preserves_structured_facts() -> None:
    explanation = ExplanationService().explain_record_evidence(
        record(with_evidence=True)
    )
    first = render_explanation(explanation)
    second = render_explanation(explanation)
    assert first == second
    assert "Facts:" in first
    assert "Supporting references:" in first
    assert "Limitations:" in first
    for fact in explanation.facts:
        assert f"- {fact.field_path} | {fact.role} | {fact.value}" in first


def test_renderer_rejects_non_explanation_input() -> None:
    with pytest.raises(ExplanationRenderingError):
        render_explanation("not an explanation")  # type: ignore[arg-type]
