import { useState } from 'react'
import {
  IconStatusNegative,
  IconStatusWarning,
  IconUser,
  IconCaretDown,
  IconNav,
} from './icons'

type TabId = 'all' | 'open' | 'resolved' | 'dismissed'

const TABS: { id: TabId; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'open', label: 'Open' },
  { id: 'resolved', label: 'Resolved' },
  { id: 'dismissed', label: 'Dismissed' },
]

const ACTIONS = [
  {
    id: '1',
    title: 'Network Performance Degradation in Singapore',
    time: '5m',
    status: 'negative' as const,
    description: 'Network performance degradation in Singapore caused by latency from an SD‑WAN policy change',
    tag: 'Tag 1',
    assignee: 'First Last',
    assigneeInitial: 'F',
    selected: true,
  },
  {
    id: '2',
    title: 'Lorem ipsum dolor sit amet',
    time: '12m',
    status: 'warning' as const,
    description: 'Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam',
    tag: 'Tag 2',
    assignee: null,
    assigneeInitial: null,
    selected: false,
  },
  {
    id: '3',
    title: 'At vero eos et accusamus et iusto odio',
    time: '34m',
    status: 'negative' as const,
    description: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque',
    tag: 'Tag 1',
    assignee: 'Second User',
    assigneeInitial: 'S',
    selected: false,
  },
]

export interface ActionsPanelProps {
  onOpenChatPanel?: () => void
}

export function ActionsPanel({ onOpenChatPanel }: ActionsPanelProps) {
  const [activeTab, setActiveTab] = useState<TabId>('all')
  const [categoriesOpen, setCategoriesOpen] = useState(false)
  const [assigneeOpen, setAssigneeOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  const handleHamburgerClick = () => {
    if (onOpenChatPanel) {
      onOpenChatPanel()
    } else {
      setCollapsed((c) => !c)
    }
  }

  if (collapsed && !onOpenChatPanel) {
    return (
      <aside
        className="actions-panel actions-panel--collapsed"
        aria-label="Actions menu collapsed"
      >
        <button
          type="button"
          className="actions-panel__collapse-btn"
          onClick={() => setCollapsed(false)}
          aria-label="Expand actions menu"
        >
          <IconNav />
        </button>
      </aside>
    )
  }

  return (
    <aside className="actions-panel" aria-label="Actions menu">
      <div className="actions-panel__header">
        <button
          type="button"
          className="actions-panel__collapse-btn"
          onClick={handleHamburgerClick}
          aria-label={onOpenChatPanel ? 'Open chat panel' : 'Collapse actions menu'}
        >
          <IconNav />
        </button>
      </div>

      <div className="actions-panel__tabs">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`actions-panel__tab ${activeTab === tab.id ? 'actions-panel__tab--active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
            aria-pressed={activeTab === tab.id}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="actions-panel__filters">
        <div className="actions-panel__dropdown-wrap">
          <button
            type="button"
            className="actions-panel__dropdown"
            onClick={() => setCategoriesOpen(!categoriesOpen)}
            aria-expanded={categoriesOpen}
            aria-haspopup="listbox"
          >
            Categories
            <IconCaretDown className="actions-panel__dropdown-icon" />
          </button>
        </div>
        <div className="actions-panel__dropdown-wrap">
          <button
            type="button"
            className="actions-panel__dropdown"
            onClick={() => setAssigneeOpen(!assigneeOpen)}
            aria-expanded={assigneeOpen}
            aria-haspopup="listbox"
          >
            Assignee Status
            <IconCaretDown className="actions-panel__dropdown-icon" />
          </button>
        </div>
      </div>

      <div className="actions-panel__list">
        {ACTIONS.map((action) => (
          <button
            key={action.id}
            type="button"
            className={`actions-panel__card ${action.selected ? 'actions-panel__card--selected' : ''}`}
            aria-pressed={action.selected}
            aria-label={action.title}
          >
            <div className="actions-panel__card-header">
              {action.status === 'negative' ? (
                <IconStatusNegative className="actions-panel__card-status" />
              ) : (
                <IconStatusWarning className="actions-panel__card-status" />
              )}
              <span className="actions-panel__card-title">{action.title}</span>
              <span className="actions-panel__card-time">{action.time}</span>
            </div>
            <p className="actions-panel__card-description">{action.description}</p>
            <div className="actions-panel__card-footer">
              <span className="actions-panel__card-tag">{action.tag}</span>
              <span className="actions-panel__card-assignee">
                <IconUser className="actions-panel__card-assignee-icon" />
                {action.assignee ? (
                  <>
                    <span className="actions-panel__avatar actions-panel__avatar--accent">
                      {action.assigneeInitial}
                    </span>
                    <span className="actions-panel__assignee-name">{action.assignee}</span>
                  </>
                ) : (
                  <span className="actions-panel__assignee-unassigned">Unassigned</span>
                )}
              </span>
            </div>
          </button>
        ))}
      </div>
    </aside>
  )
}
