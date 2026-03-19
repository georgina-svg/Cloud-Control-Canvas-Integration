import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  IconArrowUpRight,
  IconPlus,
  IconMic,
  IconWaveform,
  IconSend,
  IconDotsThree,
  IconStatusNegative,
} from './icons'
import { Button } from './Button'

const TAGS = ['Meraki', 'ThousandEyes', 'SD-WAN Manager', 'Splunk', 'Security Cloud Control']

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  text: string
}

function generateReply(message: string): string {
  const m = message.toLowerCase()
  if (m.includes('rollback') || m.includes('revert'))
    return 'Initiating rollback of policy "BranchOptimize-v2" to the previous stable version. This should restore latency to baseline within 2–3 minutes. I\'ll monitor the recovery and update you once client connectivity normalizes.'
  if (m.includes('latency') || m.includes('slow') || m.includes('performance'))
    return 'Current max latency in Singapore is 795 ms, up from a baseline of ~42 ms. The spike correlates directly with the BranchOptimize-v2 policy deployment at 11:02 today. Affected paths include the MPLS backup route across AP-Southeast-1.'
  if (m.includes('client') || m.includes('user') || m.includes('impact'))
    return '1,583 clients are currently affected across 4 Singapore branch sites. The heaviest impact is on VoIP and video conferencing traffic. Business-critical applications like Webex and Salesforce are showing elevated error rates.'
  if (m.includes('cause') || m.includes('why') || m.includes('root'))
    return 'Root cause: The BranchOptimize-v2 policy modified DiffServ markings for real-time traffic, inadvertently deprioritizing latency-sensitive flows. ThousandEyes confirmed the degradation started 3 minutes after the policy was pushed at 11:02 AM.'
  if (m.includes('escalat') || m.includes('manager') || m.includes('ticket'))
    return 'Escalation drafted to your incident manager (on-call: Priya Sharma). A ServiceNow ticket INC-204817 has been pre-populated with current telemetry. Shall I send it now?'
  return 'Understood. Based on current telemetry from Meraki and ThousandEyes, the Singapore SD-WAN degradation is ongoing. The fastest path to resolution is rolling back "BranchOptimize-v2". Would you like me to proceed?'
}

export interface ActionsDetailProps {
  /** When true, hide the Open canvas button (e.g. when embedded on Open Canvas page) */
  hideOpenCanvas?: boolean
  /** When true, use compact layout for narrow panels */
  compact?: boolean
  /** When provided, "+" in metrics widget calls this (e.g. to add widget to Open Canvas board) */
  onAddMetricsToBoard?: () => void
  /** When true, hide the "+" in metrics widget (e.g. widget already on board) */
  metricsOnBoard?: boolean
}

export function ActionsDetail({ hideOpenCanvas, compact, onAddMetricsToBoard, metricsOnBoard }: ActionsDetailProps = {}) {
  const [inputValue, setInputValue] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const hasText = inputValue.trim().length > 0

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const handleSend = () => {
    const text = inputValue.trim()
    if (!text) return
    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: 'user', text }
    setMessages((prev) => [...prev, userMsg])
    setInputValue('')
    setIsTyping(true)
    setTimeout(() => {
      const reply: ChatMessage = { id: crypto.randomUUID(), role: 'assistant', text: generateReply(text) }
      setMessages((prev) => [...prev, reply])
      setIsTyping(false)
    }, 1200)
  }

  const scrollContent = (
    <>
      <header className="actions-detail__header">
        <div className="actions-detail__toolbar">
          <div className="actions-detail__toolbar-left">
            <IconStatusNegative className="actions-detail__header-status" aria-hidden />
            <h1 className="actions-detail__title">
              Network performance degradation in Singapore caused by latency from an SD‑WAN policy change
            </h1>
          </div>
          <div className="actions-detail__toolbar-actions">
            <button type="button" className="actions-detail__dots-btn" aria-label="More options">
              <IconDotsThree />
            </button>
            {!hideOpenCanvas && (
              <Link to="/canvas/open" className="ai-button ai-button--primary actions-detail__open-canvas">
                Open canvas
                <IconArrowUpRight className="actions-detail__open-icon" />
              </Link>
            )}
          </div>
        </div>
        <div className="actions-detail__header-meta">
          <span className="actions-detail__header-tag">Risk Exposure</span>
          <span className="actions-detail__header-time">Today, 11:05 am</span>
          <span className="actions-detail__assignee-row">
            <span className="actions-detail__avatar">S</span>
            <span>Sean McGinnis</span>
          </span>
        </div>
      </header>

      <hr className="actions-detail__divider" />

      <section className="actions-detail__section">
        <p className="actions-detail__summary">
          <strong>Summary:</strong> Network performance degradation was observed in Singapore as a result of elevated network latency. The latency increase correlated with a recent SD‑WAN policy change (BranchOptimize‑v2), impacting traffic performance across affected connections.
        </p>
        <div className="actions-detail__tags">
          {TAGS.map((tag) => (
            <span key={tag} className="actions-detail__tag">{tag}</span>
          ))}
        </div>
      </section>

      <section className="actions-detail__section">
        <div className="actions-detail__metrics-widget">
          <div className="actions-detail__metrics-widget-header">
            <p className="actions-detail__section-intro">Here’s a quick overview of the incident duration and estimated impact:</p>
            {!metricsOnBoard && onAddMetricsToBoard != null && (
              <button
                type="button"
                className="actions-detail__metrics-widget-add"
                aria-label="Add metric to board"
                onClick={onAddMetricsToBoard}
              >
                <IconPlus />
              </button>
            )}
          </div>
          <div className="actions-detail__metrics">
          <div className="actions-detail__metric">
            <span className="actions-detail__metric-value actions-detail__metric-value--red">00:03:45</span>
            <span className="actions-detail__metric-label">Incident Duration</span>
            <div className="actions-detail__metric-bar actions-detail__metric-bar--red" />
            <span className="actions-detail__metric-axis">10m ago — Live</span>
          </div>
          <div className="actions-detail__metric">
            <span className="actions-detail__metric-value">1,583 Clients</span>
            <span className="actions-detail__metric-label">Estimated Impact</span>
            <div className="actions-detail__metric-chart" />
            <span className="actions-detail__metric-axis">10m ago — Live</span>
          </div>
          <div className="actions-detail__metric">
            <span className="actions-detail__metric-value">795 ms</span>
            <span className="actions-detail__metric-label">Max Latency</span>
            <div className="actions-detail__metric-line" />
            <span className="actions-detail__metric-axis">10m ago — Live</span>
            <button type="button" className="actions-detail__metric-expand" aria-label="Expand chart">
              <IconPlus />
            </button>
          </div>
        </div>
        </div>
      </section>

      <section className="actions-detail__section">
        <p className="actions-detail__recommendation">
          <strong>Recommendation:</strong> Rollback policy &apos;BranchOptimize-v2&apos;.
          <br />
          <strong>Confidence:</strong> High
        </p>
        <p className="actions-detail__prompt">
          Would you like to apply the recommended action and roll back the SD-WAN policy &apos;BranchOptimize-v2&apos;?
        </p>
      </section>

      <div className="actions-detail__actions">
        <Button variant="secondary" type="button" className="ai-button--blue-border">Rollback policy &apos;BranchOptimize-v2&apos;</Button>
        <Button variant="secondary" type="button">Escalate to incident manager</Button>
        <Button variant="secondary" type="button">Show issues in Topology</Button>
      </div>
    </>
  )

  return (
    <div className={`actions-detail${compact ? ' actions-detail--compact' : ''}`}>
      {compact ? <div className="actions-detail__scroll">{scrollContent}</div> : scrollContent}

      {messages.length > 0 && (
        <div className="actions-detail__messages">
          {messages.map((msg) => (
            <div key={msg.id} className={`actions-detail__bubble actions-detail__bubble--${msg.role}`}>
              {msg.role === 'assistant' && (
                <span className="actions-detail__bubble-avatar" aria-hidden>AI</span>
              )}
              <p className="actions-detail__bubble-text">{msg.text}</p>
            </div>
          ))}
          {isTyping && (
            <div className="actions-detail__bubble actions-detail__bubble--assistant">
              <span className="actions-detail__bubble-avatar" aria-hidden>AI</span>
              <div className="actions-detail__typing" aria-label="Assistant is typing">
                <span /><span /><span />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      )}

      <div className="actions-detail__chat">
        <div className="ai-assistant__chat-field">
          <div className="ai-assistant__chat-field-inner">
            {!hasText && (
              <button type="button" className="ai-assistant__chat-field-btn" aria-label="Add attachment">
                <IconPlus />
              </button>
            )}
            <input
              type="text"
              className="ai-assistant__chat-placeholder"
              placeholder="Ask anything"
              aria-label="Ask anything"
              autoComplete="off"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
            />
          </div>
          {hasText ? (
            <button
              type="button"
              className="ai-assistant__chat-field-btn ai-assistant__chat-field-btn--highlight"
              aria-label="Send message"
              onClick={handleSend}
            >
              <IconSend />
            </button>
          ) : (
            <>
              <button type="button" className="ai-assistant__chat-field-btn" aria-label="Voice input">
                <IconMic />
              </button>
              <button type="button" className="ai-assistant__chat-field-btn ai-assistant__chat-field-btn--highlight" aria-label="Waveform">
                <IconWaveform />
              </button>
            </>
          )}
        </div>
      </div>

      <footer className="ai-assistant__footer actions-detail__footer">
        Prompts and responses are only visible to you. Assistant can make mistakes. Verify responses.
      </footer>
    </div>
  )
}
