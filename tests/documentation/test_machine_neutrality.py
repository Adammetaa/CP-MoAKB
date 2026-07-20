from __future__ import annotations

from scripts.verify_documentation import MACHINE_PATTERNS, governed_markdown


def test_governed_documentation_contains_no_machine_specific_content() -> None:
    for path in governed_markdown():
        text = path.read_text(encoding="utf-8")
        assert not any(pattern.search(text) for pattern in MACHINE_PATTERNS), path
