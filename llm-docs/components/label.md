# CDSLabel

Import from `@ciscodesignsystems/cds-react-label`.

See [README](../../libs/components/react/src/label/README.md) for full props and usage.

Form field label. Rarely needed directly since form components (CDSTextInput, CDSSelect, CDSTextArea) have built-in `label` props.

```tsx
<CDSLabel htmlFor="custom-input" required>
  Custom Field
</CDSLabel>
```

- Only use when building custom form controls that don't have a built-in label prop.
