# CDSPopover

Import from `@ciscodesignsystems/cds-react-popover`.

See [README](../../libs/components/react/src/popover/README.md) for full props and usage.

Floating content panel anchored to a trigger element.

```tsx
<CDSPopover
  title={<CDSText>Popover content here</CDSText>}
  open={open}
  setOpen={setOpen}
  placement="bottom">
  <CDSButton onClick={() => setOpen(!open)}>Toggle</CDSButton>
</CDSPopover>
```

- `title` — ReactNode. This is the **content** prop (despite the name), not a string tooltip.
- `open` / `setOpen` — controlled open state.
- `placement` — `"top"` | `"bottom"` | `"left"` | `"right"` and variants.

## DON'T

- Never set z-index on CDSPopover — it manages its own z-index.
- For simple text hints on hover, use CDSTooltip instead.
