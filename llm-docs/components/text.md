# CDSText

Import from `@ciscodesignsystems/cds-react-text`.

See [README](../../libs/components/react/src/text/README.md) for full props and usage.

Text component for paragraphs and inline text.

```tsx
<CDSText size="p3" weight="semi-bold">Label text</CDSText>
<CDSText size="xxs" color="light">Secondary info</CDSText>
```

- `size` — `"p1"` | `"p2"` | `"p3"` | `"p4"` or `"xxxs"` | `"xxs"` | `"xs"` | `"sm"` | `"md"` | `"lg"` | `"xl"`.
- `weight` — `"regular"` | `"semi-bold"` | `"bold"`.
- `ellipsis` — truncates with ellipsis. Use with `width` for fixed-width truncation.
- `as` — polymorphic element type (e.g. `"span"`, `"p"`, `"label"`).

## DON'T

- Never use plain `<div>`, `<span>`, or `<p>` for visible text — always use CDSText or CDSHeading.
