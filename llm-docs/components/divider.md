# CDSDivider

Import from `@ciscodesignsystems/cds-react-divider`.

See [README](../../libs/components/react/src/divider/README.md) for full props and usage.

Horizontal or vertical separator line.

```tsx
<CDSDivider />
<CDSDivider direction="vertical" />
```

- `direction` — `"horizontal"` (default) | `"vertical"`.
- `prominence` — `"default"` | `"strong"`.
- Always add `aria-hidden="true"` since dividers are decorative.

## DON'T

- Never put CDSDivider inside CDSNav — nav sections have built-in separation.
