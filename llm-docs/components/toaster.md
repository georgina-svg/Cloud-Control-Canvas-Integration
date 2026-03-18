# CDSToaster

Import from `@ciscodesignsystems/cds-react-toaster`.

See [README](../../libs/components/react/src/toaster/README.md) for full props and usage.

Toast notification system for transient messages.

```tsx
const [toasts, setToasts] = useState([]);

const deleteToast = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));

<CDSToaster list={toasts} deleteToast={deleteToast} placement="top-right" />;
```

- `list` — `CDSToastObject[]`: `{ id, title, description, status, timeout }`.
- `deleteToast` — `(id: string) => void` (required).
- `status` — `"info"` | `"positive"` | `"warning"` | `"negative"`.
- `timeout` — ms before auto-dismiss.
