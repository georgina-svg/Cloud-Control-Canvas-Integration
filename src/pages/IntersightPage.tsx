import { useState, useRef, useEffect, useCallback } from 'react'
import type React from 'react'
import { useNavigate, useSearchParams, useOutletContext, useLocation } from 'react-router-dom'
import { IconNav, IconSend, IconCaretDown } from '../components/icons'
import { ChatPanel } from '../components/ChatPanel'
import type { LayoutOutletContext } from '../components/Layout'
import { INTERSIGHT_PROMPT_CATEGORIES, IntersightPromptCat } from '../components/IntersightPromptCats'

// ─── DonutChart ──────────────────────────────────────────────────────────────

interface DonutSegment {
  value: number
  color: string
  label: string
}

interface DonutChartProps {
  segments: DonutSegment[]
  total: number
  centerLabel?: string
}

const RADIUS = 38
const CIRCUMFERENCE = 2 * Math.PI * RADIUS // ≈ 238.76

function DonutChart({ segments, total, centerLabel = 'total' }: DonutChartProps) {
  let accumulated = 0

  return (
    <div className="isp__donut-wrap">
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        {/* background track */}
        <circle
          cx="50"
          cy="50"
          r={RADIUS}
          fill="none"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth="10"
        />
        {segments.map((seg, i) => {
          const segLen = (seg.value / total) * CIRCUMFERENCE
          const offset = -accumulated
          accumulated += segLen

          return (
            <circle
              key={i}
              cx="50"
              cy="50"
              r={RADIUS}
              fill="none"
              stroke={seg.color}
              strokeWidth="10"
              strokeDasharray={`${segLen} ${CIRCUMFERENCE}`}
              strokeDashoffset={offset}
              transform="rotate(-90 50 50)"
              strokeLinecap="butt"
            />
          )
        })}
      </svg>
      <div className="isp__donut-center">
        <span className="isp__donut-value">{total}</span>
        <span className="isp__donut-label">{centerLabel}</span>
      </div>
    </div>
  )
}

// ─── Sidebar nav data ─────────────────────────────────────────────────────────

const SIDEBAR_NAV = [
  {
    label: 'Dashboards',
    active: true,
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <rect x="1" y="1" width="6" height="6" rx="1" fill="currentColor" opacity="0.85"/>
        <rect x="9" y="1" width="6" height="6" rx="1" fill="currentColor" opacity="0.85"/>
        <rect x="1" y="9" width="6" height="6" rx="1" fill="currentColor" opacity="0.85"/>
        <rect x="9" y="9" width="6" height="6" rx="1" fill="currentColor" opacity="0.85"/>
      </svg>
    ),
  },
  {
    label: 'Servers',
    active: false,
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <rect x="1" y="3" width="14" height="4" rx="1" stroke="currentColor" strokeWidth="1.4" fill="none"/>
        <rect x="1" y="9" width="14" height="4" rx="1" stroke="currentColor" strokeWidth="1.4" fill="none"/>
        <circle cx="12.5" cy="5" r="0.9" fill="currentColor"/>
        <circle cx="12.5" cy="11" r="0.9" fill="currentColor"/>
      </svg>
    ),
  },
  {
    label: 'Chassis',
    active: false,
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <rect x="1" y="2" width="14" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.4" fill="none"/>
        <line x1="1" y1="6" x2="15" y2="6" stroke="currentColor" strokeWidth="1"/>
        <line x1="1" y1="10" x2="15" y2="10" stroke="currentColor" strokeWidth="1"/>
      </svg>
    ),
  },
  {
    label: 'HyperFlex Clusters',
    active: false,
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.4" fill="none"/>
        <circle cx="8" cy="8" r="2.5" fill="currentColor" opacity="0.7"/>
        <line x1="8" y1="2" x2="8" y2="5" stroke="currentColor" strokeWidth="1.2"/>
        <line x1="8" y1="11" x2="8" y2="14" stroke="currentColor" strokeWidth="1.2"/>
        <line x1="2" y1="8" x2="5" y2="8" stroke="currentColor" strokeWidth="1.2"/>
        <line x1="11" y1="8" x2="14" y2="8" stroke="currentColor" strokeWidth="1.2"/>
      </svg>
    ),
  },
  {
    label: 'Fabric Interconnects',
    active: false,
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <rect x="2" y="6" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.3" fill="none"/>
        <rect x="10" y="6" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.3" fill="none"/>
        <line x1="6" y1="8" x2="10" y2="8" stroke="currentColor" strokeWidth="1.3"/>
        <line x1="4" y1="6" x2="4" y2="3" stroke="currentColor" strokeWidth="1.3"/>
        <line x1="12" y1="6" x2="12" y2="3" stroke="currentColor" strokeWidth="1.3"/>
        <line x1="4" y1="10" x2="4" y2="13" stroke="currentColor" strokeWidth="1.3"/>
        <line x1="12" y1="10" x2="12" y2="13" stroke="currentColor" strokeWidth="1.3"/>
      </svg>
    ),
  },
  {
    label: 'Storage',
    active: false,
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <ellipse cx="8" cy="4.5" rx="6" ry="2.5" stroke="currentColor" strokeWidth="1.3" fill="none"/>
        <path d="M2 4.5 v7 c0 1.38 2.69 2.5 6 2.5s6-1.12 6-2.5v-7" stroke="currentColor" strokeWidth="1.3" fill="none"/>
        <line x1="2" y1="8" x2="14" y2="8" stroke="currentColor" strokeWidth="1" opacity="0.5"/>
      </svg>
    ),
  },
  {
    label: 'Service Profiles',
    active: false,
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <rect x="2" y="1.5" width="12" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.3" fill="none"/>
        <line x1="5" y1="5.5" x2="11" y2="5.5" stroke="currentColor" strokeWidth="1.2"/>
        <line x1="5" y1="8" x2="11" y2="8" stroke="currentColor" strokeWidth="1.2"/>
        <line x1="5" y1="10.5" x2="8.5" y2="10.5" stroke="currentColor" strokeWidth="1.2"/>
      </svg>
    ),
  },
  {
    label: 'Policies',
    active: false,
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M8 1.5L14 4v4c0 3.3-2.5 6-6 6.5C2.5 14 0 11.3 0 8V4L8 1.5z" transform="translate(1 0)" stroke="currentColor" strokeWidth="1.3" fill="none"/>
        <path d="M5.5 8l1.8 1.8L10.5 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    label: 'Orchestration',
    active: false,
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <circle cx="3" cy="8" r="2" stroke="currentColor" strokeWidth="1.3" fill="none"/>
        <circle cx="13" cy="4" r="2" stroke="currentColor" strokeWidth="1.3" fill="none"/>
        <circle cx="13" cy="12" r="2" stroke="currentColor" strokeWidth="1.3" fill="none"/>
        <line x1="5" y1="7.3" x2="11" y2="4.7" stroke="currentColor" strokeWidth="1.2"/>
        <line x1="5" y1="8.7" x2="11" y2="11.3" stroke="currentColor" strokeWidth="1.2"/>
      </svg>
    ),
  },
  {
    label: 'Devices',
    active: false,
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <rect x="2" y="4" width="10" height="7" rx="1" stroke="currentColor" strokeWidth="1.3" fill="none"/>
        <line x1="7" y1="11" x2="7" y2="13.5" stroke="currentColor" strokeWidth="1.3"/>
        <line x1="4.5" y1="13.5" x2="9.5" y2="13.5" stroke="currentColor" strokeWidth="1.3"/>
        <rect x="13" y="6" width="1" height="3" rx="0.4" fill="currentColor" opacity="0.6"/>
      </svg>
    ),
  },
  {
    label: 'Software Repository',
    active: false,
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M3 2h10a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z" stroke="currentColor" strokeWidth="1.3" fill="none"/>
        <path d="M8 5v6M5.5 8l2.5 3 2.5-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
]

// ─── Tab IDs ──────────────────────────────────────────────────────────────────

const TAB_IDS = ['Server', 'NOC View', 'HyperFlex']

// ─── Widget data ──────────────────────────────────────────────────────────────

const FI_SEGMENTS = [
  { label: '6248', value: 12, color: '#4B9CF0' },
  { label: '6332', value: 6,  color: '#36C9C2' },
]

const FI_STATS = [
  { value: '752',  label: 'Ports' },
  { value: '136',  label: 'Used' },
  { value: '616',  label: 'Available' },
]

const SERVER_SEGMENTS = [
  { label: 'B',        value: 78, color: '#4B9CF0' },
  { label: 'C',        value: 47, color: '#36C9C2' },
  { label: 'HX',       value: 39, color: '#F0A838' },
  { label: 'S',        value: 8,  color: '#9B6FD6' },
  { label: 'Appliance',value: 1,  color: '#7E868F' },
]

const SERVER_STATS = [
  { value: '81',  label: 'Unassociated' },
  { value: '31',  label: 'Standalone' },
  { value: '141', label: 'Managed' },
]

const MODEL_SEGMENTS = [
  { label: 'B200 M5',       value: 26, color: '#4B9CF0' },
  { label: 'B200 M4',       value: 25, color: '#36C9C2' },
  { label: 'B200 M3',       value: 14, color: '#3BBF7C' },
  { label: 'C220 M5SX',     value: 13, color: '#F0D438' },
  { label: 'HXAF220C M5SX', value: 10, color: '#F0A838' },
  { label: 'EX M4-1',       value: 8,  color: '#E05555' },
  { label: 'Other',         value: 77, color: '#4A525B' },
]

const VERSION_SEGMENTS = [
  { label: '3.1(1e)',   value: 67, color: '#36C9C2' },
  { label: '4.1(28a)',  value: 10, color: '#4B9CF0' },
  { label: '3.0(4d)',   value: 8,  color: '#9B6FD6' },
  { label: '3.1(26i)',  value: 8,  color: '#F0A838' },
  { label: '2.2(6f)',   value: 7,  color: '#F0D438' },
  { label: '3.0(4i)',   value: 7,  color: '#E05555' },
  { label: '4.1(27a)',  value: 6,  color: '#3BBF7C' },
  { label: 'Other',     value: 60, color: '#4A525B' },
]

const PROFILE_SEGMENTS = [
  { label: 'OK',           value: 3,  color: '#3BBF7C' },
  { label: 'Not Assigned', value: 44, color: '#4A525B' },
  { label: 'Not Deployed', value: 9,  color: '#F0A838' },
  { label: 'Failed',       value: 2,  color: '#E05555' },
]

const PROFILE_STATS = [
  { value: '2',  label: 'Failed' },
  { value: '9',  label: 'Not Deployed' },
]

const HX_CLUSTERS = [
  { rank: 1, name: 'HX-Han',         capacity: '110.6 TB', pct: 61.6 },
  { rank: 2, name: 'Richardson',     capacity: '7.2 TB',   pct: 13.1 },
  { rank: 3, name: 'Atlanta',        capacity: '7.2 TB',   pct: 2.9  },
  { rank: 4, name: 'ciscolive',      capacity: '8 TB',     pct: 1.7  },
  { rank: 5, name: '2N-Edge-W9-UQ',  capacity: '3.2 TB',   pct: 1.0  },
]

// ─── IntersightPage ───────────────────────────────────────────────────────────

export function IntersightPage({ onDismissCanvas, canvasWidth }: { onDismissCanvas?: () => void; canvasWidth?: number | null } = {}) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [searchParams] = useSearchParams()
  const { threads, intersightMessages, setIntersightMessages, intersightTyping, setIntersightTyping } = useOutletContext<LayoutOutletContext>()
  const [activeTab, setActiveTab] = useState(0)
  const [bannerVisible, setBannerVisible] = useState(true)
  const [assistantClosing, setAssistantClosing] = useState(false)
  const [threadsPanelOpen, setThreadsPanelOpen] = useState(false)

  const assistantOpen = searchParams.get('chat') === '1'

  const [chatInput, setChatInput] = useState('')
  const msgsEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    msgsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [intersightMessages, intersightTyping])

  const closeAssistant = () => {
    setAssistantClosing(true)
    setTimeout(() => {
      setAssistantClosing(false)
      navigate('/intersight')
    }, 300)
  }

  const handleSend = useCallback(() => {
    const text = chatInput.trim()
    if (!text) return
    const now = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    setIntersightMessages((prev) => [...prev, { id: crypto.randomUUID(), role: 'user', text, time: now }])
    setChatInput('')
    setIntersightTyping(true)
    setTimeout(() => {
      const replyTime = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
      setIntersightMessages((prev) => [...prev, { id: crypto.randomUUID(), role: 'assistant', text: "I'm analyzing your Intersight data now. I'll surface insights and recommended actions for you.", time: replyTime }])
      setIntersightTyping(false)
    }, 1200)
  }, [chatInput, setIntersightMessages, setIntersightTyping])

  const openCanvas = () => {
    navigate('/intersight/canvas', {
      state: {
        breadcrumb: ['Intersight', 'Alerts', 'Active'],
        title: 'FI-6400 Fabric Interconnect Degraded',
        severity: 'P1',
        triggered: '2h 14m ago',
        affectedClients: 1247,
      },
    })
  }

  const isCanvasOpen = pathname.startsWith('/intersight/canvas')

  const dismissWidth = canvasWidth != null ? window.innerWidth - canvasWidth : null

  return (
    <div
      className={`intersight-page${isCanvasOpen ? ' intersight-page--canvas-open' : ''}`}
      style={dismissWidth != null ? { '--isp-dismiss-width': `${dismissWidth}px` } as React.CSSProperties : undefined}
    >
      {isCanvasOpen && (
        <div
          className="intersight-page__canvas-dismiss"
          aria-label="Close canvas"
          role="button"
          tabIndex={0}
          style={canvasWidth != null ? { width: `${window.innerWidth - canvasWidth}px` } : undefined}
          onClick={() => onDismissCanvas ? onDismissCanvas() : navigate('/intersight')}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onDismissCanvas ? onDismissCanvas() : navigate('/intersight') }}
        />
      )}
      {/* ── Sidebar ── */}
      <nav className="isp__sidebar" aria-label="Intersight navigation">
        <div className="isp__sidebar-logo">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <circle cx="10" cy="10" r="9" fill="#1B67CC"/>
            <path d="M6 10h8M10 6v8" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span className="isp__sidebar-brand">Intersight</span>
        </div>

        <ul className="isp__sidebar-list" role="list">
          {SIDEBAR_NAV.map((item) => (
            <li key={item.label}>
              <button
                type="button"
                className={`isp__sidebar-item${item.active ? ' isp__sidebar-item--active' : ''}`}
                aria-current={item.active ? 'page' : undefined}
              >
                <span className="isp__sidebar-icon">{item.icon}</span>
                <span className="isp__sidebar-label">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* ── Main content ── */}
      <div className="isp__main">

        {/* Banner */}
        {bannerVisible && (
          <div className="isp__banner" role="status">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="isp__banner-icon">
              <circle cx="8" cy="8" r="7" stroke="#4B9CF0" strokeWidth="1.5"/>
              <line x1="8" y1="7" x2="8" y2="11" stroke="#4B9CF0" strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="8" cy="5" r="0.75" fill="#4B9CF0"/>
            </svg>
            <span className="isp__banner-text">
              New features have recently been added!{' '}
              <a href="#" className="isp__banner-link">Learn More</a>
            </span>
            <button
              type="button"
              className="isp__banner-dismiss"
              aria-label="Dismiss banner"
              onClick={() => setBannerVisible(false)}
            >
              ×
            </button>
          </div>
        )}

        {/* Tab bar */}
        <div className="isp__tabbar">
          <div className="isp__tabs" role="tablist">
            {TAB_IDS.map((tab, i) => (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={activeTab === i}
                className={`isp__tab${activeTab === i ? ' isp__tab--active' : ''}`}
                onClick={() => setActiveTab(i)}
              >
                {tab}
              </button>
            ))}
            <button type="button" className="isp__tab isp__tab--add" aria-label="Add tab">
              +
            </button>
          </div>
          <button type="button" className="isp__add-widget-btn">
            + Add Widget
          </button>
        </div>

        {/* Widget grid */}
        <div className="isp__widgets">

          {/* ── Widget 1: Fabric Interconnect Inventory ── */}
          <div className="isp__widget">
            <div className="isp__widget-title">Fabric Interconnect Inventory</div>
            <div className="isp__widget-body">
              <DonutChart segments={FI_SEGMENTS} total={18} />
              <div className="isp__legend">
                {FI_SEGMENTS.map((s) => (
                  <div key={s.label} className="isp__legend-item">
                    <span className="isp__legend-dot" style={{ background: s.color }} />
                    {s.label}
                    <span className="isp__legend-count">{s.value}</span>
                  </div>
                ))}
                <button
                  type="button"
                  className="isp__canvas-alert-link"
                  onClick={openCanvas}
                  aria-label="View 1 critical alert in Canvas"
                >
                  <span className="isp__canvas-alert-dot" />
                  1 Critical Alert — Open in Canvas →
                </button>
              </div>
            </div>
            <div className="isp__widget-footer">
              {FI_STATS.map((s) => (
                <div key={s.label} className="isp__stat">
                  <span className="isp__stat-num">{s.value}</span>
                  <span className="isp__stat-lbl">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Widget 2: Server Inventory ── */}
          <div className="isp__widget">
            <div className="isp__widget-title">Server Inventory</div>
            <div className="isp__widget-body">
              <DonutChart segments={SERVER_SEGMENTS} total={173} />
              <div className="isp__legend">
                {SERVER_SEGMENTS.map((s) => (
                  <div key={s.label} className="isp__legend-item">
                    <span className="isp__legend-dot" style={{ background: s.color }} />
                    {s.label}
                    <span className="isp__legend-count">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="isp__widget-footer">
              {SERVER_STATS.map((s) => (
                <div key={s.label} className="isp__stat">
                  <span className="isp__stat-num">{s.value}</span>
                  <span className="isp__stat-lbl">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Widget 3: Server Model Summary ── */}
          <div className="isp__widget">
            <div className="isp__widget-title">Server Model Summary</div>
            <div className="isp__widget-body">
              <DonutChart segments={MODEL_SEGMENTS} total={173} />
              <div className="isp__legend">
                {MODEL_SEGMENTS.map((s) => (
                  <div key={s.label} className="isp__legend-item">
                    <span className="isp__legend-dot" style={{ background: s.color }} />
                    {s.label}
                    <span className="isp__legend-count">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Widget 4: Server Version Summary ── */}
          <div className="isp__widget">
            <div className="isp__widget-title">Server Version Summary</div>
            <div className="isp__widget-body">
              <DonutChart segments={VERSION_SEGMENTS} total={173} />
              <div className="isp__legend">
                {VERSION_SEGMENTS.map((s) => (
                  <div key={s.label} className="isp__legend-item">
                    <span className="isp__legend-dot" style={{ background: s.color }} />
                    {s.label}
                    <span className="isp__legend-count">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Widget 5: Server Profile Summary ── */}
          <div className="isp__widget">
            <div className="isp__widget-title">Server Profile Summary</div>
            <div className="isp__widget-body">
              <DonutChart segments={PROFILE_SEGMENTS} total={58} />
              <div className="isp__legend">
                {PROFILE_SEGMENTS.map((s) => (
                  <div key={s.label} className="isp__legend-item">
                    <span className="isp__legend-dot" style={{ background: s.color }} />
                    {s.label}
                    <span className="isp__legend-count">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="isp__widget-footer">
              {PROFILE_STATS.map((s) => (
                <div key={s.label} className="isp__stat">
                  <span className="isp__stat-num">{s.value}</span>
                  <span className="isp__stat-lbl">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Widget 6: Top 5 HyperFlex Clusters ── */}
          <div className="isp__widget isp__widget--table">
            <div className="isp__widget-title">Top 5 HyperFlex Clusters by Storage Utilization</div>
            <div className="isp__widget-body isp__widget-body--table">
              <table className="isp__hx-table" aria-label="Top 5 HyperFlex clusters by storage utilization">
                <thead>
                  <tr>
                    <th className="isp__hx-th">#</th>
                    <th className="isp__hx-th">Name</th>
                    <th className="isp__hx-th">Capacity</th>
                    <th className="isp__hx-th">Utilization</th>
                  </tr>
                </thead>
                <tbody>
                  {HX_CLUSTERS.map((row) => (
                    <tr key={row.rank} className="isp__hx-tr">
                      <td className="isp__hx-td isp__hx-td--rank">{row.rank}</td>
                      <td className="isp__hx-td isp__hx-td--name">
                        <a href="#" className="isp__hx-link">{row.name}</a>
                      </td>
                      <td className="isp__hx-td">{row.capacity}</td>
                      <td className="isp__hx-td isp__hx-td--bar">
                        <div className="isp__hx-bar-wrap">
                          <div className="isp__hx-bar-track">
                            <div
                              className="isp__hx-bar-fill"
                              style={{ width: `${row.pct}%` }}
                              role="progressbar"
                              aria-valuenow={row.pct}
                              aria-valuemin={0}
                              aria-valuemax={100}
                            />
                          </div>
                          <span className="isp__hx-pct">{row.pct}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>

      {(assistantOpen || assistantClosing) && (
        <>
          <div className={`isp__assistant-panel${assistantClosing ? ' isp__assistant-panel--closing' : ''}`}>
            {threadsPanelOpen && (
              <ChatPanel canvasInline onClose={() => setThreadsPanelOpen(false)} injectedThreads={threads} />
            )}
            <header className="open-canvas__chat-header">
              <button type="button" className="open-canvas__expand-btn" aria-label="Toggle threads" onClick={() => setThreadsPanelOpen((v) => !v)}>
                <IconNav />
              </button>
              <button type="button" className="open-canvas__close-canvas-btn" onClick={closeAssistant}>
                Close
              </button>
            </header>

            <div className="open-canvas__assistant-body">
              <div className="canvas-welcome">
                {intersightMessages.length === 0 && (
                  <>
                    <div className="canvas-welcome__hero">
                      <h2 className="canvas-welcome__heading">Where should we begin?</h2>
                      <p className="canvas-welcome__desc">Welcome to your canvas. Use it to visualize your network, solve issues quickly, and work together with your team. Explore the prompt categories.</p>
                    </div>
                    <div className="canvas-welcome__cats">
                      {INTERSIGHT_PROMPT_CATEGORIES.map((cat) => (
                        <IntersightPromptCat key={cat.id} label={cat.label} icon={cat.icon} />
                      ))}
                    </div>
                  </>
                )}
              </div>
              {intersightMessages.length > 0 && (
                <div className="canvas-chat-messages">
                  {intersightMessages.map((msg) => (
                    <div key={msg.id} className={`canvas-chat-msg canvas-chat-msg--${msg.role}`}>
                      <div className="canvas-chat-msg__header">
                        {msg.role === 'user' ? (
                          <>
                            <span className="canvas-chat-msg__avatar" aria-hidden>A</span>
                            <span className="canvas-chat-msg__name">You</span>
                          </>
                        ) : (
                          <>
                            <span className="canvas-chat-msg__ai-icon" aria-hidden>AI</span>
                            <span className="canvas-chat-msg__name">AI Assistant</span>
                            <span className="canvas-chat-msg__timestamp">{msg.time}</span>
                          </>
                        )}
                      </div>
                      <p className="canvas-chat-msg__text">{msg.text}</p>
                    </div>
                  ))}
                  {intersightTyping && (
                    <div className="canvas-chat-msg canvas-chat-msg--assistant">
                      <div className="canvas-chat-msg__header">
                        <span className="canvas-chat-msg__ai-icon" aria-hidden>AI</span>
                        <span className="canvas-chat-msg__name">AI Assistant</span>
                      </div>
                      <div className="actions-detail__typing" aria-label="Assistant is typing">
                        <span /><span /><span />
                      </div>
                    </div>
                  )}
                  <div ref={msgsEndRef} />
                </div>
              )}
            </div>

            <footer className="open-canvas__chat-footer">
              <div className="open-canvas__input-wrap">
                <div className="open-canvas__input-field">
                  <input
                    type="text"
                    className="open-canvas__input-placeholder"
                    placeholder="Ask AI Assistant a question, / for prompts"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
                    aria-label="Ask AI Assistant"
                  />
                  <div className="open-canvas__input-toolbar">
                    <div className="open-canvas__input-chips">
                      <button type="button" className="open-canvas__input-auto-btn" aria-label="Model: Auto">
                        Auto <IconCaretDown className="open-canvas__input-auto-caret" />
                      </button>
                    </div>
                    <button type="button" className="open-canvas__submit-btn" aria-label="Send message" onClick={handleSend}>
                      <IconSend />
                    </button>
                  </div>
                </div>
                <p className="open-canvas__disclaimer">
                  AI Assistant can make mistakes. Verify responses.
                </p>
              </div>
            </footer>
          </div>
        </>
      )}
    </div>
  )
}
