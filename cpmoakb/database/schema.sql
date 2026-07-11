
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS organization(
    organization_id TEXT PRIMARY KEY,
    organization_name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS moa_group(
    moa_group_id TEXT PRIMARY KEY,
    group_code TEXT NOT NULL,
    group_name TEXT,
    source_version TEXT
);

CREATE TABLE IF NOT EXISTS chemical_class(
    chemical_class_id TEXT PRIMARY KEY,
    moa_group_id TEXT,
    class_name TEXT,
    FOREIGN KEY(moa_group_id) REFERENCES moa_group(moa_group_id)
);

CREATE TABLE IF NOT EXISTS active_ingredient(
    active_ingredient_id TEXT PRIMARY KEY,
    chemical_class_id TEXT,
    iso_common_name TEXT,
    FOREIGN KEY(chemical_class_id) REFERENCES chemical_class(chemical_class_id)
);
