# First Explanation

Run:

```shell
python -m examples.query_and_explain.example
```

The example explicitly composes `QueryService`, `ExplanationService`, and
`RuntimeApplicationService`, then requests one match by index. It prints one
stable canonical application JSON document containing the query projection and a
structured explanation.

An explanation reports traceable facts and limitations already present in the
input and query match. It is not a diagnosis, recommendation, causal account, or
confidence score. An empty result or invalid index produces a typed application
contract error. See [explanation concepts](../concepts/explanation.md) and the
[Application API](../api/application-api.md).
