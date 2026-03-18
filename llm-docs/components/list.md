# CDSList

Import from `@ciscodesignsystems/cds-react-list`.

See [README](../../libs/components/react/src/list/README.md) for full props and usage.

Uses dot notation: `CDSList.Unordered`, `CDSList.Ordered`, `CDSList.Item`.

```tsx
<CDSList.Unordered spacing="spacious" size="p3" leadIn="Requirements:">
  <CDSList.Item>First item</CDSList.Item>
  <CDSList.Item>Second item</CDSList.Item>
</CDSList.Unordered>
```

- `spacing` — `'compact' | 'spacious'`
- `size` — text size (`'p1'` through `'p4'`, `'xxs'`, `'xs'`, `'sm'`)
- `leadIn` — introductory text above the list
- Nesting supported: place a list inside a `CDSList.Item`.
