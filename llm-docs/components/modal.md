# CDSModal

Import from `@ciscodesignsystems/cds-react-modal`.

See [README](../../libs/components/react/src/modal/README.md) for full props and usage.

Controlled modal dialog.

```tsx
<CDSModal isOpen={isOpen} size="md" onClose={() => setIsOpen(false)}>
  <CDSFlex direction="vertical">
    <CDSHeading size="primary" margin={{ bottom: 16 }}>
      Confirmation
    </CDSHeading>
    <CDSText style={{ marginBottom: 24 }}>Are you sure?</CDSText>
    <CDSFlex justify="flex-end">
      <CDSButton.Group>
        <CDSButton variant="tertiary" onClick={() => setIsOpen(false)}>
          Cancel
        </CDSButton>
        <CDSButton onClick={() => setIsOpen(false)}>Confirm</CDSButton>
      </CDSButton.Group>
    </CDSFlex>
  </CDSFlex>
</CDSModal>
```

- `isOpen` / `onClose` — controlled open state (required).
- `size` — `"sm"` | `"md"` | `"lg"`.

## DON'T

- Never set z-index on CDSModal — it manages its own z-index.
- CDSModal has no built-in `title` or `footer` props — compose layout with CDSFlex, CDSHeading, CDSButton.Group.
