# CDSToggle

Import from `@ciscodesignsystems/cds-react-toggle`.

See [README](../../libs/components/react/src/toggle/README.md) for full props and usage.

Switch/toggle control.

```tsx
<CDSToggle checked={enabled} setChecked={setEnabled}>
  <CDSText size="p3">Enable notifications</CDSText>
</CDSToggle>
```

- `checked` / `setChecked` — controlled state. **Uses `setChecked`, NOT `onChange`.**
- `locale` — `{ supplementalText?: string }` for help text below the toggle.
- `children` — label (typically a CDSText element).

## DON'T

- Never use `onChange` — CDSToggle uses `setChecked`, not `onChange`.
