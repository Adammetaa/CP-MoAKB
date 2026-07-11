
from pathlib import Path
import sqlite3

def build_database(db_path="CP-MoAKB.db", schema_path="cpmoakb/database/schema.sql"):
    conn=sqlite3.connect(db_path)
    with open(schema_path,"r",encoding="utf-8") as f:
        conn.executescript(f.read())
    conn.commit()
    conn.close()
    print(f"Created {db_path}")

if __name__=="__main__":
    build_database()
