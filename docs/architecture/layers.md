# Implemented Layers

| Layer | Input and output | Public surface | Non-goal / forbidden direction |
| --- | --- | --- | --- |
| Source/parser | Explicit PDF to immutable IRAC document | `cpmoakb.parsers` | No Runtime orchestration |
| Domain | Typed values to immutable records | `cpmoakb.domain` | No adapters, storage, or network |
| YAML adapter | YAML text to candidate record | `cpmoakb.adapters.yaml` | No files, validation, or promotion |
| Validation | Record/context to ordered issues | `cpmoakb.validation` | No scientific acceptance |
| Registries | Explicit records/references to snapshots | `cpmoakb.registries` | No persistence or allocation service |
| Query | Records/snapshots plus criteria to matches | `cpmoakb.query` | No ranking or inference |
| Explanation | Explicit result/facts to structured explanation | `cpmoakb.explain` | No generative reasoning |
| Serialization | Supported result to closed JSON projection | `cpmoakb.serialization` | No input decoding or arbitrary objects |
| Runtime API | Version identity | `cpmoakb.runtime_api` | No facade aggregation |
| Application | Typed request to response/projection | `cpmoakb.application` | No transport or hidden data |
| Composition | Caller services to new facade | `cpmoakb.composition` | No defaults or discovery |
| HTTP / CLI | Strict request or argv to facade call | `cpmoakb.http_api`, `cpmoakb.cli` | No service ownership or server executable |
| Packaging | Source to wheel/sdist | PEP 621 metadata | No publication |
| Verification | Repository state to pass/fail evidence | `scripts/verify_*` | Not Runtime code or public package API |

Each layer's extension point is its documented input protocol or constructor—not
an invitation to import internal helpers. RAS-001 through RAS-014 and their linked
tests define the detailed responsibilities.
