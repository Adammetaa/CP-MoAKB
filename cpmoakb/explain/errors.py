"""Programming and configuration errors for explanation services."""


class ExplanationError(RuntimeError):
    """Base class for explanation framework defects."""


class UnsupportedExplanationTargetError(ExplanationError):
    """A builder received an unsupported Runtime object type."""


class InvalidExplanationInputError(ExplanationError):
    """Supplied explicit inputs contradict one another or the model contract."""


class ExplanationRenderingError(ExplanationError):
    """A renderer received an unsupported structured explanation value."""
