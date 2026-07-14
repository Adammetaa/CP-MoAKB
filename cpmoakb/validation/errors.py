"""Framework configuration errors, never ordinary validation findings."""


class ValidationFrameworkError(RuntimeError):
    """Base class for validation programming or configuration defects."""


class DuplicateRuleIdentifierError(ValidationFrameworkError):
    """A profile contains more than one rule with the same stable ID."""


class InvalidValidationProfileError(ValidationFrameworkError):
    """A profile has invalid identity, rules, or layer configuration."""


class InvalidValidationContextError(ValidationFrameworkError):
    """A read-only context cannot be constructed deterministically."""


class UnsupportedValidationTargetError(ValidationFrameworkError):
    """A rule or engine entry point received an unsupported target type."""
