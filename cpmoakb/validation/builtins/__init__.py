"""Built-in generic mechanical validation rules."""

from .cross_object import CROSS_OBJECT_RULES
from .domain import DOMAIN_RULES
from .structural import STRUCTURAL_RULES

__all__ = ["CROSS_OBJECT_RULES", "DOMAIN_RULES", "STRUCTURAL_RULES"]
