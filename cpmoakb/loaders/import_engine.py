
from pathlib import Path
from zipfile import ZipFile
import json
import pandas as pd

def scan_zip(zip_path):
    with ZipFile(zip_path) as z:
        return [n for n in z.namelist() if n.lower().endswith(".xlsx")]

def import_zip(zip_path, out_dir="build"):
    out=Path(out_dir)
    out.mkdir(parents=True, exist_ok=True)
    ext=out/"extracted"
    ext.mkdir(exist_ok=True)
    with ZipFile(zip_path) as z:
        z.extractall(ext)
    report=[]
    for wb in ext.rglob("*.xlsx"):
        xls=pd.ExcelFile(wb)
        item={"workbook":str(wb.relative_to(ext)),"sheets":[]}
        for s in xls.sheet_names:
            df=pd.read_excel(wb,sheet_name=s)
            item["sheets"].append({"sheet":s,"rows":len(df),"columns":[str(c) for c in df.columns]})
        report.append(item)
    (out/"metadata.json").write_text(json.dumps(report,indent=2,ensure_ascii=False),encoding="utf-8")
    (out/"import_log.json").write_text(json.dumps({"status":"success","workbooks":len(report)},indent=2),encoding="utf-8")
    return report

if __name__=="__main__":
    import argparse
    p=argparse.ArgumentParser()
    p.add_argument("zipfile")
    p.add_argument("--out",default="build")
    a=p.parse_args()
    import_zip(a.zipfile,a.out)
