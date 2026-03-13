import { IconNav, IconPencil, IconSearch, IconSettings, IconCheck } from './icons'

const TODAY_THREADS = [
  { id: '1', title: 'Network performance degradation', selected: false },
  { id: '2', title: 'Wi-Fi Connectivity Problems', selected: false },
  { id: '3', title: 'Slow Internet Speed', selected: false },
  { id: '4', title: 'Network Timeout Errors', selected: false },
  { id: '5', title: 'DNS Resolution Failures', selected: false },
]

const YESTERDAY_THREADS = [
  { id: '6', title: 'Wi-Fi Issue at HQ' },
  { id: '7', title: 'VPN Connection Error' },
  { id: '8', title: 'Bandwidth Throttling' },
  { id: '9', title: 'DNS Resolution Failure' },
  { id: '10', title: 'Network Timeout Error' },
]

export interface ChatPanelProps {
  onClose: () => void
  overlay?: boolean
  docked?: boolean
  canvasInline?: boolean
  /** When set, this thread id is shown as selected/highlighted (e.g. when opened from Actions page) */
  highlightThreadId?: string
}

export function ChatPanel({ onClose, overlay, docked, canvasInline, highlightThreadId }: ChatPanelProps) {
  return (
    <aside
      className={`chat-panel${overlay ? ' chat-panel--overlay' : ''}${docked ? ' chat-panel--docked' : ''}${canvasInline ? ' chat-panel--canvas-inline' : ''}`}
      aria-label="Threads"
      role="complementary"
    >
      <div className="chat-panel__header">
        <h2 className="chat-panel__title">Threads</h2>
        <button
          type="button"
          className="chat-panel__toggle"
          onClick={onClose}
          aria-label="Close chat panel"
        >
          <IconNav />
        </button>
      </div>

      <nav className="chat-panel__nav" aria-label="Chat actions">
        <button
          type="button"
          className={`chat-panel__nav-item${!highlightThreadId ? ' chat-panel__nav-item--selected' : ''}`}
          aria-pressed={!highlightThreadId}
        >
          <IconPencil className="chat-panel__nav-icon" />
          <span>New chat</span>
        </button>
        <button type="button" className="chat-panel__nav-item">
          <IconSearch className="chat-panel__nav-icon" />
          <span>Search</span>
        </button>
        <button type="button" className="chat-panel__nav-item">
          <IconSettings className="chat-panel__nav-icon" />
          <span>Settings</span>
        </button>
      </nav>

      <div className="chat-panel__history">
        <section className="chat-panel__section" aria-label="Today">
          <h3 className="chat-panel__section-label">Today</h3>
          {TODAY_THREADS.map((thread) => {
            const isSelected = thread.selected || thread.id === highlightThreadId
            return (
              <button
                key={thread.id}
                type="button"
                className={`chat-panel__thread ${isSelected ? 'chat-panel__thread--selected' : ''}`}
                aria-pressed={isSelected}
              >
                <span className="chat-panel__thread-title">{thread.title}</span>
                {isSelected && (
                  <span className="chat-panel__thread-check" aria-hidden>
                    <IconCheck />
                  </span>
                )}
              </button>
            )
          })}
        </section>

        <section className="chat-panel__section" aria-label="Yesterday">
          <h3 className="chat-panel__section-label">Yesterday</h3>
          {YESTERDAY_THREADS.map((thread) => (
            <button
              key={thread.id}
              type="button"
              className="chat-panel__thread"
            >
              <span className="chat-panel__thread-title">{thread.title}</span>
            </button>
          ))}
        </section>
      </div>
    </aside>
  )
}
