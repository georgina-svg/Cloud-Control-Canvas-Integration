# CDSNotification

Import from `@ciscodesignsystems/cds-react-notification`.

See [README](../../libs/components/react/src/notification/README.md) for full props and usage.

Inline notification banners. Uses dot notation: `CDSNotification.Group`, `CDSNotification.Item`.

```tsx
<CDSNotification status="warning" title="Connection unstable">
  Check your network settings.
</CDSNotification>
```

**Grouped notifications:**

```tsx
<CDSNotification product status="info" title="System Updates">
  <CDSNotification.Group>
    <CDSNotification.Item status="warning" title="Warning" onClose={() => {}} />
    <CDSNotification.Item status="negative" title="Error" onClose={() => {}} />
  </CDSNotification.Group>
</CDSNotification>
```

- `status` — `"info"` | `"positive"` | `"warning"` | `"negative"` (required).
- `onClose` — adds dismiss button.
- `product` — product-level banner (collapsible group header).
