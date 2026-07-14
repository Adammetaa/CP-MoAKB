import pytest

from cpmoakb.domain import (
    DuplicatePreferredLabelError,
    InvalidLabelError,
    Label,
    LabelSet,
    LabelStatus,
    SourceIdentifier,
)


def test_label_set_orders_preferred_before_alternatives_deterministically():
    source = SourceIdentifier("synthetic-source")
    alternative = Label(
        "en", "Example Structure", LabelStatus.SOURCED, source_id=source
    )
    preferred = Label(
        "en", "Synthetic Structure", LabelStatus.SOURCED, True, source_id=source
    )

    labels = LabelSet((alternative, preferred))

    assert labels.labels == (preferred, alternative)
    assert labels.preferred == (preferred,)
    assert labels.alternatives == (alternative,)


def test_duplicate_preferred_language_and_locale_is_rejected():
    with pytest.raises(DuplicatePreferredLabelError):
        LabelSet(
            (
                Label("en", "Synthetic One", LabelStatus.PROVISIONAL, True),
                Label("EN", "Synthetic Two", LabelStatus.PROVISIONAL, True),
            )
        )


def test_same_language_can_have_distinct_explicit_locales():
    labels = LabelSet(
        (
            Label("en", "Synthetic Global", LabelStatus.PROVISIONAL, True),
            Label(
                "en", "Synthetic Local", LabelStatus.PROVISIONAL, True, locale="en-GB"
            ),
        )
    )
    assert len(labels.preferred) == 2


def test_sourced_and_editorial_labels_require_provenance_fields():
    with pytest.raises(InvalidLabelError):
        Label("en", "Synthetic", LabelStatus.SOURCED)
    with pytest.raises(InvalidLabelError):
        Label("en", "Synthetic", LabelStatus.EDITORIAL)


def test_ambiguity_is_explicit_and_text_is_not_normalized():
    first = Label(
        "en", "Synthetic Term", LabelStatus.PROVISIONAL, ambiguity_note="Two scopes"
    )
    second = Label("en", "synthetic term", LabelStatus.PROVISIONAL)
    labels = LabelSet((first, second))

    assert len(labels.labels) == 2
    assert first.ambiguity_note == "Two scopes"
