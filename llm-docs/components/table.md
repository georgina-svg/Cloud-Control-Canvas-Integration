# CDSTable

Import from `@ciscodesignsystems/cds-react-table`.

See [README](../../libs/components/react/src/table/README.md) for full props and usage.

Uses TanStack React Table underneath.

```tsx
import type { ColumnDef, SortingState } from '@tanstack/react-table';
import { CDSTable, type CDSTableSelection } from '@ciscodesignsystems/cds-react-table';
```

## Required Props

- `columns: ColumnDef<TData>[]` — TanStack column definitions
- `data: TData[]` — array of data rows

## Pagination

Use `pagination` + `paginationConfig`, NOT `enablePagination` or `initialState`:

```tsx
<CDSTable
  columns={columns}
  data={data}
  pagination={true}
  paginationConfig={{
    pageSize: 10,
    showPageSizeChanger: true,
    pageSizeOptions: [10, 20, 50],
  }}
/>
```

## Sorting

Use sorting state + onSortingChange callback:

```tsx
const [sorting, setSorting] = useState<SortingState>([]);
<CDSTable columns={columns} data={data} sorting={sorting} onSortingChange={setSorting} />;
```

## Filtering

Use CDSTable.FilterBar as a child, NOT a separate CDSSearch outside the table:

```tsx
<CDSTable columns={columns} data={data}>
  <CDSTable.FilterBar showSearch={true} searchPlaceholderText="Search devices..." />
</CDSTable>
```

## Selection

```tsx
const [selectedRows, setSelectedRows] = useState<CDSTableSelection>({});
<CDSTable
  columns={columns}
  data={data}
  rowSelection={selectedRows}
  onRowSelectionChange={setSelectedRows}
/>;
```

## Other Props

- `density="compact" | "condensed" | "comfy" | "spacious"` (default: "compact")
- `sticky={boolean}` — sticky headers
- `enableColumnResizing={boolean}`
- `columnResizeMode="onChange" | "onEnd"`
- `enableColumnsDisplaySettings={boolean}` — column visibility drawer
- `enableColumnPinning={boolean}`
- `enableExpanding={boolean}` + `rowExpansionConfig`
- `enableReorderRows={boolean}` + `onReorderRow`
- `loading={boolean}` — skeleton loading state
- `onRowClick={(event, row) => void}`
- `emptyStateMessage="No matches found"` or `emptyState={<ReactNode />}`

## Column Definition Pattern

```tsx
const columns: ColumnDef<MyData>[] = [
  {
    id: 'name',
    header: 'Device Name',
    accessorKey: 'name',
    enableSorting: true, // per-column sorting (enableSorting is a COLUMN prop, not a table prop)
    cell: (info) => <CDSText size="p3">{info.getValue()}</CDSText>,
    meta: {
      align: 'left',
      isHighlightable: true,
    },
  },
];
```

## paginationConfig Details

- Use `pageSize` (NOT `initialPageSize`) for the number of rows per page
- `showPageSizeChanger` is required (boolean)
- `pageSizeOptions` is optional (number array)

## CDSTable.FilterBar Props

- Use `searchPlaceholderText` (NOT `placeholder`) for search input placeholder text
- `showSearch` defaults to `true` — no need to set explicitly

## CDSTable Does NOT Have These Props

- ~~`enableSorting`~~ (table-level) — use `sorting` + `onSortingChange`. `enableSorting` is a per-column ColumnDef property
- ~~`enablePagination`~~ — use `pagination={true}` + `paginationConfig={...}`
- ~~`initialState`~~ — use the specific props directly (`sorting`, `pagination`, `paginationConfig`)
- ~~`enableFiltering`~~ — use `<CDSTable.FilterBar>` as a child component
