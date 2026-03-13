import { useState, useCallback } from 'react'
import { ChatInput } from '../components/ChatInput'
import { AgentStudioChatPanel } from '../components/AgentStudioChatPanel'
import type { ChatMessage } from '../components/AgentStudioChatPanel'
import {
  IconSearch,
  IconRocket,
  IconRocketMagnetic,
  IconFile,
  IconEye,
  IconLightning,
} from '../components/icons'

const AGENT_STUDIO_CHOICES = [
  {
    id: 'browse',
    title: 'Browse Cisco agents',
    description: 'Discover and use pre-built agents from Cisco to automate common tasks.',
    Icon: IconSearch,
  },
  {
    id: 'bring',
    title: 'Bring your own agent',
    description: 'Connect and manage agents you’ve built or integrated from other platforms.',
    Icon: IconRocket,
  },
  {
    id: 'build',
    title: 'Build an agent',
    description: 'Create a new AI agent from scratch with step-by-step guidance.',
    Icon: IconRocketMagnetic,
  },
  {
    id: 'knowledge',
    title: 'Build knowledge base',
    description: 'Add documents and data sources to power your agents with custom knowledge.',
    Icon: IconFile,
  },
  {
    id: 'observe',
    title: 'Observe your agents in action',
    description: 'Monitor and analyze how your agents perform in real time across workflows.',
    Icon: IconEye,
  },
  {
    id: 'test-run',
    title: 'Take your agents for a test run',
    description: 'Run your agents in a sandbox to validate behavior before deploying.',
    Icon: IconLightning,
  },
]

const pageStyle: React.CSSProperties = {
  paddingTop: 72,
  minHeight: '100vh',
  width: '100%',
  position: 'relative',
  overflow: 'visible',
  boxSizing: 'border-box',
  zIndex: 1,
  display: 'block',
  background: '#000217',
}
const contentStyle: React.CSSProperties = {
  position: 'relative',
  zIndex: 2,
  padding: '0 16px',
  color: '#f7f7f7',
  fontSize: 16,
  opacity: 1,
  visibility: 'visible',
}

export function AgentStudioPage() {
  const [chatPanelOpen, setChatPanelOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])

  const handleSendFromMain = useCallback((message: string) => {
    const trimmed = message.trim()
    if (!trimmed) return
    setMessages([{ id: '0', role: 'user', text: trimmed }])
    setChatPanelOpen(true)
  }, [])

  const handleSendFromPanel = useCallback((text: string) => {
    const trimmed = text.trim()
    if (!trimmed) return
    setMessages((prev) => [...prev, { id: String(prev.length), role: 'user', text: trimmed }])
  }, [])

  return (
    <div
      className={`ai-assistant--agent-studio${chatPanelOpen ? ' agent-studio--panel-open' : ''}`}
      role="main"
      style={pageStyle}
    >
      {chatPanelOpen && (
        <div className="agent-studio__docked-panel-wrap">
          <AgentStudioChatPanel
            onClose={() => setChatPanelOpen(false)}
            messages={messages}
            onSend={handleSendFromPanel}
          />
        </div>
      )}
      <div className="agent-studio__content" style={contentStyle}>
      <section className="agent-studio__hero" aria-labelledby="agent-studio-title" style={{ color: '#f7f7f7', opacity: 1 }}>
        <h1 id="agent-studio-title" className="agent-studio__title" style={{ fontSize: 40, margin: '0 0 16px', color: '#f7f7f7' }}>
          Welcome to Agent Studio
        </h1>
        <p className="agent-studio__blurb" style={{ fontSize: 18, color: '#889099', margin: '0 auto' }}>
          Agent Studio helps you discover, connect, and build AI agents that automate workflows and extend your team. Choose an option below to get started.
        </p>
      </section>

      <div className="agent-studio__chat">
        <ChatInput
          placeholder="What would you like to build today?"
          showChips={false}
          onSubmit={handleSendFromMain}
        />
      </div>

      <div className="agent-studio__choices">
        {AGENT_STUDIO_CHOICES.map(({ id, title, description, Icon }) => (
          <a
            key={id}
            href="#"
            className="agent-studio__card"
            aria-labelledby={`agent-studio-card-${id}-title`}
          >
            <span className="agent-studio__card-icon" aria-hidden>
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
    </div>
  )
}
