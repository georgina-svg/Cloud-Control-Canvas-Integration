import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChatInput } from '../components/ChatInput'
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
  const navigate = useNavigate()

  const handleSendFromMain = useCallback(
    (message: string) => {
      const trimmed = message.trim()
      if (!trimmed) return
      navigate('/agent-studio/chat', { state: { initialMessage: trimmed } })
    },
    [navigate],
  )

  return (
    <div className="ai-assistant--agent-studio" role="main" style={pageStyle}>
      <div className="agent-studio__content" style={contentStyle}>
      <section className="agent-studio__hero" aria-labelledby="agent-studio-title" style={{ color: '#f7f7f7', opacity: 1 }}>
        <h1 id="agent-studio-title" className="agent-studio__title" style={{ fontSize: 40, margin: '0 0 16px', color: '#f7f7f7' }}>
          Welcome to Agent Studio
        </h1>
        <p className="agent-studio__blurb" style={{ fontSize: 18, color: '#889099', margin: '0 auto' }}>
          Agent Studio helps you discover, connect, and build AI agents that automate workflows and extend your team. Let's get started.
        </p>
      </section>

      <div className="agent-studio__chat">
        <ChatInput
          placeholder="How can I help?"
          showChips={false}
          onSubmit={handleSendFromMain}
        />
      </div>

      <div className="agent-studio__choices">
        {AGENT_STUDIO_CHOICES.map(({ id, title, description, Icon, comingSoon, iconBg }) => (
          <a
            key={id}
            href="#"
            className={`agent-studio__card${comingSoon ? ' agent-studio__card--disabled' : ''}`}
            aria-labelledby={`agent-studio-card-${id}-title`}
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
    </div>
  )
}
