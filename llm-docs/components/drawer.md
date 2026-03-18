# CDSDrawer

Import from `@ciscodesignsystems/cds-react-drawer`.

See [README](../../libs/components/react/src/drawer/README.md) for full props and usage.

Slide-in panel from the right side of the page.

```tsx
<CDSDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} size="md">
  <CDSFlex direction="vertical" gap="md" style={{ padding: 16 }}>
    <CDSHeading size="section">Details</CDSHeading>
    <CDSText>Drawer content here</CDSText>
  </CDSFlex>
</CDSDrawer>
```

- `isOpen` / `onClose` — controlled open state (required).
- `size` — `"sm"` | `"md"` | `"lg"` or number (custom px width).
- `openBelowHeader` — opens below CDSHeader instead of full-height.
- `affectsLayout` — pushes page content instead of overlaying.

## DON'T

- Never set z-index on CDSDrawer — it manages its own z-index.
