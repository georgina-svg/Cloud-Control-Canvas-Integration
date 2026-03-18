# CDSStepper — Compound Component API

Import from `@ciscodesignsystems/cds-react-stepper`.

See [README](../../libs/components/react/src/stepper/README.md) for full props and usage.

CDSStepper uses a **compound component pattern**. There is NO `activeStep` prop on the root.

## Required Structure

```tsx
<CDSStepper horizontal={false}>
  <CDSStepper.LeftPanel isExpanded={isExpanded} onCollapse={onCollapse} onExpand={onExpand}>
    <CDSStepper.Step stepNumber={1} title="Step 1" active completed={false} expanded={isExpanded}>
      Step 1
    </CDSStepper.Step>
    <CDSStepper.Step
      stepNumber={2}
      title="Step 2"
      active={false}
      completed={false}
      expanded={isExpanded}>
      Step 2
    </CDSStepper.Step>
  </CDSStepper.LeftPanel>
  <CDSStepper.RightPanel
    primaryAction={() => {}}
    secondaryAction={() => {}}
    primaryCta="Next"
    secondaryCta="Cancel">
    <div>Right panel content for the active step</div>
  </CDSStepper.RightPanel>
</CDSStepper>
```

## CRITICAL Rules

- **NO** `CDSStepper.Steps` — this does not exist. Use `CDSStepper.LeftPanel` directly.
- **NO** `activeStep` prop on `<CDSStepper>` — manage active state per-Step via the `active` prop.
- **NO** `<CDSStepperStep>` as a flat import in JSX — always use `CDSStepper.Step`.
- **NO** self-closing `<CDSStepper.Step ... />` — always pass **children** content (a short summary label). Children remain visible even when the left panel is collapsed (52px wide), providing context alongside the step number circles. **Children text must use only short words** (max ~8 characters each) so they can word-wrap at 52px without causing horizontal scrollbars. Use the step title as children (e.g., `{step.title}`) since titles are already short 1-2 word labels.
- The `CDSStepper.LeftPanel` requires ALL of: `isExpanded`, `onCollapse`, `onExpand`.
- Each `CDSStepper.Step` requires: `stepNumber` (number), `title` (ReactNode), and **children** (the step title repeated, e.g., `{step.title}`).

## Sub-Components

| Component               | Required Props                                   | Optional Props                                                                                                |
| ----------------------- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------- |
| `CDSStepper`            | children                                         | `horizontal`                                                                                                  |
| `CDSStepper.LeftPanel`  | children, `isExpanded`, `onCollapse`, `onExpand` | —                                                                                                             |
| `CDSStepper.Step`       | `stepNumber`, `title`, children                  | `active`, `completed`, `disabled`, `description`, `expanded`, `onClick`                                       |
| `CDSStepper.RightPanel` | children, `primaryAction`, `secondaryAction`     | `primaryCta`, `secondaryCta`, `tertiaryAction`, `tertiaryCta`, `isTertiaryActionAvailable`, `explanatoryText` |
| `CDSStepper.SubStep`    | `title`                                          | `active`, `completed`, `disabled`, `description`, `expanded`                                                  |

## Step Labels

Step titles should be **brief** (1-3 words). Use the `description` prop for additional detail.

**Good step titles**: "Build", "Test", "Stage", "Deploy", "Review", "Configure", "Submit"
**Bad step titles**: "Build and compile the application", "Run all test suites", "Deploy to staging environment"

When generating steps for a workflow, always use short action words as titles and put longer explanations in `description`:

```tsx
{ title: 'Configure', description: 'Set up environment variables' }
{ title: 'Review', description: 'Check configuration details' }
{ title: 'Deploy', description: 'Push changes to production' }
```

## Container Width Requirements

CDSStepper uses a CSS grid layout (`fit-content(600px) 1fr`) and requires sufficient horizontal space for step labels to be visible:

- **Expanded left panel**: 296px wide — step titles and descriptions are shown.
- **Collapsed left panel**: 52px wide — only step number circles are shown.
- **Minimum container width for expanded view**: ~700px (296px left panel + collapse button + right panel content).

**Important**: Always wrap CDSStepper in a container with `min-width: 700px` or `width: 100%` on a sufficiently wide parent so that step labels remain visible. If the container is too narrow, the left panel will appear collapsed and only show step numbers without titles.

```tsx
<div style={{ minWidth: 700 }}>
  <CDSStepper>{/* ... */}</CDSStepper>
</div>
```

For narrow preview contexts, consider using `horizontal` mode instead, which stacks steps above the content and avoids the side panel width issue:

```tsx
<CDSStepper horizontal>
  {/* horizontal mode doesn't need LeftPanel/RightPanel collapse controls */}
</CDSStepper>
```

## When to Use CDSStepper

Use CDSStepper for any multi-step workflow, deployment pipeline, or wizard UI. It should always be included when the prompt mentions "steps", "pipeline", "stages", "wizard", or "workflow".

## Complete Interactive Example

```tsx
const [isExpanded, setIsExpanded] = useState(true);
const [currentStep, setCurrentStep] = useState(1);

const steps = [
  { title: 'Build', description: 'Compile and bundle' },
  { title: 'Test', description: 'Run test suites' },
  { title: 'Stage', description: 'Deploy to staging' },
  { title: 'Deploy', description: 'Push to production' },
];

<CDSStepper>
  <CDSStepper.LeftPanel
    isExpanded={isExpanded}
    onCollapse={() => setIsExpanded(false)}
    onExpand={() => setIsExpanded(true)}>
    {steps.map((step, i) => (
      <CDSStepper.Step
        key={i}
        stepNumber={i + 1}
        title={step.title}
        description={step.description}
        active={currentStep === i + 1}
        completed={currentStep > i + 1}
        expanded={isExpanded}
        onClick={() => setCurrentStep(i + 1)}>
        {step.title}
      </CDSStepper.Step>
    ))}
  </CDSStepper.LeftPanel>
  <CDSStepper.RightPanel
    primaryAction={() => setCurrentStep((prev) => Math.min(prev + 1, steps.length))}
    secondaryAction={() => console.log('cancel')}
    tertiaryAction={() => setCurrentStep((prev) => Math.max(prev - 1, 1))}
    isTertiaryActionAvailable={currentStep > 1}
    primaryCta="Next"
    secondaryCta="Cancel"
    tertiaryCta="Back">
    <CDSHeading>{steps[currentStep - 1].title}</CDSHeading>
    <CDSText>{steps[currentStep - 1].description}</CDSText>
  </CDSStepper.RightPanel>
</CDSStepper>;
```
