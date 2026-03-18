# CDSTag

Import from `@ciscodesignsystems/cds-react-tag`.

See [README](../../libs/components/react/src/tag/README.md) for full props and usage.

Small label/chip for status indicators or dismissible tags.

```tsx
<CDSTag sentiment="positive" size="sm">Healthy</CDSTag>
<CDSTag onClose={() => handleRemove(id)}>Filter: Active</CDSTag>
```

- `sentiment` — `"positive"` | `"warning"` | `"negative"` | `"info"` | `"neutral"` for status coloring.
- `onClose` — makes the tag dismissible with an X button.
- `icon` — ReactNode for a leading icon.

## CDSTag vs CDSBadge

- **CDSTag** — inline labels, status indicators in tables/cards, filter chips.
- **CDSBadge** — overlay dots/counts on icons or avatars (NOT inline labels).
