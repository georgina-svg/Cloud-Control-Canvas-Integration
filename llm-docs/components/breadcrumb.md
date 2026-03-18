# CDSBreadcrumb

Import from `@ciscodesignsystems/cds-react-breadcrumb`.

See [README](../../libs/components/react/src/breadcrumb/README.md) for full props and usage.

Uses dot notation: `CDSBreadcrumb` + `CDSBreadcrumb.Link`.

```tsx
<CDSBreadcrumb role="navigation" aria-label="breadcrumb">
  <CDSBreadcrumb.Link href="/home">Home</CDSBreadcrumb.Link>
  <CDSBreadcrumb.Link href="/devices">Devices</CDSBreadcrumb.Link>
  <CDSBreadcrumb.Link href="/devices/123" aria-current="page">
    Device Details
  </CDSBreadcrumb.Link>
</CDSBreadcrumb>
```

- Always add `role="navigation"` and `aria-label="breadcrumb"` on the root.
- Set `aria-current="page"` on the **last** link.
- Separators render automatically.
