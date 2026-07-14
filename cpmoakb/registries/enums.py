"""Controlled custody state for candidate identifiers."""

from enum import Enum


class CandidateIdentifierState(str, Enum):
    """Identifier custody, distinct from candidate-record lifecycle."""

    RESERVED = "reserved"
    REGISTERED = "registered"
    ABANDONED = "abandoned"
    REJECTED = "rejected"
    SUPERSEDED = "superseded"
