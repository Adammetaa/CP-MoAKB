import importlib

from ._api_manifest import EXPERIMENTAL_EXPORTS, PUBLIC_API_EXPORTS


def test_static_manifest_exactly_matches_package_exports() -> None:
    for package_name, expected in PUBLIC_API_EXPORTS.items():
        package = importlib.import_module(package_name)
        assert tuple(package.__all__) == expected


def test_every_manifest_symbol_is_importable() -> None:
    for package_name, symbols in PUBLIC_API_EXPORTS.items():
        package = importlib.import_module(package_name)
        for symbol in symbols:
            assert getattr(package, symbol) is not None


def test_stability_manifest_is_bounded_to_public_symbols() -> None:
    public = {
        (package, symbol)
        for package, symbols in PUBLIC_API_EXPORTS.items()
        for symbol in symbols
    }
    assert EXPERIMENTAL_EXPORTS <= public
    assert len(public) == 165
    assert len(EXPERIMENTAL_EXPORTS) == 18


def test_representative_internal_helpers_are_not_public_exports() -> None:
    internal_helpers = {
        "cpmoakb.adapters.yaml": ("_mapping", "_candidate_identifier"),
        "cpmoakb.registries": ("_optional_trimmed",),
        "cpmoakb.query": ("_normalized_text", "_LabelEntry"),
        "cpmoakb.explain": ("_required", "_record_reference"),
    }
    for package_name, symbols in internal_helpers.items():
        package = importlib.import_module(package_name)
        assert all(symbol not in package.__all__ for symbol in symbols)
