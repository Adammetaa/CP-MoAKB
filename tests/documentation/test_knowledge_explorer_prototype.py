from __future__ import annotations

import json
import re

from scripts.verify_documentation import KNOWLEDGE_EXPLORER_DOCUMENTS, ROOT

PROTOTYPE = ROOT / "prototype" / "knowledge-explorer"
PAGES = (
    "index.html",
    "search.html",
    "browse.html",
    "concept.html",
    "evidence.html",
    "source.html",
    "authority.html",
    "governance.html",
    "about.html",
    "components.html",
)


def test_knowledge_explorer_deliverables_are_complete() -> None:
    assert KNOWLEDGE_EXPLORER_DOCUMENTS == (
        "prototype/knowledge-explorer/README.md",
        "prototype/knowledge-explorer/docs/information-architecture.md",
        "prototype/knowledge-explorer/docs/personas.md",
        "prototype/knowledge-explorer/docs/wireframes.md",
        "prototype/knowledge-explorer/docs/design-system.md",
        "prototype/knowledge-explorer/docs/deployment.md",
    )
    for relative in KNOWLEDGE_EXPLORER_DOCUMENTS:
        assert (ROOT / relative).is_file()
    for page in PAGES:
        assert (PROTOTYPE / page).is_file()


def test_every_screen_is_static_accessible_and_boundary_labeled() -> None:
    for page in PAGES:
        text = (PROTOTYPE / page).read_text(encoding="utf-8")
        assert "<main" in text
        assert "data-page=" in text
        assert "Prototype · fictional placeholder content" in text
        assert '<meta name="robots" content="noindex,nofollow">' in text
        assert "assets/styles.css" in text
        assert "assets/app.js" in text
        assert "login" not in text.casefold()
        for target in re.findall(r'href="([^"#]+\.html)', text):
            assert (PROTOTYPE / target).is_file(), f"{page}: {target}"


def test_mock_dataset_is_explicitly_fictional_and_minimal() -> None:
    data = json.loads(
        (PROTOTYPE / "assets" / "data" / "mock-knowledge.json").read_text(
            encoding="utf-8"
        )
    )

    assert data["meta"]["status"] == "fictional-placeholder"
    assert "not agricultural knowledge" in data["meta"]["disclaimer"]
    assert len(data["concepts"]) == 4
    assert len(data["evidence"]) == 2
    assert len(data["sources"]) == 2
    assert len(data["authorities"]) == 1
    assert all("Placeholder" in item["status"] for item in data["concepts"])


def test_required_personas_flows_components_and_responsive_design_are_documented() -> (
    None
):
    personas = (PROTOTYPE / "docs" / "personas.md").read_text(encoding="utf-8")
    architecture = (PROTOTYPE / "docs" / "information-architecture.md").read_text(
        encoding="utf-8"
    )
    wireframes = (PROTOTYPE / "docs" / "wireframes.md").read_text(encoding="utf-8")
    design = (PROTOTYPE / "docs" / "design-system.md").read_text(encoding="utf-8")

    for persona in (
        "Farmer",
        "Agronomist",
        "Crop Advisor",
        "Researcher",
        "Student",
        "Government Officer",
        "Developer",
        "Knowledge Author",
        "Knowledge Reviewer",
    ):
        assert f"## {persona}" in personas
    for journey in ("Search journey", "Evidence journey", "Authority journey"):
        assert journey in architecture
    for viewport in ("Desktop", "Tablet", "Mobile"):
        assert viewport in wireframes
    for component in (
        "Search Box",
        "Concept Card",
        "Evidence Card",
        "Authority Card",
        "Knowledge Badge",
        "Lifecycle Badge",
        "Relationship Chip",
        "Source Card",
        "Breadcrumb",
        "Graph Card",
    ):
        assert component in design


def test_prototype_has_no_backend_or_production_dependency() -> None:
    package = json.loads((PROTOTYPE / "package.json").read_text(encoding="utf-8"))
    readme = (PROTOTYPE / "README.md").read_text(encoding="utf-8").casefold()

    assert package["private"] is True
    assert "dependencies" not in package
    assert package["version"] == "0.0.0-private"
    for boundary in (
        "no backend",
        "runtime",
        "database",
        "api",
        "authentication",
        "persistence",
        "ai",
        "diagnosis",
        "recommendation",
    ):
        assert boundary in readme
    assert (PROTOTYPE / "assets" / "og.png").is_file()
