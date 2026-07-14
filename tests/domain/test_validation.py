from cpmoakb.domain import ValidationIssue, ValidationResult, ValidationSeverity


def test_warnings_do_not_invalidate_result_but_errors_do():
    warning = ValidationIssue(
        "SYN-WARN", ValidationSeverity.WARNING, "Synthetic warning."
    )
    error = ValidationIssue("SYN-ERROR", ValidationSeverity.ERROR, "Synthetic error.")

    assert ValidationResult((warning,)).is_valid
    assert not ValidationResult((warning, error)).is_valid


def test_validation_issues_have_deterministic_order():
    later = ValidationIssue(
        "Z-CODE", ValidationSeverity.WARNING, "Later synthetic issue."
    )
    earlier = ValidationIssue(
        "A-CODE", ValidationSeverity.WARNING, "Earlier synthetic issue."
    )

    result = ValidationResult((later, earlier))

    assert result.issues == (earlier, later)


def test_validation_results_filter_and_combine():
    info = ValidationIssue("INFO", ValidationSeverity.INFO, "Synthetic information.")
    error = ValidationIssue("ERROR", ValidationSeverity.ERROR, "Synthetic error.")

    combined = ValidationResult((info,)).combine(ValidationResult((error,)))

    assert combined.for_severity(ValidationSeverity.ERROR) == (error,)
    assert len(combined.issues) == 2
