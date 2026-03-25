import { useState, useRef, useCallback, useEffect } from 'react'
import { useNavigate, useOutletContext, useLocation } from 'react-router-dom'
import { ChatInput } from '../components/ChatInput'
import { ChatPanel } from '../components/ChatPanel'
import type { LayoutOutletContext } from '../components/Layout'
import {
  IconSearch, IconRocket, IconRocketMagnetic, IconFile, IconEye, IconLightning,
  IconNav, IconSend, IconCaretDown,
} from '../components/icons'
import type React from 'react'

// ── Sidebar nav ───────────────────────────────────────────────────────────────

const SIDEBAR_ITEMS = [
  {
    label: 'My Agents',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
        <circle cx="8" cy="5.5" r="2.5" stroke="currentColor" strokeWidth="1.3"/>
        <path d="M2.5 13.5c0-3.038 2.462-5.5 5.5-5.5s5.5 2.462 5.5 5.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: 'Templates',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
        <rect x="2" y="2" width="5.5" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.3"/>
        <rect x="8.5" y="2" width="5.5" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.3"/>
        <rect x="2" y="8.5" width="5.5" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.3"/>
        <rect x="8.5" y="8.5" width="5.5" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.3"/>
      </svg>
    ),
  },
  {
    label: 'Knowledge Bases',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
        <path d="M3 3h10v10H3z" stroke="currentColor" strokeWidth="1.3" fill="none" rx="1"/>
        <line x1="5.5" y1="6" x2="10.5" y2="6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
        <line x1="5.5" y1="8.5" x2="10.5" y2="8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
        <line x1="5.5" y1="11" x2="8.5" y2="11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: 'Deployments',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
        <path d="M8 2L14 5v6L8 14 2 11V5L8 2z" stroke="currentColor" strokeWidth="1.3" fill="none"/>
        <circle cx="8" cy="8" r="2" fill="currentColor" opacity="0.7"/>
      </svg>
    ),
  },
]

const SIDEBAR_BOTTOM = [
  {
    label: 'API Keys',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
        <circle cx="6" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.3"/>
        <path d="M8.5 8h5.5M12 6.5V8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: 'Settings',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
        <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.3"/>
        <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.41 1.41M11.54 11.54l1.41 1.41M3.05 12.95l1.41-1.41M11.54 4.46l1.41-1.41" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    ),
  },
]

// ── Agent templates ───────────────────────────────────────────────────────────

const AGENT_TEMPLATES = [
  {
    id: 'incident-response',
    title: 'Incident Response Agent',
    description: 'Automatically detect, triage, and respond to P1/P2 incidents across your Cisco infrastructure.',
    Icon: IconLightning,
    color: 'canvas-card--orange',
  },
  {
    id: 'network-health',
    title: 'Network Health Monitor Agent',
    description: 'Continuously monitor network health, surface anomalies, and alert your team before issues escalate.',
    Icon: IconEye,
    color: 'canvas-card--blue',
  },
  {
    id: 'alert-correlation',
    title: 'Alert Correlation Agent',
    description: 'Reduce alert noise by correlating related events and surfacing only the signals that matter.',
    Icon: IconSearch,
    color: 'canvas-card--pink',
  },
  {
    id: 'change-validation',
    title: 'Change Validation Agent',
    description: 'Validate network changes before and after deployment to catch regressions automatically.',
    Icon: IconRocketMagnetic,
    color: 'canvas-card--purple',
  },
  {
    id: 'device-inventory',
    title: 'Device Inventory Agent',
    description: 'Track device inventory, firmware versions, and compliance status across all your sites.',
    Icon: IconFile,
    color: 'canvas-card--green',
  },
  {
    id: 'wireless-performance',
    title: 'Wireless Performance Agent',
    description: 'Monitor wireless KPIs, detect interference, and recommend configuration improvements in real time.',
    Icon: IconRocket,
    color: 'canvas-card--teal',
  },
]

// ── Suggestion chips ──────────────────────────────────────────────────────────

const SUGGESTIONS = [
  'Troubleshooting incidents faster',
  'Monitor & fix wireless issues',
  'Build agents from my documentation',
  'Automate change validation',
  'Correlate alerts and reduce noise',
]

// ── Component ─────────────────────────────────────────────────────────────────

export function AgentStudioPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { threads, assistantOpen, setAssistantOpen } = useOutletContext<LayoutOutletContext>()
  const [threadsPanelOpen, setThreadsPanelOpen] = useState(false)
  const [chatInput, setChatInput] = useState('')
  const [messages, setMessages] = useState<{ id: string; role: 'user' | 'assistant'; text: string; time: string }[]>([])
  const [typing, setTyping] = useState(false)
  const [chatMode, setChatMode] = useState(false)

  // Reset to landing when nav button clicked while already on this page
  useEffect(() => {
    const state = location.state as null | { reset?: number }
    if (state?.reset) {
      setChatMode(false)
      setMessages([])
      setAssistantOpen(false)
    }
  }, [location.state, setAssistantOpen])
  const msgsEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    msgsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])


  const AGENT_REPLIES = [
    "I can help you build, connect, and manage AI agents in Agent Studio. What would you like to create?",
    "Great — I can help with that. Would you like to start by defining the agent's role, or jump straight into connecting your data sources?",
    "To set this up effectively, I'll need to know which Cisco APIs you'd like to integrate. Intersight, Meraki, and Catalyst Center are the most common starting points.",
    "That's a solid use case. I'd recommend enabling the Telemetry & Metrics data source so the agent can detect anomalies in real time. Want me to add that?",
    "Understood. I'll refine the agent's behavior to prioritize P1 incidents and auto-escalate when thresholds are exceeded. Anything else before we finalize?",
  ]

  const replyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const sendMessage = useCallback((text: string) => {
    if (!text.trim() || typing) return
    const now = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    setMessages((prev) => {
      const updated = [...prev, { id: crypto.randomUUID(), role: 'user' as const, text: text.trim(), time: now }]
      const turnIndex = prev.filter(m => m.role === 'assistant').length % AGENT_REPLIES.length
      if (replyTimerRef.current) clearTimeout(replyTimerRef.current)
      replyTimerRef.current = setTimeout(() => {
        const replyTime = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
        setMessages((prev2) => [...prev2, { id: crypto.randomUUID(), role: 'assistant', text: AGENT_REPLIES[turnIndex], time: replyTime }])
        setTyping(false)
      }, 1200)
      return updated
    })
    setTyping(true)
    setChatMode(true)
  }, [typing])

  const handleSend = useCallback(() => {
    if (!chatInput.trim()) return
    sendMessage(chatInput)
    setChatInput('')
  }, [chatInput, sendMessage])


  return (
    <div className="as2-page">

      {/* Left sidebar */}
      <aside className="as2-sidebar">
        <button type="button" className="as2-sidebar__new-btn" onClick={() => navigate('/agent-studio/build')}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
            <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          New agent
        </button>

        <nav className="as2-sidebar__nav">
          {SIDEBAR_ITEMS.map((item) => (
            <button key={item.label} type="button" className="as2-sidebar__nav-item">
              <span className="as2-sidebar__nav-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

      </aside>

      {/* Main area */}
      <div className={`as2-main${chatMode ? ' as2-main--chat' : ''}`}>
        <div className="as2-glow" aria-hidden />

        {chatMode ? (
          /* ── Chat mode ── */
          <div className="as2-chat-wrap">
            <div className="as2-chat-messages">
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
            <div className="as2-chat-input-bar">
              <div className="as2-chat-input-inner">
                <ChatInput
                  placeholder="Describe the agent you want to build, or ask anything…"
                  showChips={false}
                  onSubmit={sendMessage}
                />
              </div>
            </div>
          </div>
        ) : (
          /* ── Landing mode ── */
          <div className="as2-center">

            {/* Greeting */}
            <div className="as2-hero">
              <h1 className="as2-hero__heading">
                <span className="as2-hero__heading-plain">What will you </span>
                <span className="as2-hero__heading-gradient">build today?</span>
              </h1>
              <p className="as2-hero__sub">Build, connect, and deploy AI agents that automate workflows across your Cisco infrastructure.</p>
            </div>

            {/* Input */}
            <ChatInput
              placeholder="Describe the agent you want to build, or ask anything…"
              showChips={false}
              onSubmit={sendMessage}
            />

            {/* Suggestion chips */}
            <div className="as2-suggestions">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  className="as2-suggestion-chip"
                  onClick={() => sendMessage(s)}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Agent template cards */}
            <div className="as2-section">
              <h2 className="as2-section__label">Start with a template</h2>
              <div className="as2-cards">
                {AGENT_TEMPLATES.map(({ id, title, description, Icon, color }) => (
                  <button
                    key={id}
                    type="button"
                    className={`canvas-page__template-card ${color}`}
                    onClick={() => navigate('/agent-studio/build')}
                    aria-label={title}
                    style={{ textAlign: 'left', cursor: 'pointer', width: '100%', border: 'none' }}
                  >
                    <div className="canvas-page__template-top">
                      <div className="canvas-page__template-icon">
                        <Icon />
                      </div>
                    </div>
                    <h3 className="canvas-page__template-title">{title}</h3>
                    <p className="canvas-page__template-description">{description}</p>
                  </button>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>

      {/* Assistant panel */}
      {assistantOpen && (
        <div className="isp__assistant-panel">
          {threadsPanelOpen && (
            <ChatPanel canvasInline onClose={() => setThreadsPanelOpen(false)} injectedThreads={threads} />
          )}
          <header className="open-canvas__chat-header">
            <button type="button" className="open-canvas__expand-btn" aria-label="Toggle threads" onClick={() => setThreadsPanelOpen((v) => !v)}>
              <IconNav />
            </button>
          </header>
          <div className="open-canvas__assistant-body">
            <div className="canvas-welcome__hero" style={{ padding: '32px 24px' }}>
              <h2 className="canvas-welcome__heading">How can I help?</h2>
              <p className="canvas-welcome__desc">Ask me anything about building agents, connecting APIs, or managing your AI Studio workspace.</p>
            </div>
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
                  <button type="button" className="open-canvas__submit-btn" aria-label="Send message" onClick={handleSend} disabled={!chatInput.trim()}>
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
