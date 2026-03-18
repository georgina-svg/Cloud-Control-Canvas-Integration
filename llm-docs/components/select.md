# CDSSelect

Import from `@ciscodesignsystems/cds-react-select`.

See [README](../../libs/components/react/src/select/README.md) for full props and usage.

Dropdown select with search, multi-select, and grouped options.

```tsx
<CDSSelect
  options={[
    { label: 'Option 1', value: '1' },
    { label: 'Option 2', value: '2' },
  ]}
  label="Choose one"
  placeholder="Select..."
/>
```

- `options` — `{ label, value, disabled?, icon? }[]` (required).
- `optionsGroups` — `{ label, options }[]` for grouped options.
- `multiple` — multi-select mode. `searchable` — enable search. `clearable` — show clear button.

## Important Rules

- **ALWAYS** pass `placeholder` — without it, empty selects collapse to minimal height and look broken.
- Never use native `<select>` — use CDSSelect.
- Options use `{ label, value }` objects, NOT `<option>` JSX children.
