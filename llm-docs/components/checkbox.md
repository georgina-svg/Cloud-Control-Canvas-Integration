# CDSCheckbox

Import from `@ciscodesignsystems/cds-react-checkbox`.

See [README](../../libs/components/react/src/checkbox/README.md) for full props and usage.

Checkbox control with optional label.

```tsx
<CDSCheckbox id="agree" checked={checked} onChange={(e) => setChecked(e.target.checked)}>
  I agree to the terms
</CDSCheckbox>
```

- `checked` / `onChange` — controlled state.
- `indeterminate` — partial selection state.
- `children` — label text (optional, renders beside checkbox).
- `id` — required for accessibility.
