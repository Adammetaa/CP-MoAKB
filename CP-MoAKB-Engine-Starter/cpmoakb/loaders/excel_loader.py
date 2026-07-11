from pathlib import Path
import pandas as pd

def load_excel(path):
    return pd.ExcelFile(Path(path))
