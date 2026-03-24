import { useState, useRef, useCallback, useEffect } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { ChatInput } from '../components/ChatInput'
import { ChatPanel } from '../components/ChatPanel'
import type { LayoutOutletContext } from '../components/Layout'
import {
  IconSearch,
  IconRocket,
  IconRocketMagnetic,
  IconFile,
  IconEye,
  IconLightning,
  IconNav,
  IconSend,
  IconCaretDown,
} from '../components/icons'

const AGENT_STUDIO_CHOICES = [
  {
    id: 'build',
    title: 'Build an agent',
    description: 'Create a new AI agent from scratch with step-by-step guidance.',
    Icon: IconRocketMagnetic,
    iconBg: 'linear-gradient(to bottom, #9b5ff5, #864ae0)',
  },
  {
    id: 'knowledge',
    title: 'Build knowledge base',
    description: 'Add documents and data sources to power your agents with custom knowledge.',
    Icon: IconFile,
    iconBg: 'linear-gradient(to bottom, #17c2c2, #04a4b0)',
  },
  {
    id: 'browse',
    title: 'Browse Cisco agents',
    description: 'Discover and use pre-built agents from Cisco to automate common tasks.',
    Icon: IconSearch,
    iconBg: 'linear-gradient(to bottom, #6977f0, #505ed9)',
    comingSoon: true,
  },
  {
    id: 'bring',
    title: 'Bring your own agent',
    description: "Connect and manage agents you've built or integrated from other platforms.",
    Icon: IconRocket,
    iconBg: 'linear-gradient(to bottom, #fc8d4c, #f26722)',
    comingSoon: true,
  },
  {
    id: 'observe',
    title: 'Observe your agents in action',
    description: 'Monitor and analyze how your agents perform in real time across workflows.',
    Icon: IconEye,
    iconBg: 'linear-gradient(to bottom, #169855, #0b7b46)',
    comingSoon: true,
  },
  {
    id: 'test-run',
    title: 'Take your agents for a test run',
    description: 'Run your agents in a sandbox to validate behavior before deploying.',
    Icon: IconLightning,
    iconBg: 'linear-gradient(to bottom, #e3447c, #c2306f)',
    comingSoon: true,
  },
]

export function AgentStudioPage() {
  const navigate = useNavigate()
  const { threads, assistantOpen, setAssistantOpen } = useOutletContext<LayoutOutletContext>()
  const [assistantClosing, setAssistantClosing] = useState(false)
  const [threadsPanelOpen, setThreadsPanelOpen] = useState(false)
  const [chatInput, setChatInput] = useState('')
  const [messages, setMessages] = useState<{ id: string; role: 'user' | 'assistant'; text: string; time: string }[]>([])
  const [typing, setTyping] = useState(false)
  const msgsEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    msgsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  const closeAssistant = () => {
    setAssistantClosing(true)
    setTimeout(() => {
      setAssistantClosing(false)
      setAssistantOpen(false)
    }, 300)
  }

  const handleSend = useCallback(() => {
    const text = chatInput.trim()
    if (!text) return
    const now = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: 'user', text, time: now }])
    setChatInput('')
    setTyping(true)
    setTimeout(() => {
      const replyTime = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
      setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: 'assistant', text: "I can help you build, connect, and manage AI agents in Agent Studio. What would you like to create?", time: replyTime }])
      setTyping(false)
    }, 1200)
  }, [chatInput])

  const handleSendFromMain = useCallback(
    (message: string) => {
      const trimmed = message.trim()
      if (!trimmed) return
      navigate('/agent-studio/chat', { state: { initialMessage: trimmed } })
    },
    [navigate],
  )

  return (
    <div
      className={`ai-assistant--agent-studio${assistantOpen || assistantClosing ? ' agent-studio--panel-open' : ''}`}
      role="main"
      style={{
        paddingTop: 72,
        minHeight: '100vh',
        width: '100%',
        position: 'relative',
        overflow: 'visible',
        boxSizing: 'border-box',
        zIndex: 1,
        display: assistantOpen || assistantClosing ? 'flex' : 'block',
        background: '#000217',
      }}
    >
      <div className="agent-studio__content" style={{ position: 'relative', zIndex: 2, padding: '0 16px', color: '#f7f7f7', fontSize: 16, opacity: 1, visibility: 'visible', flex: 1, minWidth: 0 }}>
        <section className="agent-studio__hero" aria-labelledby="agent-studio-title" style={{ color: '#f7f7f7', opacity: 1 }}>
          <h1 id="agent-studio-title" className="agent-studio__title" style={{ fontSize: 40, margin: '0 0 16px', color: '#f7f7f7' }}>
            Welcome to Agent Studio
          </h1>
          <p className="agent-studio__blurb" style={{ fontSize: 18, color: '#889099', margin: '0 auto' }}>
            Agent Studio helps you discover, connect, and build AI agents that automate workflows and extend your team. Let's get started.
          </p>
        </section>

        <div className="agent-studio__chat">
          <ChatInput placeholder="How can I help?" showChips={false} onSubmit={handleSendFromMain} />
        </div>

        <div className="agent-studio__choices">
          {AGENT_STUDIO_CHOICES.map(({ id, title, description, Icon, iconBg }) => (
            <a
              key={id}
              href="#"
              className="agent-studio__card"
              aria-labelledby={`agent-studio-card-${id}-title`}
              onClick={(e) => { if (id === 'build') { e.preventDefault(); navigate('/agent-studio/build') } }}
            >
              <span className="agent-studio__card-icon" aria-hidden style={iconBg ? { background: iconBg } : undefined}>
                <Icon />
              </span>
              <h2 id={`agent-studio-card-${id}-title`} className="agent-studio__card-title">
                {title}
              </h2>
              <p className="agent-studio__card-description">
                {description}
              </p>
            </a>
          ))}
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
                  <p className="canvas-welcome__desc">Ask me anything about building agents, connecting APIs, or managing your Agent Studio workspace.</p>
                </div>
              )}
            </div>
            {messages.length > 0 && (
              <div className="canvas-chat-messages">
                {messages.map((msg) => (
                  <div key={msg.id} className={`canvas-chat-msg canvas-chat-msg--${msg.role}`}>
                    <div className="canvas-chat-msg__header">
                      {msg.role === 'user' ? (
                        <>
                          <span className="canvas-chat-msg__avatar" aria-hidden>A</span>
                          <span className="canvas-chat-msg__name">You</span>
                        </>
                      ) : (
                        <>
                          <span className="canvas-chat-msg__ai-icon" aria-hidden>AI</span>
                          <span className="canvas-chat-msg__name">AI Assistant</span>
                          <span className="canvas-chat-msg__timestamp">{msg.time}</span>
                        </>
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
                    <div className="actions-detail__typing" aria-label="Assistant is typing">
                      <span /><span /><span />
                    </div>
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
                  <button type="button" className="open-canvas__submit-btn" aria-label="Send message" onClick={handleSend}>
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
