# CDSStatusIcon

Import from `@ciscodesignsystems/cds-react-icons`.

See [README](../../libs/components/react/src/icons/README.md) for full props and usage.

## Props

| Prop                | Type                                                           | Default  | Description                             |
| ------------------- | -------------------------------------------------------------- | -------- | --------------------------------------- |
| `status` (required) | `'positive' \| 'warning' \| 'negative' \| 'info' \| 'neutral'` | —        | Status type                             |
| `size`              | `number \| string`                                             | 16       | Width and height                        |
| `variation`         | `'none' \| 'bordered'`                                         | `'none'` | Only for info/negative/positive/warning |
| `hasBackground`     | `boolean`                                                      | `false`  | Adds colored circular background        |

## Positioning Rules

CDSStatusIcon is an inline SVG — always pair it with text using `CDSFlex` for alignment.

### Inline with label (most common)

Place the icon AFTER the text label, inside a horizontal flex with center alignment:

```tsx
<CDSFlex gap="xxs" align="center">
  <CDSText weight="semi-bold">Healthy</CDSText>
  <CDSStatusIcon size={18} status="positive" />
</CDSFlex>
```

### CRITICAL — Do NOT put CDSStatusIcon before the label

**Wrong**:

```tsx
<CDSFlex gap="xxs" align="center">
  <CDSStatusIcon size={18} status="positive" />
  <CDSText>Healthy</CDSText>
</CDSFlex>
```

**Right** — icon follows the label:

```tsx
<CDSFlex gap="xxs" align="center">
  <CDSText weight="semi-bold">Healthy</CDSText>
  <CDSStatusIcon size={18} status="positive" />
</CDSFlex>
```

### In metric tiles (inside cards)

```tsx
<CDSFlex
  direction="vertical"
  style={{ background: 'var(--base-bg-default)', flex: 1, padding: 10, borderRadius: 8 }}>
  <CDSHeading size="lg">42</CDSHeading>
  <CDSFlex gap="xxs" align="center">
    <CDSText weight="semi-bold">Positive</CDSText>
    <CDSStatusIcon size={18} status="positive" />
  </CDSFlex>
</CDSFlex>
```

### As a tab suffix

```tsx
<CDSTab.Link suffix={<CDSStatusIcon size={16} status="warning" />}>Alerts</CDSTab.Link>
```

## Do NOT

- Do NOT use CDSStatusIcon as a standalone element without a label nearby
- Do NOT set `size` larger than 24 for inline usage — use `hasBackground` for emphasis instead
- Do NOT use raw CSS `color` on CDSStatusIcon — the color is determined by `status`
