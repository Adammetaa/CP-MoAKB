import pandas as pd

from cpmoakb.exporters.csv_exporter import export_irac_csv
from cpmoakb.parsers.models import IRACDocument, IRACNode


def test_export_writes_frozen_irac_csv_datasets(tmp_path):
    document = IRACDocument(
        version="11.3",
        nodes=(
            IRACNode("1", "Acetylcholinesterase inhibitors", 1, None, 1),
            IRACNode("1A", "Carbamates", 2, "1", 1),
            IRACNode("1A:aldicarb", "Aldicarb", 3, "1A", 1),
        ),
    )

    paths = export_irac_csv(document, tmp_path / "irac")

    assert {key: path.name for key, path in paths.items()} == {
        "moa_group": "MoA_Group.csv", "chemical_class": "Chemical_Class.csv",
        "active_ingredient": "Active_Ingredient.csv",
    }
    assert pd.read_csv(paths["moa_group"], dtype=str).to_dict("records") == [{
        "moa_group_id": "IRAC-11-3-GROUP-1", "group_code": "1",
        "group_name": "Acetylcholinesterase inhibitors", "source_version": "11.3",
    }]
    assert pd.read_csv(paths["chemical_class"], dtype=str).to_dict("records") == [{
        "chemical_class_id": "IRAC-11-3-CLASS-1A", "moa_group_id": "IRAC-11-3-GROUP-1",
        "class_name": "Carbamates",
    }]
    assert pd.read_csv(paths["active_ingredient"], dtype=str).to_dict("records") == [{
        "active_ingredient_id": "IRAC-11-3-INGREDIENT-1A-aldicarb",
        "chemical_class_id": "IRAC-11-3-CLASS-1A", "iso_common_name": "Aldicarb",
    }]
