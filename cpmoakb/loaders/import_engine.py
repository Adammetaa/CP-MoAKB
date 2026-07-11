
from pathlib import Path
from zipfile import ZipFile
import json
import pandas as pd

def import_zip(zip_path, output_dir):
    output_dir=Path(output_dir)
    output_dir.mkdir(parents=True,exist_ok=True)
    work=output_dir/"extracted"
    work.mkdir(exist_ok=True)

    with ZipFile(zip_path) as z:
        z.extractall(work)

    metadata=[]
    for xlsx in work.rglob("*.xlsx"):
        xl=pd.ExcelFile(xlsx)
        wb={"file":str(xlsx.relative_to(work)),"sheets":[]}
        for s in xl.sheet_names:
            df=pd.read_excel(xlsx,sheet_name=s)
            wb["sheets"].append({
                "sheet":s,
                "rows":len(df),
                "columns":list(df.columns)
            })
        metadata.append(wb)

    (output_dir/"metadata.json").write_text(json.dumps(metadata,indent=2,ensure_ascii=False),encoding="utf-8")
    (output_dir/"import_log.json").write_text(json.dumps({
        "workbooks":len(metadata),
        "status":"success"
    },indent=2),encoding="utf-8")
    return metadata

if __name__=="__main__":
    import argparse
    p=argparse.ArgumentParser()
    p.add_argument("zip")
    p.add_argument("--out",default="build")
    args=p.parse_args()
    import_zip(args.zip,args.out)
