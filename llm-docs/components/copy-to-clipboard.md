# CDSCopyToClipboard

Import from `@ciscodesignsystems/cds-react-copy-to-clipboard`.

See [README](../../libs/components/react/src/copy-to-clipboard/README.md) for full props and usage.

Two variants:

- `CDSCopyToClipboard` — full field with label, value display, and copy button
- `CDSCopyToClipboardButton` — standalone copy button only

```tsx
<CDSCopyToClipboard label="Email address" value="user@cisco.com" size="md" />
```

**Button only:**

```tsx
<CDSCopyToClipboardButton value="192.168.1.1" />
```
