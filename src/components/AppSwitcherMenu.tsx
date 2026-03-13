import { useNavigate, useLocation } from 'react-router-dom'
import { figmaAssets } from '../figma-assets'

export type AppSwitcherMenuProps = {
  onClose: () => void
  onHomeClick?: () => void
}

/* Platform items with Figma icon asset; active is derived from current route (Home never highlighted) */
const PLATFORM_ITEMS = [
  { id: 'home', label: 'Home', path: '/', iconSrc: figmaAssets.iconHomeDefault },
  { id: 'agent-studio', label: 'Agent Studio', path: '/agent-studio', iconSrc: figmaAssets.iconAgentsDefault },
  { id: 'inventory', label: 'Inventory', path: '#', iconSrc: figmaAssets.iconInventoryDefault },
  { id: 'topology', label: 'Topology', path: '#', iconSrc: figmaAssets.iconTopologyDefault },
  { id: 'admin', label: 'Admin Console', path: '#', iconSrc: figmaAssets.iconSettingsDefault },
]

/* Products with Figma icon assets */
const PRODUCT_ITEMS = [
  { id: 'intersight', label: 'Intersight', path: '#', iconSrc: figmaAssets.iconIntersight },
  { id: 'meraki', label: 'Meraki', path: '#', iconSrc: figmaAssets.iconMerakiDefault },
  { id: 'nexus', label: 'Nexus Dashboard', path: '#', iconSrc: figmaAssets.iconNexusEllipse1 },
  { id: 'security', label: 'Security', path: '#', iconSrc: figmaAssets.iconSecurityDefault },
  { id: 'splunk', label: 'Splunk', path: '#', iconSrc: figmaAssets.iconSplunk },
  { id: 'thousandeyes', label: 'ThousandEyes', path: '#', iconSrc: figmaAssets.iconThousandEyesDefault },
  { id: 'webex', label: 'Webex Control Hub', path: '#', iconSrc: figmaAssets.iconWebex1 },
]

const FAVORITES_ITEMS = [
  { id: 'te-users', label: 'thousandeyes.com/users', iconSrc: figmaAssets.iconThousandEyesDefault },
  { id: 'te-admin', label: 'thousandeyes.com/admin', iconSrc: figmaAssets.iconThousandEyesDefault },
  { id: 'meraki-users', label: 'meraki.com/users', iconSrc: figmaAssets.iconMerakiDefault },
]

export function AppSwitcherMenu({ onClose, onHomeClick }: AppSwitcherMenuProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const pathname = location.pathname

  const isPlatformItemActive = (path: string) => path !== '#' && pathname === path

  return (
    <div className="app-switcher-overlay" role="dialog" aria-label="Platform navigator" aria-modal="true">
      <div className="app-switcher-backdrop" aria-hidden onClick={onClose} />
      <div className="app-switcher-panel" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="app-switcher-close"
          aria-label="Close"
          onClick={onClose}
        >
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
                {PLATFORM_ITEMS.map(({ id, label, path, iconSrc }) => {
                  const active = isPlatformItemActive(path)
                  return (
                    <button
                      key={id}
                      type="button"
                      className={`app-switcher-item ${active ? 'app-switcher-item--active' : ''}`}
                      aria-current={active ? 'page' : undefined}
                      onClick={() => {
                        onClose()
                        if (path === '/' && onHomeClick) onHomeClick()
                        else if (path !== '#') navigate(path)
                      }}
                    >
                      <img src={iconSrc} alt="" width={24} height={24} className="app-switcher-item-icon" />
                      <span>{label}</span>
                    </button>
                  )
                })}
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
                    onClick={() => {
                      onClose()
                      if (path !== '#') navigate(path)
                    }}
                  >
                    <img src={iconSrc} alt="" width={24} height={24} className="app-switcher-item-icon" />
                    <span>{label}</span>
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
                    <img src={iconSrc} alt="" width={16} height={16} className="app-switcher-fav-item-icon" />
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
