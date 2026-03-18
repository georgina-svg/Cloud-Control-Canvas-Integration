# CDSPieChart / CDSHealthChart

Import from `@ciscodesignsystems/cds-react-pie-chart`.

See [README](../../libs/components/react/src/data-viz/pie-chart/README.md) for full props and usage.

Pie/donut chart and health (progress donut) chart.

```tsx
<CDSPieChart
  data={[
    { id: 'Category A', value: 40 },
    { id: 'Category B', value: 35 },
    { id: 'Category C', value: 25 },
  ]}
  width={300}
  height={300}
  donut={true}
/>
```

```tsx
<CDSHealthChart progress={75} showCentricLabel={true} />
```

- `data` — array of `{ id: string, value: number, label?: string }`.
- `donut={true}` for donut style (sets innerRadius).
- `CDSHealthChart` is a simpler donut showing a single `progress` percentage (0–100).
