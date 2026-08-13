from __future__ import annotations

from scripts.verify_documentation import (
    RICE_DISEASE_WAVE_001_DOCUMENTS,
    ROOT,
    verify,
)
from tests.contracts._api_manifest import PUBLIC_API_EXPORTS


def _all() -> str:
    return "\n".join(
        (ROOT / path).read_text(encoding="utf-8")
        for path in RICE_DISEASE_WAVE_001_DOCUMENTS
    )


def test_wave_materializes_two_traceable_rice_disease_subjects() -> None:
    text = _all()

    assert len(RICE_DISEASE_WAVE_001_DOCUMENTS) == 8
    assert all((ROOT / path).is_file() for path in RICE_DISEASE_WAVE_001_DOCUMENTS)
    for required in (
        "GS-DOA-HAZARDOUS-SALES-2019-001/v1",
        "9b2a14d7ba2bcc5bc6bde236af406df64d42f9ac109c1f43b3e7923113b0ff22",
        "โรคใบสีส้มของข้าว",
        "โรคจู๋ของข้าว",
        "EV-RDW1-001/v1",
        "EV-RDW1-002/v1",
        "CL-RDW1-004/v1",
        "RL-RDW1-002/v1",
        "CKP-RDW1-ORANGE-001/v1",
        "CKP-RDW1-GRASSY-STUNT-001/v1",
        "WV-RDW1-ORANGE-001/v1",
        "WV-RDW1-GRASSY-STUNT-001/v1",
        "PDF page 7",
        "printed page `1-2`",
        "P7-S2.2.2-B",
        "P7-S2.2.2-C",
    ):
        assert required in text
    assert len(verify()) == 684


def test_wave_preserves_scientific_and_engineering_boundaries() -> None:
    text = _all().casefold()

    assert "source-describes-vector" in text
    assert "not a causal-organism assertion" in text
    assert "no agronomist review is required" in text
    assert "diagnosis, or recommendation" in text
    for prohibited in (
        "recommended product:",
        "application rate:",
        "field diagnosis:",
        '"type": "object"',
        "create table",
        "openapi:",
    ):
        assert prohibited not in text
    assert sum(len(symbols) for symbols in PUBLIC_API_EXPORTS.values()) == 165
