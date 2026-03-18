# CDSTextArea

Import from `@ciscodesignsystems/cds-react-textarea`.

See [README](../../libs/components/react/src/textarea/README.md) for full props and usage.

Multi-line text input with built-in label and validation.

```tsx
<CDSTextArea label="Description" placeholder="Enter description" rows={4} />
```

- `label` — built-in field label.
- `rows` — visible rows. `maxLength` — character limit.
- `invalid` — error state. `contextualHint` — help text.

## DON'T

- Note the casing: `CDSTextArea` (not `CDSTextarea`).
