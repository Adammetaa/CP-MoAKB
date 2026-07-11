import sqlite3

def create(db):
    sqlite3.connect(db).close()
