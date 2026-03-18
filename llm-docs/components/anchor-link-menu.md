# CDSAnchorLinkMenu

Import from `@ciscodesignsystems/cds-react-anchor-link-menu`.

See [README](../../libs/components/react/src/anchor-link-menu/README.md) for full props and usage.

A sidebar navigation menu that scrolls-to and highlights sections on a page. Used for long-form content pages.

```tsx
<CDSAnchorLinkMenu
  items={[
    { label: 'Overview', href: '#overview' },
    { label: 'Configuration', href: '#config' },
    { label: 'Security', href: '#security' },
  ]}
/>
```

- Automatically highlights the active section based on scroll position.
- Place it as a sticky sidebar alongside the main content.
