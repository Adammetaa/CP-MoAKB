import pytest

from cpmoakb.domain import SourceIdentifier
from cpmoakb.registries import (
    RegistryError,
    RegistryItemNotFoundError,
    SourceRegistry,
)


def test_registry_errors_are_typed_and_deterministic() -> None:
    identifier = SourceIdentifier("synthetic-missing-source")
    with pytest.raises(RegistryItemNotFoundError) as caught:
        SourceRegistry().get(identifier)
    assert isinstance(caught.value, RegistryError)
    assert str(caught.value) == "source synthetic-missing-source is not registered"
