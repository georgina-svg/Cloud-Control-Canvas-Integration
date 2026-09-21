import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { Link, useNavigate, useOutletContext } from 'react-router-dom'
import type { LayoutOutletContext } from '../components/Layout'
import {
  IconSettings,
  IconTopologyNodes,
  IconDotsThree,
  IconCaretDown,
  IconNav,
  IconSend,
  IconPlus,
  IconInfoCircle,
  IconGrid,
  IconListBullets,
  IconBarChart,
  IconCodeDebug,
  IconBug,
  IconCloud,
  IconFile,
} from '../components/icons'
import { Sidebar } from '../components/Sidebar'
import { ChatPanel } from '../components/ChatPanel'
import {
  LOCAL_DEMO_USER_ID,
  formatPersonalizationForAssistantContext,
  userHasPersonalizationContext,
} from '../lib/assistantPersonalization'

/** Sample rows for the All canvases list view */
const CANVAS_LIST_ROWS = [
  { id: '1', name: 'Hybrid Cloud Infrastructure Optimization Implementation', created: 'Today, 2:30 PM', modified: '8 minutes ago', owner: 'You' },
  { id: '2', name: 'Packet Loss Analysis Template', created: 'Today, 2:22 PM', modified: '8 minutes ago', owner: 'You' },
  { id: '3', name: 'Network Troubleshooting', created: 'Today, 2:18 PM', modified: '8 minutes ago', owner: 'You' },
  { id: '4', name: 'Packet Loss Analysis Template', created: 'Yesterday', modified: '8 minutes ago', owner: 'You' },
  { id: '5', name: 'Network Troubleshooting', created: 'Yesterday', modified: '8 minutes ago', owner: 'You' },
  { id: '6', name: 'Hybrid Cloud Infrastructure Optimization Implementation', created: 'Mar 7, 2025', modified: '8 minutes ago', owner: 'You' },
  { id: '7', name: 'Hybrid Cloud Infrastructure Optimization Implementation', created: 'Mar 6, 2025', modified: '8 minutes ago', owner: 'You' },
  { id: '8', name: 'Packet Loss Analysis Template', created: 'Mar 5, 2025', modified: '8 minutes ago', owner: 'You' },
  { id: '9', name: 'Network Troubleshooting', created: 'Mar 4, 2025', modified: '8 minutes ago', owner: 'You' },
]

const QUICK_START = [
  {
    title: 'Network Performance Analysis',
    description: 'Analyze network performance bottlenecks.',
    Icon: IconBarChart,
    prompt: 'Analyze network performance bottlenecks across my sites.',
  },
  {
    title: 'Code Optimization and Debugging',
    description: 'Identify and resolve code inefficiencies.',
    Icon: IconCodeDebug,
    prompt: 'Identify and resolve code inefficiencies in my automation scripts.',
  },
  {
    title: 'Network Chart Visualization',
    description: 'Analyze network performance bottlenecks.',
    Icon: IconTopologyNodes,
    prompt: 'Visualize network performance bottlenecks as charts.',
  },
  {
    title: 'Packet Loss Root Cause Analysis',
    description: 'Pinpoint the source of packet loss issues.',
    Icon: IconBug,
    prompt: 'Pinpoint the source of packet loss issues.',
  },
  {
    title: 'Real-time Network Monitoring',
    description: 'Monitor your network in real-time with key metrics.',
    Icon: IconFile,
    prompt: 'Monitor my network in real-time with key metrics.',
  },
  {
    title: 'Cloud Migration Strategy',
    description: 'Plan your cloud migration with this strategic template.',
    Icon: IconCloud,
    prompt: 'Plan a cloud migration strategy for my hybrid infrastructure.',
  },
] as const

type CanvasPreviewVariant = 'charts' | 'flow' | 'ops'

const RECENT_CANVASES: {
  id: string
  title: string
  edited: string
  preview: CanvasPreviewVariant
}[] = [
  { id: 'r1', title: 'Hybrid Cloud Infrastructure Optimization Implementation', edited: 'Edited 8 minutes ago', preview: 'charts' },
  { id: 'r2', title: 'Packet Loss Analysis Template', edited: 'Edited 8 minutes ago', preview: 'flow' },
  { id: 'r3', title: 'Network Troubleshooting', edited: 'Edited 8 minutes ago', preview: 'ops' },
  { id: 'r4', title: 'Packet Loss Analysis Template', edited: 'Edited 8 minutes ago', preview: 'flow' },
  { id: 'r5', title: 'Network Troubleshooting', edited: 'Edited 8 minutes ago', preview: 'ops' },
  { id: 'r6', title: 'Hybrid Cloud Infrastructure Optimization Implementation', edited: 'Edited 8 minutes ago', preview: 'charts' },
  { id: 'r7', title: 'Hybrid Cloud Infrastructure Optimization Implementation', edited: 'Edited 8 minutes ago', preview: 'charts' },
  { id: 'r8', title: 'Packet Loss Analysis Template', edited: 'Edited 8 minutes ago', preview: 'flow' },
  { id: 'r9', title: 'Network Troubleshooting', edited: 'Edited 8 minutes ago', preview: 'ops' },
]

function CanvasThumb({ variant }: { variant: CanvasPreviewVariant }) {
  return (
    <div className={`canvas-hub__thumb canvas-hub__thumb--${variant}`} aria-hidden>
      {variant === 'charts' && (
        <>
          <div className="canvas-hub__widget canvas-hub__widget--cyan">
            <span className="canvas-hub__spark canvas-hub__spark--line" />
          </div>
          <div className="canvas-hub__widget canvas-hub__widget--teal">
            <span className="canvas-hub__spark canvas-hub__spark--line" />
          </div>
        </>
      )}
      {variant === 'flow' && (
        <>
          <div className="canvas-hub__widget canvas-hub__widget--gold canvas-hub__widget--stack">
            <span /><span /><span />
          </div>
          <div className="canvas-hub__widget canvas-hub__widget--magenta canvas-hub__widget--phone">
            <span /><span /><span />
          </div>
          <div className="canvas-hub__widget canvas-hub__widget--lime">
            <span className="canvas-hub__spark canvas-hub__spark--curve" />
          </div>
        </>
      )}
      {variant === 'ops' && (
        <>
          <div className="canvas-hub__widget canvas-hub__widget--cyan canvas-hub__widget--sm">
            <span className="canvas-hub__spark canvas-hub__spark--line" />
          </div>
          <div className="canvas-hub__widget canvas-hub__widget--lime canvas-hub__widget--sm">
            <span className="canvas-hub__spark canvas-hub__spark--bars" />
          </div>
          <div className="canvas-hub__widget canvas-hub__widget--gold canvas-hub__widget--wide">
            <span /><span /><span />
          </div>
        </>
      )}
    </div>
  )
}

const PINNED_CANVASES = RECENT_CANVASES.slice(0, 3)

function ViewSwitcher({
  value,
  onChange,
}: {
  value: 'grid' | 'list'
  onChange: (next: 'grid' | 'list') => void
}) {
  return (
    <div className="canvas-hub__view-toggle" role="group" aria-label="Canvas view">
      <button
        type="button"
        className={`canvas-hub__view-btn${value === 'list' ? ' canvas-hub__view-btn--active' : ''}`}
        aria-pressed={value === 'list'}
        aria-label="List view"
        onClick={() => onChange('list')}
      >
        <IconListBullets />
      </button>
      <button
        type="button"
        className={`canvas-hub__view-btn${value === 'grid' ? ' canvas-hub__view-btn--active' : ''}`}
        aria-pressed={value === 'grid'}
        aria-label="Grid view"
        onClick={() => onChange('grid')}
      >
        <IconGrid />
      </button>
    </div>
  )
}

function CanvasGalleryCard({
  title,
  edited,
  preview,
  onOpen,
}: {
  title: string
  edited: string
  preview: CanvasPreviewVariant
  onOpen: () => void
}) {
  return (
    <article className="canvas-hub__recent-card">
      <div className="canvas-hub__recent-head">
        <button type="button" className="canvas-hub__recent-open" onClick={onOpen}>
          <span className="canvas-hub__recent-title">{title}</span>
          <span className="canvas-hub__recent-meta">{edited}</span>
        </button>
        <button
          type="button"
          className="canvas-page__template-menu"
          aria-label={`Options for ${title}`}
        >
          <IconDotsThree />
        </button>
      </div>
      <button
        type="button"
        className="canvas-hub__recent-preview"
        onClick={onOpen}
        aria-label={`Open ${title}`}
      >
        <CanvasThumb variant={preview} />
      </button>
    </article>
  )
}
const CANVAS_FILTER_OPTIONS = ['All canvases', 'Favorites', 'Created by me'] as const
const CANVAS_SORT_OPTIONS = ['Newest', 'Oldest', 'Name A–Z'] as const

const ASSISTANT_REPLIES = [
  "I can help you explore your network, analyze performance, or build a canvas. What would you like to do?",
  "Sure — I can pull up the relevant data for you. Which area of your infrastructure are you focusing on?",
  "Got it. Based on current telemetry, here's what I'm seeing across your network. Want me to add this to a canvas?",
  "I can help you troubleshoot that. Could you tell me which site or device you're most concerned about?",
  "That's a good starting point. I'll prepare a canvas with the relevant metrics. Ready when you are.",
]

export function CanvasPage() {
  const navigate = useNavigate()
  const { threads, assistantOpen, setAssistantOpen } = useOutletContext<LayoutOutletContext>()
  const [threadPanelOpen, setThreadPanelOpen] = useState(false)
  const [assistantThreadsOpen, setAssistantThreadsOpen] = useState(false)
  const [assistantClosing, setAssistantClosing] = useState(false)
  const [chatInput, setChatInput] = useState('')
  const [messages, setMessages] = useState<{ id: string; role: 'user' | 'assistant'; text: string; time: string }[]>([])
  const [typing, setTyping] = useState(false)
  const msgsEndRef = useRef<HTMLDivElement>(null)
  const replyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    msgsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  const sendMessage = useCallback((text: string) => {
    if (!text.trim() || typing) return
    const now = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    setMessages((prev) => {
      const turnIndex = prev.filter(m => m.role === 'assistant').length % ASSISTANT_REPLIES.length
      if (replyTimerRef.current) clearTimeout(replyTimerRef.current)
      replyTimerRef.current = setTimeout(() => {
        const replyTime = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
        const hasP = userHasPersonalizationContext(LOCAL_DEMO_USER_ID)
        let replyText = ASSISTANT_REPLIES[turnIndex]
        if (hasP) {
          if (import.meta.env.DEV) {
            console.debug(
              '[Assistant context injection]\n',
              formatPersonalizationForAssistantContext(LOCAL_DEMO_USER_ID)
            )
          }
          replyText = `Applying your saved personalization. ${replyText}`
        }
        setMessages((prev2) => [
          ...prev2,
          { id: crypto.randomUUID(), role: 'assistant', text: replyText, time: replyTime },
        ])
        setTyping(false)
      }, 1200)
      return [...prev, { id: crypto.randomUUID(), role: 'user' as const, text: text.trim(), time: now }]
    })
    setTyping(true)
    setAssistantOpen(true)
  }, [typing, setAssistantOpen])

  const handleSend = useCallback(() => {
    if (!chatInput.trim()) return
    sendMessage(chatInput)
    setChatInput('')
  }, [chatInput, sendMessage])
  const [canvasView, setCanvasView] = useState<'grid' | 'list'>('grid')
  const [canvasFilter, setCanvasFilter] = useState<(typeof CANVAS_FILTER_OPTIONS)[number]>('All canvases')
  const [canvasSort, setCanvasSort] = useState<(typeof CANVAS_SORT_OPTIONS)[number]>('Newest')
  const [canvasFilterOpen, setCanvasFilterOpen] = useState(false)
  const filterWrapRef = useRef<HTMLDivElement>(null)
  const [personalizationRevision, setPersonalizationRevision] = useState(0)

  useEffect(() => {
    const bump = () => setPersonalizationRevision((n) => n + 1)
    window.addEventListener('ccc-personalization-changed', bump)
    window.addEventListener('storage', bump)
    return () => {
      window.removeEventListener('ccc-personalization-changed', bump)
      window.removeEventListener('storage', bump)
    }
  }, [])

  const hasPersonalizationContext = useMemo(
    () => userHasPersonalizationContext(LOCAL_DEMO_USER_ID),
    [personalizationRevision]
  )

  useEffect(() => {
    if (!canvasFilterOpen) return
    function handleClickOutside(event: MouseEvent) {
      if (filterWrapRef.current && !filterWrapRef.current.contains(event.target as Node)) {
        setCanvasFilterOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [canvasFilterOpen])

  return (
    <div
      className={`ai-assistant ai-assistant--canvas ai-assistant--canvas-with-sidebar${threadPanelOpen ? ' ai-assistant--canvas-thread-open' : ''}${assistantOpen || assistantClosing ? ' ai-assistant--canvas-assistant-open' : ''}`}
      role="main"
    >
      <div className="ai-assistant__bg" aria-hidden />
      <div className="ai-assistant__bg-glow" aria-hidden />
      <div className="ai-assistant__bg-glow-overlay" aria-hidden />
      <Sidebar
        onToggleChatPanel={() => setThreadPanelOpen((open) => !open)}
        isChatPanelOpen={threadPanelOpen}
      />

      {threadPanelOpen && (
        <ChatPanel onClose={() => setThreadPanelOpen(false)} canvasInline injectedThreads={threads} />
      )}

      <div className="canvas-page__content canvas-page__content--hub">
        <section className="canvas-hub__section" aria-labelledby="quick-start-heading">
          <div className="canvas-hub__section-header">
            <h1 id="quick-start-heading" className="canvas-hub__section-title">Quick start</h1>
            <div className="canvas-hub__section-actions">
              <button
                type="button"
                className="canvas-hub__icon-btn"
                onClick={() => navigate('/canvas/settings')}
                aria-label="Open Canvas settings"
              >
                <IconSettings className="canvas-hub__icon-btn-svg" />
              </button>
              <button
                type="button"
                className="ai-button ai-button--primary canvas-hub__new-btn"
                aria-label="Create a new canvas"
                onClick={() => navigate('/canvas/open')}
              >
                <IconPlus className="canvas-hub__new-btn-icon" aria-hidden />
                New
              </button>
            </div>
          </div>
          <div className="canvas-hub__quick-grid">
            {QUICK_START.map((item) => {
              const { title, description, Icon, prompt } = item
              return (
                <button
                  key={title}
                  type="button"
                  className="canvas-hub__quick-card"
                  onClick={() => navigate('/canvas/open', { state: { initialPrompt: prompt } })}
                >
                  <span className="canvas-hub__quick-icon" aria-hidden>
                    <Icon />
                  </span>
                  <span className="canvas-hub__quick-body">
                    <span className="canvas-hub__quick-title">{title}</span>
                    <span className="canvas-hub__quick-desc">{description}</span>
                  </span>
                </button>
              )
            })}
          </div>
        </section>

        <section className="canvas-hub__section" aria-labelledby="pinned-heading">
          <div className="canvas-hub__section-header">
            <div className="canvas-hub__title-row">
              <h2 id="pinned-heading" className="canvas-hub__section-title">Pinned canvases</h2>
              <span
                className="canvas-hub__info"
                title="Pin canvases you use most often so they stay at the top of this page."
              >
                <IconInfoCircle className="canvas-hub__info-icon" aria-hidden />
                <span className="canvas-settings-page__sr-only">
                  Pin canvases you use most often so they stay at the top of this page.
                </span>
              </span>
            </div>
            <ViewSwitcher value={canvasView} onChange={setCanvasView} />
          </div>
          <div className="canvas-hub__recent-grid" role="list" aria-label="Pinned canvases">
            {PINNED_CANVASES.map((canvas) => (
              <CanvasGalleryCard
                key={`pin-${canvas.id}`}
                title={canvas.title}
                edited={canvas.edited}
                preview={canvas.preview}
                onOpen={() => navigate('/canvas/open')}
              />
            ))}
          </div>
        </section>

        <section className="canvas-hub__section" aria-labelledby="recent-heading">
          <div className="canvas-hub__section-header">
            <h2 id="recent-heading" className="canvas-hub__section-title">Recent</h2>
          </div>
          <div className="canvas-hub__recent-toolbar">
            <div className="canvas-page__filter-wrap" ref={filterWrapRef}>
              <button
                type="button"
                className="canvas-page__select"
                onClick={() => setCanvasFilterOpen((open) => !open)}
                aria-expanded={canvasFilterOpen}
                aria-haspopup="listbox"
                aria-label="Filter canvases"
              >
                <span>{canvasFilter}</span>
                <IconCaretDown className="canvas-page__select-icon" />
              </button>
              {canvasFilterOpen && (
                <div className="canvas-page__filter-dropdown">
                  <div className="canvas-page__filter-section">
                    <span className="canvas-page__filter-section-label">Filter</span>
                    <ul role="listbox" aria-label="Canvas filter">
                      {CANVAS_FILTER_OPTIONS.map((option) => (
                        <li key={option} role="option" aria-selected={canvasFilter === option}>
                          <button
                            type="button"
                            className={`canvas-page__filter-option ${canvasFilter === option ? 'canvas-page__filter-option--selected' : ''}`}
                            onClick={() => {
                              setCanvasFilter(option)
                              setCanvasFilterOpen(false)
                            }}
                          >
                            {option}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="canvas-page__filter-section">
                    <span className="canvas-page__filter-section-label">Sort by</span>
                    <ul role="listbox" aria-label="Sort order">
                      {CANVAS_SORT_OPTIONS.map((option) => (
                        <li key={option} role="option" aria-selected={canvasSort === option}>
                          <button
                            type="button"
                            className={`canvas-page__filter-option ${canvasSort === option ? 'canvas-page__filter-option--selected' : ''}`}
                            onClick={() => {
                              setCanvasSort(option)
                              setCanvasFilterOpen(false)
                            }}
                          >
                            {option}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
            <span className="canvas-page__results">{RECENT_CANVASES.length} results</span>
            <div className="canvas-hub__toolbar-spacer" />
            <ViewSwitcher value={canvasView} onChange={setCanvasView} />
          </div>

          {canvasView === 'grid' ? (
            <div className="canvas-hub__recent-grid" role="list" aria-label="All canvases">
              {RECENT_CANVASES.map((canvas) => (
                <CanvasGalleryCard
                  key={canvas.id}
                  title={canvas.title}
                  edited={canvas.edited}
                  preview={canvas.preview}
                  onOpen={() => navigate('/canvas/open')}
                />
              ))}
            </div>
          ) : (
            <div className="canvas-page__list-view" role="region" aria-label="Canvas list">
              <table className="canvas-page__list-table">
                <thead>
                  <tr>
                    <th className="canvas-page__list-th canvas-page__list-th--name">Name</th>
                    <th className="canvas-page__list-th">Created</th>
                    <th className="canvas-page__list-th">Modified</th>
                    <th className="canvas-page__list-th">Owner</th>
                    <th className="canvas-page__list-th canvas-page__list-th--actions" aria-label="Actions" />
                  </tr>
                </thead>
                <tbody>
                  {CANVAS_LIST_ROWS.map((row) => (
                    <tr key={row.id} className="canvas-page__list-row">
                      <td className="canvas-page__list-td canvas-page__list-td--name">{row.name}</td>
                      <td className="canvas-page__list-td">{row.created}</td>
                      <td className="canvas-page__list-td">{row.modified}</td>
                      <td className="canvas-page__list-td">{row.owner}</td>
                      <td className="canvas-page__list-td canvas-page__list-td--actions">
                        <button type="button" className="canvas-page__list-action" aria-label={`Options for ${row.name}`}>
                          <IconDotsThree />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="canvas-page__list-pagination">
                <span className="canvas-page__list-pagination-info">
                  Showing 1–{CANVAS_LIST_ROWS.length} of {CANVAS_LIST_ROWS.length}
                </span>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Assistant panel */}
      {(assistantOpen || assistantClosing) && (
        <div className={`isp__assistant-panel${assistantClosing ? ' isp__assistant-panel--closing' : ''}`}>
          {assistantThreadsOpen && (
            <ChatPanel canvasInline onClose={() => setAssistantThreadsOpen(false)} injectedThreads={threads} />
          )}
          <header className="open-canvas__chat-header">
            <button type="button" className="open-canvas__expand-btn" aria-label="Toggle threads" onClick={() => setAssistantThreadsOpen((v) => !v)}>
              <IconNav />
            </button>
          </header>
          <div className="open-canvas__assistant-body">
            {messages.length === 0 && (
              <div className="canvas-welcome__hero" style={{ padding: '32px 24px' }}>
                <h2 className="canvas-welcome__heading">How can I help?</h2>
                <p className="canvas-welcome__desc">Ask me anything about your network, canvases, or how to get started.</p>
              </div>
            )}
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
                  <button type="button" className="open-canvas__submit-btn" aria-label="Send message" onClick={handleSend} disabled={!chatInput.trim() || typing}>
                    <IconSend />
                  </button>
                </div>
              </div>
              <p className="open-canvas__disclaimer">AI Assistant can make mistakes. Verify responses.</p>
              {hasPersonalizationContext && (
                <p className="open-canvas__personalization-note">
                  Saved personalization is included in assistant context.{' '}
                  <Link className="canvas-page__overview-link" to="/canvas/settings">
                    Edit in Settings
                  </Link>
                </p>
              )}
            </div>
          </footer>
        </div>
      )}
    </div>
  )
}
