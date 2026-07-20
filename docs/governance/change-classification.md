# Change Classification

| Change | Required review |
| --- | --- |
| Typo or clarified accurate prose | Documentation tests and owner review |
| Internal refactor with identical behavior | Focused tests and architecture checks |
| Public symbol/signature/error/ordering change | RAS-007 compatibility and version review |
| Schema, projection, route, command, or package change | Owning RAS plus version/artifact review |
| New durable architectural choice | ADR decision before implementation |
| New reusable Runtime rule | RAS amendment or new RAS |
| Agricultural record, term, or claim | Knowledge Track source/scientific governance |
| Publication or deployment | Separate explicit approval and boundary review |

When classification is uncertain, stop before editing the governed surface. A
smaller diff does not make a semantic change “internal.”
