# CDSTooltip

Import from `@ciscodesignsystems/cds-react-tooltip`.

See [README](../../libs/components/react/src/tooltip/README.md) for full props and usage.

Text hint shown on hover/focus of a trigger element.

```tsx
<CDSTooltip title="More information">
  <InfoIcon size={20} weight="bold" />
</CDSTooltip>
```

- `title` — string (required). Tooltip text.
- `placement` — `"top"` | `"bottom"` | `"left"` | `"right"`.

## DON'T

- Never set z-index on CDSTooltip — it manages its own z-index.
- For rich content, use CDSPopover instead.
