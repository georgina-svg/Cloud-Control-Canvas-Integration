import { useState, useRef, useEffect } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import type { LayoutOutletContext } from '../components/Layout'
import {
  IconHeartPulse,
  IconSettings,
  IconChart,
  IconDevice,
  IconShield,
  IconTopologyNodes,
  IconDotsThree,
  IconSearch,
  IconCaretDown,
} from '../components/icons'
import { Sidebar } from '../components/Sidebar'
import { ChatPanel } from '../components/ChatPanel'

/** Sample rows for the All canvases list view (Figma List-View node 2048:10854) */
const CANVAS_LIST_ROWS = [
  { id: '1', name: 'Network Performance Analysis', created: 'Today, 2:30 PM', modified: 'Today, 2:30 PM', owner: 'You' },
  { id: '2', name: 'Packet Loss Root Cause', created: 'Yesterday', modified: 'Yesterday', owner: 'You' },
  { id: '3', name: 'Cloud Migration Strategy', created: 'Mar 7, 2025', modified: 'Mar 8, 2025', owner: 'You' },
  { id: '4', name: 'Real-time Network Monitoring', created: 'Mar 5, 2025', modified: 'Mar 6, 2025', owner: 'You' },
  { id: '5', name: 'Code Optimization Review', created: 'Mar 4, 2025', modified: 'Mar 4, 2025', owner: 'You' },
]

const TEMPLATES = [
  {
    title: 'Health & Overview',
    description: 'Get a unified view of network health, alerts, and system status across your infrastructure.',
    Icon: IconHeartPulse,
    color: 'canvas-card--blue',
    prompts: [
      'How is my organization doing?',
      'Which sites are down?',
      'Are there any critical alerts?',
      'Show me health trends for the past 14 days',
      'Show me all sites with health scores below 80%',
      'What is wrong with my network between yesterday and today?',
    ],
  },
  { title: 'Troubleshooting', description: 'Diagnose and resolve issues fast with guided root cause analysis and remediation steps.', Icon: IconSettings, color: 'canvas-card--orange', prompts: [] },
  { title: 'Performance & Trends', description: 'Analyze performance metrics and spot trends to proactively prevent degradation.', Icon: IconChart, color: 'canvas-card--pink', prompts: [] },
  { title: 'Devices & Inventory', description: 'Explore device inventory, configurations, and connectivity across your network.', Icon: IconDevice, color: 'canvas-card--green', prompts: [] },
  { title: 'Security & Access', description: 'Review access policies, detect anomalies, and strengthen your security posture.', Icon: IconShield, color: 'canvas-card--purple', prompts: [] },
  { title: 'Visualization & Topology', description: 'Map and visualize your network topology for clearer situational awareness.', Icon: IconTopologyNodes, color: 'canvas-card--teal', prompts: [] },
]

type TemplateItem = (typeof TEMPLATES)[number]

const CANVAS_FILTER_OPTIONS = ['All canvases', 'Favorites', 'Created by me'] as const
const CANVAS_SORT_OPTIONS = ['Newest', 'Oldest', 'Name A–Z'] as const

export function CanvasPage() {
  const navigate = useNavigate()
  const { threads } = useOutletContext<LayoutOutletContext>()
  const [threadPanelOpen, setThreadPanelOpen] = useState(false)
  const [templateDetails, setTemplateDetails] = useState<TemplateItem | null>(null)
  const [expandedTemplate, setExpandedTemplate] = useState<string | null>(null)
  const [canvasFilter, setCanvasFilter] = useState<(typeof CANVAS_FILTER_OPTIONS)[number]>('All canvases')
  const [canvasSort, setCanvasSort] = useState<(typeof CANVAS_SORT_OPTIONS)[number]>('Newest')
  const [canvasFilterOpen, setCanvasFilterOpen] = useState(false)
  const filterWrapRef = useRef<HTMLDivElement>(null)

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
      className={`ai-assistant ai-assistant--canvas ai-assistant--canvas-with-sidebar${threadPanelOpen ? ' ai-assistant--canvas-thread-open' : ''}`}
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

      <div className="canvas-page__content">
        <section className="canvas-page__overview" aria-labelledby="canvas-overview-heading">
          <h1 id="canvas-overview-heading" className="canvas-page__overview-heading">
            Welcome to AI Canvas
          </h1>
          <p className="canvas-page__overview-description">
            The workspace for AgenticOps: bring telemetry, teams, and agents into one place.
            Ask once and see across domains; agents propose solutions and you approve execution.
          </p>
          <button type="button" className="canvas-page__create-canvas ai-button ai-button--primary" aria-label="Create a new canvas" onClick={() => navigate('/canvas/open')}>
            <span>Create a New Canvas</span>
          </button>
        </section>

        <section className="canvas-page__section">
          <h2 className="canvas-page__section-title">Prompt Library</h2>
          <div className="canvas-page__templates">
            {TEMPLATES.map((template) => {
              const { title, description, Icon, color, prompts } = template
              const isExpanded = expandedTemplate === title
              return (
                <article
                  key={title}
                  className={`canvas-page__template-card ${color}${isExpanded ? ' canvas-page__template-card--expanded' : ''}`}
                  style={{ position: 'relative' }}
                >
                  <button
                    type="button"
                    className="canvas-page__template-header-btn"
                    aria-expanded={isExpanded}
                    onClick={() => setExpandedTemplate(isExpanded ? null : title)}
                  >
                    <div className="canvas-page__template-top">
                      <div className="canvas-page__template-icon">
                        <Icon />
                      </div>
                      <IconCaretDown className={`canvas-page__template-chevron${isExpanded ? ' canvas-page__template-chevron--open' : ''}`} />
                    </div>
                    <h3 className="canvas-page__template-title">{title}</h3>
                    <p className="canvas-page__template-description">{description}</p>
                  </button>
                  {isExpanded && prompts.length > 0 && (
                    <ul className="canvas-page__template-prompts" role="list">
                      {prompts.map((prompt) => (
                        <li key={prompt}>
                          <button
                            type="button"
                            className="canvas-page__template-prompt-item"
                            onClick={() => navigate('/canvas/open', { state: { initialPrompt: prompt } })}
                          >
                            {prompt}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </article>
              )
            })}
          </div>
        </section>

        {templateDetails && (
          <>
            <div
              className="canvas-page__template-details-backdrop"
              onClick={() => setTemplateDetails(null)}
              aria-hidden
            />
            <div
              className="canvas-page__template-details-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="template-details-title"
            >
              <div className="canvas-page__template-details-content">
                <div className={`canvas-page__template-details-icon ${templateDetails.color}`}>
                  <templateDetails.Icon />
                </div>
                <h2 id="template-details-title" className="canvas-page__template-details-title">
                  {templateDetails.title}
                </h2>
                <p className="canvas-page__template-details-description">
                  {templateDetails.description}
                </p>
                <button
                  type="button"
                  className="ai-button ai-button--primary canvas-page__template-details-close"
                  onClick={() => setTemplateDetails(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </>
        )}

        <section className="canvas-page__section">
          <h2 className="canvas-page__section-title">All Canvases</h2>
          <div className="canvas-page__all-toolbar">
            <div className="canvas-page__search">
              <IconSearch className="canvas-page__search-icon" />
              <span className="canvas-page__search-placeholder">Search</span>
            </div>
            <div className="canvas-page__filter-wrap" ref={filterWrapRef}>
              <button
                type="button"
                className="canvas-page__select"
                onClick={() => setCanvasFilterOpen((open) => !open)}
                aria-expanded={canvasFilterOpen}
                aria-haspopup="listbox"
                aria-label="Filter and sort canvases"
              >
                <span>{canvasFilter} · {canvasSort}</span>
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
            <span className="canvas-page__results">{CANVAS_LIST_ROWS.length} results</span>
          </div>

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
        </section>
      </div>
    </div>
  )
}
