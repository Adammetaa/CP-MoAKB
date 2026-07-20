"""Private deterministic failures for CLI argument validation."""


class CliArgumentError(ValueError):
    """Raised instead of argparse process termination."""
