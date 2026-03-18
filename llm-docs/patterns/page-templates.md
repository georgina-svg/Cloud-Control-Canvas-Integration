# Page Templates

Reference: Magnetic Design System Foundations > Page Templates

Page templates are starting-point layouts for common page types. All templates share the same UI shell (CDSHeader + CDSNav + CDSFooter) from the app-layout pattern. The differences are in the **body content** area.

When a user asks for a specific page type, match it to the closest template below.

---

## Dashboard Template

**Use when**: displaying a high-level product overview with data visualizations, summary metrics, and details.
**Don't use when**: extensive user input is needed or task-specific interactions are required.

### Anatomy

1. Page title
2. Optional section titles grouping rows of cards
3. Container cards with charts, tables, key-value pairs, or metrics

### Card layout

Cards align to a 12-column grid. Supported distributions per row:

- **1 card** — full width
- **2 cards (1:1)** — equal halves
- **2 cards (1:2 or 2:1)** — one-third / two-thirds
- **3 cards (1:1:1)** — equal thirds

### Best practices

- Separate distinct charts/metrics into different cards (exception: a secondary chart providing context for the first)
- Use different text sizes for section titles (`CDSHeading size="section"`) vs card titles (`CDSHeading size="sub-section"`)
- Keep card heights consistent within a row — align to the tallest card
- Add "View details" buttons on cards that lead to a drawer or detail page

### Responsive behavior

- Minimum card width: **300px**
- Cards stack vertically when viewport can't fit them at 300px minimum
- 3-card rows wrap to 2+1 first, then fully stack

### Code pattern

```tsx
<CDSFlex direction="vertical" gap={24} margin={24}>
  <CDSHeading size="section">Dashboard</CDSHeading>

  {/* Section with title */}
  <CDSFlex direction="vertical" gap={16}>
    <CDSHeading size="sub-section">Network Health</CDSHeading>
    <CDSFlex gap="m" wrap="wrap">
      <CDSCard style={{ flex: '1 1 300px' }} aria-label="Card title">
        {/* Card content */}
      </CDSCard>
      <CDSCard style={{ flex: '1 1 300px' }} aria-label="Card title">
        {/* Card content */}
      </CDSCard>
    </CDSFlex>
  </CDSFlex>

  {/* Full-width card */}
  <CDSCard aria-label="Recent activity">{/* Table or chart */}</CDSCard>
</CDSFlex>
```

---

## List Template

**Use when**: presenting a filterable, full-page list of items (devices, users, policies, etc.) with summary statistics.

### Anatomy

1. Page title
2. Optional interactive/status cards (summary metrics that can filter the table)
3. Full-width table (CDSTable)

### Features

- Status cards above the table can act as filters — selecting a card updates matching table filters
- An optional chart can be toggled inside the same container card as the table for additional context

### Responsive behavior

- Table adjusts for smaller viewports: truncate cells, collapse filter bar
- Design for 1440px, test at 980px

### Code pattern

```tsx
<CDSFlex direction="vertical" gap={24} margin={24}>
  <CDSHeading size="section">Devices</CDSHeading>

  {/* Optional status summary cards */}
  <CDSFlex gap="m" wrap="wrap">
    <CDSCard style={{ flex: '1 1 200px', cursor: 'pointer' }} aria-label="Healthy devices">
      <CDSFlex direction="vertical" gap="xs">
        <CDSHeading size="lg">142</CDSHeading>
        <CDSFlex gap="xxs" align="center">
          <CDSText weight="semi-bold">Healthy</CDSText>
          <CDSStatusIcon size={18} status="positive" />
        </CDSFlex>
      </CDSFlex>
    </CDSCard>
  </CDSFlex>

  {/* Main table */}
  <CDSCard>
    <CDSTable columns={columns} data={data} />
  </CDSCard>
</CDSFlex>
```

---

## Left Column Template

**Use when**: showing full-page details of a device, user, policy, etc. — separating key summary info on the left from detailed content on the right.
**Don't use when**: a drawer is sufficient to present the details.

### Anatomy

1. Page title
2. Left column: essential summary info (key-value pairs, tags, status, form elements)
3. Right column: container cards with charts, tables, or detailed content

### Variations

- **Details column** — left side shows read-only key-value pairs, status, tags
- **Form column** — left side contains an editable form

### Best practices

- Put the most essential information in the left column for quick overview
- Use CDSDivider to separate the left column into smaller scannable sections
- Left column width: ~260–380px depending on breakpoint (roughly 2–4 grid columns)
- Left column height hugs its contents (not full-height)

### Code pattern

```tsx
<CDSFlex direction="vertical" gap={24} margin={24}>
  <CDSHeading size="section">Device Details</CDSHeading>

  <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 16 }}>
    {/* Left column */}
    <CDSCard>
      <CDSFlex direction="vertical" gap="m" style={{ padding: 16 }}>
        <CDSHeading size="sub-section">Summary</CDSHeading>
        {/* Key-value pairs, tags, status */}
        <CDSDivider />
        <CDSHeading size="sub-section">Configuration</CDSHeading>
        {/* More details */}
      </CDSFlex>
    </CDSCard>

    {/* Right column */}
    <CDSFlex direction="vertical" gap={16}>
      <CDSCard aria-label="Performance">{/* Chart or table */}</CDSCard>
      <CDSCard aria-label="Activity log">{/* Table */}</CDSCard>
    </CDSFlex>
  </div>
</CDSFlex>
```

---

## Form Template

**Use when**: settings/configuration screens, long forms that can be sectioned, or when the user benefits from seeing the entire form on one page.

### Anatomy

1. Form title (page-level heading)
2. Form sections — each in a container card with a section title and optional subtitle
3. Form elements (inputs, selects, toggles, checkboxes, etc.) inside each card
4. Call-to-action buttons at the bottom

### Best practices

- Group related form elements by topic into separate container cards
- Use CDSDivider to separate long sections within a card
- Stack form sections vertically — never side by side
- Elements within a card can be arranged horizontally when appropriate
- Section titles default to the left of the content; on smaller viewports, shift them above
- For very long forms, consider using a stepper pattern instead

### Code pattern

```tsx
<CDSFlex direction="vertical" gap={24} margin={24}>
  <CDSHeading size="section">Settings</CDSHeading>

  {/* Form section */}
  <CDSCard>
    <CDSFlex direction="vertical" gap="m" style={{ padding: 16 }}>
      <CDSHeading size="sub-section">General</CDSHeading>
      <CDSTextInput label="Name" placeholder="Enter name" />
      <CDSTextArea label="Description" placeholder="Enter description" />
      <CDSDivider />
      <CDSHeading size="sub-section">Notifications</CDSHeading>
      <CDSToggle label="Email notifications" />
      <CDSToggle label="Push notifications" />
    </CDSFlex>
  </CDSCard>

  {/* Another section */}
  <CDSCard>
    <CDSFlex direction="vertical" gap="m" style={{ padding: 16 }}>
      <CDSHeading size="sub-section">Security</CDSHeading>
      <CDSSelect label="Authentication method">
        <option value="sso">SSO</option>
        <option value="local">Local</option>
      </CDSSelect>
    </CDSFlex>
  </CDSCard>

  {/* Actions */}
  <CDSFlex gap="sm">
    <CDSButton variant="primary">Save</CDSButton>
    <CDSButton variant="secondary">Cancel</CDSButton>
  </CDSFlex>
</CDSFlex>
```
