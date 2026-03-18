# CDSFilterBar

Import from `@ciscodesignsystems/cds-react-filter-bar`.

See [README](../../libs/components/react/src/filter-bar/README.md) for full props and usage.

Toolbar with search and collapsible filters. Uses dot notation: `CDSFilterBar.AppliedFilters`.

```tsx
<CDSFilterBar
  searchItems={[
    { label: 'Devices', items: [{ label: 'Router', value: 'router' }] },
  ]}
  results={42}
  showResetButton={true}
  onFiltersResetClick={handleReset}
>
  <CDSSelect placeholder="Status" options={statusOptions} />
  <CDSSelect placeholder="Location" options={locationOptions} />
</CDSFilterBar>

<CDSFilterBar.AppliedFilters
  categories={[
    { id: 'status', label: 'Status', values: ['Active'] },
  ]}
  onRemoveFilter={(catId, val) => {}}
  onClearCategory={(catId) => {}}
/>
```

## Important Rules

- `searchItems` — `[{ label: string, items: [{ label, value }] }]` for search categories.
- Children are filter controls (e.g., `CDSSelect`) that auto-collapse into overflow.
- **No labels on inline controls**: Do NOT pass `label` to `CDSSelect` or other form controls inside `CDSFilterBar`. Labels render above the control and misalign the row with the search input. Use descriptive `placeholder` text instead (e.g., `placeholder="Status"`).
- **Size consistency**: Use the same `size` prop on all child controls within the filter bar to prevent mismatched heights.
- **Always pass `placeholder`** on child `CDSSelect` components — without it, empty selects collapse to minimal height.
- `CDSFilterBar.AppliedFilters` — shows removable filter tags.
