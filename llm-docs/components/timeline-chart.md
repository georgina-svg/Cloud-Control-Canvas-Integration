# CDSTimelineChart

Import from `@ciscodesignsystems/cds-react-timeline-chart`.

See [README](../../libs/components/react/src/data-viz/timeline-chart/README.md) for full props and usage.

Horizontal timeline showing status over time.

```tsx
<CDSTimelineChart
  data={[
    { timestamp: 1700000000000, status: 'healthy', id: 1 },
    { timestamp: 1700003600000, status: 'error', id: 2 },
    { timestamp: 1700007200000, status: 'healthy', id: 3 },
  ]}
  label="Service A"
  width={900}
  height={120}
  isInteractive={true}
/>
```

- `data` — array of `{ timestamp: number, status: string, id: number }`. Timestamps are Unix ms.
- `label` — text label shown to the left of the timeline.
- `compact` — uses default props optimized for small spaces.
