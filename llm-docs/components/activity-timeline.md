# CDSActivityTimeline

Import from `@ciscodesignsystems/cds-react-activity-timeline`.

See [README](../../libs/components/react/src/activity-timeline/README.md) for full props and usage.

Vertical activity/event timeline. Uses dot notation: `CDSActivityTimeline.Item`.

```tsx
<CDSActivityTimeline>
  <CDSActivityTimeline.Item
    title="Deployment started"
    status="complete"
    timestamp="Feb 20, 2026 10:00 AM"
  />
  <CDSActivityTimeline.Item
    title="Running tests"
    status="in-progress"
    timestamp="Feb 20, 2026 10:05 AM"
  />
  <CDSActivityTimeline.Item title="Pending review" status="inactive" timestamp="" />
</CDSActivityTimeline>
```

- Each `Item` needs `title`, `status`, and `timestamp`.
- `status` — `"complete"` | `"in-progress"` | `"error"` | `"inactive"` | `"neutral"`.
- `isCollapsible` / `isNumbered` on parent for collapsible or numbered items.
