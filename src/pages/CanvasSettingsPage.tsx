import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ASSISTANT_ADVICE_STYLE_OPTIONS,
  ENTERPRISE_FUNCTIONS,
  LOCAL_DEMO_USER_ID,
  OPERATIONAL_POSTURE_OPTIONS,
  type AiToneSettings,
  type EnterpriseFunction,
  type EnterpriseRoleContext,
  type PersonalizationEntry,
  type PersonalizationEntryKind,
  type ResponseCharacteristics,
  type UserPersonalizationState,
  loadUserPersonalization,
  saveUserPersonalization,
} from '../lib/assistantPersonalization'
import { IconCaretLeft, IconInfoCircle } from '../components/icons'

const KIND_LABELS: Record<PersonalizationEntryKind, string> = {
  preference: 'Preference',
  constraint: 'Constraint',
  context: 'Context',
  fact: 'Fact',
}

const KIND_HELP: Record<PersonalizationEntryKind, string> = {
  preference: 'How you want the assistant to behave or respond.',
  constraint: 'Limits or rules the assistant must respect.',
  context: 'Standing context (team, region, stack) to keep in mind.',
  fact: 'Facts you want the assistant to treat as true for you.',
}

const SUGGESTED_OCCUPATION_TAGS = [
  'Information architect',
  'High severity impact work',
  'Big picture visibility',
] as const

function newEntry(): PersonalizationEntry {
  const now = new Date().toISOString()
  return {
    id: crypto.randomUUID(),
    kind: 'preference',
    content: '',
    createdAt: now,
    updatedAt: now,
  }
}

export function CanvasSettingsPage() {
  const navigate = useNavigate()
  const userId = LOCAL_DEMO_USER_ID
  const [model, setModel] = useState<UserPersonalizationState>(() => loadUserPersonalization(userId))
  const [tagDraft, setTagDraft] = useState('')
  const [acronymShorthand, setAcronymShorthand] = useState('')
  const [acronymExpansion, setAcronymExpansion] = useState('')
  const [selectedAcronymId, setSelectedAcronymId] = useState('')

  useEffect(() => {
    setModel(loadUserPersonalization(userId))
  }, [userId])

  const commit = useCallback((next: UserPersonalizationState) => {
    saveUserPersonalization(next)
    setModel(next)
  }, [])

  const addOccupationTag = (raw: string) => {
    const t = raw.trim()
    if (!t) return
    if (model.occupationTags.includes(t)) return
    commit({ ...model, occupationTags: [...model.occupationTags, t] })
    setTagDraft('')
  }

  const removeOccupationTag = (tag: string) => {
    commit({ ...model, occupationTags: model.occupationTags.filter((x) => x !== tag) })
  }

  const addAcronym = () => {
    const s = acronymShorthand.trim()
    const e = acronymExpansion.trim()
    if (!s || !e) return
    const id = crypto.randomUUID()
    const next = {
      ...model,
      acronyms: [...model.acronyms, { id, shorthand: s, expansion: e }],
    }
    commit(next)
    setSelectedAcronymId(id)
    setAcronymShorthand('')
    setAcronymExpansion('')
  }

  const handleEnterpriseChange = (value: EnterpriseFunction | '') => {
    commit({ ...model, enterpriseFunction: value })
  }

  const updateEntry = (id: string, patch: Partial<PersonalizationEntry>) => {
    const nextEntries = model.entries.map((e) =>
      e.id === id ? { ...e, ...patch, updatedAt: new Date().toISOString() } : e
    )
    commit({ ...model, entries: nextEntries })
  }

  const removeEntry = (id: string) => {
    commit({ ...model, entries: model.entries.filter((e) => e.id !== id) })
  }

  const addEntry = () => {
    commit({ ...model, entries: [...model.entries, newEntry()] })
  }

  const setAiTone = (key: keyof AiToneSettings, value: number) => {
    commit({ ...model, aiTone: { ...model.aiTone, [key]: value } })
  }

  const setCharacteristic = (key: keyof ResponseCharacteristics, value: boolean) => {
    commit({ ...model, characteristics: { ...model.characteristics, [key]: value } })
  }

  const setEnterpriseRoleContext = (patch: Partial<EnterpriseRoleContext>) => {
    commit({
      ...model,
      enterpriseRoleContext: { ...model.enterpriseRoleContext, ...patch },
    })
  }

  return (
    <div
      className="ai-assistant ai-assistant--canvas canvas-settings-page"
      role="main"
    >
      <div className="ai-assistant__bg" aria-hidden />
      <div className="ai-assistant__bg-glow" aria-hidden />
      <div className="ai-assistant__bg-glow-overlay" aria-hidden />

      <div className="canvas-page__content canvas-settings-page__inner">
        <header className="canvas-settings-page__header">
          <button
            type="button"
            className="canvas-settings-page__back"
            onClick={() => navigate('/canvas')}
          >
            <IconCaretLeft className="canvas-settings-page__back-icon" aria-hidden />
            Back to Canvas
          </button>
          <h1 className="canvas-settings-page__title">Settings</h1>
          <p className="canvas-settings-page__lede">
            Configure how the AI Assistant applies your organization context on this device.
          </p>
        </header>

        <section
          className="canvas-settings-page__section"
          aria-labelledby="personalization-heading"
        >
          <h2 id="personalization-heading" className="canvas-settings-page__section-title">
            Personalization
          </h2>
          <p className="canvas-settings-page__section-subtitle">Response customization</p>
          <p className="canvas-settings-page__section-desc">
            Tell the assistant what to remember—preferences, constraints, and context—so responses stay aligned
            with your role. Memories are stored as structured entries, scoped to your user profile (on this device:
            demo user), and merged into the assistant&apos;s context for every conversation. They persist across
            sessions until you change or remove them.
          </p>

          <div
            className="canvas-settings-page__split-block"
            aria-labelledby="enterprise-role-heading"
          >
            <div className="canvas-settings-page__split-intro">
              <h3 id="enterprise-role-heading" className="canvas-settings-page__split-title">
                Enterprise role & outcomes
              </h3>
              <p className="canvas-settings-page__split-subtitle">
                Ground the assistant in how you work—so guidance, examples, and tradeoffs match your enterprise
                context.
              </p>
            </div>
            <div className="canvas-settings-page__split-controls">
              <div className="canvas-settings-page__field canvas-settings-page__field--wide">
                <label htmlFor="enterprise-function" className="canvas-settings-page__label">
                  Enterprise function
                </label>
                <p className="canvas-settings-page__hint" id="enterprise-function-hint">
                  Area you operate in (informs tone, examples, and priorities when the assistant is configured to use
                  it).
                </p>
                <select
                  id="enterprise-function"
                  className="canvas-settings-page__select"
                  aria-describedby="enterprise-function-hint"
                  value={model.enterpriseFunction}
                  onChange={(e) =>
                    handleEnterpriseChange((e.target.value || '') as EnterpriseFunction | '')
                  }
                >
                  <option value="">Select function…</option>
                  {ENTERPRISE_FUNCTIONS.map((fn) => (
                    <option key={fn} value={fn}>
                      {fn}
                    </option>
                  ))}
                </select>
              </div>

              <div className="canvas-settings-page__acronym-grid">
                <div className="canvas-settings-page__field">
                  <label htmlFor="role-title" className="canvas-settings-page__label">
                    Role title
                  </label>
                  <p className="canvas-settings-page__hint" id="role-title-hint">
                    Official title or short description of your position.
                  </p>
                  <input
                    id="role-title"
                    className="canvas-settings-page__text-input"
                    type="text"
                    value={model.enterpriseRoleContext.roleTitle}
                    onChange={(e) => setEnterpriseRoleContext({ roleTitle: e.target.value })}
                    placeholder="e.g. Senior Collaboration Architect, SOC Lead"
                    aria-describedby="role-title-hint"
                    autoComplete="organization-title"
                  />
                </div>
                <div className="canvas-settings-page__field">
                  <label htmlFor="team-org-scope" className="canvas-settings-page__label">
                    Team / organization scope
                  </label>
                  <p className="canvas-settings-page__hint" id="team-org-hint">
                    Team, BU, region, or segment you represent.
                  </p>
                  <input
                    id="team-org-scope"
                    className="canvas-settings-page__text-input"
                    type="text"
                    value={model.enterpriseRoleContext.teamOrgScope}
                    onChange={(e) => setEnterpriseRoleContext({ teamOrgScope: e.target.value })}
                    placeholder="e.g. AMER Network Services, Corp Security"
                    aria-describedby="team-org-hint"
                    autoComplete="off"
                  />
                </div>
              </div>

              <div className="canvas-settings-page__field canvas-settings-page__field--wide">
                <label htmlFor="role-mission" className="canvas-settings-page__label">
                  Mission & outcomes
                </label>
                <p className="canvas-settings-page__hint" id="role-mission-hint">
                  What success looks like in your role—mandates, SLAs, KPIs, or programs the assistant should
                  optimize for.
                </p>
                <textarea
                  id="role-mission"
                  className="canvas-settings-page__textarea"
                  rows={3}
                  value={model.enterpriseRoleContext.roleMission}
                  onChange={(e) => setEnterpriseRoleContext({ roleMission: e.target.value })}
                  placeholder="e.g. Reduce incident MTTR for hybrid cloud; standardize on approved designs before rollout."
                  aria-describedby="role-mission-hint"
                />
              </div>

              <div className="canvas-settings-page__field canvas-settings-page__field--wide">
                <label htmlFor="stakeholder-audience" className="canvas-settings-page__label">
                  Primary audience
                </label>
                <p className="canvas-settings-page__hint" id="stakeholder-hint">
                  Who consumes your work—helps calibrate depth, formality, and abstraction.
                </p>
                <textarea
                  id="stakeholder-audience"
                  className="canvas-settings-page__textarea"
                  rows={2}
                  value={model.enterpriseRoleContext.stakeholderAudience}
                  onChange={(e) => setEnterpriseRoleContext({ stakeholderAudience: e.target.value })}
                  placeholder="e.g. IT leadership and app owners; external auditors in Q4."
                  aria-describedby="stakeholder-hint"
                />
              </div>

              <div className="canvas-settings-page__field canvas-settings-page__field--wide">
                <label htmlFor="primary-tools" className="canvas-settings-page__label">
                  Primary tools & platforms
                </label>
                <p className="canvas-settings-page__hint" id="primary-tools-hint">
                  Products or stacks to lean on in examples (comma-separated is fine).
                </p>
                <input
                  id="primary-tools"
                  className="canvas-settings-page__text-input"
                  type="text"
                  value={model.enterpriseRoleContext.primaryTools}
                  onChange={(e) => setEnterpriseRoleContext({ primaryTools: e.target.value })}
                  placeholder="e.g. Intersight, Meraki, SecureX, ServiceNow"
                  aria-describedby="primary-tools-hint"
                  autoComplete="off"
                />
              </div>

              <div className="canvas-settings-page__acronym-grid">
                <div className="canvas-settings-page__field">
                  <label htmlFor="advice-style" className="canvas-settings-page__label">
                    How should the assistant advise?
                  </label>
                  <p className="canvas-settings-page__hint" id="advice-style-hint">
                    Default framing for recommendations and next steps.
                  </p>
                  <select
                    id="advice-style"
                    className="canvas-settings-page__select"
                    aria-describedby="advice-style-hint"
                    value={model.enterpriseRoleContext.adviceStyle}
                    onChange={(e) =>
                      setEnterpriseRoleContext({
                        adviceStyle: e.target.value as EnterpriseRoleContext['adviceStyle'],
                      })
                    }
                  >
                    {ASSISTANT_ADVICE_STYLE_OPTIONS.map((opt, i) => (
                      <option key={`advice-${i}-${opt.value}`} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="canvas-settings-page__field">
                  <label htmlFor="operational-posture" className="canvas-settings-page__label">
                    Operational posture
                  </label>
                  <p className="canvas-settings-page__hint" id="operational-posture-hint">
                    Risk and change appetite for rollout-style guidance.
                  </p>
                  <select
                    id="operational-posture"
                    className="canvas-settings-page__select"
                    aria-describedby="operational-posture-hint"
                    value={model.enterpriseRoleContext.operationalPosture}
                    onChange={(e) =>
                      setEnterpriseRoleContext({
                        operationalPosture: e.target.value as EnterpriseRoleContext['operationalPosture'],
                      })
                    }
                  >
                    {OPERATIONAL_POSTURE_OPTIONS.map((opt, i) => (
                      <option key={`posture-${i}-${opt.value}`} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div
            className="canvas-settings-page__split-block"
            aria-labelledby="ai-tone-heading"
          >
            <div className="canvas-settings-page__split-intro">
              <h3 id="ai-tone-heading" className="canvas-settings-page__split-title">
                AI Tone
              </h3>
              <p className="canvas-settings-page__split-subtitle">Customize your AI</p>
            </div>
            <div className="canvas-settings-page__split-controls">
              <p className="canvas-settings-page__split-controls-label">Characteristics</p>
              <div className="canvas-settings-page__slider-group" role="group" aria-label="AI tone sliders">
                <div className="canvas-settings-page__slider-row">
                  <div className="canvas-settings-page__slider-labels">
                    <span>Information only</span>
                    <span>Active Contributor</span>
                  </div>
                  <input
                    type="range"
                    className="canvas-settings-page__range"
                    min={0}
                    max={100}
                    value={model.aiTone.engagement}
                    onChange={(e) => setAiTone('engagement', Number(e.target.value))}
                    aria-valuetext={`${model.aiTone.engagement} percent toward active contributor`}
                  />
                </div>
                <div className="canvas-settings-page__slider-row">
                  <div className="canvas-settings-page__slider-labels">
                    <span>Short responses</span>
                    <span>Long responses</span>
                  </div>
                  <input
                    type="range"
                    className="canvas-settings-page__range"
                    min={0}
                    max={100}
                    value={model.aiTone.responseLength}
                    onChange={(e) => setAiTone('responseLength', Number(e.target.value))}
                    aria-valuetext={`${model.aiTone.responseLength} percent toward long responses`}
                  />
                </div>
                <div className="canvas-settings-page__slider-row">
                  <div className="canvas-settings-page__slider-labels">
                    <span>Brief — to the point</span>
                    <span>Detailed — concise and descriptive</span>
                  </div>
                  <input
                    type="range"
                    className="canvas-settings-page__range"
                    min={0}
                    max={100}
                    value={model.aiTone.detailLevel}
                    onChange={(e) => setAiTone('detailLevel', Number(e.target.value))}
                    aria-valuetext={`${model.aiTone.detailLevel} percent toward detailed responses`}
                  />
                </div>
              </div>
            </div>
          </div>

          <div
            className="canvas-settings-page__split-block"
            aria-labelledby="characteristics-heading"
          >
            <div className="canvas-settings-page__split-intro">
              <h3 id="characteristics-heading" className="canvas-settings-page__split-title">
                Characteristics
              </h3>
              <p className="canvas-settings-page__split-subtitle">Response customization</p>
            </div>
            <div className="canvas-settings-page__split-controls">
              <ul className="canvas-settings-page__checklist" role="list">
                <li className="canvas-settings-page__check-item">
                  <label className="canvas-settings-page__check-label">
                    <input
                      type="checkbox"
                      className="canvas-settings-page__checkbox"
                      checked={model.characteristics.longAnswers}
                      onChange={(e) => setCharacteristic('longAnswers', e.target.checked)}
                    />
                    Long answers
                  </label>
                </li>
                <li className="canvas-settings-page__check-item">
                  <label className="canvas-settings-page__check-label">
                    <input
                      type="checkbox"
                      className="canvas-settings-page__checkbox"
                      checked={model.characteristics.bulletPoints}
                      onChange={(e) => setCharacteristic('bulletPoints', e.target.checked)}
                    />
                    Bullet points
                  </label>
                </li>
                <li className="canvas-settings-page__check-item">
                  <label className="canvas-settings-page__check-label">
                    <input
                      type="checkbox"
                      className="canvas-settings-page__checkbox"
                      checked={model.characteristics.paragraphResponses}
                      onChange={(e) => setCharacteristic('paragraphResponses', e.target.checked)}
                    />
                    Paragraph responses
                  </label>
                </li>
                <li className="canvas-settings-page__check-item">
                  <label className="canvas-settings-page__check-label">
                    <input
                      type="checkbox"
                      className="canvas-settings-page__checkbox"
                      checked={model.characteristics.conclusionSummarization}
                      onChange={(e) => setCharacteristic('conclusionSummarization', e.target.checked)}
                    />
                    Conclusion summarization after each response
                  </label>
                </li>
              </ul>
            </div>
          </div>

          <div className="canvas-settings-page__field canvas-settings-page__field--wide">
            <label htmlFor="occupation-tags" className="canvas-settings-page__label">
              Occupation information
            </label>
            <p className="canvas-settings-page__hint" id="occupation-tags-hint">
              Add tags that describe your role or focus. Press Enter to add each tag.
            </p>
            <div className="canvas-settings-page__tag-field" onKeyDown={(ev) => ev.stopPropagation()}>
              <div className="canvas-settings-page__tags" role="list" aria-label="Occupation tags">
                {model.occupationTags.map((tag) => (
                  <span key={tag} className="canvas-settings-page__tag" role="listitem">
                    {tag}
                    <button
                      type="button"
                      className="canvas-settings-page__tag-remove"
                      aria-label={`Remove ${tag}`}
                      onClick={() => removeOccupationTag(tag)}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <input
                id="occupation-tags"
                className="canvas-settings-page__tag-input"
                type="text"
                value={tagDraft}
                onChange={(e) => setTagDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addOccupationTag(tagDraft)
                  }
                }}
                placeholder="Type and press Enter to add a tag"
                aria-describedby="occupation-tags-hint"
              />
            </div>
            <div className="canvas-settings-page__suggested-tags" aria-label="Suggested tags">
              {SUGGESTED_OCCUPATION_TAGS.map((s) => (
                <button
                  key={s}
                  type="button"
                  className="canvas-settings-page__suggested-tag"
                  onClick={() => addOccupationTag(s)}
                  disabled={model.occupationTags.includes(s)}
                >
                  + {s}
                </button>
              ))}
            </div>
          </div>

          <div className="canvas-settings-page__field canvas-settings-page__field--wide">
            <div className="canvas-settings-page__label-row">
              <label htmlFor="more-information" className="canvas-settings-page__label">
                More information
              </label>
              <span
                className="canvas-settings-page__info-wrap"
                title="Optional extra context always included with your personalization profile."
              >
                <IconInfoCircle className="canvas-settings-page__info-icon" aria-hidden />
                <span className="canvas-settings-page__sr-only">Help</span>
              </span>
            </div>
            <input
              id="more-information"
              className="canvas-settings-page__text-input"
              type="text"
              value={model.moreInformation}
              placeholder="Default"
              onChange={(e) => commit({ ...model, moreInformation: e.target.value })}
            />
          </div>

          <div className="canvas-settings-page__field canvas-settings-page__field--wide">
            <h3 className="canvas-settings-page__field-heading">Acronym / Shorthand</h3>
            <div className="canvas-settings-page__acronym-grid">
              <div className="canvas-settings-page__field">
                <label className="canvas-settings-page__label" htmlFor="acronym-shorthand">
                  Shorthand
                </label>
                <input
                  id="acronym-shorthand"
                  className="canvas-settings-page__text-input"
                  type="text"
                  value={acronymShorthand}
                  onChange={(e) => setAcronymShorthand(e.target.value)}
                  placeholder="Ex. SFO"
                  autoComplete="off"
                />
              </div>
              <div className="canvas-settings-page__field">
                <label className="canvas-settings-page__label" htmlFor="acronym-expansion">
                  Expands to
                </label>
                <input
                  id="acronym-expansion"
                  className="canvas-settings-page__text-input"
                  type="text"
                  value={acronymExpansion}
                  onChange={(e) => setAcronymExpansion(e.target.value)}
                  placeholder="Ex. SF Meraki Network"
                  autoComplete="off"
                />
              </div>
            </div>
            <button type="button" className="ai-button ai-button--primary" onClick={addAcronym}>
              + Add term
            </button>

            <div className="canvas-settings-page__field canvas-settings-page__field--wide canvas-settings-page__field--tight-top">
              <label htmlFor="acronym-list" className="canvas-settings-page__label">
                Your acronyms ({model.acronyms.length})
              </label>
              <select
                id="acronym-list"
                className="canvas-settings-page__select"
                value={selectedAcronymId}
                onChange={(e) => setSelectedAcronymId(e.target.value)}
                aria-label="Saved acronyms"
              >
                <option value="">Select a saved acronym…</option>
                {model.acronyms.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.shorthand} — {a.expansion}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="canvas-settings-page__memories">
            <div className="canvas-settings-page__memories-header">
              <h3 className="canvas-settings-page__subsection-title">Saved memories</h3>
              <button type="button" className="ai-button ai-button--primary" onClick={addEntry}>
                Add entry
              </button>
            </div>
            <p className="canvas-settings-page__section-desc canvas-settings-page__section-desc--tight">
              Each row is one structured item the assistant can inject into context. Use clear, short statements.
            </p>

            {model.entries.length === 0 ? (
              <p className="canvas-settings-page__empty">No memories yet. Add an entry to get started.</p>
            ) : (
              <ul className="canvas-settings-page__entry-list" role="list">
                {model.entries.map((entry) => (
                  <li key={entry.id} className="canvas-settings-page__entry">
                    <div className="canvas-settings-page__entry-row">
                      <div className="canvas-settings-page__field canvas-settings-page__field--grow">
                        <label className="canvas-settings-page__label" htmlFor={`kind-${entry.id}`}>
                          Type
                        </label>
                        <select
                          id={`kind-${entry.id}`}
                          className="canvas-settings-page__select"
                          value={entry.kind}
                          onChange={(e) =>
                            updateEntry(entry.id, {
                              kind: e.target.value as PersonalizationEntryKind,
                            })
                          }
                        >
                          {(Object.keys(KIND_LABELS) as PersonalizationEntryKind[]).map((k) => (
                            <option key={k} value={k}>
                              {KIND_LABELS[k]}
                            </option>
                          ))}
                        </select>
                        <p className="canvas-settings-page__hint">{KIND_HELP[entry.kind]}</p>
                      </div>
                      <button
                        type="button"
                        className="canvas-settings-page__remove"
                        aria-label="Remove this memory"
                        onClick={() => removeEntry(entry.id)}
                      >
                        Remove
                      </button>
                    </div>
                    <div className="canvas-settings-page__field">
                      <label className="canvas-settings-page__label" htmlFor={`content-${entry.id}`}>
                        Content
                      </label>
                      <textarea
                        id={`content-${entry.id}`}
                        className="canvas-settings-page__textarea"
                        rows={3}
                        value={entry.content}
                        placeholder="e.g. Prefer Meraki API examples; our standard MTU is 9000 for DC links."
                        onChange={(e) => updateEntry(entry.id, { content: e.target.value })}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
