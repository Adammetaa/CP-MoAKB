# Observation Vocabulary Architecture Examples

Status: Active

Version: 1.0

## Purpose

These examples demonstrate architecture boundaries. They are fictional review
illustrations, not a real dataset, approved vocabulary, master data, diagnosis
guide, or recommendation source.

## Neutral Expression Patterns

| Candidate pattern | Why it may enter review | Context still required |
| --- | --- | --- |
| spindle-shaped lesion | Describes perceived shape and feature type | observer, structure, scale, method, time |
| linear translucent streak | Describes form and optical appearance | structure, illumination, extent, method |
| leaf margin discoloration | Describes location and visible change | leaf identity, comparison basis, color, time |
| clustered circular spots | Describes distribution and shape | structure, count basis, scale, sampling frame |
| insects observed on lower leaf surface | Reports directly perceived entities and location | identity basis, method, count, time, uncertainty |

These patterns MAY be nominated only after their language, definitions,
boundaries, provenance, and authority basis are supplied. Their inclusion here
does not make them preferred labels.

## Non-neutral Expression Patterns

| Prohibited pattern | Embedded interpretation | Neutral repair direction |
| --- | --- | --- |
| blast lesion | Named disease diagnosis | describe shape, color, margin, location, and distribution |
| bacterial streak damage | Causal agent and damage attribution | describe visible streak morphology and context |
| stem-borer symptom | Inferred pest identity and symptom interpretation | describe observed opening, tissue change, material, or organism separately |
| nitrogen-deficiency yellowing | Nutrient diagnosis | describe discoloration, distribution, structure, and comparison |
| insecticide-resistant population | Resistance conclusion | record observed organisms and separately governed test evidence |

The neutral repair direction does not validate any term. It shows how reviewers
separate perception from inference.

## Language Relationship Example

Suppose a fictional local expression is nominated alongside Thai and English
technical candidates. Reviewers MUST preserve the local expression and its
usage context; assess translation, transliteration, synonymy, and equivalence as
different relationships; and avoid treating the local expression as a diagnosis.
No relationship is approved merely because the expressions occur together.

## Instance versus Term Example

“Three circular marks were recorded on the lower surface at inspection time” is
an observation-instance statement. A definition of “circular” is terminology.
The instance does not define the term, and the term does not prove the instance.
Neither establishes Evidence, Hypothesis, Diagnosis, or Recommendation.

## Composition Non-example

Combining a neutral shape term, a neutral crop context, and a neutral temporal
term into a phrase that conventionally names a disease still creates an
inference. Review MUST evaluate the composed meaning, not only each component.

## Implementation Boundary

Tables in this document are explanatory prose. They MUST NOT be parsed as term
records, imported as seed data, assigned identifiers, or used as validation
fixtures without separate governed authorization.
