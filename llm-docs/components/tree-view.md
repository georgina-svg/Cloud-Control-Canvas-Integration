# CDSTreeView

Import from `@ciscodesignsystems/cds-react-tree-view`.

See [README](../../libs/components/react/src/tree-view/README.md) for full props and usage.

Hierarchical tree list with expand/collapse. Uses a **compound component pattern** with a required `renderTreeItem` prop.

## CRITICAL: `renderTreeItem` is Required

CDSTreeView does NOT automatically render item titles. You **must** pass a `renderTreeItem` function that returns `<CDSTreeView.Item>` compound components. Without it, only expand/collapse chevrons are shown with no text.

```tsx
const items = [
  {
    id: '1',
    title: 'Documents',
    textValue: 'Documents',
    items: [
      { id: '11', title: 'Reports', textValue: 'Reports' },
      { id: '12', title: 'Contracts', textValue: 'Contracts' },
    ],
  },
  { id: '2', title: 'Images', textValue: 'Images' },
];

const renderTreeItem = (item) => (
  <CDSTreeView.Item>
    <CDSTreeView.Item.Title>{item.title}</CDSTreeView.Item.Title>
  </CDSTreeView.Item>
);

<CDSTreeView
  items={items}
  renderTreeItem={renderTreeItem}
  onSelectionChange={handleSelect}
  aria-label="Tree View"
/>;
```

## Important Rules

- **ALWAYS** pass `renderTreeItem` — without it, tree items show only chevrons with no visible text.
- `renderTreeItem` receives each item object and must return `<CDSTreeView.Item>` with content.
- Use `<CDSTreeView.Item.Title>` for the item label text.
- Use `<CDSTreeView.Item.Anchor>` for trailing content (badges, menus, etc.).
- Items are nested objects with `id` (required), `title`, `textValue`, and optional `items` children.
- Optional `count` prop on items for badge counts.
- Supports `selectionMode`: `"none"`, `"single"`, `"multiple"`.

## Sub-Components

| Component                 | Purpose                                                             |
| ------------------------- | ------------------------------------------------------------------- |
| `CDSTreeView`             | Root tree container                                                 |
| `CDSTreeView.Item`        | Wrapper for each tree item's content (returned by `renderTreeItem`) |
| `CDSTreeView.Item.Title`  | Text label for the tree item                                        |
| `CDSTreeView.Item.Anchor` | Trailing slot for badges, menus, or action buttons                  |
| `CDSTreeView.Menu`        | Dropdown menu for tree item actions                                 |
| `CDSTreeView.Menu.Item`   | Individual menu action item                                         |

## Complete Example with Badges

```tsx
const renderTreeItem = (item) => (
  <CDSTreeView.Item>
    <CDSTreeView.Item.Title>{item.title}</CDSTreeView.Item.Title>
    {item.count && (
      <CDSTreeView.Item.Anchor>
        <CDSTag>{item.count}</CDSTag>
      </CDSTreeView.Item.Anchor>
    )}
  </CDSTreeView.Item>
);

<CDSTreeView
  items={items}
  renderTreeItem={renderTreeItem}
  defaultExpandedKeys={['1']}
  selectionMode="single"
  aria-label="File Browser"
/>;
```
