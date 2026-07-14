import pytest

from cpmoakb.domain import (
    AuthorityIdentifier,
    ExternalIdentifier,
    RecordKind,
    RecordLifecycle,
    SourceIdentifier,
)
from cpmoakb.query import (
    LabelScope,
    QueryCriteria,
    QueryItemNotFoundError,
    QueryService,
    TextMatchMode,
)

from ._support import candidate_id, entity


def service() -> QueryService:
    return QueryService.from_records(
        (
            entity(
                992002,
                preferred_text="Café Widget",
                alternative_text="Imaginary Device",
                preferred_language="fr",
                preferred_locale="fr-FR",
                domain_type="SyntheticDevice",
                lifecycle=RecordLifecycle.UNDER_REVIEW,
                external_value="fictional-002",
                source_key="synthetic-source-a",
                authority_key="synthetic-authority-a",
            ),
            entity(992001, preferred_text="Fictional   Widget"),
        )
    )


def test_exact_lookup_listing_and_not_found_policy() -> None:
    query = service()
    assert query.get(candidate_id(992001)).identifier == candidate_id(992001)
    assert tuple(record.identifier for record in query.iter_records()) == (
        candidate_id(992001),
        candidate_id(992002),
    )
    with pytest.raises(QueryItemNotFoundError):
        query.get(candidate_id(992099))


def test_empty_and_no_match_search_behavior() -> None:
    query = service()
    assert query.search(QueryCriteria()).total_count == 2
    assert query.search(QueryCriteria(domain_type="AbsentSyntheticType")).matches == ()


def test_exact_case_insensitive_and_conservative_normalized_matching() -> None:
    query = service()
    assert query.search(QueryCriteria(label_text="Café Widget")).total_count == 1
    assert (
        query.search(
            QueryCriteria(
                label_text="cAFÉ wIDGET", match_mode=TextMatchMode.CASE_INSENSITIVE
            )
        ).total_count
        == 1
    )
    normalized = query.search(
        QueryCriteria(
            label_text="  fictional widget ",
            match_mode=TextMatchMode.CONSERVATIVE_NORMALIZED,
        )
    )
    assert normalized.total_count == 1
    assert normalized.matches[0].match_mode is TextMatchMode.CONSERVATIVE_NORMALIZED


def test_normalization_does_not_remove_diacritics_or_fuzzy_match() -> None:
    query = service()
    assert (
        query.search(
            QueryCriteria(
                label_text="Cafe Widget",
                match_mode=TextMatchMode.CONSERVATIVE_NORMALIZED,
            )
        ).matches
        == ()
    )
    assert (
        query.search(
            QueryCriteria(
                label_text="Café Widgit",
                match_mode=TextMatchMode.CONSERVATIVE_NORMALIZED,
            )
        ).matches
        == ()
    )


def test_normalization_does_not_transliterate() -> None:
    query = QueryService.from_records(
        (entity(992010, preferred_text="Живора", alternative_text="Other Fiction"),)
    )
    assert (
        query.search(
            QueryCriteria(
                label_text="Zhivora",
                match_mode=TextMatchMode.CONSERVATIVE_NORMALIZED,
            )
        ).matches
        == ()
    )


def test_label_scope_language_locale_and_traceability() -> None:
    query = service()
    preferred = query.search(
        QueryCriteria(
            label_scope=LabelScope.PREFERRED,
            language="FR",
            locale="fr-fr",
        )
    )
    assert preferred.total_count == 1
    match = preferred.matches[0]
    assert match.matched_field == "labels.preferred"
    assert match.matched_value == "Café Widget"
    assert match.language == "fr"
    assert match.locale == "fr-FR"

    alternatives = query.search(
        QueryCriteria(label_text="Imaginary Device", label_scope=LabelScope.ALTERNATIVE)
    )
    assert alternatives.matches[0].matched_field == "labels.alternative"


def test_record_field_filters_and_external_lookup() -> None:
    query = service()
    criteria = QueryCriteria(
        record_kind=RecordKind.ENTITY,
        domain_type="syntheticdevice",
        lifecycle=RecordLifecycle.UNDER_REVIEW,
        external_identifier=ExternalIdentifier("synthetic-catalog", "fictional-002"),
        source_identifier=SourceIdentifier("synthetic-source-a"),
        authority_identifier=AuthorityIdentifier("synthetic-authority-a"),
        match_mode=TextMatchMode.CASE_INSENSITIVE,
    )
    result = query.search(criteria)
    assert result.total_count == 1
    assert result.matches[0].record.identifier == candidate_id(992002)


def test_queries_do_not_mutate_records() -> None:
    query = service()
    before = tuple(repr(record) for record in query.iter_records())
    query.search(QueryCriteria(label_text="Café Widget"))
    assert tuple(repr(record) for record in query.iter_records()) == before
