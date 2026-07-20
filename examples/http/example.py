"""Create and inspect an injected HTTP app without starting a server."""

from cpmoakb.composition import create_runtime_application_service
from cpmoakb.explain import ExplanationService
from cpmoakb.http_api import create_http_app
from cpmoakb.query import QueryService


def main() -> int:
    service = create_runtime_application_service(
        query_service=QueryService.from_records(()),
        explanation_service=ExplanationService(),
    )
    app = create_http_app(service)
    described: list[tuple[str, str]] = []
    for route in app.routes:
        path = getattr(route, "path", None)
        methods = getattr(route, "methods", None)
        if isinstance(path, str) and isinstance(methods, set):
            described.append((path, ",".join(sorted(methods))))
    for path, methods in sorted(described):
        print(methods, path)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
