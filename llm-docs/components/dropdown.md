# CDSDropdown

Import from `@ciscodesignsystems/cds-react-dropdown`.

See [README](../../libs/components/react/src/dropdown/README.md) for full props and usage.

Button that opens a dropdown menu. Uses dot notation: `CDSDropdown.Item`, `CDSDropdown.Submenu`.

```tsx
<CDSDropdown label="Actions" variant="secondary">
  <CDSDropdown.Item label="Edit" onClick={handleEdit} />
  <CDSDropdown.Item label="Duplicate" onClick={handleDuplicate} />
  <CDSDropdown.Submenu label="More Options">
    <CDSDropdown.Item label="Sub Item 1" />
  </CDSDropdown.Submenu>
  <CDSDropdown.Item label="Delete" destructive onClick={handleDelete} />
</CDSDropdown>
```

- `CDSDropdown.Item` — `label` (required), `icon`, `destructive`, `disabled`, `onClick`.
- `CDSDropdown.Submenu` — wraps nested `CDSDropdown.Item` children.
