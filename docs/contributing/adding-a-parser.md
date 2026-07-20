# Adding a Parser

Current parsers consume an explicitly supplied source and return typed values.
A parser extension must have an approved source/format scope, remain separate from
Runtime orchestration, avoid automatic discovery or fetching, and translate
format errors at its boundary.

Required evidence includes fictional unit fixtures, malformed-input coverage,
deterministic ordering, no implicit writes, architecture tests, and documentation
of the public or internal surface. Never alter the frozen IRAC parser or golden
counts as a shortcut. A new generic representation contract may require an ADR
and RAS-003 review; agricultural content requires separate source governance.
