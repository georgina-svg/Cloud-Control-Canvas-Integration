import { useState, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  IconCaretDown,
  IconUser,
  IconHome,
} from './icons'
import { AppSwitcherMenu } from './AppSwitcherMenu'

const NAV_ITEMS = [
  { label: 'Home', path: '/', icon: IconHome },
  { label: 'Meraki', path: '#' },
  { label: 'Intersight', path: '/intersight' },
  { label: 'AI Studio', path: '/agent-studio' },
  { label: 'Admin Console', path: '/admin-console' },
]

export function Header({ onHomeClick, onAssistantClick, assistantOpen, actionsMessages }: { onHomeClick?: () => void; onAssistantClick?: () => void; assistantOpen?: boolean; actionsMessages?: { id: string; role: 'user' | 'assistant'; text: string }[] }) {
  const [appSwitcherOpen, setAppSwitcherOpen] = useState(false)
  const appSwitcherRef = useRef<HTMLDivElement>(null)
  const appSwitcherButtonRef = useRef<HTMLButtonElement>(null)
  const location = useLocation()
  const navigate = useNavigate()
  const pathname = location.pathname

  return (
    <header className="ai-assistant__header ai-assistant__header--figma" role="banner" data-name="CCC Header [Beta]">
      <div className="ai-assistant__header-inner">
        <div className="ai-assistant__header-left">
          <div className="ai-assistant__header-logo">
            <img src="/cisco-logo.png" alt="" className="ai-assistant__header-cisco-icon" aria-hidden />
            <span className="ai-assistant__header-product">Cloud Control</span>
          </div>
          <div className="ai-assistant__header-divider" aria-hidden />
          <button
            type="button"
            className="ai-assistant__tenant"
            aria-haspopup="listbox"
            aria-label="Current tenant: Acme Corp, Inc"
          >
            Acme Corp, Inc
            <IconCaretDown className="ai-assistant__tenant-caret" />
          </button>
          <div className="ai-assistant__app-switcher-wrap" ref={appSwitcherRef}>
            <button
              ref={appSwitcherButtonRef}
              type="button"
              className="ai-assistant__icon-btn ai-assistant__icon-btn--app-switcher"
              aria-label="App switcher"
              aria-expanded={appSwitcherOpen}
              aria-haspopup="true"
              onClick={() => setAppSwitcherOpen((open) => !open)}
            >
              <img src="/app-switcher.png" alt="" className="ai-assistant__app-switcher-icon" width={24} height={24} aria-hidden />
            </button>
            {appSwitcherOpen && (
              <AppSwitcherMenu
                onClose={() => setAppSwitcherOpen(false)}
                onHomeClick={onHomeClick}
              />
            )}
          </div>
          <nav className="ai-assistant__nav" aria-label="Product navigation">
            {NAV_ITEMS.map(({ label, path, icon: Icon }) => {
              const active = path !== '#' && pathname === path
              if (label === 'Home' && onHomeClick) {
                return (
                  <button
                    key={label}
                    type="button"
                    className={`ai-assistant__nav-btn ${active ? 'ai-assistant__nav-btn--active' : ''}`}
                    aria-current={active ? 'page' : undefined}
                    onClick={onHomeClick}
                  >
                    {Icon ? <Icon className="ai-assistant__nav-icon" /> : null}
                    {label}
                  </button>
                )
              }
              if (path === '/agent-studio') {
                const agentStudioActive = pathname === '/agent-studio' || pathname.startsWith('/agent-studio/')
                return (
                  <button
                    key={label}
                    type="button"
                    className={`ai-assistant__nav-btn ${agentStudioActive ? 'ai-assistant__nav-btn--active' : ''}`}
                    aria-current={agentStudioActive ? 'page' : undefined}
                    onClick={() => navigate('/agent-studio', { state: { reset: Date.now() } })}
                  >
                    {Icon ? <Icon className="ai-assistant__nav-icon" /> : null}
                    {label}
                  </button>
                )
              }
              if (path === '/intersight') {
                const intersightActive = pathname === '/intersight' || pathname.startsWith('/intersight/')
                return (
                  <button
                    key={label}
                    type="button"
                    className={`ai-assistant__nav-btn ${intersightActive ? 'ai-assistant__nav-btn--active' : ''}`}
                    aria-current={intersightActive ? 'page' : undefined}
                    onClick={() => navigate('/intersight')}
                  >
                    {label}
                  </button>
                )
              }
              if (path === '/admin-console') {
                const adminActive = pathname === '/admin-console'
                return (
                  <button
                    key={label}
                    type="button"
                    className={`ai-assistant__nav-btn ${adminActive ? 'ai-assistant__nav-btn--active' : ''}`}
                    aria-current={adminActive ? 'page' : undefined}
                    onClick={() => navigate('/admin-console')}
                  >
                    {label}
                  </button>
                )
              }
              return (
                <a
                  key={label}
                  href="#"
                  className={`ai-assistant__nav-btn ${active ? 'ai-assistant__nav-btn--active' : ''}`}
                  aria-current={active ? 'page' : undefined}
                >
                  {Icon ? <Icon className="ai-assistant__nav-icon" /> : null}
                  {label}
                </a>
              )
            })}
          </nav>
        </div>
        <div className="ai-assistant__header-right">
          <button
            type="button"
            className={`ai-assistant__header-action-btn${assistantOpen || pathname === '/' ? ' ai-assistant__header-action-btn--active' : ''}`}
            aria-label="Assistant"
            onClick={pathname === '/canvas/open' || pathname === '/canvas' || pathname.startsWith('/canvas/') || pathname === '/intersight' || pathname.startsWith('/intersight/') || pathname.startsWith('/agent-studio') || pathname === '/admin-console' || pathname === '/actions' ? onAssistantClick : undefined}
          >
            <img src="/assistant-icon.png" alt="" className="ai-assistant__header-action-btn-icon" aria-hidden />
          </button>
          <button
            type="button"
            className={`ai-assistant__header-action-btn${(pathname === '/intersight/canvas' && !assistantOpen || (pathname === '/canvas/open' && !assistantOpen) || pathname === '/canvas' || pathname === '/canvas/settings') ? ' ai-assistant__header-action-btn--active' : ''}`}
            aria-label="Canvas"
            aria-pressed={pathname === '/intersight/canvas'}
            onClick={() => {
              if (pathname.startsWith('/agent-studio') || pathname === '/admin-console') {
                navigate('/canvas')
              } else if (pathname === '/canvas' || pathname === '/canvas/settings') {
                return
              } else if (pathname === '/canvas/open') {
                if (assistantOpen) onAssistantClick?.()
                return
              } else if (pathname === '/intersight/canvas' && assistantOpen) {
                onAssistantClick?.()
              } else if (pathname === '/intersight/canvas' && !assistantOpen) {
                navigate('/intersight')
              } else if (pathname === '/') {
                navigate('/canvas')
              } else if (pathname === '/actions') {
                navigate('/canvas/open', { state: { actionsMessages } })
              } else {
                navigate('/intersight/canvas', {
                  state: {
                    breadcrumb: ['Intersight', 'Alerts', 'Active'],
                    title: 'FI-6400 Fabric Interconnect Degraded',
                    severity: 'P1',
                    triggered: '2h 14m ago',
                    affectedClients: 1247,
                  }
                })
              }
            }}
          >
            <img src="/canvas-icon.png" alt="" className="ai-assistant__header-action-btn-icon" aria-hidden />
            Canvas
          </button>
          <button type="button" className="ai-assistant__icon-btn" aria-label="Alerts">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path d="M8 1.5a4.5 4.5 0 0 1 4.5 4.5c0 2.5.5 3.5 1 4H2.5c.5-.5 1-1.5 1-4A4.5 4.5 0 0 1 8 1.5z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
              <path d="M6.5 13.5a1.5 1.5 0 0 0 3 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
          </button>
          <button type="button" className="ai-assistant__icon-btn" aria-label="User account">
            <IconUser />
          </button>
        </div>
      </div>
    </header>
  )
}
