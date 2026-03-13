import { IconListBullets, IconNewChat, IconSearch, IconSettings } from './icons'

const SIDEBAR_ITEMS = [
  { icon: IconListBullets, label: 'Show or hide chat panel' },
  { icon: IconNewChat, label: 'New chat' },
  { icon: IconSearch, label: 'Search' },
  { icon: IconSettings, label: 'Settings' },
] as const

export interface SidebarProps {
  onToggleChatPanel?: () => void
  isChatPanelOpen?: boolean
}

export function Sidebar({ onToggleChatPanel, isChatPanelOpen = false }: SidebarProps) {
  return (
    <aside className="ai-assistant__sidebar" aria-label="Canvas panel">
      {SIDEBAR_ITEMS.map(({ icon: Icon, label }, index) => {
        const isToggle = index === 0
        return (
          <button
            key={label}
            type="button"
            className="ai-assistant__sidebar-item"
            aria-label={label}
            aria-pressed={isToggle ? isChatPanelOpen : undefined}
            onClick={isToggle ? onToggleChatPanel : undefined}
          >
            <Icon />
          </button>
        )
      })}
    </aside>
  )
}
