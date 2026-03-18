# CDSTransfer

Import from `@ciscodesignsystems/cds-react-transfer`.

See [README](../../libs/components/react/src/transfer/README.md) for full props and usage.

Dual-list transfer component for moving items between source and target lists.

## CRITICAL: Always use `useTransferList` hook

**Do NOT manually manage transfer state with arrays.** The `sourceKeys` and `targetKeys` props are `Set<string>` (not arrays). The `sourceData` and `targetData` props are `Map<string, string>`. Always use the `useTransferList` hook which handles all state correctly:

```tsx
const initialData = new Map([
  ['key1', 'Option 1'],
  ['key2', 'Option 2'],
  ['key3', 'Option 3'],
]);

const { onKeysChange, onTransfer, sourceData, sourceKeys, targetData, targetKeys } =
  useTransferList({ initialSourceData: initialData });

<CDSTransfer
  initialData={initialData}
  onKeysChange={onKeysChange}
  onTransfer={onTransfer}
  sourceData={sourceData}
  sourceKeys={sourceKeys}
  targetData={targetData}
  targetKeys={targetKeys}
/>;
```

## Important Rules

- **ALWAYS** use `useTransferList` hook — never manually create `sourceKeys`/`targetKeys` state.
- `sourceKeys` and `targetKeys` are **`Set<string>`** — NOT arrays. Using arrays will cause `keys.has is not a function` errors.
- `sourceData` and `targetData` are **`Map<string, string>`** — NOT arrays or objects.
- `initialSourceData` must be a `Map<string, string>`.
- `useTransferList` is imported from the same package: `import { CDSTransfer, useTransferList } from '@ciscodesignsystems/cds-react-transfer'`.
- For lists under 15 options, consider `CDSSelect` with `multiple` instead.

## Props

| Prop           | Type                             | Required |
| -------------- | -------------------------------- | -------- |
| `initialData`  | `Map<string, string>`            | Yes      |
| `sourceData`   | `Map<string, string>`            | Yes      |
| `targetData`   | `Map<string, string>`            | Yes      |
| `sourceKeys`   | `Set<string>`                    | Yes      |
| `targetKeys`   | `Set<string>`                    | Yes      |
| `onTransfer`   | `(direction, movedKeys) => void` | Yes      |
| `onKeysChange` | `(listType, keys) => void`       | Yes      |
| `sourceTitle`  | `string`                         | No       |
| `targetTitle`  | `string`                         | No       |
