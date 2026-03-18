# CDSNav

Import from `@ciscodesignsystems/cds-react-nav`.

See [README](../../libs/components/react/src/nav/README.md) for full props and usage.

CDSNav uses namespace/dot notation for sub-components: CDSNav.Item, CDSNav.Section, CDSNav.Section.Label, CDSNav.Switcher, CDSNav.Menu, CDSNav.Menu.Section, CDSNav.Menu.Label, CDSNav.Menu.Link.

## Props

### CDSNav

- `isCollapsed` (boolean) — controlled collapse state
- `initialCollapsed` (boolean) — default collapse state (uncontrolled)
- `setCollapsed` (function) — callback when collapse state changes
- `iconOnlyCollapsed` (boolean) — show only icons when collapsed
- `hideCollapseButton` (boolean) — hide the collapse/expand toggle
- `menuSize` — `'compact'` | `'comfy'`
- `enableSubMenuStackAutoDetect` (boolean) — auto-open parent menus for selected children

### CDSNav.Item

- `icon` (string, required) — icon key from the valid icon names list below
- `children` (string) — the label text
- `isSelected` (boolean) — marks item as active
- `href` (string) — makes item a link
- `menu` (ReactNode) — attach a flyout CDSNav.Menu
- `suffix` (ReactNode) — content after the label (e.g. badge)
- `as` — polymorphic element type (`'a'`, `'button'`, etc.)

### CDSNav.Section

- `children` only — contains CDSNav.Section.Label and CDSNav.Item children
- **Has NO `label` prop** — use CDSNav.Section.Label child instead

### CDSNav.Switcher

- `icon` (string) — e.g. `"organization-switcher"`
- `menu` (ReactNode) — dropdown menu
- `subHeading` (string) — small text below the main label
- `children` (string) — main label text

### CDSNav.Menu

- `title` (string) — menu header
- `children` — CDSNav.Menu.Section and CDSNav.Menu.Link children

### CDSNav.Menu.Link

- `icon` (string) — optional icon
- `children` (string) — link text
- `isSelected` (boolean) — marks as active
- `menu` (ReactNode) — nested CDSNav.Menu for sub-navigation

## Positioning in Layouts

When used in a dashboard/page layout, CDSNav must be positioned as a sticky sidebar:

```tsx
<CDSNav
  isCollapsed={false}
  style={{
    position: 'sticky',
    top: '56px',
    height: 'calc(100vh - 56px)',
    overflowY: 'auto',
  }}
>
```

- Use CSS Grid with `gridTemplateColumns: 'min-content 1fr'` for the nav + content split
- The `min-content` column auto-sizes to the nav width (collapsed or expanded)
- `top: '56px'` accounts for the CDSHeader height
- See the dashboard-layout pattern for the full structure

## Valid Icon Names

Nav icon strings are Cisco-specific keys, NOT Phosphor icon names. Valid names include: home, settings, analytics, users, admin, alerts, reports, help, overview, security, configuration, monitor, inventory, applications, groups, policies, tools, operations, documentation, feedback, explore, design, placeholder, agents, bookmarks, connect, domains, endpoints, firewall, intelligence, jobs, licensing, servers, sites, software, vpn, wireless, workflows

## Collapse State

CDSNav's built-in collapse button only works when wired to React state. **Always** use `useState` for `isCollapsed`:

```tsx
const [isCollapsed, setIsCollapsed] = useState(false);

<CDSNav isCollapsed={isCollapsed} setCollapsed={setIsCollapsed}>
  ...
</CDSNav>;
```

**Never** use a static value like `isCollapsed={false}` — the collapse button will appear but do nothing.

## Reference Code

```tsx
const [isCollapsed, setIsCollapsed] = useState(false);

<CDSNav isCollapsed={isCollapsed} setCollapsed={setIsCollapsed}>
  <CDSNav.Item icon="home" isSelected>
    Dashboard
  </CDSNav.Item>
  <CDSNav.Section>
    <CDSNav.Section.Label>Monitoring</CDSNav.Section.Label>
    <CDSNav.Item icon="analytics">Analytics</CDSNav.Item>
    <CDSNav.Item icon="alerts">Alerts</CDSNav.Item>
  </CDSNav.Section>
  <CDSNav.Section>
    <CDSNav.Section.Label>Admin</CDSNav.Section.Label>
    <CDSNav.Item icon="users">Users</CDSNav.Item>
    <CDSNav.Item icon="settings">Settings</CDSNav.Item>
  </CDSNav.Section>
</CDSNav>;
```

## DO

- Use `useState` for `isCollapsed` and pass `setCollapsed` so the collapse button works
- Use CDSNav.Item with valid icon string names listed above
- Use CDSNav.Section.Label as a child element for section labels
- Always provide an `icon` prop on CDSNav.Item — it is required
- Use `isSelected` to mark the active navigation item
- Place standalone items (like "Home") **before** any CDSNav.Section — not inside one

## DON'T

- Never use `isCollapsed={false}` without `useState` — the collapse toggle will not work
- Never put CDSDivider inside CDSNav — sections already have built-in visual separation
- Never wrap every nav item in its own CDSNav.Section — group related items together in one section
- Never create empty CDSNav.Section elements (no items, only a label)
- Never use CDSNav.Item icon="gear" — invalid icon name, use "settings" instead
- Never use CDSNav.Item icon="house" — invalid icon name, use "home" instead
- Never use CDSNav.Item icon="chart-bar" — invalid icon name, use "analytics" instead
- Never use CDSNav.Item icon="dashboard" — invalid icon name, use "overview" instead
- Never use CDSNav.Item icon="shield" — invalid icon name, use "security" instead
- Never use CDSNav.Item icon="network" — invalid icon name, use "monitor" instead
- Never use CDSNav.Item icon="devices" — invalid icon name, use "inventory" instead
- Never use CDSNav.Section label="..." — CDSNav.Section has no label prop, use CDSNav.Section.Label child
- Never omit the `icon` prop on CDSNav.Item — it is required
- Never use `position: fixed` for CDSNav — use `position: sticky`
- Never use flexbox for nav + content split — use CSS Grid with `min-content 1fr`
