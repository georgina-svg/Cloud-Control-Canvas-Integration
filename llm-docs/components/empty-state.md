# CDSEmptyState

Import from `@ciscodesignsystems/cds-react-empty-state`.

See [README](../../libs/components/react/src/empty-state/README.md) for full props and usage.

Uses dot notation: `CDSEmptyState`, `CDSEmptyState.Illustration`, `CDSEmptyState.Title`, `CDSEmptyState.Message`.

```tsx
<CDSCard>
  <CDSEmptyState>
    <CDSEmptyState.Illustration aria-labelledby="empty-msg" />
    <div style={{ textAlign: 'center' }}>
      <CDSEmptyState.Title>No results found</CDSEmptyState.Title>
      <CDSEmptyState.Message id="empty-msg">Try adjusting your filters.</CDSEmptyState.Message>
      <CDSButton>Clear Filters</CDSButton>
    </div>
  </CDSEmptyState>
</CDSCard>
```

- `CDSEmptyState.Message` is the only required sub-component.
- Typically placed inside a `CDSCard` or container.
