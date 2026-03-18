# CDSFlex — Layout & Spacing

Import from `@ciscodesignsystems/cds-react-flex`.

See [README](../../libs/components/react/src/flex/README.md) for full props and usage.

## Props

| Prop        | Type                                                                                                                   | Default        | Description                   |
| ----------- | ---------------------------------------------------------------------------------------------------------------------- | -------------- | ----------------------------- |
| `direction` | `'horizontal' \| 'vertical'`                                                                                           | `'horizontal'` | Flex direction                |
| `gap`       | `'none' \| 'xxs' \| 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| 'xxl'` or `0 \| 2 \| 4 \| 8 \| 12 \| 16 \| 24 \| 36 \| 48` | `0`            | Gap between children          |
| `align`     | `'flex-start' \| 'flex-end' \| 'center' \| 'baseline' \| 'stretch'`                                                    | `'stretch'`    | Cross-axis alignment          |
| `justify`   | `'flex-start' \| 'flex-end' \| 'center' \| 'space-between' \| 'space-around' \| 'space-evenly'`                        | `'flex-start'` | Main-axis justification       |
| `grow`      | `boolean`                                                                                                              | `false`        | Children fill available space |
| `wrap`      | `boolean`                                                                                                              | `false`        | Allow wrapping                |
| `reverse`   | `boolean`                                                                                                              | `false`        | Reverse direction             |
| `margin`    | `number \| number[] \| { top?, right?, bottom?, left? }`                                                               | `0`            | Outer margin                  |

## Card Grid Spacing

When laying out multiple cards, use `CDSFlex` with consistent gap values:

```tsx
// Row of metric cards — use gap="sm" (12px) or gap="md" (16px)
<CDSFlex gap="sm" wrap>
  <CDSCard style={{ flex: '1 1 250px' }}>...</CDSCard>
  <CDSCard style={{ flex: '1 1 250px' }}>...</CDSCard>
  <CDSCard style={{ flex: '1 1 250px' }}>...</CDSCard>
</CDSFlex>
```

**CRITICAL**: Use `flex: '1 1 250px'` (with a min-width basis) on cards for responsive grids — NOT fixed widths or percentages. Add `wrap` on the parent CDSFlex so cards flow to the next row on smaller viewports.

## Section Spacing

For vertical page layouts with sections (heading + content blocks):

```tsx
<CDSFlex direction="vertical" gap="md">
  <CDSHeading size="section">Dashboard</CDSHeading>
  <CDSFlex gap="sm" wrap>
    {/* cards row */}
  </CDSFlex>
  <CDSHeading size="sub-section">Details</CDSHeading>
  <CDSTable ... />
</CDSFlex>
```

Use `gap="md"` (16px) between major sections, `gap="sm"` (12px) between cards in a row, and `gap="xs"` (8px) for tight groupings within a card.

## Common Mistakes

**Wrong** — no gap between cards:

```tsx
<CDSFlex>
  <CDSCard>...</CDSCard>
  <CDSCard>...</CDSCard>
</CDSFlex>
```

**Wrong** — using margin on individual cards instead of flex gap:

```tsx
<CDSFlex>
  <CDSCard style={{ marginRight: 16 }}>...</CDSCard>
  <CDSCard>...</CDSCard>
</CDSFlex>
```

**Right** — consistent gap:

```tsx
<CDSFlex gap="sm" wrap>
  <CDSCard style={{ flex: '1 1 250px' }}>...</CDSCard>
  <CDSCard style={{ flex: '1 1 250px' }}>...</CDSCard>
</CDSFlex>
```
