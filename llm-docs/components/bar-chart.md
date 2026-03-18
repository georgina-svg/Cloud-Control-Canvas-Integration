# CDSBarChart

Import from `@ciscodesignsystems/cds-react-bar-chart`.

See [README](../../libs/components/react/src/data-viz/bar-chart/README.md) for full props and usage.

Bar chart for categorical comparisons.

```tsx
<CDSBarChart
  data={[
    { category: 'A', value1: 30, value2: 20 },
    { category: 'B', value1: 45, value2: 35 },
  ]}
  keys={['value1', 'value2']}
  indexBy="category"
  width={500}
  height={300}
  groupMode="grouped"
/>
```

- `data` — array of objects with a shared index key and numeric value keys.
- `keys` — which keys in data objects to render as bars.
- `indexBy` — the key used as the category axis label.
- `groupMode` — `"stacked"` (default) or `"grouped"`.
- `layout` — `"vertical"` (default) or `"horizontal"`.
