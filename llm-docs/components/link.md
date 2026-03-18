# CDSLink

Import from `@ciscodesignsystems/cds-react-link`.

See [README](../../libs/components/react/src/link/README.md) for full props and usage.

Styled anchor link.

```tsx
<CDSLink href="https://example.com" icon={<ArrowSquareOutIcon weight="bold" />}>
  External Link
</CDSLink>
```

- `href` — URL string.
- `size` — `"sm"` | `"md"`.
- `icon` — ReactNode for trailing icon (e.g. ArrowSquareOutIcon for external links).

## DON'T

- Never use plain `<a>` tags — use CDSLink for consistent styling.
