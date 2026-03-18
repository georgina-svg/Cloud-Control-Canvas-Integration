# CDSLegend

Import from `@ciscodesignsystems/cds-react-legend`.

See [README](../../libs/components/react/src/data-viz/legend/README.md) for full props and usage.

Legend for charts. Supports dot notation: `CDSLegend.Item`, `CDSLegend.Marker`.

```tsx
<CDSLegend
  direction="horizontal"
  kind="solid"
  items={[
    { label: 'Series A', color: '#00bceb' },
    { label: 'Series B', color: '#6ebe4a' },
  ]}
/>
```

- `direction` — `"horizontal"` or `"vertical"`.
- `kind` — `"solid"`, `"dashed"`, or `"square"`.
- `items` — array of `{ label: string, color: string }`.
- Can also compose with `CDSLegend.Item` children for custom rendering.
