# General Guidelines

**Library Name**: @ciscodesignsystems/cds-react
**Import Path**: `@ciscodesignsystems/cds-react-<component-name>`

## Core Principles

- Each component MUST be imported from its own scoped package: `import { CDSButton } from '@ciscodesignsystems/cds-react-button'`
- Never import multiple components from a single barrel package like `@ciscodesignsystems/cds-react`
- Never include `import React from 'react'` — this project uses automatic JSX transform, React does not need to be in scope
- Never import from `@ciscodesignsystems/cds-react-cisco-logo` or `@ciscodesignsystems/cds-react-logos` — these packages do NOT exist. CiscoLogo is exported from `@ciscodesignsystems/cds-react-icons`
- Only use components and packages documented in this file. Do not guess that a package exists
- Use CDSFlex with direction="vertical" instead of div with style={{ flexDirection: 'column' }}
- Use CDSFlex gap="sm" or gap="md" instead of pixel spacing values
- Use CSS custom properties (design tokens) for colors like `var(--base-bg-default)`, `var(--positive-text-default)`
- See `icons.md` for the full approved Phosphor icon list and usage rules

## React Rules

- **RANDOM/GENERATED DATA**: Always wrap data created with `Math.random()`, `Date.now()`, or `Array.from()` loops inside a `useState` initializer so it is only generated once:
  - ❌ BAD: `const items = Array.from({ length: 50 }, () => ({ value: Math.random() }));`
  - ✅ GOOD: `const [items] = useState(() => Array.from({ length: 50 }, () => ({ value: Math.random() })));`
  - Generating random data directly in the render body causes infinite re-render loops because new values are produced on every render.
- Never import React hooks (`useState`, `useEffect`, etc.) — they are already in scope in the preview environment. Just use them directly.
- Keep all hook calls at the top level of the render function, never inside conditions or loops.

## Data Consistency

- When a story displays the same dataset in multiple views (e.g. summary cards AND a detail table), define **one shared data array** and derive all figures from it.
- Summary counts, totals, and breakdowns must be computed from the data array (e.g. `data.filter(d => d.status === 'healthy').length`), never hardcoded separately.
- This prevents mismatches like showing 5 rows in a table but 150+ in a summary card.
- Wrap the shared data array in `useState(() => [...])` so it is only generated once (see React Rules above).

## Do's and Don'ts

### DO

- Import each CDS component from its own package: `import { CDSButton } from '@ciscodesignsystems/cds-react-button'`
- Use CDSFlex for layout with direction, gap, grow, wrap props
- Use CDSContainer for main content areas
- Use CDSText with size="p2" or size="p3" for body text
- Use design tokens for colors: var(--base-bg-default), var(--base-text-strong), var(--positive-text-default)
- Use `import type { Meta, StoryObj } from '@storybook/react-vite'` for Storybook types

### DON'T

- Never add `import React from 'react'` — causes unused import lint error
- Never use div with flexDirection style when CDSFlex direction prop exists
- Never add CSS imports in generated story files — CSS is handled by Storybook preview config
- **Never use plain `<div>`, `<span>`, or `<p>` for visible text** — always use `CDSText` or `CDSHeading`. Raw HTML elements bypass the design system's typography tokens and produce inconsistent styling

## Component Naming — Exact Casing

CDS component names use **PascalCase with exact casing**. Common mistakes:

| Wrong                      | Right                      |
| -------------------------- | -------------------------- |
| `CDSTextarea`              | `CDSTextArea`              |
| `CDSTextinput`             | `CDSTextInput`             |
| `CDSCodeblock`             | `CDSCodeBlock`             |
| `CDSEmptystate`            | `CDSEmptyState`            |
| `CDSFilterbar`             | `CDSFilterBar`             |
| `CDSKeyvalue`              | `CDSKeyValue`              |
| `CDSStickybar`             | `CDSStickyBar`             |
| `CDSViewswitcher`          | `CDSViewSwitcher`          |
| `CDSDatetimePicker`        | `CDSDateTimePicker`        |
| `CDSActivitytimeline`      | `CDSActivityTimeline`      |
| `CDSAnchorlinkmenu`        | `CDSAnchorLinkMenu`        |
| `CDSCopyToClipboardButton` | `CDSCopyToClipboardButton` |

Each word boundary is capitalized. When in doubt, check the "Safe Components" list below.

## Error Patterns

**Wrong**: `import React from 'react'`
**Right**: (omit entirely, or `import { useState } from 'react'` if needed)
**Why**: Project uses automatic JSX transform. Unused React import causes lint error.

## Safe Components for Generated Stories

All of these components are safe to use in generated stories:

- CDSHeader, CDSTenantMenuRoot, CDSTenantMenuRow, CDSTenantMenuDivider, CDSHeaderSearch, CDSHeaderBadge, CDSCustomMenuRoot, CDSCustomMenuItem, CDSMenu from '@ciscodesignsystems/cds-react-header'
- CDSNav (with CDSNav.Item, CDSNav.Section, CDSNav.Section.Label, CDSNav.Menu) from '@ciscodesignsystems/cds-react-nav'
- CDSButton from '@ciscodesignsystems/cds-react-button'
- CDSCard from '@ciscodesignsystems/cds-react-card'
- CDSFlex from '@ciscodesignsystems/cds-react-flex'
- CDSHeading from '@ciscodesignsystems/cds-react-heading'
- CDSText from '@ciscodesignsystems/cds-react-text'
- CDSTag from '@ciscodesignsystems/cds-react-tag'
- CDSBadge from '@ciscodesignsystems/cds-react-badge'
- CDSDivider from '@ciscodesignsystems/cds-react-divider'
- CDSLink from '@ciscodesignsystems/cds-react-link'
- CDSContainer from '@ciscodesignsystems/cds-react-container'
- CDSCheckbox from '@ciscodesignsystems/cds-react-checkbox'
- CDSDropdown from '@ciscodesignsystems/cds-react-dropdown'
- CDSNotification from '@ciscodesignsystems/cds-react-notification'
- CDSModal from '@ciscodesignsystems/cds-react-modal'
- CDSToggle from '@ciscodesignsystems/cds-react-toggle'
- CDSTooltip from '@ciscodesignsystems/cds-react-tooltip'
- CDSPopover from '@ciscodesignsystems/cds-react-popover'
- CDSSkeleton from '@ciscodesignsystems/cds-react-skeleton'
- CDSSpinner from '@ciscodesignsystems/cds-react-spinner'
- CDSTextInput from '@ciscodesignsystems/cds-react-text-input'
- CDSTextarea from '@ciscodesignsystems/cds-react-textarea'
- CDSRadio from '@ciscodesignsystems/cds-react-radio'
- CDSSelect from '@ciscodesignsystems/cds-react-select'
- CDSDrawer from '@ciscodesignsystems/cds-react-drawer'
- CDSSlider from '@ciscodesignsystems/cds-react-slider'
- CDSEmptyState from '@ciscodesignsystems/cds-react-empty-state'
- CDSFooter from '@ciscodesignsystems/cds-react-footer'
- CDSTable (with CDSTable.FilterBar) from '@ciscodesignsystems/cds-react-table'
- CDSBadge (with CDSBadge.Status, CDSBadge.Counter) from '@ciscodesignsystems/cds-react-badge'
- CDSSearch (with CDSSearch.Simple) from '@ciscodesignsystems/cds-react-search'
- CiscoLogo and CDSStatusIcon from '@ciscodesignsystems/cds-react-icons'
- Phosphor icons from '@phosphor-icons/react'
