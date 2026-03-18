# CDSNumeral

Import from `@ciscodesignsystems/cds-react-numeral`.

See [README](../../libs/components/react/src/numeral/README.md) for full props and usage.

Large statistic/KPI display with label, value, and optional trend.

```tsx
<CDSNumeral value={1234} label="Total Devices" size="lg" />
<CDSNumeral value={95.2} label="Uptime %" trend="up" trendValue="+2.1%" sentiment="positive" />
```

- `value` — number (required).
- `label` — descriptive text.
- `trend` — `"up"` | `"down"` | `"neutral"` with arrow icon.
- `sentiment` — `"positive"` | `"negative"` | `"warning"` | `"neutral"`.
