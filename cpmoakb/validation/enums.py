"""Controlled values for the generic runtime validation framework."""

from enum import Enum


class ValidationLayer(str, Enum):
    """Architectural validation layers.

    Representation checks belong primarily to adapters. Scientific validation
    is modeled but no scientific rule is implemented or registered.
    """

    REPRESENTATION = "representation"
    STRUCTURAL = "structural"
    DOMAIN = "domain"
    CROSS_OBJECT = "cross_object"
    SCIENTIFIC = "scientific"


class RuleApplicability(str, Enum):
    RECORD = "record"
    BATCH = "batch"
