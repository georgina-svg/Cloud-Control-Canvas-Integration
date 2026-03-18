# C3+Canvas — AI Guidelines

This document describes the **C3+Canvas** (AI Assistant prototype) project and, when using CDS, the **Cisco Magnetic Common Design System** (`@ciscodesignsystems/cds-react-*`). Read this file before generating or modifying any UI code.

---

## Project overview

- **Stack**: React 18, TypeScript, Vite, React Router. Plain CSS (no Tailwind); design tokens in `src/index.css` (Magnetic-inspired: `--base-bg-*`, `--spacing-*`, etc.).
- **Layout**: `Layout` wraps all routes; `Header` + optional `ModeSwitcher`; main content via `<Outlet />`. Header height 56px; main has `paddingTop: 56`, `minHeight: calc(100vh - 56px)`.
- **Routes** (all under `Layout`):
  - `/` — Home
  - `/agent-studio` — Agent Studio (chat panel can dock on send)
  - `/agent-studio/chat` — Agent Studio chat
  - `/intersight` — Intersight (Canvas + Assistant entry in header)
  - `/actions` — Actions
  - `/canvas` — Canvas
  - `/canvas/open` — Open Canvas (board with pan/zoom, draggable sticky notes and draggable board cards, assistant panel)
- **Key files**: `src/App.tsx` (routes), `src/components/Layout.tsx`, `src/components/Header.tsx`, `src/pages/OpenCanvasPage.tsx` (canvas board, cards, stickies), `src/pages/AgentStudioPage.tsx`, `src/index.css` (tokens + component styles).
- **Conventions**: Use design tokens for colors/spacing; no raw hex for UI chrome. No `import React from 'react'` (use JSX transform); use named hooks when needed.

---

## CDS component docs (when using Magnetic Design System)

All component references, props, usage examples, and DO/DON'T rules live here:

- **Components**: `llm-docs/components/<component-name>.md`
- **Layout patterns**: `llm-docs/patterns/`
- **General rules**: `llm-docs/guidelines/general.md`
- **Icons**: `llm-docs/guidelines/icons.md`
- **Z-index**: `llm-docs/guidelines/z-index.md`

Always read the relevant doc before using a component. Do not guess prop names.

---

## Core rules (never violate these)

### Imports
- Each component comes from its **own scoped package**: `import { CDSButton } from '@ciscodesignsystems/cds-react-button'`
- **Never** import from a barrel like `@ciscodesignsystems/cds-react`
- `CiscoLogo` and `CDSStatusIcon` come from `@ciscodesignsystems/cds-react-icons` — there is no separate `cds-react-logos` or `cds-react-cisco-logo` package
- `CDSMenu` (header dropdown) comes from `@ciscodesignsystems/cds-react-header`, not `cds-react-menu`

### React
- **Never** write `import React from 'react'` — this project uses the automatic JSX transform
- Do write `import { useState, useEffect } from 'react'` when hooks are needed
- Wrap `Math.random()` / `Date.now()` / generated arrays in `useState(() => ...)` to avoid infinite re-renders

### HTML elements
- **Never** use `<div>`, `<span>`, or `<p>` for visible text — use `CDSText` or `CDSHeading`
- **Never** use raw `<div style={{ flexDirection: 'column' }}>` — use `<CDSFlex direction="vertical">`
- **Never** use `<input>` — use `CDSTextInput`

### Colors
- Use CSS custom properties (design tokens) for all colors: `var(--base-bg-default)`, `var(--positive-text-default)`, etc.
- Never hardcode hex/rgb colors for UI chrome

---

## CSS setup

Component styles require **explicit CSS imports** — they are not auto-injected. Any new CDS package you install must have its `index.css` added to `src/index.css`.

Pattern:
```css
@import '@ciscodesignsystems/cds-react-<package-name>/index.css';
```

Currently imported in `src/index.css`:
- `cds-magnetic-theme-web` + `cds-magnetic-blue-theme-web` — design tokens (must come first)
- `cds-react-header`, `cds-react-nav`, `cds-react-card`, `cds-react-flex`
- `cds-react-footer`, `cds-react-heading`, `cds-react-icons`, `cds-react-line-chart`
- `cds-react-tab`, `cds-react-table`, `cds-react-tag`, `cds-react-text`, `cds-react-button`
- `cds-react-badge`, `cds-react-divider`, `cds-react-link`, `cds-react-container`
- `cds-react-text-input`, `cds-react-search`, `cds-react-pagination`, `cds-react-select`
- `cds-react-checkbox`, `cds-react-filter-bar`, `cds-react-menu`

If a component looks unstyled, its `index.css` is missing from `src/index.css`.

---

## Vite config note

`vite.config.ts` includes `resolve: { dedupe: ['react', 'react-dom'] }`. This is required — `cds-react-line-chart` pulls in `@nivo` which ships a nested `react-dom`. Without deduplication, React throws a `ReactCurrentDispatcher` error and the app renders blank.

---

## App shell layout

The standard Magnetic app shell (see `llm-docs/patterns/app-layout.md`):

```tsx
<CDSThemeProvider theme="light" brand="magnetic">
  {/* Header must be in normal flow — NOT position:fixed */}
  <div style={{ position: 'relative', zIndex: 200 }}>
    <CDSHeader sentiment="inverse" title="App Name" logo={<CiscoLogo size="sm" />}>
      {/* toolbar items as children */}
    </CDSHeader>
  </div>

  {/* CSS Grid for nav + content — NOT flexbox */}
  <div style={{ display: 'grid', gridTemplateColumns: 'min-content 1fr' }}>
    <CDSNav
      isCollapsed={isCollapsed}
      setCollapsed={setIsCollapsed}
      style={{ position: 'sticky', top: '56px', height: 'calc(100vh - 56px)', overflowY: 'auto' }}
    >
      {/* nav items */}
    </CDSNav>

    <CDSFlex direction="vertical" gap={24} margin={24}>
      {/* page content */}
      <CDSFooter brandName="Cisco Systems, Inc." />
    </CDSFlex>
  </div>
</CDSThemeProvider>
```

Key rules:
- `CDSHeader`: always `sentiment="inverse"`, wrap in `zIndex: 200` div
- `CDSNav`: `position: sticky`, `top: 56px`, `height: calc(100vh - 56px)` — never `position: fixed`
- Nav + content split: CSS Grid `min-content 1fr` — never flexbox
- `CDSFooter` goes **inside** the content `CDSFlex`, not outside the grid
- `isCollapsed` must be `useState` — never a static value

---

## Theme switcher

`CDSThemeProvider` accepts:
- `theme`: `'light' | 'dark' | 'classic-light' | 'classic-dark'`
- `brand`: `'magnetic' | 'magnetic-blue'`

The settings gear menu in the header is wired to switch themes at runtime (see `src/App.tsx`).

---

## Component naming — exact casing

| Wrong | Right |
|-------|-------|
| `CDSTextarea` | `CDSTextArea` |
| `CDSTextinput` | `CDSTextInput` |
| `CDSCodeblock` | `CDSCodeBlock` |
| `CDSEmptystate` | `CDSEmptyState` |
| `CDSFilterbar` | `CDSFilterBar` |

---

## Adding a new page / feature

1. Read `llm-docs/patterns/page-templates.md` for the right page template (Dashboard, List, Left Column, Form).
2. Read the relevant component docs in `llm-docs/components/`.
3. Add any new packages: `npm install @ciscodesignsystems/cds-react-<name>` and add its `index.css` to `src/index.css`.
4. Follow the layout structure from `llm-docs/patterns/app-layout.md`.
5. Use `CDSFlex` for all layout — never raw divs with flex styles.
6. Use design tokens (`var(--...)`) for colors — never hardcoded hex values.
