# CDSMenuRoot (Context Menu)

Import from `@ciscodesignsystems/cds-react-menu`.

**Not to be confused with** `CDSMenu` from `cds-react-header` (header navigation menus) or `CDSDropdown` (button dropdown menus).

See [README](../../libs/components/react/src/menu/README.md) for full props and usage.

Exports: `CDSMenuRoot`, `CDSMenuTrigger`, `CDSMenuContent`, `CDSMenuItem`, `CDSSubMenuRoot`, `CDSSubMenuTrigger`, `CDSSubMenuContent`.

```tsx
<CDSMenuRoot>
  <CDSMenuTrigger>
    <CDSButton variant="secondary">Right-click or click</CDSButton>
  </CDSMenuTrigger>
  <CDSMenuContent>
    <CDSMenuItem onSelect={() => {}}>Edit</CDSMenuItem>
    <CDSMenuItem onSelect={() => {}}>Duplicate</CDSMenuItem>
    <CDSMenuItem onSelect={() => {}} destructive>
      Delete
    </CDSMenuItem>
  </CDSMenuContent>
</CDSMenuRoot>
```

## DON'T

- Never import `CDSMenu` from `cds-react-menu` — that export doesn't exist here. `CDSMenu` is from `cds-react-header`.
- For simple button dropdowns, prefer `CDSDropdown` over `CDSMenuRoot`.
