# Term Review Process

## Purpose

The review process turns a term proposal into an auditable vocabulary decision. It separates lexical quality, language expertise, domain meaning, evidence, regulation, architecture, and release authority.

## Workflow

```text
Draft
→ Terminology Review
→ Domain Review
→ Architecture Review
→ Accepted
→ Published
```

Language Review is required for every language represented. Evidence Review is required for definitions and semantic relationships. Regulatory Review is required whenever terminology could convey registration, label, legal, jurisdictional, or safety meaning. A proposal may loop back, remain disputed, be rejected, or be withdrawn.

## Review stages

### 1. Draft

The proposer states concept reference, category, candidate labels, definition, scope, usage, language/script, source, evidence, provenance, ambiguity, and intended vocabulary. Missing information remains explicit.

### 2. Terminology Review

The Terminology Reviewer checks clarity, one-concept scope, preferred/alternative distinction, lexical relationship type, homonyms, prohibited inference, consistency with house style, and conflicts with existing terms. Normalization MAY find candidates but MUST NOT merge concepts.

### 3. Language Review

Qualified reviewers check language, script, spelling, grammar, translation meaning, transliteration scheme, regional/community usage, register, and potential harmful or misleading wording. Scientific names follow nomenclatural review rather than being treated as ordinary translations.

### 4. Domain Review

Qualified domain reviewers check definition, inclusion/exclusion scope, category, scientific/taxonomic context, concept boundaries, source applicability, and whether another concept is being conflated. Domain Review does not approve regulatory or recommendation validity.

### 5. Evidence and regulatory review

Evidence reviewers assess whether each material label/definition/relationship claim is supported and traceable. Regulatory reviewers assess legal or label terminology using authoritative, current, jurisdiction-specific sources. Lack of authority or currency blocks the affected claim.

### 6. Architecture Review

Architecture governance checks separation from ontology, identifier, evidence, regulation, safety, diagnosis, and recommendation; cross-vocabulary consistency; lifecycle/version implications; privacy; and technology neutrality.

### 7. Acceptance and publication

The Vocabulary Steward records the accepted decision and all review evidence. The Release Manager publishes it only after quality and release gates pass. Acceptance may be conditional on a future release and is not publication by itself.

## Acceptance criteria

Before a future term is Accepted, it MUST have:

- stable concept reference;
- definition and explicit scope;
- source and evidence appropriate to every material claim;
- reviewer identities/roles and completed required reviews;
- language/script and regional context where relevant;
- category and vocabulary lifecycle status;
- provenance and change history;
- reviewed preferred/alternative/synonym classification;
- ambiguity, conflicts, limitations, and prohibited inferences recorded; and
- no unresolved critical quality, privacy, legal, identity, or architecture issue.

The minimum required elements—Definition, Scope, Evidence, Source, Reviewer, Language, Category, and Status—MUST never be inferred from a blank field.

## Decision records and appeals

Approve, return, reject, withdraw, or defer decisions MUST include rationale and date. A dissenting review remains visible. Appeals use a new review event with new evidence or clarified scope; they do not overwrite the original decision. Material conflicts are escalated to the role with authority for that boundary.
