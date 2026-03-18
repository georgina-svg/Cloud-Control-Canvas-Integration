# CDSCollapse

Import from `@ciscodesignsystems/cds-react-collapse`.

See [README](../../libs/components/react/src/collapse/README.md) for full props and usage.

Uses dot notation: `CDSCollapse`, `CDSCollapse.Heading`, `CDSCollapse.Panel`, `CDSCollapse.Group`.

```tsx
<CDSCollapse.Group>
  <CDSCollapse kind="stacked" size="md">
    <CDSCollapse.Heading>Section 1</CDSCollapse.Heading>
    <CDSCollapse.Panel>Content here</CDSCollapse.Panel>
  </CDSCollapse>
  <CDSCollapse kind="stacked" size="md">
    <CDSCollapse.Heading>Section 2</CDSCollapse.Heading>
    <CDSCollapse.Panel>More content</CDSCollapse.Panel>
  </CDSCollapse>
</CDSCollapse.Group>
```

- `kind`: `'stacked' | 'contained' | 'borderless' | 'unstyled'`
- Use `CDSCollapse.Group` to wrap multiple stacked items.
- For accordion (one open at a time), use controlled `open` + `onChange` props.
