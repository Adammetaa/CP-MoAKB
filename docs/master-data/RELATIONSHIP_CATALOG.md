# Conceptual Relationship Catalog

Relationships are versioned statements, not automatically universal facts. Each future relationship record must declare subject, predicate, object, scope, supporting or contradicting evidence, review status, and—where applicable—confidence, method, jurisdiction, production context, and valid time.

| Relationship | Required interpretation |
| --- | --- |
| crop **has growth stage** | Refers to a named crop-stage system, not an improvised label list. |
| growth stage **belongs to crop-stage system** | Preserves system/version identity; mappings between systems are separate reviewed statements. |
| crop **has plant organ** | Botanical applicability, not presence in every observed specimen. |
| organism **may act as pest of crop** | Contextual role; does not classify every occurrence as harmful. |
| weed **competes with crop** | Requires production/habitat context. |
| pathogen **may infect host** | Host association is separate from disease causality. |
| disease **has causal agent** | Requires causality evidence and may express uncertainty or multiple agents. |
| disease **manifests symptom** | Descriptive association, not a diagnostic rule. |
| causal agent **may produce sign** | Does not make the sign uniquely identifying. |
| symptom **occurs on plant organ** | Qualifies possible location and context. |
| damage **affects plant organ** | Links a reviewed damage concept to an anatomical target. |
| pest **causes damage mechanism** | Requires pest, host, and context evidence. |
| damage mechanism **produces damage pattern** | Allows non-unique and uncertain outcomes. |
| pest **is relevant during growth stage** | Time/stage-specific applicability, not universal presence. |
| disease **is reported during growth stage** | A sourced report, not proof of exclusive timing. |
| observation **may support identification** | Case evidence contributes to, but does not equal, diagnosis. |
| observation **may contradict identification** | Negative/conflicting evidence is retained. |
| source **supports statement** | Support is claim- and version-specific. |
| external authority **maps to local entity** | Requires mapping type, evidence, authority version, and review. |
| jurisdiction **constrains statement applicability** | Legal/local scope is explicit and time-bound. |

Inverse, hierarchy, equivalence, and transitive behavior must never be inferred merely from labels. Any computational semantics require later approval.
