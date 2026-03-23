import { useNavigate, useLocation } from 'react-router-dom'
import { figmaAssets } from '../figma-assets'

export type AppSwitcherMenuProps = {
  onClose: () => void
  onHomeClick?: () => void
}

const PLATFORM_ITEMS = [
  { id: 'home',         label: 'Home',           path: '/',             iconSrc: figmaAssets.iconHome },
  { id: 'agent-studio', label: 'Agent Studio',   path: '/agent-studio', iconSrc: figmaAssets.iconAgents },
  { id: 'inventory',    label: 'Inventory',       path: '#',             iconSrc: figmaAssets.iconInventory },
  { id: 'topology',     label: 'Topology',        path: '#',             iconSrc: figmaAssets.iconTopology },
  { id: 'admin',        label: 'Admin Console',   path: '#',             iconSrc: figmaAssets.iconAdmin },
]

const PRODUCT_ITEMS = [
  { id: 'intersight',   label: 'Intersight',       path: '#', iconSrc: figmaAssets.iconIntersight },
  { id: 'meraki',       label: 'Meraki',           path: '#', iconSrc: figmaAssets.iconMeraki },
  { id: 'nexus',        label: 'Nexus Dashboard',  path: '#', iconSrc: figmaAssets.iconNexus },
  { id: 'security',     label: 'Security',         path: '#', iconSrc: figmaAssets.iconSecurity },
  { id: 'splunk',       label: 'Splunk',           path: '#', iconSrc: figmaAssets.iconSplunk },
  { id: 'thousandeyes', label: 'ThousandEyes',     path: '#', iconSrc: figmaAssets.iconThousandEyes },
  { id: 'webex',        label: 'Webex Control Hub', path: '#', iconSrc: figmaAssets.iconWebex },
]

const FAVORITES_ITEMS = [
  { id: 'te-users',     label: 'thousandeyes.com/users', iconSrc: figmaAssets.iconThousandEyes },
  { id: 'te-admin',     label: 'thousandeyes.com/admin', iconSrc: figmaAssets.iconThousandEyes },
  { id: 'meraki-users', label: 'meraki.com/users',       iconSrc: figmaAssets.iconMeraki },
]

const HEADER_PINNED_IDS = new Set(['meraki', 'intersight', 'agent-studio', 'admin'])

function PinIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      className={`app-switcher-pin-icon${filled ? ' app-switcher-pin-icon--filled' : ''}`}
      width="14" height="14" viewBox="0 0 16 16" fill="none"
      aria-label={filled ? 'Pinned to header' : 'Not pinned'}
    >
      <path
        d="M9.5 2.5L13.5 6.5L10.5 9.5L10 12L8 14L6.5 10.5L3.5 13.5L2.5 12.5L5.5 9.5L2 8L4 6L6.5 5.5L9.5 2.5Z"
        stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"
        fill={filled ? 'currentColor' : 'none'}
      />
    </svg>
  )
}

export function AppSwitcherMenu({ onClose, onHomeClick }: AppSwitcherMenuProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const pathname = location.pathname

  const isActive = (path: string) => path !== '#' && pathname === path

  return (
    <div className="app-switcher-overlay" role="dialog" aria-label="Platform navigator" aria-modal="true">
      <div className="app-switcher-backdrop" aria-hidden onClick={onClose} />
      <div className="app-switcher-panel" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="app-switcher-close" aria-label="Close" onClick={onClose}>
          <img src={figmaAssets.close} alt="" width={24} height={24} className="app-switcher-close-img" />
        </button>

        <div className="app-switcher-content">
          <div className="app-switcher-search-wrap">
            <div className="app-switcher-search">
              <span className="app-switcher-search-placeholder">Search for products and favorites…</span>
              <span className="app-switcher-search-shortcut">⌘+F</span>
            </div>
          </div>

          <div className="app-switcher-columns">
            <section className="app-switcher-column" aria-labelledby="platform-title">
              <h2 id="platform-title" className="app-switcher-column-title">Platform</h2>
              <div className="app-switcher-list">
                {PLATFORM_ITEMS.map(({ id, label, path, iconSrc }) => (
                  <button
                    key={id}
                    type="button"
                    className={`app-switcher-item${isActive(path) ? ' app-switcher-item--active' : ''}`}
                    aria-current={isActive(path) ? 'page' : undefined}
                    onClick={() => {
                      onClose()
                      if (path === '/' && onHomeClick) onHomeClick()
                      else if (path !== '#') navigate(path)
                    }}
                  >
                    <img src={iconSrc} alt="" className="app-switcher-item-icon" />
                    <span>{label}</span>
                    {id !== 'home' && <PinIcon filled={HEADER_PINNED_IDS.has(id)} />}
                  </button>
                ))}
              </div>
            </section>

            <section className="app-switcher-column" aria-labelledby="products-title">
              <h2 id="products-title" className="app-switcher-column-title">Products</h2>
              <div className="app-switcher-list">
                {PRODUCT_ITEMS.map(({ id, label, path, iconSrc }) => (
                  <button
                    key={id}
                    type="button"
                    className="app-switcher-item"
                    onClick={() => { onClose(); if (path !== '#') navigate(path) }}
                  >
                    <img src={iconSrc} alt="" className="app-switcher-item-icon" />
                    <span>{label}</span>
                    <PinIcon filled={HEADER_PINNED_IDS.has(id)} />
                  </button>
                ))}
              </div>
            </section>

            <section className="app-switcher-column" aria-labelledby="favorites-title">
              <div className="app-switcher-column-heading" id="favorites-title">
                <img src={figmaAssets.iconStar} alt="" width={20} height={20} className="app-switcher-fav-star" />
                <h2 className="app-switcher-column-title">Favorites</h2>
                <button type="button" className="app-switcher-fav-edit" aria-label="Edit favorites">
                  <img src={figmaAssets.iconPencil} alt="" width={20} height={20} />
                </button>
              </div>
              <div className="app-switcher-list">
                {FAVORITES_ITEMS.map(({ id, label, iconSrc }) => (
                  <button key={id} type="button" className="app-switcher-favorite">
                    <img src={iconSrc} alt="" className="app-switcher-fav-item-icon" />
                    <span>{label}</span>
                  </button>
                ))}
                <button type="button" className="app-switcher-add-fav">
                  <span>Add new favorite</span>
                  <img src={figmaAssets.iconPlus} alt="" width={16} height={16} />
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
