# CDSHeading

Import from `@ciscodesignsystems/cds-react-heading`.

See [README](../../libs/components/react/src/heading/README.md) for full props and usage.

## DO

- Use CDSHeading with size prop only. Valid sizes: "primary" (h1), "section" (h2), "sub-section" (h3), "smallest" (h4), "xxs", "xs", "sm", "md", "lg", "xl". CDSHeading has NO level prop

## DON'T

- Never use CDSHeading level={1} or level={2} — CDSHeading has no level prop, use size="primary" for h1, size="section" for h2, size="sub-section" for h3
- Never use CDSHeading size="page" — "page" is not a valid size

## Spacing / Margin

CDSHeading has a `margin` prop (default `0`) — use it to control spacing below headings instead of wrapper divs or CSS.

- `margin={0}` — no margin (default). Use when the parent container's `gap` handles spacing.
- `margin={[0, 0, 8, 0]}` — 8px bottom margin. Good for tight spacing before body text.
- `margin={[0, 0, 16, 0]}` — 16px bottom margin. Good for section headings.
- Object syntax: `margin={{ bottom: 8 }}`

**CRITICAL**: When a CDSHeading is inside a `CDSFlex` with `gap`, do NOT add extra margin — the flex gap already provides spacing. Only use `margin` when the heading is NOT inside a flex container, or when you need asymmetric spacing.

```tsx
// WRONG — double spacing (gap + margin)
<CDSFlex direction="vertical" gap="md">
  <CDSHeading size="section" margin={[0, 0, 16, 0]}>Title</CDSHeading>
  <CDSText>Body</CDSText>
</CDSFlex>

// RIGHT — let flex gap handle spacing
<CDSFlex direction="vertical" gap="sm">
  <CDSHeading size="section">Title</CDSHeading>
  <CDSText>Body</CDSText>
</CDSFlex>

// RIGHT — margin when not in flex
<div>
  <CDSHeading size="section" margin={{ bottom: 8 }}>Title</CDSHeading>
  <CDSText>Body</CDSText>
</div>
```

## Error Patterns

**Wrong**: `<CDSHeading level={1} size="page">Title</CDSHeading>`
**Right**: `<CDSHeading size="primary">Title</CDSHeading>`
**Why**: CDSHeading has no level prop and no "page" size. Use size="primary" for h1, "section" for h2, "sub-section" for h3, "smallest" for h4.
