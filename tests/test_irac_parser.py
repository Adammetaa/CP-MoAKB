from unittest.mock import patch

from cpmoakb.parsers.irac_parser import IRACParser, parse_irac_pdf


class _Page:
    def __init__(self, text):
        self.text = text

    def extract_text(self):
        return self.text


class _PDF:
    def __init__(self, pages):
        self.pages = pages

    def __enter__(self):
        return self

    def __exit__(self, *_):
        return False


def test_parser_detects_version_and_builds_hierarchy(tmp_path):
    source = tmp_path / "irac-official.pdf"
    source.touch()
    pdf = _PDF(
        [
            _Page("IRAC Mode of Action Classification Scheme\nVersion 11.3\nGroup 1 - Acetylcholinesterase inhibitors\n1A  Carbamates"),
            _Page("1B | Organophosphates\nGroup 4A: Neonicotinoids\nGroup UN - Unknown mode of action"),
        ]
    )

    with patch("cpmoakb.parsers.irac_parser.pdfplumber.open", return_value=pdf) as open_pdf:
        document = parse_irac_pdf(source)

    open_pdf.assert_called_once_with(source)
    assert document.version == "11.3"
    assert [(node.code, node.name, node.level, node.parent_code, node.page) for node in document.nodes] == [
        ("1", "Acetylcholinesterase inhibitors", 1, None, 1),
        ("1A", "Carbamates", 2, "1", 1),
        ("1B", "Organophosphates", 2, "1", 2),
        ("4A", "Neonicotinoids", 2, "4", 2),
        ("UN", "Unknown mode of action", 1, None, 2),
    ]
    assert document.to_dataframe().to_dict("records")[0] == {
        "code": "1",
        "name": "Acetylcholinesterase inhibitors",
        "level": 1,
        "parent_code": None,
        "page": 1,
    }


def test_parser_rejects_missing_pdf(tmp_path):
    missing = tmp_path / "missing.pdf"

    try:
        IRACParser().parse(missing)
    except FileNotFoundError as error:
        assert "IRAC PDF was not found" in str(error)
    else:
        raise AssertionError("A missing IRAC PDF should raise FileNotFoundError")
