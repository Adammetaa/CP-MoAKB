from __future__ import annotations

import json
import subprocess

from tests.deployment.test_investigation_decision_gates import NODE, ROOT

DATA = (
    ROOT
    / "prototype"
    / "knowledge-explorer"
    / "assets"
    / "data"
    / "multi-source-integration-001.json"
)
APP = ROOT / "prototype" / "knowledge-explorer" / "assets" / "app.js"
PAGE = ROOT / "prototype" / "knowledge-explorer" / "crop-protection-management.html"


def data() -> dict:
    return json.loads(DATA.read_text(encoding="utf-8"))


def project(view_id: str = "WV-MSI-BPH-001/v1") -> dict:
    payload = json.dumps(data())
    script = (
        "global.__EXPLORER_TEST__=true;"
        + f"require({json.dumps(str(APP))});"
        + f"const data={payload};"
        + "process.stdout.write(JSON.stringify(global.__explorerLocalization."
        + f"projectIntegratedKnowledge(data,{json.dumps(view_id)})));"
    )
    result = subprocess.run(
        [NODE, "-e", script],
        check=True,
        capture_output=True,
        text=True,
        encoding="utf-8",
    )
    return json.loads(result.stdout)


def test_source_classes_and_authority_roles_stay_separate() -> None:
    integration = data()
    assert [item["id"] for item in integration["source_classes"]] == [
        "CASE_EVIDENCE",
        "SCIENTIFIC_AUTHORITY",
        "REGULATORY_AUTHORITY",
        "MOA_CLASSIFICATION_AUTHORITY",
        "MANUFACTURER_COMMERCIAL_SOURCE",
    ]
    assert not any("confidence" in item for item in integration["source_classes"])


def test_case_evidence_is_displayed_separately_from_canonical_knowledge() -> None:
    result = project()
    assert result["observedInCase"][0]["source_role"] == "CASE_EVIDENCE"
    assert result["observedInCase"][0]["canonical"] is False
    assert result["generalKnowledge"][0]["source_role"] == "SCIENTIFIC_AUTHORITY"
    assert result["generalKnowledge"][0]["canonical"] is True


def test_scientific_and_moa_assertions_have_exact_provenance() -> None:
    for view_id in ("WV-MSI-BPH-001/v1", "WV-MSI-BLAST-001/v1"):
        result = project(view_id)
        for assertion in result["generalKnowledge"] + result["moaKnowledge"]:
            assert assertion["provenance"]["sourceId"]
            assert assertion["provenance"]["sourceClass"] in {
                "SCIENTIFIC_AUTHORITY",
                "MOA_CLASSIFICATION_AUTHORITY",
            }
            assert assertion["provenance"]["locator"]


def test_product_identity_binds_name_manufacturer_ingredient_and_formulation() -> None:
    integration = data()
    product = integration["entities"]["products"][0]
    assert product["product_name"] == "เพลนั่ม 50 ดับบลิวจี"
    assert product["manufacturer_id"] == "MFR-SYNGENTA"
    assert product["active_ingredient_id"] == "AI-PYMETROZINE"
    assert product["concentration"] == "50%" and product["formulation"] == "WG"
    assert product["source_identity"] == "MS-SYN-PLENUM-001/v1"
    assert len(product["identity_key"].split("|")) == 6


def test_ambiguous_product_name_is_not_merged() -> None:
    candidate = data()["entities"]["products"][1]
    assert candidate["identity_state"] == "NEEDS_REVIEW"
    assert candidate["identity_key"] is None
    assert "cannot merge" in candidate["ambiguity_rule"]


def test_product_manufacturer_and_registration_relationships_are_traceable() -> None:
    relationships = {item["id"]: item for item in data()["relationships"]}
    assert relationships["REL-PRODUCT-AI"]["state"] == "SUPPORTED"
    assert relationships["REL-PRODUCT-MFR"]["to"] == "MFR-SYNGENTA"
    assert relationships["REL-PRODUCT-REG"]["to"] == "TH-REG-405-2555"
    assert all(item["source_assertions"] for item in relationships.values())


def test_registration_identity_does_not_become_crop_target_use_authority() -> None:
    registration = data()["entities"]["registrations"][0]
    assert registration["registration_number"] == "405-2555"
    assert registration["recorded_expiry"] == "2024-03-22"
    assert registration["current_status"] == "CURRENT_RENEWAL_UNRESOLVED"
    assert registration["crop_target_use_authority"] == "AUTHORITY_BLOCKED"


def test_manufacturer_claim_does_not_become_regulatory_authority() -> None:
    integration = data()
    claim = next(
        item for item in integration["assertions"] if item["id"] == "AS-MFR-PLENUM-001"
    )
    binding = next(
        item
        for item in integration["relationships"]
        if item["id"] == "REL-MFR-CLAIM-CTU"
    )
    assert claim["source_role"] == "MANUFACTURER_COMMERCIAL_SOURCE"
    assert claim["state"] == "NEEDS_REVIEW"
    assert binding["state"] == "AUTHORITY_BLOCKED"


def test_conflicting_field_and_scientific_assertions_are_both_retained() -> None:
    result = project("WV-MSI-BLAST-001/v1")
    assert result["observedInCase"] and result["generalKnowledge"]
    assert any(item["state"] == "CONFLICTING" for item in result["relationships"])
    assert result["humanReviewRequired"] is True


def test_multiple_manufacturers_share_one_neutral_schema() -> None:
    manufacturers = data()["entities"]["manufacturers"]
    assert [item["name"] for item in manufacturers] == [
        "Chia Tai",
        "Syngenta Crop Protection Co., Ltd.",
        "Bayer",
        "ADAMA",
    ]
    assert len({item["schema_role"] for item in manufacturers}) == 1
    assert (
        next(item for item in manufacturers if item["name"] == "Chia Tai")[
            "product_assertions"
        ]
        == 0
    )


def test_failed_control_and_case_results_never_become_canonical_claims() -> None:
    relationship = next(
        item for item in data()["relationships"] if item["id"] == "REL-FAILED-CONTROL"
    )
    assert relationship["state"] == "NOT_APPLICABLE"
    assert "resistance" in relationship["limitations"][0]
    assert "efficacy" in relationship["limitations"][1]


def test_chemical_review_exposes_information_without_product_selection() -> None:
    result = project()
    assert result["managementOptionLink"] == "CHEMICAL_REVIEW_INFORMATION_ONLY"
    assert result["products"]
    assert result["recommendation"] is None
    assert result["ranking"] is None
    assert result["prescription"] is None
    assert result["execution"] is None


def test_no_instructions_commercial_preference_or_automatic_learning() -> None:
    integration = data()
    assert integration["safety"] == {
        "recommendation": None,
        "ranking": None,
        "commercial_preference": None,
        "prescription": None,
        "execution": None,
        "application_instructions": None,
        "automatic_learning": False,
        "human_review_can_invent_authority": False,
    }
    assert project()["canonicalPromotion"] is False


def test_every_displayed_assertion_and_relationship_has_provenance() -> None:
    for view_id in ("WV-MSI-BPH-001/v1", "WV-MSI-BLAST-001/v1"):
        result = project(view_id)
        displayed = (
            result["observedInCase"]
            + result["generalKnowledge"]
            + result["moaKnowledge"]
            + result["regulatoryKnowledge"]
            + result["manufacturerKnowledge"]
        )
        assert all(item["provenance"]["sourceId"] for item in displayed)
        assert all(item["provenance"] for item in result["relationships"])


def test_existing_knowledge_explorer_surface_contains_bounded_projection() -> None:
    page = PAGE.read_text(encoding="utf-8")
    app = APP.read_text(encoding="utf-8")
    assert "data-integrated-knowledge" in page
    for required in (
        "Observed in this Case",
        "Scientific Knowledge",
        "Mode of Action",
        "Regulatory Status",
        "Related Product Information",
        "Source & Provenance",
        "Gaps / Conflicts",
        "Product information ≠ recommendation",
    ):
        assert required in app
    for prohibited in (
        "recommended product",
        "best product",
        "increase dose",
        "recommended tank mix",
        "recommended spray timing",
    ):
        assert prohibited not in (page + app).lower()
