# Data Alignment Audit — Internal Pilot

## Finding

The Field Workspace currently combines four data classes that must not be
presented as one canonical source:

1. governed CP-MoAKB records and review states;
2. internal operational configuration;
3. external contextual data;
4. user-reported field facts.

The immediate data-quality risk is semantic, not transport-related. Moving the
current JSON behind an API without status and provenance would make prototype
values look authoritative while preserving the mismatch.

## Priority mismatches

| Web area | Current source | Current state | Required alignment |
|---|---|---|---|
| Rice stage/CMP | `field-config.json` | Internal operational model | Confirm canonical owner/source, then version mapping separately from crop biology |
| Rice variety | Free text | User reported, unvalidated | Import a reviewed variety vocabulary and retain raw user text plus matched identifier |
| Planting method | `field-config.json` | Internal taxonomy | Map to a versioned vocabulary object |
| Today's checks | `investigation-config.json` | Safe generic workflow | Keep as observation workflow; attach governed knowledge only after runtime query |
| Learning Center | Static Knowledge Explorer JSON | Mixed review/publication states | Query through server-side runtime adapter and enforce review-state filters |
| Weather | Open-Meteo | External contextual | Preserve timestamp/provider/limitations; never promote to causal evidence |
| AI answer | OpenAI Responses | Generated field-scoped text | Bind to field/season, provider response ID and governed retrieval references when available |

## Integration order

1. Publish a server-side data catalog and expose its status in Pilot Diagnostics.
2. Add a read-only CP-MoAKB runtime adapter behind the Node server.
3. Connect Learning Center search first because it does not alter field state.
4. Add reviewed vocabulary endpoints for rice variety and planting method.
5. Replace stage/CMP configuration only after a named canonical source and
   human owner approve the mapping.
6. Add governed retrieval context to Field Chat without allowing AI output to
   overwrite canonical knowledge.

No existing Field, Season, Case, Message or Evidence record should be rewritten
silently. Data corrections require explicit versioned migration and preserve
the original user-reported value.
