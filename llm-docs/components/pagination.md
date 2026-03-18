# CDSPagination

Import from `@ciscodesignsystems/cds-react-pagination`.

See [README](../../libs/components/react/src/pagination/README.md) for full props and usage.

Uses dot notation: `CDSPagination`, `CDSPagination.Options`, `CDSPagination.Controls`.

```tsx
const [currentPage, setCurrentPage] = useState(1);

<CDSPagination currentPage={currentPage} rows={500}>
  <CDSPagination.Options
    options={[
      { value: '10', label: '10' },
      { value: '20', label: '20' },
    ]}
    totalRows={500}
    onRowsPerPageChange={() => setCurrentPage(1)}
  />
  <CDSPagination.Controls onPageClick={(page) => setCurrentPage(Number(page))} />
</CDSPagination>;
```

- Fully controlled — you must manage `currentPage` state.
- `onPageClick` receives `'first' | 'previous' | 'next' | 'last'` or a page number string.
