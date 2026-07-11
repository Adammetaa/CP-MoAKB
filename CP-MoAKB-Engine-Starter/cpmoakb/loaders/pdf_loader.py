from pathlib import Path
import fitz

def open_pdf(path):
    return fitz.open(Path(path))
