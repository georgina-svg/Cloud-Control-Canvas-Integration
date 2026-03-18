# CDSLineChart

Import from `@ciscodesignsystems/cds-react-line-chart`.

See [README](../../libs/components/react/src/data-viz/line-chart/README.md) for full props and usage.

Line chart for time-series and trend data.

```tsx
<CDSLineChart
  data={[
    {
      id: 'Series A',
      color: '#00bceb',
      data: [
        { x: 'Jan', y: 10 },
        { x: 'Feb', y: 25 },
        { x: 'Mar', y: 18 },
      ],
    },
  ]}
  axes={{ xAxis: { legend: 'Month' }, yAxis: { legend: 'Value' } }}
  isInteractive={true}
  enablePoints={true}
  pointSize={6}
  pointColor={{ theme: 'background' }}
  pointBorderWidth={2}
  pointBorderColor={{ from: 'serieColor' }}
  enableCrosshair={true}
  curve="monotoneX"
  width={600}
  height={300}
/>
```

- `data` — array of `{ id, color, data: [{ x, y }] }` series objects.
- Many props like `isInteractive`, `enablePoints`, `pointSize`, `pointColor`, `pointBorderWidth`, `pointBorderColor`, `enableCrosshair`, `curve` are required.
- `fill={true}` for area chart style. `dashed={true}` for dashed lines.
- `fluid={true}` makes it scale to container width.
