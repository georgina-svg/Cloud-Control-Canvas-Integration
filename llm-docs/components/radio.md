# CDSRadio

Import from `@ciscodesignsystems/cds-react-radio`.

See [README](../../libs/components/react/src/radio/README.md) for full props and usage.

Radio button group. Requires an `options` array prop — does NOT use children or dot notation.

```tsx
const options = [
  { key: 'opt1', label: 'Option 1', value: 'option1' },
  { key: 'opt2', label: 'Option 2', value: 'option2' },
  { key: 'opt3', label: 'Option 3', value: 'option3', disabled: true },
];

const [value, setValue] = useState('option1');

<CDSRadio
  name="choice"
  direction="vertical"
  options={options}
  value={value}
  onChange={(e) => setValue(e.target.value)}
  legend="Select an option"
/>;
```

## Props

- `options` (required) — Array of `{ key, label, value, disabled?, description?, children? }`.
- `value` — Currently selected value.
- `onChange` (required) — `ChangeEventHandler<HTMLInputElement>`.
- `name` — Form input name.
- `direction` — `"horizontal"` | `"vertical"` (default `"vertical"`).
- `size` — `"sm"` | `"md"` (default `"md"`).
- `legend` — Label displayed at top of group.
- `disabled` — Disables entire group.

## Important

- **Do NOT use dot notation** (`CDSRadio.Input`) — it does not exist.
- **Do NOT pass radio children** — all options must go through the `options` array prop.
- Each option requires `key`, `label`, and `value`.
