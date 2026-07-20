# Visual Design System

## Direction

The interface combines the calm confidence of a scientific atlas with the
precision of modern developer tools. Warm paper surfaces, deep ink, botanical
green, and evidence blue make governance legible without looking bureaucratic.

## Typography

- Display: Georgia with system serif fallback, used for platform and concept
  titles.
- Interface and body: Inter-compatible system sans stack.
- Data labels: compact uppercase sans with increased tracking.
- Base size: 16px; body line height: 1.65; display scale: 48/40/32/24px.

## Spacing and grid

- Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64, 96px.
- Desktop grid: 12 columns, 24px gutters, 1200px maximum content width.
- Tablet grid: 8 columns, 20px gutters.
- Mobile grid: 4 columns, 16px gutters.
- Cards use 18–24px internal padding and 16–20px corner radii.

## Color tokens

| Token | Value | Use |
| --- | --- | --- |
| Ink | `#13251d` | Primary text and dark surfaces |
| Paper | `#f6f4ed` | Page background |
| Surface | `#fffdf8` | Cards and fields |
| Botanical | `#1d6b4f` | Primary action and knowledge identity |
| Botanical light | `#dcece4` | Selected states |
| Evidence | `#315f89` | Evidence tags and links |
| Authority | `#75572a` | Authority tags |
| Lifecycle | `#715a8b` | Lifecycle tags |
| Warning | `#9a4d2e` | Boundary and unresolved status |
| Rule | `#d8d9cf` | Dividers and borders |

Color is never the sole status signal; every status includes text.

## Components

- **Search Box:** large labeled field with keyboard hint and explicit submit.
- **Concept Card:** title, type, placeholder status, short definition, typed link.
- **Evidence Card:** level, support relationship, source, limitations.
- **Authority Card:** authority name, scope, jurisdiction, version context.
- **Knowledge Badge:** botanical label for governed knowledge type.
- **Lifecycle Badge:** explicit state with icon-free text.
- **Relationship Chip:** predicate plus target; never an unlabeled arrow.
- **Source Card:** source identity, publication, checksum, evidence backlinks.
- **Breadcrumb:** ordered, scrollable location trail.
- **Graph Card:** accessible relationship list presented with CSS nodes and
  equivalent text; no claim of graph Runtime capability.

## Buttons and states

Primary buttons use botanical fill; secondary buttons use surface fill and ink
border; tertiary actions are underlined text. Hover, focus, active, and disabled
states preserve at least a 3:1 component contrast. Focus uses a 3px evidence-blue
outline with 3px offset.

## Tags

Knowledge, evidence, authority, lifecycle, and relationship tags use distinct
labels, border styles, and color families. Placeholder status always appears
first when mock content could otherwise look authoritative.

## Motion and accessibility

Transitions are limited to 160–220ms opacity, color, and transform changes.
Reduced-motion preference removes transforms. Touch targets are at least 44px.
Semantic landmarks, headings, labels, current-page state, and live result counts
support assistive technology.
