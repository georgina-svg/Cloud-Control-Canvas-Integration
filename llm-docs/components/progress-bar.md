# CDSProgressBar

Import from `@ciscodesignsystems/cds-react-progress-bar`.

See [README](../../libs/components/react/src/progress-bar/README.md) for full props and usage.

Progress indicator bar.

```tsx
<CDSProgressBar value={65} size="md" sentiment="positive" label="Upload progress" />
<CDSProgressBar indeterminate size="sm" label="Loading..." />
```

- `value` — 0–100 percentage.
- `indeterminate` — animated loading state (no specific progress).
- `sentiment` — `"positive"` | `"warning"` | `"negative"` | `"info"` | `"neutral"`.
