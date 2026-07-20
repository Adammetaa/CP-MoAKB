# Documentation Contributions

Describe existing behavior, distinguish current scope from future vision, and
link to authoritative constants, manifests, ADRs, and RAS documents. Use public
APIs and fictional identifiers in examples. State limitations and avoid
production, scientific efficacy, publication, or certification claims.

Relative Markdown links must resolve. Do not include machine paths, usernames,
transient Actions run identifiers, stale screenshots, or placeholder markers.
Run `python scripts/verify_documentation.py` and the documentation tests. If text
and implementation disagree, classify the discrepancy before changing either;
documentation correction is not authority to change behavior.
