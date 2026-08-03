# Publication and Representation Graph

Status: Active

## Purpose

Separate accepted Asset meaning, Package selection, publication authorization,
publication history, and audience representation.

```mermaid
flowchart LR
    A["Accepted Asset Version"] -->|selected by| M["Package Membership Object"]
    M -->|exact Package Version enters gate| PA["Publication Authorization"]
    PA -->|recorded by| PR["Publication Record Object"]
    A -->|expressed by exact-version| R["Representation Object"]
    PR -->|authorizes declared public view| R
```

Publication Authorization is a competent governance decision referenced by the
Publication Record; it is not inferred from membership or acceptance. A
Representation MUST NOT create a new Asset, and public reachability MUST NOT
substitute for a Publication Record.

This graph defines no deployment, tag, release, package upload, or delivery code.
