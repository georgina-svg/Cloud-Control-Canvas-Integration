import { useState, useRef, useCallback, useEffect } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { ChatPanel } from '../components/ChatPanel'
import type { LayoutOutletContext } from '../components/Layout'
import { IconNav, IconSend, IconCaretDown } from '../components/icons'

const STEPS = [
  { id: 'describe', label: 'Describe',     subtitle: 'Name and describe your agent',     title: 'Describe what you want to build' },
  { id: 'apis',     label: 'Connect APIs', subtitle: 'Choose API integrations',           title: 'Connect APIs' },
  { id: 'data',     label: 'Select Data',  subtitle: 'Pick data sources to reason over',  title: 'Select data sources' },
  { id: 'build',    label: 'Build & Test', subtitle: 'Test and deploy your agent',        title: 'Build and test your agent' },
]

const SAMPLE_APIS = [
  { id: 'intersight', name: 'Cisco Intersight',  desc: 'Infrastructure management and monitoring' },
  { id: 'meraki',     name: 'Cisco Meraki',      desc: 'Network visibility and control' },
  { id: 'webex',      name: 'Webex',             desc: 'Collaboration and messaging platform' },
  { id: 'dnac',       name: 'Catalyst Center',   desc: 'Network automation and assurance' },
  { id: 'duo',        name: 'Cisco Duo',         desc: 'Zero-trust access and authentication' },
  { id: 'xdr',        name: 'Cisco XDR',         desc: 'Extended detection and response' },
]

const SAMPLE_DATA_SOURCES = [
  { id: 'alerts',     name: 'Active Alerts',       desc: 'Real-time infrastructure alerts and incidents' },
  { id: 'inventory',  name: 'Device Inventory',    desc: 'Servers, switches, and fabric interconnects' },
  { id: 'policies',   name: 'Policies & Profiles', desc: 'Service profiles, firmware and config policies' },
  { id: 'telemetry',  name: 'Telemetry & Metrics', desc: 'CPU, memory, network performance data' },
  { id: 'logs',       name: 'System Logs',         desc: 'Audit trails and event logs' },
  { id: 'compliance', name: 'Compliance Reports',  desc: 'Security posture and compliance status' },
]

const AGENT_ROLES = [
  'Network Operations',
  'Infrastructure Monitoring',
  'Incident Response',
  'Capacity Planning',
  'Security Operations',
]

export function BuildAgentPage() {
  const navigate = useNavigate()
  const { threads, assistantOpen, setAssistantOpen } = useOutletContext<LayoutOutletContext>()
  const [assistantClosing, setAssistantClosing] = useState(false)
  const [threadsPanelOpen, setThreadsPanelOpen] = useState(false)
  const [chatInput, setChatInput] = useState('')
  const [messages, setMessages] = useState<{ id: string; role: 'user' | 'assistant'; text: string; time: string }[]>([])
  const [typing, setTyping] = useState(false)
  const msgsEndRef = useRef<HTMLDivElement>(null)
  const replyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    msgsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  const closeAssistant = () => {
    setAssistantClosing(true)
    setTimeout(() => { setAssistantClosing(false); setAssistantOpen(false) }, 300)
  }

  const AGENT_REPLIES = [
    "I can help you refine this agent further. Which aspect would you like to improve — the data sources, the API connections, or the agent's reasoning behavior?",
    "Great question. Based on the agent configuration you've set up, I'd recommend also connecting the Telemetry & Metrics data source to give the agent better context for anomaly detection.",
    "I can generate a step-by-step remediation plan. Should I prioritize by severity, affected clients, or estimated resolution time?",
    "The agent is configured to monitor Cisco Intersight in real time. I can also set up automated alerts for when thresholds are exceeded — would you like to enable that?",
    "Understood. I'll refine the agent's response policy to include escalation paths for P1 incidents. Anything else you'd like to adjust before deploying?",
  ]

  const handleSend = useCallback(() => {
    const text = chatInput.trim()
    if (!text || typing) return
    const now = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    setMessages((prev) => {
      const updated = [...prev, { id: crypto.randomUUID(), role: 'user' as const, text, time: now }]
      const turnIndex = Math.floor(updated.filter(m => m.role === 'assistant').length) % AGENT_REPLIES.length
      if (replyTimerRef.current) clearTimeout(replyTimerRef.current)
      replyTimerRef.current = setTimeout(() => {
        const replyTime = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
        setMessages((prev2) => [...prev2, { id: crypto.randomUUID(), role: 'assistant', text: AGENT_REPLIES[turnIndex], time: replyTime }])
        setTyping(false)
      }, 1200)
      return updated
    })
    setChatInput('')
    setTyping(true)
  }, [chatInput, typing])

  const [step, setStep] = useState(0)
  const [agentName, setAgentName] = useState('')
  const [agentDesc, setAgentDesc] = useState('')
  const [selectedRole, setSelectedRole] = useState('')
  const [connectedApis, setConnectedApis] = useState<Set<string>>(new Set())
  const [selectedData, setSelectedData] = useState<Set<string>>(new Set())
  const [testInput, setTestInput] = useState('')
  const [deployed, setDeployed] = useState(false)

  const isStepAccessible = (i: number) => {
    if (i === 0) return true
    if (i === 1) return agentName.trim().length > 0 && agentDesc.trim().length > 0
    if (i === 2) return connectedApis.size > 0
    if (i === 3) return selectedData.size > 0
    return false
  }

  const canAdvance = () => isStepAccessible(step + 1)

  const toggleApi = (id: string) => {
    setConnectedApis((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
  }

  const toggleData = (id: string) => {
    setSelectedData((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
  }

  const handleTest = () => {
    if (!testInput.trim()) return
    const text = testInput.trim()
    const now = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    setMessages([{ id: crypto.randomUUID(), role: 'user', text, time: now }])
    setAssistantOpen(true)
    setTyping(true)
    setTimeout(() => {
      const replyTime = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
      setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: 'assistant', text: 'Based on the connected data sources, I found 3 critical alerts in Cisco Intersight. The FI-6400 Fabric Interconnect is degraded affecting 1,247 clients. I recommend reviewing port utilization and checking for firmware updates. Do you want me to generate a remediation plan?', time: replyTime }])
      setTyping(false)
    }, 1400)
  }

  const handleDeploy = () => {
    setDeployed(true)
    setTimeout(() => navigate('/agent-studio'), 2000)
  }

  return (
    <div className={`build-agent-page${assistantOpen || assistantClosing ? ' build-agent-page--assistant-open' : ''}`}>

      {/* Left sidebar */}
      <aside className="build-agent-page__sidebar">
        <nav className="build-agent-page__step-nav" aria-label="Build steps">
          {STEPS.map((s, i) => {
            const done = i < step
            const active = i === step
            const accessible = isStepAccessible(i)
            return (
              <button
                key={s.id}
                type="button"
                className={`build-agent-page__step-item${active ? ' build-agent-page__step-item--active' : ''}${done ? ' build-agent-page__step-item--done' : ''}${!accessible && !done ? ' build-agent-page__step-item--locked' : ''}`}
                onClick={() => accessible && setStep(i)}
                aria-current={active ? 'step' : undefined}
                disabled={!accessible && !done}
              >
                <div className="build-agent-page__step-track">
                  <div className="build-agent-page__step-dot">
                    {done ? (
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
                        <path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ) : (
                      <span>{i + 1}</span>
                    )}
                  </div>
                  {i < STEPS.length - 1 && <div className="build-agent-page__step-line" />}
                </div>
                <div className="build-agent-page__step-text">
                  <span className="build-agent-page__step-label">{s.label}</span>
                  <span className="build-agent-page__step-sub">{s.subtitle}</span>
                </div>
              </button>
            )
          })}
        </nav>
      </aside>

      {/* Right content */}
      <div className="build-agent-page__main">
        <div className="build-agent-page__content">

          {/* Step 0 — Describe */}
          {step === 0 && (
            <div className="build-agent-page__panel">
              <div className="build-agent-page__panel-header">
                <h2 className="build-agent-page__panel-title">{STEPS[0].title}</h2>
                <p className="build-agent-page__panel-desc">Give your agent a name, describe its purpose, and pick a role.</p>
              </div>
              <div className="build-agent-page__field">
                <label className="build-agent-page__label" htmlFor="agent-name">Agent name</label>
                <input id="agent-name" type="text" className="build-agent-page__input" placeholder="e.g. Network Ops Assistant" value={agentName} onChange={(e) => setAgentName(e.target.value)} />
              </div>
              <div className="build-agent-page__field">
                <label className="build-agent-page__label" htmlFor="agent-desc">What should this agent do?</label>
                <textarea id="agent-desc" className="build-agent-page__textarea" placeholder="Describe the agent's goal, the problems it solves, and who it helps..." rows={4} value={agentDesc} onChange={(e) => setAgentDesc(e.target.value)} />
              </div>
              <div className="build-agent-page__field">
                <label className="build-agent-page__label">Role</label>
                <div className="build-agent-page__role-chips">
                  {AGENT_ROLES.map((r) => (
                    <button key={r} type="button" className={`build-agent-page__role-chip${selectedRole === r ? ' build-agent-page__role-chip--active' : ''}`} onClick={() => setSelectedRole(r)}>{r}</button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 1 — Connect APIs */}
          {step === 1 && (
            <div className="build-agent-page__panel">
              <div className="build-agent-page__panel-header">
                <h2 className="build-agent-page__panel-title">{STEPS[1].title}</h2>
                <p className="build-agent-page__panel-desc">Select the Cisco APIs your agent can access to take action and retrieve data.</p>
              </div>
              <div className="build-agent-page__api-grid">
                {SAMPLE_APIS.map((api) => (
                  <button key={api.id} type="button" className={`build-agent-page__api-card${connectedApis.has(api.id) ? ' build-agent-page__api-card--active' : ''}`} onClick={() => toggleApi(api.id)} aria-pressed={connectedApis.has(api.id)}>
                    <div className="build-agent-page__api-check" aria-hidden>
                      {connectedApis.has(api.id) && (
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      )}
                    </div>
                    <div className="build-agent-page__api-name">{api.name}</div>
                    <div className="build-agent-page__api-desc">{api.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2 — Select Data */}
          {step === 2 && (
            <div className="build-agent-page__panel">
              <div className="build-agent-page__panel-header">
                <h2 className="build-agent-page__panel-title">{STEPS[2].title}</h2>
                <p className="build-agent-page__panel-desc">Choose which data your agent can read and reason over.</p>
              </div>
              <div className="build-agent-page__data-list">
                {SAMPLE_DATA_SOURCES.map((ds) => (
                  <button key={ds.id} type="button" className={`build-agent-page__data-row${selectedData.has(ds.id) ? ' build-agent-page__data-row--active' : ''}`} onClick={() => toggleData(ds.id)} aria-pressed={selectedData.has(ds.id)}>
                    <div className={`build-agent-page__data-checkbox${selectedData.has(ds.id) ? ' build-agent-page__data-checkbox--checked' : ''}`} aria-hidden>
                      {selectedData.has(ds.id) && (
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      )}
                    </div>
                    <div>
                      <div className="build-agent-page__data-name">{ds.name}</div>
                      <div className="build-agent-page__data-desc">{ds.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3 — Build & Test */}
          {step === 3 && (
            <div className="build-agent-page__panel">
              <div className="build-agent-page__panel-header">
                <h2 className="build-agent-page__panel-title">{STEPS[3].title}</h2>
                <p className="build-agent-page__panel-desc">Your agent is configured. Test it with a sample prompt before deploying.</p>
              </div>
              <div className="build-agent-page__summary">
                <div className="build-agent-page__summary-row">
                  <span className="build-agent-page__summary-key">Name</span>
                  <span className="build-agent-page__summary-val">{agentName}</span>
                </div>
                {selectedRole && (
                  <div className="build-agent-page__summary-row">
                    <span className="build-agent-page__summary-key">Role</span>
                    <span className="build-agent-page__summary-val">{selectedRole}</span>
                  </div>
                )}
                <div className="build-agent-page__summary-row">
                  <span className="build-agent-page__summary-key">APIs connected</span>
                  <span className="build-agent-page__summary-val">{connectedApis.size}</span>
                </div>
                <div className="build-agent-page__summary-row">
                  <span className="build-agent-page__summary-key">Data sources</span>
                  <span className="build-agent-page__summary-val">{selectedData.size} selected</span>
                </div>
              </div>
              <div className="build-agent-page__test-area">
                <label className="build-agent-page__label" htmlFor="test-prompt">Test prompt</label>
                <div className="build-agent-page__test-row">
                  <input id="test-prompt" type="text" className="build-agent-page__input" placeholder="Ask your agent something…" value={testInput} onChange={(e) => setTestInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') handleTest() }} />
                  <button type="button" className="build-agent-page__run-btn" onClick={handleTest} disabled={!testInput.trim()}>
                    Run test
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Nav buttons */}
          <div className="build-agent-page__nav">
            {step > 0 && (
              <button type="button" className="build-agent-page__btn-back" onClick={() => setStep((s) => s - 1)}>Back</button>
            )}
            <div style={{ flex: 1 }} />
            {step < STEPS.length - 1 ? (
              <button type="button" className="build-agent-page__btn-next" disabled={!canAdvance()} onClick={() => setStep((s) => s + 1)}>Continue</button>
            ) : (
              <button type="button" className={`build-agent-page__btn-next${deployed ? ' build-agent-page__btn-next--deployed' : ''}`} onClick={handleDeploy} disabled={deployed}>
                {deployed ? 'Deployed ✓' : 'Deploy agent'}
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Docked assistant panel */}
      {(assistantOpen || assistantClosing) && (
        <div className={`isp__assistant-panel${assistantClosing ? ' isp__assistant-panel--closing' : ''}`}>
          {threadsPanelOpen && (
            <ChatPanel canvasInline onClose={() => setThreadsPanelOpen(false)} injectedThreads={threads} />
          )}
          <header className="open-canvas__chat-header">
            <button type="button" className="open-canvas__expand-btn" aria-label="Toggle threads" onClick={() => setThreadsPanelOpen((v) => !v)}>
              <IconNav />
            </button>
          </header>
          <div className="open-canvas__assistant-body">
            <div className="canvas-welcome">
              {messages.length === 0 && (
                <div className="canvas-welcome__hero">
                  <h2 className="canvas-welcome__heading">How can I help?</h2>
                  <p className="canvas-welcome__desc">Ask me anything about building agents, connecting APIs, or managing your workspace.</p>
                </div>
              )}
            </div>
            {messages.length > 0 && (
              <div className="canvas-chat-messages">
                {messages.map((msg) => (
                  <div key={msg.id} className={`canvas-chat-msg canvas-chat-msg--${msg.role}`}>
                    <div className="canvas-chat-msg__header">
                      {msg.role === 'user' ? (
                        <><span className="canvas-chat-msg__avatar" aria-hidden>A</span><span className="canvas-chat-msg__name">You</span></>
                      ) : (
                        <><span className="canvas-chat-msg__ai-icon" aria-hidden>AI</span><span className="canvas-chat-msg__name">AI Assistant</span><span className="canvas-chat-msg__timestamp">{msg.time}</span></>
                      )}
                    </div>
                    <p className="canvas-chat-msg__text">{msg.text}</p>
                  </div>
                ))}
                {typing && (
                  <div className="canvas-chat-msg canvas-chat-msg--assistant">
                    <div className="canvas-chat-msg__header">
                      <span className="canvas-chat-msg__ai-icon" aria-hidden>AI</span>
                      <span className="canvas-chat-msg__name">AI Assistant</span>
                    </div>
                    <div className="actions-detail__typing" aria-label="Assistant is typing"><span /><span /><span /></div>
                  </div>
                )}
                <div ref={msgsEndRef} />
              </div>
            )}
          </div>
          <footer className="open-canvas__chat-footer">
            <div className="open-canvas__input-wrap">
              <div className="open-canvas__input-field">
                <input
                  type="text"
                  className="open-canvas__input-placeholder"
                  placeholder="Ask AI Assistant a question, / for prompts"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
                  aria-label="Ask AI Assistant"
                />
                <div className="open-canvas__input-toolbar">
                  <div className="open-canvas__input-chips">
                    <button type="button" className="open-canvas__input-auto-btn" aria-label="Model: Auto">
                      Auto <IconCaretDown className="open-canvas__input-auto-caret" />
                    </button>
                  </div>
                  <button type="button" className="open-canvas__submit-btn" aria-label="Send message" onClick={handleSend} disabled={!chatInput.trim() || typing}>
                    <IconSend />
                  </button>
                </div>
              </div>
              <p className="open-canvas__disclaimer">AI Assistant can make mistakes. Verify responses.</p>
            </div>
          </footer>
        </div>
      )}
    </div>
  )
}
