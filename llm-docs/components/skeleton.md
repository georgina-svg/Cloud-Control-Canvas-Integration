# CDSSkeleton

Import from `@ciscodesignsystems/cds-react-skeleton`.

See [README](../../libs/components/react/src/skeleton/README.md) for full props and usage.

Loading placeholder that mimics content layout.

- `height` — `'sm' | 'md' | 'lg'` or number (px)
- `lines` — number of lines (default: 1)
- `oblique` — boolean, vary line widths
- `shade` — `'regular' | 'dark'` (use `'dark'` for title placeholders)
- Width via `style={{ width: '...' }}`

```tsx
<CDSSkeleton height="lg" shade="dark" style={{ width: '50%' }} />
<CDSSkeleton height="sm" lines={4} oblique />
```
