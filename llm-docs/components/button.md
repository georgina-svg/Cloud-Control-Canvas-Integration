# CDSButton

Import from `@ciscodesignsystems/cds-react-button`.

See [README](../../libs/components/react/src/button/README.md) for full props and usage.

Supports dot notation: `CDSButton.Group` for spacing multiple buttons.

- `variant` — `"primary"` | `"secondary"` | `"tertiary"` | `"ghost"`. Default: `"primary"`.
- `destructive` — red destructive styling. When pressed, display a confirmation warning popover or modal.
- `icon` — ReactNode for a leading (left) icon. Use Phosphor icons at size 16 with weight "bold".
- `rightIcon` — ReactNode for a trailing (right) icon.
- `loading` — shows spinner, disables button to prevent duplicate actions. `block` — full width.
- `size` — `"sm"` | `"md"` (default).
- `title` — accessibility label, required for icon-only buttons (no children).

## Icons in Buttons

Use the `icon` and `rightIcon` props to add icons to buttons. Never manually compose icon + text inside button children.

```tsx
{
  /* Button with leading icon */
}
<CDSButton icon={<PencilSimpleIcon size={16} weight="bold" />}>Edit Profile</CDSButton>;

{
  /* Button with trailing icon */
}
<CDSButton rightIcon={<ArrowRightIcon size={16} weight="bold" />}>Next</CDSButton>;

{
  /* Icon-only button (no children, must have title for accessibility) */
}
<CDSButton icon={<TrashIcon size={16} weight="bold" />} title="Delete" />;
```

## Button Hierarchy

Buttons have a strict visual hierarchy: **Primary > Secondary > Tertiary**. The style implies importance.

- **Primary**: The main, focal action. Only ONE primary button per section, card, or visual grouping.
- **Secondary**: Actions of lesser importance, options, or infrequently used actions.
- **Tertiary**: Least important. Provides further visual hierarchy in action-dense interfaces.

## Button Groups

Use `CDSButton.Group` to wrap multiple buttons with correct spacing.

Every button group must have a clear hierarchy:

- The most important action should be **primary**
- Supporting actions should be **secondary** or **tertiary**
- **Order matters**: secondary/tertiary buttons come FIRST (left), primary button comes LAST (right). The primary action anchors the right side of the group.

```tsx
{
  /* Correct: primary + tertiary */
}
<CDSButton.Group>
  <CDSButton variant="tertiary" onClick={onCancel}>
    Cancel
  </CDSButton>
  <CDSButton>Save</CDSButton>
</CDSButton.Group>;

{
  /* Correct: primary + secondary */
}
<CDSButton.Group>
  <CDSButton variant="secondary" onClick={onEdit}>
    Edit profile
  </CDSButton>
  <CDSButton>Save changes</CDSButton>
</CDSButton.Group>;

{
  /* Correct: destructive primary + tertiary cancel */
}
<CDSButton.Group>
  <CDSButton variant="tertiary" onClick={onCancel}>
    Cancel
  </CDSButton>
  <CDSButton destructive>Delete</CDSButton>
</CDSButton.Group>;
```

## Labels

- Use 1-2 descriptive verbs: "Save", "Edit profile", "Apply rule"
- Use sentence case
- Avoid "Submit" — prefer descriptive verbs like "Send", "Configure", "Save"
- Avoid more than 4 words

## DO

- Always include a primary button in every button group — it anchors the hierarchy
- Use CDSButton.Group when showing multiple buttons on the same line
- Use `loading` prop to disable the button while an action is in progress
- Use the `icon` prop for leading icons and `rightIcon` for trailing icons — CDSButton handles layout automatically

## DON'T

- Never use two primary buttons in a button group — only one focal action per group
- Never use secondary + tertiary without a primary — every group needs a primary action to anchor the hierarchy
- Never use `variant="ghost"` without `sentiment="inverse"` — ghost is only for header/inverse backgrounds
- Never use CDSButton directly as a CDSHeader child for toolbar actions — use CDSCustomMenuRoot instead
- Never place primary buttons before secondary/tertiary in a button group — primary always comes last (rightmost)
- Never omit the primary button and use only lower-hierarchy variants (e.g. secondary + tertiary alone)
- Never manually compose icon + text inside CDSButton children (e.g. `<CDSButton><CDSFlex><Icon /><CDSText>Label</CDSText></CDSFlex></CDSButton>`) — use the `icon` prop instead: `<CDSButton icon={<Icon size={16} weight="bold" />}>Label</CDSButton>`
