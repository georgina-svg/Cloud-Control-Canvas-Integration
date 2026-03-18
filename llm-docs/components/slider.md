# CDSSlider

Import from `@ciscodesignsystems/cds-react-slider`.

See [README](../../libs/components/react/src/slider/README.md) for full props and usage.

Range slider control.

```tsx
<CDSSlider label="Volume" min={0} max={100} value={value} onChange={setValue} />
```

- `min` / `max` / `step` — range bounds and increment.
- `value` / `onChange` — controlled state. `onChange` is `(value: number) => void`.
