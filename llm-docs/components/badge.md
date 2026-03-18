# CDSBadge

Import from `@ciscodesignsystems/cds-react-badge`.

See [README](../../libs/components/react/src/badge/README.md) for full props and usage.

CDSBadge uses dot notation:

- `CDSBadge.Status` — overlays a small status icon on a **target element** (e.g. avatar, icon). Requires `children` (the target) and `status` prop.
- `CDSBadge.Counter` — counter badge with `value={number}`
- `CDSBadge.Dot` — dot indicator that wraps a target element (requires children). Do NOT use CDSBadge.Dot as a standalone color indicator — it's a notification dot overlay on another element.
- `CDSBadge.Notifier` — notification badge overlay with a count, wraps a target element.

## CRITICAL — CDSBadge is an Overlay, Not a Label

All CDSBadge sub-components (`Status`, `Dot`, `Notifier`) are **overlay badges** — they position a small indicator on top of a target element using absolute positioning. They are NOT inline labels or tags.

**Wrong** — using CDSBadge.Status as a status label:

```tsx
<CDSBadge.Status status="warning">
  <div>WARN</div>
</CDSBadge.Status>
```

This renders a floating status icon at an unexpected position and wraps the text in an overlay container.

**Right** — use `CDSTag` for inline status labels:

```tsx
<CDSTag sentiment="warning" size="sm">Warning</CDSTag>
<CDSTag sentiment="negative" size="sm">Critical</CDSTag>
<CDSTag sentiment="positive" size="sm">Healthy</CDSTag>
```

**Right** — use CDSBadge.Status to overlay a status icon on an avatar or icon:

```tsx
<CDSBadge.Status status="positive">
  <CDSIcons name="User" size={32} />
</CDSBadge.Status>
```

## When to Use What

| Need                                        | Component                            |
| ------------------------------------------- | ------------------------------------ |
| Inline status label in a table cell or card | `CDSTag` with `sentiment` prop       |
| Small colored dot on an avatar/icon         | `CDSBadge.Dot`                       |
| Notification count on an icon               | `CDSBadge.Notifier`                  |
| Status icon overlay on an avatar/icon       | `CDSBadge.Status`                    |
| Standalone status icon next to text         | `CDSStatusIcon` (see status-icon.md) |
