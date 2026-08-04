# Website Navigation Model

Status: Active

Version: 1.0

## Navigation Purpose

Navigation helps users move from orientation to governed detail while retaining
context, provenance, and boundaries. It does not encode a diagnostic decision
tree, workflow automation, ranking, or scientific inference.

## Navigation Paths

- **Orientation path:** Home -> About -> Knowledge or Investigation.
- **Knowledge path:** Knowledge -> Package or object representation -> source,
  relationship, version, review, limitation, and related eligible objects.
- **Investigation path:** Investigation -> Observation -> Information Gap ->
  Question -> Evidence Need -> provisional comparison -> Human Review boundary.
- **Explorer path:** Knowledge Explorer -> filtered eligible results -> exact
  object/relationship explanation -> authoritative context.
- **Learning path:** Learning -> Learning Candidate -> required review -> possible
  future approved package, without automatic promotion.
- **Evolution path:** Future SPA Workspace -> SPA Alpha prerequisites -> Field
  Pilot -> Production -> Enterprise, clearly marked as future.

## Principles

- always preserve location in the information architecture and a route back to context;
- expose status, version, source, authority, and limitations near substantive content;
- distinguish concepts from examples and architecture from production capability;
- distinguish public, future, provisional, reviewed, and unavailable content;
- support Thai-first labels without hiding stable technical meaning;
- avoid dead ends by offering governed related paths, not speculative recommendations;
- do not personalize scientific meaning or reorder content as implicit likelihood; and
- make “not available in Alpha” a valid, explicit destination state.

## Search and Navigation Separation

Search retrieves eligible representations; navigation explains their governed
relationships. Search order does not create authority or relevance to a case.
Filters do not establish causal, diagnostic, or recommendation meaning.

## Future Role-aware Navigation

Later authenticated experiences may expose role-bounded destinations. Role-aware
visibility must be separately governed and cannot be inferred from persona labels
or implemented by this architecture sprint.
