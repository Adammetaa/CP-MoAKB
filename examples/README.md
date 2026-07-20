# Executable Examples

Run examples from the repository root after local installation. They use public
APIs, fictional records, explicit dependencies, and no network, files, secrets,
database, server, or background process.

| Example | Purpose | Extra |
| --- | --- | --- |
| [Minimal](minimal/README.md) | Load one synthetic candidate | Core |
| [Query](query/README.md) | Search explicit records | Core |
| [Query and explain](query_and_explain/README.md) | Use the application facade | Core |
| [Serialization](serialization/README.md) | Inspect canonical projection | Core |
| [Composition](composition/README.md) | Construct a facade explicitly | Core |
| [HTTP](http/README.md) | Create an injected app without serving | `http` |
| [CLI](cli/README.md) | Call the CLI as a library | Core |
| [Embedding](embedding/README.md) | Embed the facade in caller code | Core |
| [Testing](testing/README.md) | Assert deterministic behavior | Core |
| [Extension boundary](extension_boundary/README.md) | Classify safe extensions | None |

`examples/examples.json` is the verifier's explicit execution manifest. Examples
are repository learning material, not installed public API or knowledge data.
