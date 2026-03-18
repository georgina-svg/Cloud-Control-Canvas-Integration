# CDSHeatMapChart

Import from `@ciscodesignsystems/cds-react-heat-map-chart`.

See [README](../../libs/components/react/src/data-viz/heat-map-chart/README.md) for full props and usage.

Grid-based heat map for two-dimensional data.

```tsx
<CDSHeatMapChart
  data={[
    {
      id: 'Row A',
      data: [
        { x: 'Col 1', y: 10 },
        { x: 'Col 2', y: 25 },
      ],
    },
    {
      id: 'Row B',
      data: [
        { x: 'Col 1', y: 5 },
        { x: 'Col 2', y: 40 },
      ],
    },
  ]}
  width={600}
  height={300}
  colors={{ type: 'sequential', colors: ['#e8f5e9', '#1b5e20'], steps: 5 }}
/>
```

- `data` — array of `{ id: string, data: [{ x: string|number, y: number }] }` row objects.
- `colors` — `{ type: 'quantize'|'sequential'|'diverging', colors: string[], steps: number }`.
- `cellComponent` — `"rect"` (default) or `"circle"`.
