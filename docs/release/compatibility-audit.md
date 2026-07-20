# Sprint-028R Compatibility Audit

The audit baseline is `5c625c70c229773991434a638c831e061dcb92bf`.

| Surface | Governed version | Result |
| --- | --- | --- |
| Distribution | `0.1.0` | Unchanged |
| Runtime API | `0.1` | Unchanged |
| YAML schema | `1.0` | Unchanged |
| JSON projection | `1.0` | Unchanged |
| Application API | `0.1` | Unchanged |
| HTTP API | `0.1` | Unchanged |
| CLI API | `0.1` | Unchanged |
| Composition API | `0.1` | Unchanged |

The public manifest remains 165 symbols. No public signature, route, CLI command,
output envelope, error code, exit code, query matching rule, explanation structure
or text, package dependency category, or optional-extra behavior changes in this
sprint. New scripts, tests, documents, CI gates, and the release-readiness manifest
are governance surfaces, not Runtime API.
