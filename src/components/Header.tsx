import { useState, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  IconCaretDown,
  IconUser,
  IconHome,
  IconUsers,
} from './icons'
import { AppSwitcherMenu } from './AppSwitcherMenu'

const NAV_ITEMS = [
  { label: 'Home', path: '/', icon: IconHome },
  { label: 'Meraki', path: '#' },
  { label: 'Security', path: '#' },
  { label: 'Agent Studio', path: '/agent-studio', icon: IconUsers },
]

export function Header({ onHomeClick }: { onHomeClick?: () => void }) {
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
                return (
                  <button
                    key={label}
                    type="button"
                    className={`ai-assistant__nav-btn ${active ? 'ai-assistant__nav-btn--active' : ''}`}
                    aria-current={active ? 'page' : undefined}
                    onClick={() => navigate('/agent-studio')}
                  >
                    {Icon ? <Icon className="ai-assistant__nav-icon" /> : null}
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
          <button type="button" className="ai-assistant__icon-btn" aria-label="User account">
            <IconUser />
          </button>
        </div>
      </div>
    </header>
  )
}
