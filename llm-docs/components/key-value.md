# CDSKeyValue

Import from `@ciscodesignsystems/cds-react-key-value`.

See [README](../../libs/components/react/src/key-value/README.md) for full props and usage.

Displays key-value pairs.

```tsx
<CDSKeyValue
  pairs={[
    ['Name', 'Jane Doe'],
    ['Email', 'jane@example.com'],
    [
      'Status',
      <CDSTag sentiment="positive" size="sm" key="s">
        Active
      </CDSTag>,
    ],
  ]}
/>
```

- `pairs` — array of `[key, value]` tuples. Both accept strings or ReactNodes.
- `placement` — `'beside'` (default) or `'above'`
- `size` — `'sm' | 'md'`
- Wrap in `CDSContainer` for card-style presentation.
