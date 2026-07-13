# CP-MoAKB

## IRAC parser and CSV export

The IRAC parser reads an official IRAC Mode of Action Classification Scheme PDF
without relying on fixed page numbers. It returns normalized, in-memory objects
only; it does not use SQLite or the Import Engine.

```python
from cpmoakb.exporters.csv_exporter import export_irac_csv
from cpmoakb.parsers.irac_parser import parse_irac_pdf

document = parse_irac_pdf("IRAC-MoA-Classification.pdf")
paths = export_irac_csv(document, "build/irac")
```

`paths` contains the generated `MoA_Group.csv`, `Chemical_Class.csv`, and
`Active_Ingredient.csv` paths. The CSV columns follow the frozen CP-MoAKB
knowledge model; this export does not alter the database schema.
