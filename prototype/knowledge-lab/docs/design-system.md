# Knowledge Lab Static Design System

Status: Static prototype documentation
Version: 1.0

## Purpose and Relationship to Explorer

The visual language shares CP-MoAKB's restrained paper, botanical, evidence, and
authority palette with Knowledge Explorer. Explorer emphasizes reading,
discovery, and atlas-like context. Lab emphasizes tasks, review, evidence,
decisions, blockers, and audit history through a darker working sidebar and
denser information panels.

## Typography and Localization

The system uses only local operating-system fonts, prioritizing system UI and
Leelawadee UI for Thai. No external font or asset CDN is used. Thai is the initial
language and long Thai content may wrap anywhere when necessary. English remains
appropriate for governed identifiers, lifecycle and review codes, scientific
names, standards, specifications, versions, IRAC, FRAC, HRAC, and BBCH.

## Color and Status

Work, review, warning, and blocked colors support scanning but never carry
meaning alone. Every status includes text, and compact status markers add shape.
Finding classes remain named rather than scored. Operational priority is not
scientific importance, and no progress indicator represents truth quality.

## Layout

The prototype uses sidebar navigation, a role/language toolbar, page heading,
persistent boundary notice, and responsive content grids. Tables receive a
horizontal scrolling container. Comparisons become a single column on mobile.
The static structure remains meaningful in source order.

## Interaction and Accessibility

Interactive targets have a minimum height of 44 pixels. Keyboard focus receives
a visible high-contrast outline. The mobile menu uses `aria-expanded`; role and
language controls have localized labels; conceptual action results use a polite
live region. Reduced-motion preferences remove smooth scrolling and transitions.

## Components

The component page demonstrates Task, Source, Evidence, Claim, Candidate,
Terminology, Relationship, Review, Finding, Decision, Acceptance Gate, Release
Package, Audit Event, Handoff, Version Comparison, Traceability, Authority,
Rights, Conflict, Empty State, and Boundary Notice patterns.

## Boundary

These are static specimens, not a framework, design-token API, component package,
permission system, or production UI. Styling never establishes authority.
