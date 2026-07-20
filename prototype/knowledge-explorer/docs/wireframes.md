# Responsive Wireframes

The same eight core views adapt across desktop, tablet, and mobile. Source is an
additional detail view following the Evidence/Authority pattern.

## Breakpoints

- **Desktop, 1200px and above:** persistent top navigation, 12-column grid,
  two-column detail views, visible contextual rail.
- **Tablet, 768–1199px:** compact navigation, 8-column grid, detail rail moves
  below the primary summary.
- **Mobile, below 768px:** menu disclosure, 4-column grid, single-column cards,
  horizontally scrollable chips, sticky search action.

## Home

```text
Desktop  [Nav] [Search________________] [Explore]
         [Promise 7 cols] [Governance status 5 cols]
         [Featured domains x3] [Statistics x4]
Tablet   [Nav] [Promise] [Search] [Governance] [Domains x2]
Mobile   [Menu] [Promise] [Search] [Governance] [Cards stacked]
```

## Search

```text
Desktop  [Query + recent] [Filters 3 cols | Results 9 cols]
Tablet   [Query] [Filter chips] [Results]
Mobile   [Query + filter button] [Active filters] [Result cards]
```

## Browse

```text
Desktop  [Domain rail 3 cols | hierarchical card grid 9 cols]
Tablet   [Domain trail] [2-column hierarchy]
Mobile   [Scrollable trail] [single-column hierarchy]
```

## Concept

```text
Desktop  [Breadcrumb] [Definition 8 cols | Status/authority 4 cols]
         [Tabs] [Evidence] [Relationships] [References]
Tablet   [Breadcrumb] [Definition] [Status strip] [Tabs] [Cards]
Mobile   [Breadcrumb scroll] [Title/status] [Summary] [Stacked sections]
```

## Evidence

```text
Desktop  [Evidence summary 8 cols | Level/status 4 cols]
         [Claim support] [Source locator] [Limitations]
Tablet   [Summary] [Metadata grid] [Source] [Limits]
Mobile   [Status] [Summary] [Metadata list] [Source link]
```

## Authority

```text
Desktop  [Authority identity 7 cols | Scope card 5 cols]
         [Jurisdiction] [Versions] [Sources] [Related concepts]
Tablet   [Identity] [Scope] [Metadata cards]
Mobile   [Identity] [Scope warning] [Stacked metadata]
```

## Governance

```text
Desktop  [Constitution banner] [KGS/KAS/ADR/RAS cards x2]
Tablet   [Banner] [Cards x2] [Boundary notes]
Mobile   [Banner] [Cards stacked] [Authority-order timeline]
```

## About

```text
Desktop  [Mission 7 cols | 30-second summary 5 cols]
         [Architecture layers] [Roadmap]
Tablet   [Mission] [Summary] [Layers x2]
Mobile   [Mission] [Summary] [Layers stacked] [Roadmap scroll]
```

## Interaction notes

Keyboard focus MUST remain visible. Navigation and filters MUST be reachable
without a pointer. Content order MUST remain meaningful when columns collapse.
No mobile breakpoint may omit evidence, authority, governance, or the prototype
disclaimer.
