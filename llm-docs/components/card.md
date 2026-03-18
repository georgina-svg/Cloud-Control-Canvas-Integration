# CDSCard

Import from `@ciscodesignsystems/cds-react-card`.

See [README](../../libs/components/react/src/card/README.md) for full props and usage.

CDSCard extends standard div props (`style`, `className`, etc.).

## Props

- `status?: 'default' | 'positive' | 'warning' | 'negative' | 'info'`
- `interactive?: boolean` — clickable card
- `disabled?: boolean`
- `selected?: boolean`

## Health/Status Card Pattern

Reference story: `components-card-card--sample-health-card`

When displaying health, status counts, or device health metrics inside cards, **always** follow this exact structure:

```tsx
<CDSCard aria-label="Status card">
  <CDSFlex direction="vertical" grow gap="sm">
    <CDSFlex direction="vertical" as="header">
      <CDSFlex gap="xxs" align="center">
        <CDSHeading size="section">Title</CDSHeading>
        <CDSText size="xxs" color="light">
          83 total
        </CDSText>
        <div style={{ flex: 1 }} />
        <WifiHighIcon size={32} style={{ color: 'var(--interact-icon-weak-default)' }} />
      </CDSFlex>
    </CDSFlex>
    <CDSFlex gap="sm">
      <CDSFlex
        direction="vertical"
        style={{ background: 'var(--base-bg-default)', flex: 1, padding: 10, borderRadius: 8 }}>
        <CDSHeading size="lg">62</CDSHeading>
        <CDSFlex gap="xxs" align="center">
          <CDSText weight="semi-bold">Positive</CDSText>
          <CDSStatusIcon size={18} status="positive" />
        </CDSFlex>
      </CDSFlex>
      <CDSFlex
        direction="vertical"
        style={{ background: 'var(--base-bg-default)', flex: 1, padding: 10, borderRadius: 8 }}>
        <CDSHeading size="lg">21</CDSHeading>
        <CDSFlex gap="xxs" align="center">
          <CDSText weight="semi-bold">Warning</CDSText>
          <CDSStatusIcon size={18} status="warning" />
        </CDSFlex>
      </CDSFlex>
    </CDSFlex>
  </CDSFlex>
</CDSCard>
```

## Key Rules for Health Cards

- Wrap all card content in `CDSFlex direction="vertical" grow gap="sm"`
- Wrap the header row in `CDSFlex direction="vertical" as="header"`
- Use `CDSHeading size="section"` for the card title — NOT `size="lg"` or `size="sub-section"`
- Use `CDSText size="xxs" color="light"` for the total count next to the title
- Use `<div style={{ flex: 1 }} />` as a spacer to push the icon to the right
- Use Phosphor icons (e.g. `WifiHighIcon`) for the category icon, styled with `color: 'var(--interact-icon-weak-default)'`
- Each metric tile: `CDSFlex direction="vertical"` with `style={{ background: 'var(--base-bg-default)', flex: 1, padding: 10, borderRadius: 8 }}`
- Use `CDSHeading size="lg"` for the large metric number
- Use `CDSFlex gap="xxs" align="center"` to pair `CDSText weight="semi-bold"` label with `CDSStatusIcon size={18}`
- `CDSStatusIcon` statuses: `"positive"`, `"warning"`, `"negative"`, `"neutral"`
- Always set `aria-label` on the CDSCard for accessibility
- When showing multiple health cards in a grid, use `CDSFlex gap="sm" wrap="wrap"` or CSS Grid

## When to Use Health Cards

Use the health card pattern whenever a dashboard shows **health summaries, status counts, or device/service health overviews**. Do NOT use custom colored badges, pills, or inline status counters — always use CDSCard with CDSStatusIcon metric tiles.

**Wrong** — custom status badges:

```tsx
<div style={{ display: 'flex', gap: 8 }}>
  <span style={{ background: 'green', padding: '4px 8px' }}>4 Healthy</span>
  <span style={{ background: 'orange', padding: '4px 8px' }}>2 Warning</span>
</div>
```

**Right** — health cards following `components-card-card--sample-health-card`:

```tsx
<CDSFlex gap="sm">
  <CDSCard aria-label="Network health">
    <CDSFlex direction="vertical" grow gap="sm">
      <CDSFlex direction="vertical" as="header">
        <CDSFlex gap="xxs" align="center">
          <CDSHeading size="section">Network</CDSHeading>
          <CDSText size="xxs" color="light">
            10 total
          </CDSText>
          <div style={{ flex: 1 }} />
          <GlobeIcon size={32} style={{ color: 'var(--interact-icon-weak-default)' }} />
        </CDSFlex>
      </CDSFlex>
      <CDSFlex gap="sm">
        <CDSFlex
          direction="vertical"
          style={{ background: 'var(--base-bg-default)', flex: 1, padding: 10, borderRadius: 8 }}>
          <CDSHeading size="lg">8</CDSHeading>
          <CDSFlex gap="xxs" align="center">
            <CDSText weight="semi-bold">Healthy</CDSText>
            <CDSStatusIcon size={18} status="positive" />
          </CDSFlex>
        </CDSFlex>
        <CDSFlex
          direction="vertical"
          style={{ background: 'var(--base-bg-default)', flex: 1, padding: 10, borderRadius: 8 }}>
          <CDSHeading size="lg">2</CDSHeading>
          <CDSFlex gap="xxs" align="center">
            <CDSText weight="semi-bold">Warning</CDSText>
            <CDSStatusIcon size={18} status="warning" />
          </CDSFlex>
        </CDSFlex>
      </CDSFlex>
    </CDSFlex>
  </CDSCard>
</CDSFlex>
```
