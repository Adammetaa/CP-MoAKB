# R2A primary SPA authority migration map

This map records which runtime owns each supported primary SPA interaction. Browser services remain only for formatting, navigation, weather display, map geometry, and explicit local drafts.

| Primary UI action | Previous browser path | R2A authoritative path |
|---|---|---|
| Login / profile | local prototype identity | server session identity |
| Home / Fields / Field detail | `WorkspaceRepository`, `FieldService`, `GuidanceService` | server lifecycle projection; local records are labelled drafts and cannot enter governed calls |
| Create Field / CropSeason | `FieldService.create_field` | record-scoped `POST /api/pilot/fields` |
| Start Inspection / Case | `InvestigationService.start_case` | governed `CASE` record through `/api/pilot/investigation-records` |
| Natural inspection statement | fixed browser questionnaire and local Observation | Step E turn → Capture Adapter → server Observation and typed Evidence → Step C/D refresh |
| Structured capture / offline work | browser Observation treated as current | explicit `DRAFT_LOCAL` → Investigation Capture Adapter sync → server bundle |
| Field / Case chat | browser conversation ID and local memory | server Field/Season/Case scope and governed conversation history |
| Investigation photo | generic `/api/pilot/evidence` plus browser Evidence | B1 `/api/pilot/visual-evidence`, categorical quality/observability, optional B2, human review |
| Case summary / next action | browser `InvestigationService` summary | server Investigation bundle, Step C assessment, and Step D current Guidance |
| Management options | browser `DecisionService.get_management_options` | server F1 review/options/context/history |
| Human decision | browser `decision_logs` | server F2 immutable Human Decision snapshot |
| Planned / performed action / outcome | browser case state | server F2 action/outcome context; explicit confirmation only |
| Follow-up / notification / timeline | local arrays and fixed badge | server G plans, reminders, due projection, transitions, and authoritative timeline |
| Local pattern | no supported primary route | bounded server H projection; never an outbreak/risk map |
| Learning | static Knowledge route | server I Learning Nomination/Inbox; no canonical promotion |
| Diagnostics | mixed browser counters | server pilot summary/catalog plus explicit presentation cache status |

Company/reference content remains Knowledge-only and cannot create F1 eligibility, a Human Decision, or an Action. `PUT /api/pilot/workspace` remains retired.
