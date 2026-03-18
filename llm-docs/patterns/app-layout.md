# App Layout Pattern

Reference: Magnetic Design System Foundations > Layout

## UI Shell Anatomy

Every page has a **UI shell** (the persistent frame) and **body content** (the page-specific area).

**UI shell** (always present):

1. **CDSHeader** — top bar with logo, product name, global search, utility menus
2. **CDSNav** — left sidebar navigation (collapsible)
3. **CDSFooter** — optional, bottom of page with copyright/legal info

**Body content** (inside the main area): 4. **Page title** — required on every page; may include breadcrumbs, tags, filters, page-level actions 5. **Container cards** — group related content on the page

## Spacing Scale

Magnetic uses a 4px-increment scale. Use these via CDSFlex `gap` prop or inline styles:

| Token | Pixels |
| ----- | ------ |
| 2xs   | 4px    |
| xs    | 8px    |
| s     | 12px   |
| m     | 16px   |
| l     | 24px   |
| xl    | 36px   |
| 2xl   | 48px   |

- Spacing between **sections** (groups of cards with a section title): **24px**
- Spacing **within** a section (between cards): **16px**
- Section titles should use `CDSHeading size="sub-section"` for hierarchy
- Save vertical and horizontal space — users are data-hungry

## Grid System

- 12-column grid, full-width at all screen sizes
- Gutters: 16px at all breakpoints
- Standard widths: Small 980px, Medium 1440px, Large 1920px, XLarge 2560px
- Design to Medium/Large and test against Small/XLarge for responsiveness

## Layout Structure

```tsx
const [isCollapsed, setIsCollapsed] = useState(false);

<>
  <CDSHeader
    sentiment="inverse"
    title="Product Name"
    logo={<CiscoLogo size="sm" />}
    logoLink="#"
    logoLinkTarget="_self"
    style={{ zIndex: 200 }}
  />
  <div style={{ display: 'grid', gridTemplateColumns: 'min-content 1fr' }}>
    <CDSNav
      isCollapsed={isCollapsed}
      setCollapsed={setIsCollapsed}
      style={{
        position: 'sticky',
        top: '56px',
        height: 'calc(100vh - 56px)',
        overflowY: 'auto',
      }}>
      <CDSNav.Item icon="home" isSelected>
        Home
      </CDSNav.Item>
      <CDSNav.Section>
        <CDSNav.Section.Label>Section</CDSNav.Section.Label>
        <CDSNav.Item icon="applications">Applications</CDSNav.Item>
      </CDSNav.Section>
    </CDSNav>

    <CDSFlex direction="vertical" gap={24} margin={24}>
      {/* Page title area */}
      <CDSHeading size="section">Page Title</CDSHeading>

      {/* Content sections — 24px between sections, 16px between cards within */}
      <CDSFlex direction="vertical" gap={16}>
        <CDSHeading size="sub-section">Section Title</CDSHeading>
        <CDSFlex gap="m" wrap="wrap">
          <CDSCard style={{ flex: '1 1 300px' }}>...</CDSCard>
          <CDSCard style={{ flex: '1 1 300px' }}>...</CDSCard>
        </CDSFlex>
      </CDSFlex>

      <CDSFooter brandName="Cisco" rightSlot={<CDSLink href="#">Privacy Policy</CDSLink>} />
    </CDSFlex>
  </div>
</>;
```

## Rules

- Root: CDSHeader in normal flow, then CSS Grid (`min-content 1fr`) for nav + content
- CDSHeader: `sentiment="inverse"`, `style={{ zIndex: 200 }}`
- CDSNav: `position: sticky`, `top: '56px'`, `height: 'calc(100vh - 56px)'`
- Nav column: `min-content` auto-sizes to nav width (collapsed or expanded)
- Main content: `CDSFlex direction="vertical" gap={24} margin={24}`
- CDSFooter goes inside the content area, not outside the grid
- Use `layout: 'fullscreen'` in story parameters
- Text line length: max ~80 characters per line

## Don't

- Don't use `position: fixed` for CDSHeader — normal flow above the grid
- Don't use flexbox for nav + content split — use CSS Grid
- Don't put CDSFooter outside the grid wrapper
- Don't forget `useState` for CDSNav `isCollapsed` / `setCollapsed`
