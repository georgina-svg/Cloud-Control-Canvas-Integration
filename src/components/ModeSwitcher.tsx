import { Link, useLocation } from 'react-router-dom'
import { IconChat, IconCanvas, IconLightning } from './icons'

type Mode = 'chat' | 'canvas' | 'actions'

const MODES: { id: Mode; label: string; path: string; icon: React.ComponentType<{ className?: string }>; showBadge?: boolean }[] = [
  { id: 'chat', label: 'Chat', path: '/', icon: IconChat },
  { id: 'canvas', label: 'Canvas', path: '/canvas', icon: IconCanvas },
  { id: 'actions', label: 'Actions', path: '/actions', icon: IconLightning, showBadge: true },
]

export function ModeSwitcher() {
  const location = useLocation()
  const pathname = location.pathname

  return (
    <div className="ai-assistant__mode-switcher" role="tablist" aria-label="Assistant mode">
      {MODES.map(({ id, label, path, icon: Icon, showBadge }) => {
        const isActive =
          path === '/canvas'
            ? pathname === '/canvas' || pathname.startsWith('/canvas/')
            : pathname === path || (path === '/' && pathname === '/')
        return (
          <Link
            key={id}
            to={path}
            role="tab"
            aria-selected={isActive}
            aria-label={label}
            className={`ai-assistant__mode-btn ${isActive ? 'ai-assistant__mode-btn--active' : ''}`}
          >
            <Icon className="ai-assistant__mode-icon" />
            <span>{label}</span>
            {showBadge && <span className="ai-assistant__badge" aria-hidden />}
          </Link>
        )
      })}
    </div>
  )
}
