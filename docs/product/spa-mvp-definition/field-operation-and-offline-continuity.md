# Field Operation and Offline Continuity

Status: Active

Version: 1.0

## Field Context

The MVP must remain practical for an SPA in a rice field using a phone, under
time pressure, weak connectivity, sunlight, gloves, and competing conversation
and observation demands. The SPA may move among plots, capture images before
spraying, accompany a drone pilot, review wind, spray, water, and crop context,
and return later for follow-up. Rice is a field-use illustration, not
crop-specific architecture or production content.

## Product Requirements

- minimize interruption and request only purpose-relevant information;
- save incomplete work without implying completion;
- resume later with missing information and unsynchronized work visible;
- separate reported accounts from direct Observations at capture time;
- capture evidence and context before interpretation;
- preserve attributable time, location basis, plot context, and sensitivity;
- require image subject, structure, scale or reference where appropriate, angle,
  time, source, and limitations without forcing unsafe capture;
- preserve contradictions and parallel accounts;
- maintain low cognitive load and rapid bounded case summary;
- permit unknown, unavailable, not recorded, conflicting, and not applicable;
- provide conceptual safe escalation when authority or risk is exceeded; and
- support switching between conversation, observation, image capture, and plots
  without merging their contexts.

These requirements prescribe no UI appearance, gesture, component, or screen.

## Offline Continuity Expectations

When connectivity is unavailable, the product concept must preserve:

- local capture continuity for authorized case work;
- clearly visible unsynchronized status;
- no silent data loss or false successful-submission claim;
- warning before likely duplicate case creation;
- original authorship, source, observer, timestamp, language, and context;
- separation of locally captured versions and previously reviewed versions;
- restrictions on review, eligibility, or closure when required knowledge,
  authority, or current records cannot be confirmed;
- no false claim that governed knowledge is complete or current offline; and
- later synchronization review for conflicts, duplicates, ordering, provenance,
  and material changes before downstream reliance.

No synchronization protocol, cache, database, conflict algorithm, or technical
offline mechanism is defined.

## Field Safety Boundary

The product must not pressure an SPA to capture information while unsafe, enter
a treated area, distract a vehicle or drone operation, expose sensitive
locations, or continue when human/crop safety requires escalation. Skipping or
deferring capture with reason is preferable to fabricated certainty.
