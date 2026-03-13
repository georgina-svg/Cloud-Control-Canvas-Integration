const STEPS = [
  { title: 'Identify Target Policy', description: 'Locate the policy to be rolled back in the configuration.' },
  { title: 'Validate Rollback Eligibility', description: 'Confirm the policy can be safely reverted.' },
  { title: 'Assess Current Impact', description: 'Review active sessions and traffic using this policy.' },
  { title: 'Preview Rollback Changes', description: 'Simulate the rollback to verify expected behavior.' },
  { title: 'Check Dependencies', description: 'Ensure no other policies or rules depend on this change.' },
  { title: 'Create Safety Snapshot', description: 'Save a restore point before applying the rollback.' },
  { title: 'Notify Stakeholders', description: 'Alert relevant teams before executing the rollback.' },
]

export function ProgressPanel() {
  return (
    <aside className="progress-panel" aria-label="Progress">
      <h2 className="progress-panel__title">Progress</h2>
      <p className="progress-panel__subtitle">
        Rollback policy &apos;BranchOptimize-v2&apos;
      </p>
      <ol className="progress-panel__timeline">
        {STEPS.map((step, index) => (
          <li key={index} className="progress-panel__step">
            <span className="progress-panel__step-marker" aria-hidden />
            <div className="progress-panel__step-content">
              <span className="progress-panel__step-title">{step.title}</span>
              <p className="progress-panel__step-description">{step.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </aside>
  )
}
