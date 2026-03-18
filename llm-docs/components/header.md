# CDSHeader

Import from `@ciscodesignsystems/cds-react-header`.

See [README](../../libs/components/react/src/header/README.md) for full props and usage.

CDSHeader requires `sentiment="inverse"`, `title`, and `logo` props. Pass menus as children, not as props.

CDSMenu uses dot notation: CDSMenu and CDSMenu.Item, but CDSMenu is imported from `cds-react-header` NOT `cds-react-menu`.

## Error Patterns

**Wrong**: `import { CDSMenu } from '@ciscodesignsystems/cds-react-menu'`
**Right**: `import { CDSMenu } from '@ciscodesignsystems/cds-react-header'`
**Why**: cds-react-menu does not export CDSMenu. CDSMenu is part of the header package.

**Wrong**: `<CDSHeader userName="John" tenantName="Corp">`
**Right**: `<CDSHeader sentiment="inverse" title="App" logo={<CiscoLogo size="sm" />}><CDSTenantMenuRoot userName="John" tenantName="Corp">...</CDSTenantMenuRoot></CDSHeader>`
**Why**: CDSHeader does not have userName or tenantName props. Those belong on CDSTenantMenuRoot.

## Header Actions & Toolbar Buttons

Action buttons and menus are passed as **children** of CDSHeader, not as props. They render in the header's right-side toolbar area.

### Icon Menus (Settings, Help, Files)

Use `CDSCustomMenuRoot` with a Phosphor icon for dropdown menus triggered by an icon button:

```tsx
import { GearSixIcon } from '@phosphor-icons/react';
import { CDSCustomMenuItem, CDSCustomMenuRoot } from '@ciscodesignsystems/cds-react-header';

<CDSHeader sentiment="inverse" title="App" logo={<CiscoLogo size="sm" />}>
  <CDSCustomMenuRoot icon={<GearSixIcon size={24} weight="bold" />} aria-label="Settings menu">
    <CDSCustomMenuItem>Preferences</CDSCustomMenuItem>
    <CDSCustomMenuItem>Account</CDSCustomMenuItem>
  </CDSCustomMenuRoot>
</CDSHeader>;
```

### Alerts Menu

Use `CDSAlertsMenuRoot` for notification/alert dropdowns:

```tsx
import {
  CDSAlert,
  CDSAlertsMenuDivider,
  CDSAlertsMenuFooter,
  CDSAlertsMenuRoot,
} from '@ciscodesignsystems/cds-react-header';

<CDSAlertsMenuRoot sentiment="inverse" variant="ghost">
  <CDSAlert sentiment="warning" headline="CRC errors detected" rightGutter="8 minutes ago">
    Alert description text
  </CDSAlert>
  <CDSAlertsMenuDivider />
  <CDSAlertsMenuFooter>
    <CDSButton sentiment="interact" rightIcon={<ArrowRightIcon size={15} />}>
      View all alerts
    </CDSButton>
  </CDSAlertsMenuFooter>
</CDSAlertsMenuRoot>;
```

### Tenant/User Menu

Use `CDSTenantMenuRoot` with `CDSTenantMenuRow` for user profile menus. Action buttons go in `rightGutter`:

```tsx
<CDSTenantMenuRow
  leftGutter={<UserIcon color="#707070" weight="regular" size={23} />}
  rightGutter={
    <CDSButton sentiment="interact" variant="secondary">
      Logout
    </CDSButton>
  }>
  <p>Logged in as</p>
  <p>Alexander Ferguson</p>
</CDSTenantMenuRow>
```

### Search

Use `CDSHeaderSearch` as a direct child of CDSHeader:

```tsx
<CDSHeaderSearch placeholder="Search" items={searchItems} />
```

### Ordering

Children render left-to-right in the toolbar, from product-specific to system-wide. Typical order: Search → Custom menus → Help menu → Alerts menu → Tenant menu. Maintain default ordering for cross-product consistency.

## Design Rules

- Header background is a fixed gray gradient (#373C42 → #0F1214) — do not change it.
- Custom utility icons must use Phosphor **"Bold"** weight, 24×24 frame, outline style, 2px stroke.
- Utilities must open panels or dropdowns — never navigate directly to a page.
- Only add **global system-level** utilities that persist across all pages.
- Accessibility: icons need 3:1 contrast ratio, text needs 4.5:1 contrast ratio against the header background.

## Styling

- CDSHeader must have `style={{ zIndex: 200 }}` to ensure it renders above other content (e.g. tables, modals, dropdowns).

## DON'T

- Never import CDSMenu from '@ciscodesignsystems/cds-react-menu' — package does not export CDSMenu. Import CDSMenu from cds-react-header instead
- Never use CDSHeader userName="..." — CDSHeader has no userName prop, use CDSTenantMenuRoot
- Never use CDSHeader tenantName="..." — CDSHeader has no tenantName prop, use CDSTenantMenuRoot
- Never use CDSHeader rightGutter="..." — CDSHeader has no rightGutter prop, pass menus as children
- Never use plain `<button>` or `CDSButton` directly as a CDSHeader child for toolbar actions — use `CDSCustomMenuRoot` with an icon for dropdown menus, or `CDSHeaderBadge` for badges
- Never use inline SVGs for header toolbar icons — use Phosphor icons with `size={24}` and `weight="bold"`
- Never add page-level utilities to the header — header is for global, system-level actions only
- Never make a utility icon navigate directly to a page — utilities must open panels or dropdowns
