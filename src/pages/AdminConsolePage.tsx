import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { ChatPanel } from '../components/ChatPanel'
import type { LayoutOutletContext } from '../components/Layout'
import { IconNav, IconSend, IconCaretDown } from '../components/icons'

// ─── Sidebar nav ─────────────────────────────────────────────────────────────
const SIDEBAR_NAV = [
  {
    label: 'Overview',
    icon: (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
        <rect x="1" y="1" width="6" height="6" rx="1.5" opacity=".85"/>
        <rect x="9" y="1" width="6" height="6" rx="1.5" opacity=".85"/>
        <rect x="1" y="9" width="6" height="6" rx="1.5" opacity=".85"/>
        <rect x="9" y="9" width="6" height="6" rx="1.5" opacity=".85"/>
      </svg>
    ),
  },
  {
    label: 'Users',
    icon: (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden>
        <circle cx="8" cy="5.5" r="2.8" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M2.5 13.5c0-3 2.5-4.5 5.5-4.5s5.5 1.5 5.5 4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: 'Groups',
    icon: (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden>
        <circle cx="5.5" cy="5" r="2.2" stroke="currentColor" strokeWidth="1.3"/>
        <circle cx="10.5" cy="5" r="2.2" stroke="currentColor" strokeWidth="1.3"/>
        <path d="M1 13c0-2.5 2-4 4.5-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
        <path d="M15 13c0-2.5-2-4-4.5-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
        <path d="M5.5 13c0-2.5 2-4 5-4s5 1.5 5 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: 'Tenants',
    icon: (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden>
        <circle cx="8" cy="5" r="2.8" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M2.5 13c0-3 2.5-4.5 5.5-4.5S13.5 10 13.5 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        <circle cx="13" cy="5" r="1.5" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M13 7v1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: 'Settings',
    expand: true,
    icon: (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden>
        <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.3"/>
        <path d="M8 1.5v2M8 12.5v2M1.5 8h2M12.5 8h2M3.4 3.4l1.4 1.4M11.2 11.2l1.4 1.4M3.4 12.6l1.4-1.4M11.2 4.8l1.4-1.4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: 'AI Context Management',
    icon: (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden>
        <rect x="2" y="2" width="5" height="5" rx="1.2" stroke="currentColor" strokeWidth="1.3"/>
        <rect x="9" y="2" width="5" height="5" rx="1.2" stroke="currentColor" strokeWidth="1.3"/>
        <rect x="2" y="9" width="5" height="5" rx="1.2" stroke="currentColor" strokeWidth="1.3"/>
        <rect x="9" y="9" width="5" height="5" rx="1.2" stroke="currentColor" strokeWidth="1.3"/>
        <circle cx="8" cy="8" r="1.5" fill="currentColor" opacity=".6"/>
      </svg>
    ),
  },
  {
    label: 'Integrations',
    active: true,
    icon: (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden>
        <rect x="1.5" y="6" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.3"/>
        <rect x="10.5" y="6" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.3"/>
        <line x1="5.5" y1="8" x2="10.5" y2="8" stroke="currentColor" strokeWidth="1.3"/>
        <line x1="3.5" y1="6" x2="3.5" y2="3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
        <line x1="12.5" y1="6" x2="12.5" y2="3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
        <line x1="3.5" y1="10" x2="3.5" y2="12.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
        <line x1="12.5" y1="10" x2="12.5" y2="12.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    ),
  },
]

// ─── Table data ───────────────────────────────────────────────────────────────
interface IntegrationRow {
  id: string
  name: string
  dateCreated: string
}

const INTEGRATIONS: IntegrationRow[] = [
  { id: '1', name: 'Firewall',          dateCreated: 'Jan 29, 2026 at 10:43 AM' },
  { id: '2', name: 'Nexus',             dateCreated: 'Feb 2, 2026 at 02:30 PM'  },
  { id: '3', name: 'olgaintegration',   dateCreated: 'Feb 2, 2026 at 02:31 PM'  },
  { id: '4', name: 'test',              dateCreated: 'Feb 2, 2026 at 02:31 PM'  },
  { id: '5', name: 'cdo',               dateCreated: 'Feb 2, 2026 at 02:31 PM'  },
  { id: '6', name: 'ServiceNow',        dateCreated: 'Feb 2, 2026 at 02:33 PM'  },
  { id: '7', name: 'thousandeyes',      dateCreated: 'Mar 5, 2026 at 01:46 AM'  },
  { id: '8', name: 'Meraki',            dateCreated: 'Mar 8, 2026 at 09:10 PM'  },
]

const ROWS_PER_PAGE = 10

// ─── AdminConsolePage ─────────────────────────────────────────────────────────
export function AdminConsolePage() {
  const { assistantOpen, threads } = useOutletContext<LayoutOutletContext>()
  const [search, setSearch] = useState('')
  const [page] = useState(1)
  const [threadsPanelOpen, setThreadsPanelOpen] = useState(false)
  const [assistantInput, setAssistantInput] = useState('')

  const filtered = INTEGRATIONS.filter((row) =>
    row.name.toLowerCase().includes(search.toLowerCase())
  )

  const pageStart = (page - 1) * ROWS_PER_PAGE + 1
  const pageEnd   = Math.min(page * ROWS_PER_PAGE, filtered.length)

  return (
    <div className="acp__page">

      {/* ── Sidebar ── */}
      <nav className="acp__sidebar" aria-label="Admin console navigation">
        <div className="acp__sidebar-header">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <span className="acp__sidebar-title">Admin Console</span>
        </div>

        <ul className="acp__sidebar-nav" role="list">
          {SIDEBAR_NAV.map((item) => (
            <li key={item.label}>
              <button
                type="button"
                className={`acp__nav-item${item.active ? ' acp__nav-item--active' : ''}`}
                aria-current={item.active ? 'page' : undefined}
              >
                <span className="acp__nav-icon">{item.icon}</span>
                <span className="acp__nav-label">{item.label}</span>
                {item.expand && (
                  <svg className="acp__nav-chevron" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                    <path d="M4.5 3l3 3-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* ── Main ── */}
      <main className="acp__main">

        {/* Page heading row */}
        <div className="acp__page-heading">
          <h1 className="acp__page-title">Integrations</h1>
          <div className="acp__page-actions">
            <button type="button" className="acp__icon-btn" aria-label="Refresh">
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path d="M13.5 8A5.5 5.5 0 1 1 8 2.5c1.8 0 3.4.87 4.4 2.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M12 2v3h-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button type="button" className="acp__create-btn">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
              Create Integration
            </button>
          </div>
        </div>

        {/* Table card */}
        <div className="acp__table-card">

          {/* Search */}
          <div className="acp__table-search">
            <svg className="acp__table-search-icon" width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
              <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <input
              type="search"
              className="acp__table-search-input"
              placeholder="Search integrations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search integrations"
            />
          </div>

          {/* Table */}
          <table className="acp__table" aria-label="Integrations list">
            <thead>
              <tr>
                <th className="acp__th acp__th--name">Integration name</th>
                <th className="acp__th acp__th--date">Date created</th>
                <th className="acp__th acp__th--action">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.id} className="acp__tr">
                  <td className="acp__td acp__td--name">{row.name}</td>
                  <td className="acp__td acp__td--date">{row.dateCreated}</td>
                  <td className="acp__td acp__td--action">
                    <button type="button" className="acp__dots-btn" aria-label={`Actions for ${row.name}`}>
                      <span aria-hidden>•••</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="acp__pagination">
            <div className="acp__pagination-goto">
              <span>Go to page:</span>
              <input
                type="number"
                className="acp__pagination-input"
                defaultValue={1}
                min={1}
                aria-label="Go to page"
              />
              <button type="button" className="acp__pagination-go" aria-label="Go">
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden>
                  <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.3"/>
                  <path d="M10 10l2.5 2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
            <div className="acp__pagination-right">
              <span className="acp__pagination-label">Rows per page</span>
              <select className="acp__pagination-select" defaultValue={10} aria-label="Rows per page">
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <span className="acp__pagination-range">{pageStart}-{pageEnd} of {filtered.length}</span>
              <div className="acp__pagination-nav">
                <button type="button" className="acp__pagination-btn" aria-label="Previous page" disabled={page === 1}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                    <path d="M7.5 2L3.5 6l4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <button type="button" className="acp__pagination-btn acp__pagination-btn--active" aria-current="page">1</button>
                <button type="button" className="acp__pagination-btn" aria-label="Next page" disabled>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                    <path d="M4.5 2l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

        </div>
      </main>

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
              <p className="canvas-welcome__desc">Ask me anything about managing users, integrations, or your Admin Console workspace.</p>
            </div>
          </div>
          <footer className="open-canvas__chat-footer">
            <div className="open-canvas__input-wrap">
              <div className="open-canvas__input-field">
                <input
                  type="text"
                  className="open-canvas__input-placeholder"
                  placeholder="Ask AI Assistant a question, / for prompts"
                  value={assistantInput}
                  onChange={(e) => setAssistantInput(e.target.value)}
                  aria-label="Ask AI Assistant"
                />
                <div className="open-canvas__input-toolbar">
                  <div className="open-canvas__input-chips">
                    <button type="button" className="open-canvas__input-auto-btn" aria-label="Model: Auto">
                      Auto <IconCaretDown className="open-canvas__input-auto-caret" />
                    </button>
                  </div>
                  <button type="button" className="open-canvas__submit-btn" aria-label="Send message" disabled={!assistantInput.trim()}>
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
