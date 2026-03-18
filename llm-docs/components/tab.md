# CDSTab — Compound Component API

Import from `@ciscodesignsystems/cds-react-tab`.

See [README](../../libs/components/react/src/tab/README.md) for full props and usage.

## Required Structure

```tsx
<CDSTab variant="primary" orientation="horizontal">
  <CDSTab.Link href="#0" target="_self" selected>
    Tab 1
  </CDSTab.Link>
  <CDSTab.Link href="#0" target="_self">
    Tab 2
  </CDSTab.Link>
  <CDSTab.Link href="#0" target="_self" disabled>
    Tab 3
  </CDSTab.Link>
</CDSTab>
```

## CRITICAL Rules

- **Default orientation is `"horizontal"`** — always set `orientation="horizontal"` explicitly for dashboard/page tabs. Only use `orientation="vertical"` for side navigation patterns.
- **Use `CDSTab.Link`** for each tab item — NOT `<li>`, `<a>`, `<button>`, or `<CDSTab.Item>`.
- **Use the `selected` prop** on `CDSTab.Link` to mark the active tab — NOT `active`, `isSelected`, or `isActive`.
- **NO `CDSTab.Item`** — this does not exist. Always use `CDSTab.Link`.
- **NO `CDSTab.Panel`** — CDSTab only renders the tab bar. Manage content panels yourself with conditional rendering.
- **NO bullets** — CDSTab renders a styled `<ul>` with list-style removed. If you see bullets, you are likely wrapping `CDSTab.Link` in `<li>` elements or nesting `CDSTab` inside another `<ul>`. Do NOT wrap tabs in any list markup.

## Props

| Component     | Required Props | Optional Props                                                                                  |
| ------------- | -------------- | ----------------------------------------------------------------------------------------------- |
| `CDSTab`      | children       | `variant` ("primary" \| "secondary"), `orientation` ("horizontal" \| "vertical")                |
| `CDSTab.Link` | children       | `href`, `target`, `selected`, `disabled`, `prefix` (ReactNode), `suffix` (ReactNode), `onClose` |

## Tab.Link prefix/suffix

Use `prefix` for leading icons and `suffix` for trailing badges or status icons:

```tsx
<CDSTab.Link
  href="#0"
  selected
  prefix={<GlobeIcon size={16} />}
  suffix={<CDSBadge size="sm">5</CDSBadge>}>
  Network
</CDSTab.Link>
```

## Vertical Tabs with Groups

Only use this pattern for side-navigation style UIs, NOT for page/dashboard content tabs:

```tsx
<CDSTab orientation="vertical">
  <CDSTab.Group label="Section">
    <CDSTab.Link href="#0" selected>
      Item 1
    </CDSTab.Link>
    <CDSTab.Link href="#0">Item 2</CDSTab.Link>
  </CDSTab.Group>
</CDSTab>
```

## Interactive Tab Switching

CDSTab does not manage content panels — handle it yourself:

```tsx
const [activeTab, setActiveTab] = useState(0);

<CDSTab orientation="horizontal">
  {tabs.map((tab, i) => (
    <CDSTab.Link
      key={i}
      href="#0"
      selected={activeTab === i}
      onClick={(e) => {
        e.preventDefault();
        setActiveTab(i);
      }}>
      {tab.label}
    </CDSTab.Link>
  ))}
</CDSTab>;
{
  activeTab === 0 && <div>Panel 1 content</div>;
}
{
  activeTab === 1 && <div>Panel 2 content</div>;
}
```

## Error Patterns

**Wrong** — bullets appear because of extra list markup:

```tsx
<ul>
  <CDSTab orientation="horizontal">
    <li>
      <CDSTab.Link selected>Tab 1</CDSTab.Link>
    </li>
  </CDSTab>
</ul>
```

**Wrong** — vertical when horizontal is needed:

```tsx
<CDSTab>
  {' '}
  {/* defaults to horizontal but be explicit */}
  <CDSTab.Link selected>Overview</CDSTab.Link>
</CDSTab>
```

**Right**:

```tsx
<CDSTab orientation="horizontal">
  <CDSTab.Link href="#0" selected>
    Overview
  </CDSTab.Link>
  <CDSTab.Link href="#0">Details</CDSTab.Link>
</CDSTab>
```
