
from pathlib import Path
import pandas as pd

TYPE_MAP={
    "TEXT":"TEXT",
    "INTEGER":"INTEGER",
    "INT":"INTEGER",
    "DATE":"TEXT",
    "DATETIME":"TEXT",
    "REAL":"REAL",
    "FLOAT":"REAL"
}

def sql_type(dtype,length):
    if not dtype:
        return "TEXT"
    return TYPE_MAP.get(str(dtype).strip().upper(),"TEXT")

def generate_schema(data_dictionary, output="schema.sql"):
    df=pd.read_excel(data_dictionary, sheet_name="Fields")
    tables=[]
    for t,grp in df.groupby("Table_Name"):
        lines=[f'CREATE TABLE IF NOT EXISTS "{t}" (']
        cols=[]
        pk=[]
        for _,r in grp.sort_values("Field_Order").iterrows():
            name=str(r["Field_Name"]).strip()
            dtype=sql_type(r.get("Data_Type","TEXT"),r.get("Length"))
            nullable="" if str(r.get("Nullable","Y")).upper()=="Y" else " NOT NULL"
            cols.append(f'  "{name}" {dtype}{nullable}')
            if str(r.get("PK","")).upper()=="Y":
                pk.append(name)
        if pk:
            cols.append("  PRIMARY KEY ("+", ".join(f'\"{x}\"' for x in pk)+")")
        lines.append(",\n".join(cols))
        lines.append(");\n")
        tables.append("\n".join(lines))
    Path(output).write_text("\n".join(tables),encoding="utf-8")
    print(f"Generated {output}")

if __name__=="__main__":
    import argparse
    p=argparse.ArgumentParser()
    p.add_argument("dictionary")
    p.add_argument("--out",default="schema.sql")
    a=p.parse_args()
    generate_schema(a.dictionary,a.out)
