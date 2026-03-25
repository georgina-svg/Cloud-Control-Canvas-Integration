import { useState, useRef, useCallback, useEffect } from 'react'
import type { ReactNode } from 'react'
import type React from 'react'
import { useLocation, useOutletContext } from 'react-router-dom'
import type { LayoutOutletContext } from '../components/Layout'
import {
  IconNav, IconFile, IconPencil, IconStar, IconCaretDown, IconMic, IconWaveform,
  IconHeartPulse, IconChart, IconSettings, IconDevice, IconShield, IconTopologyNodes, IconSend, IconDotsThree,
  IconUpload, IconStickyNote, IconMinus, IconPlus,
} from '../components/icons'
import { INTERSIGHT_PROMPT_CATEGORIES, IntersightPromptCat } from '../components/IntersightPromptCats'
import { ChatPanel } from '../components/ChatPanel'
import { ActionsDetail } from '../components/ActionsDetail'
import { ChatVisual } from '../components/ChatVisual'
import type { VisualType } from '../components/ChatVisual'

const BOARD_SIZE = 4000
const ZOOM_MIN = 0.25
const ZOOM_MAX = 2
const ZOOM_STEP = 0.25

export interface StickyNote {
  id: string
  x: number
  y: number
  text: string
}

const BOARD_CARD_IDS = [
  'incident-header',
  'metric-duration',
  'metric-clients',
  'metric-latency',
  'root-cause',
  'recommendation',
  'entities',
] as const

type BoardCardId = (typeof BOARD_CARD_IDS)[number]

const INITIAL_BOARD_CARD_POSITIONS: Record<BoardCardId, { x: number; y: number }> = {
  'incident-header': { x: 0, y: 0 },
  'metric-duration': { x: 0, y: 140 },
  'metric-clients':  { x: 280, y: 140 },
  'metric-latency':  { x: 560, y: 140 },
  'root-cause':      { x: 0, y: 340 },
  'recommendation':  { x: 436, y: 340 },
  'entities':        { x: 0, y: 556 },
}


const BOARD_TEMPLATES: Array<{
  id: string
  title: string
  description: string
  color: string
  icon: ReactNode
  prompts: string[]
}> = [
  {
    id: 'tmpl-health',
    title: 'Health & Overview',
    description: 'Show me my network health, active alerts, and critical issues across my infrastructure.',
    color: 'canvas-card--blue',
    icon: <IconHeartPulse />,
    prompts: [
      'How is my organization doing?',
      'Which sites are down?',
      'Are there any critical alerts?',
      'Show me health trends for the past 14 days',
      'Show me all sites with health scores below 80%',
      'What is wrong with my network between yesterday and today?',
    ],
  },
  {
    id: 'tmpl-troubleshoot',
    title: 'Troubleshooting',
    description: 'Help me diagnose this issue, find the root cause, and walk me through how to fix it.',
    color: 'canvas-card--orange',
    icon: <IconSettings />,
    prompts: [],
  },
  {
    id: 'tmpl-performance',
    title: 'Performance & Trends',
    description: 'Show me performance trends, latency spikes, and where my network is degrading over time.',
    color: 'canvas-card--pink',
    icon: <IconChart />,
    prompts: [],
  },
  {
    id: 'tmpl-devices',
    title: 'Devices & Inventory',
    description: 'Show me all my devices, their current status, configurations, and connectivity issues.',
    color: 'canvas-card--green',
    icon: <IconDevice />,
    prompts: [],
  },
  {
    id: 'tmpl-security',
    title: 'Security & Access',
    description: 'Show me security anomalies, policy violations, and what I should do to strengthen my posture.',
    color: 'canvas-card--purple',
    icon: <IconShield />,
    prompts: [],
  },
  {
    id: 'tmpl-visualization',
    title: 'Visualization & Topology',
    description: 'Show me a map of my network topology and highlight any connectivity gaps or anomalies.',
    color: 'canvas-card--teal',
    icon: <IconTopologyNodes />,
    prompts: [],
  },
]

const CARD_W = 320
const CARD_GAP = 28
const COL2_X = CARD_W + CARD_GAP
const CARD_H = 190
const ROW_GAP = CARD_GAP
const ROW1_Y = 0
const ROW2_Y = CARD_H + ROW_GAP
const ROW3_Y = (CARD_H + ROW_GAP) * 2
const GROUP_PAD = 40
const GROUP_BOTTOM_PAD = 60
const GROUP_HEADER_H = 20
const GROUP_W = COL2_X + CARD_W + GROUP_PAD * 2
const GROUP_H = ROW3_Y + CARD_H + GROUP_PAD + GROUP_BOTTOM_PAD + GROUP_HEADER_H
const GROUP_X = -GROUP_PAD
const GROUP_Y = -(GROUP_PAD + GROUP_HEADER_H)

const INITIAL_TEMPLATE_POSITIONS: Record<string, { x: number; y: number }> = {
  'tmpl-health':         { x: 0,       y: ROW1_Y },
  'tmpl-troubleshoot':   { x: COL2_X,  y: ROW1_Y },
  'tmpl-performance':    { x: 0,       y: ROW2_Y },
  'tmpl-devices':        { x: COL2_X,  y: ROW2_Y },
  'tmpl-security':       { x: 0,       y: ROW3_Y },
  'tmpl-visualization':  { x: COL2_X,  y: ROW3_Y },
}


function getVisualForPrompt(m: string): VisualType | undefined {
  if (m.includes('health') || m.includes('overview') || m.includes('doing') || m.includes('status'))
    return 'health-overview'
  if (m.includes('down') || (m.includes('site') && !m.includes('health')))
    return 'site-status'
  if (m.includes('alert') || m.includes('critical'))
    return 'alerts-list'
  if (m.includes('trend') || m.includes('performance') || m.includes('latency'))
    return 'perf-trend'
  if (m.includes('device') || m.includes('inventory'))
    return 'device-summary'
  return undefined
}

function generateCanvasName(prompt: string): string {
  const m = prompt.toLowerCase()
  if (m.includes('health') || m.includes('overview') || m.includes('doing') || m.includes('status'))
    return 'Network Health Overview'
  if (m.includes('site') && (m.includes('down') || m.includes('offline')))
    return 'Site Availability Check'
  if (m.includes('alert') || m.includes('critical'))
    return 'Critical Alerts Review'
  if (m.includes('health trend') || m.includes('trend') || m.includes('past') || m.includes('days'))
    return 'Health Trends Analysis'
  if (m.includes('health score') || m.includes('score below'))
    return 'Health Score Audit'
  if (m.includes('latency') || m.includes('performance') || m.includes('slow'))
    return 'Performance Investigation'
  if (m.includes('device') || m.includes('inventory'))
    return 'Device Inventory Review'
  if (m.includes('security') || m.includes('access') || m.includes('policy'))
    return 'Security & Access Audit'
  if (m.includes('topology') || m.includes('map') || m.includes('visual'))
    return 'Topology Visualization'
  if (m.includes('troubleshoot') || m.includes('issue') || m.includes('problem') || m.includes('root cause'))
    return 'Troubleshooting Session'
  if (m.includes('wireless') || m.includes('wifi') || m.includes('wi-fi'))
    return 'Wireless Performance Review'
  if (m.includes('wan') || m.includes('sd-wan'))
    return 'SD-WAN Analysis'
  if (m.includes('wrong') || m.includes('what happened'))
    return 'Incident Investigation'
  // Fallback: use first 40 chars of prompt
  const trimmed = prompt.trim()
  return trimmed.length > 40 ? trimmed.slice(0, 39) + '…' : trimmed
}

export function OpenCanvasPage({ closingCanvas, canvasWidth, onCanvasWidthChange }: { closingCanvas?: boolean; canvasWidth?: number | null; onCanvasWidthChange?: (w: number) => void } = {}) {
  const { pathname, state: routeState } = useLocation()
  const { threads, setThreads, intersightMessages, setIntersightMessages, intersightTyping, setIntersightTyping, assistantOpen } = useOutletContext<LayoutOutletContext>()
  const actionsMessages = (routeState as null | { actionsMessages?: { id: string; role: 'user' | 'assistant'; text: string }[] })?.actionsMessages
  const initialPrompt = (routeState as null | { initialPrompt?: string })?.initialPrompt ?? ''
  const canvasContext = (routeState as null | {
    breadcrumb: string[]; title: string; severity: string; triggered: string; affectedClients: number
  }) ?? {
    breadcrumb: ['Intersight', 'Alerts', 'Active'],
    title: 'FI-6400 Fabric Interconnect Degraded',
    severity: 'P1',
    triggered: '2h 14m ago',
    affectedClients: 1247,
  }
  const isIntersightCanvas = pathname.startsWith('/intersight')
  const fromActions = actionsMessages !== undefined
  const showWelcome = (isIntersightCanvas || pathname === '/canvas/open') && !fromActions
  const showContextBar = isIntersightCanvas
  const [intersightThreadId] = useState(() => 'intersight-untitled')
  const [intersightThreadTitle] = useState(() => {
    const now = new Date()
    const hh = now.getHours().toString().padStart(2, '0')
    const mm = now.getMinutes().toString().padStart(2, '0')
    const mo = (now.getMonth() + 1).toString().padStart(2, '0')
    const dd = now.getDate().toString().padStart(2, '0')
    return `${hh}:${mm} ${mo}/${dd} canvas`
  })
  const [canvasThreadId] = useState(() => crypto.randomUUID())
  const [canvasThreadTitle] = useState(() => {
    if (initialPrompt) return generateCanvasName(initialPrompt)
    const now = new Date()
    const hh = now.getHours().toString().padStart(2, '0')
    const mm = now.getMinutes().toString().padStart(2, '0')
    const mo = (now.getMonth() + 1).toString().padStart(2, '0')
    const dd = now.getDate().toString().padStart(2, '0')
    return `${hh}:${mm} ${mo}/${dd} canvas`
  })
  const [threadsPanelOpen, setThreadsPanelOpen] = useState(false)
  const [chatFullPage, setChatFullPage] = useState(() => !!(routeState as { startChatFull?: boolean } | null)?.startChatFull)
  const [selectedBoardCategory, setSelectedBoardCategory] = useState<string | null>(null)
  const [boardTemplatesHidden, setBoardTemplatesHidden] = useState(false)
  const [tmplGroupLeft, setTmplGroupLeft] = useState(600)
  const [categoriesModalOpen, setCategoriesModalOpen] = useState(() => !fromActions && !initialPrompt)
  const [chatInput, setChatInput] = useState(() => initialPrompt)
  const [localCanvasMessages, setLocalCanvasMessages] = useState<{ id: string; role: 'user' | 'assistant'; text: string; time: string; visual?: VisualType }[]>([])
  const [localCanvasTyping, setLocalCanvasTyping] = useState(false)
  const canvasMessages = isIntersightCanvas ? intersightMessages : localCanvasMessages
  const setCanvasMessages = isIntersightCanvas
    ? (setIntersightMessages as React.Dispatch<React.SetStateAction<{ id: string; role: 'user' | 'assistant'; text: string; time: string; visual?: VisualType }[]>>)
    : setLocalCanvasMessages
  const canvasTyping = isIntersightCanvas ? intersightTyping : localCanvasTyping
  const setCanvasTyping = isIntersightCanvas ? setIntersightTyping : setLocalCanvasTyping
  const canvasMsgsEndRef = useRef<HTMLDivElement>(null)
  const [metricsOnBoard, setMetricsOnBoard] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)
  const [stickyNotes, setStickyNotes] = useState<StickyNote[]>([])
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null)
  const [assistantWidth, setAssistantWidth] = useState(440)
  const [isResizingAssistant, setIsResizingAssistant] = useState(false)
  const [boardCardPositions, setBoardCardPositions] = useState<Record<string, { x: number; y: number }>>(() => ({ ...INITIAL_BOARD_CARD_POSITIONS, ...INITIAL_TEMPLATE_POSITIONS }))
  const [boardVisuals, setBoardVisuals] = useState<Array<{ id: string; type: VisualType; x: number; y: number; groupId?: string }>>([])
  const [boardGroups, setBoardGroups] = useState<Array<{ id: string; tmplId: string; title: string; x: number; y: number; w: number; h: number }>>([])
  const addVisualToBoard = useCallback((type: VisualType) => {
    const id = `visual-${crypto.randomUUID()}`
    const offset = boardVisuals.length * 32
    setBoardVisuals((prev) => [...prev, { id, type, x: 80 + offset, y: 80 + offset }])
    setBoardCardPositions((prev) => ({ ...prev, [id]: { x: 80 + offset, y: 80 + offset } }))
  }, [boardVisuals.length])
  const resizeStart = useRef({ clientX: 0, width: 0 })
  const panStart = useRef({ x: 0, y: 0, panX: 0, panY: 0 })
  const dragStart = useRef({ clientX: 0, clientY: 0, noteX: 0, noteY: 0, noteId: '' })
  const cardDragStart = useRef({ clientX: 0, clientY: 0, cardX: 0, cardY: 0, cardId: '' })
  const lastCreatedNoteIdRef = useRef<string | null>(null)
  const zoomRef = useRef(zoom)
  const canvasAreaRef = useRef<HTMLDivElement>(null)
  const boardContentRef = useRef<HTMLDivElement>(null)


  zoomRef.current = zoom

  useEffect(() => {
    canvasMsgsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [canvasMessages, canvasTyping])

  // Header assistant button toggles chat-full-page (hides/shows board) on both canvas routes
  // Use a ref to skip the initial mount so the page always starts with side-by-side view
  const prevAssistantOpenRef = useRef(assistantOpen)
  useEffect(() => {
    if (prevAssistantOpenRef.current !== assistantOpen) {
      setChatFullPage(assistantOpen)
    }
    prevAssistantOpenRef.current = assistantOpen
  }, [assistantOpen])

  useEffect(() => {
    if (!isIntersightCanvas) return
    setThreads((prev) => {
      if (prev.some((t) => t.id === intersightThreadId)) return prev
      return [{ id: intersightThreadId, title: intersightThreadTitle }, ...prev]
    })
  }, [isIntersightCanvas, intersightThreadId, intersightThreadTitle, setThreads])

  useEffect(() => {
    if (isIntersightCanvas || (!selectedBoardCategory && !initialPrompt)) return
    setThreads((prev) => {
      if (prev.some((t) => t.id === canvasThreadId)) return prev
      return [{ id: canvasThreadId, title: canvasThreadTitle }, ...prev]
    })
  }, [isIntersightCanvas, selectedBoardCategory, initialPrompt, canvasThreadId, canvasThreadTitle, setThreads])

  const VISUAL_TITLES: Record<VisualType, string> = {
    'health-overview': 'Health Overview',
    'site-status':     'Site Status',
    'alerts-list':     'Active Alerts',
    'perf-trend':      'Performance Trend',
    'device-summary':  'Device Summary',
  }

  const CATEGORY_VISUALS: Record<string, VisualType[]> = {
    'tmpl-health':         ['health-overview', 'alerts-list', 'site-status'],
    'tmpl-troubleshoot':   ['alerts-list', 'perf-trend', 'site-status'],
    'tmpl-performance':    ['perf-trend', 'health-overview', 'device-summary'],
    'tmpl-devices':        ['device-summary', 'site-status', 'health-overview'],
    'tmpl-security':       ['alerts-list', 'device-summary', 'health-overview'],
    'tmpl-visualization':  ['site-status', 'health-overview', 'perf-trend'],
  }

  const CATEGORY_REPLIES: Record<string, string> = {
    'tmpl-health':        "I've added a Health Overview, Active Alerts, and Site Status to the board. Your overall network health is at 87% with 3 critical alerts active across your Singapore and Sydney sites.",
    'tmpl-troubleshoot':  "I've pulled up Active Alerts, Performance Trends, and Site Status on the board to help you diagnose the issue. Looks like latency spiked 42% in APAC — want me to trace the root cause?",
    'tmpl-performance':   "I've added Performance Trends, Health Overview, and Device Summary to the board. Latency in APAC has increased 42% over the past 14 days — the Singapore region is the primary outlier.",
    'tmpl-devices':       "I've added Device Summary, Site Status, and Health Overview to the board. You have 4,821 managed devices across 38 sites — 47 are currently offline with 112 pending firmware updates.",
    'tmpl-security':      "I've added Active Alerts, Device Summary, and Health Overview to the board. No active incidents, but 3 policy changes were made in the last 24 hours — BranchOptimize-v2 is flagged for review.",
    'tmpl-visualization': "I've added Site Status, Health Overview, and Performance Trends to the board to give you a full picture of your network topology and any connectivity gaps.",
  }

  const handleCategorySelect = useCallback((tmplId: string) => {
    const VISUAL_W = 320
    const VISUAL_H = 270
    const VISUAL_GAP_X = 20
    const GROUP_PAD = 20
    const GROUP_HEADER_H = 32

    const visuals = CATEGORY_VISUALS[tmplId] ?? []
    const tmpl = BOARD_TEMPLATES.find((t) => t.id === tmplId)

    setSelectedBoardCategory(tmplId)
    setBoardTemplatesHidden(true)

    // If cards for this template already exist, just pan to that section
    const existingGroup = boardGroups.find((g) => g.tmplId === tmplId)
    if (existingGroup) {
      const sectionCenterX = existingGroup.x + existingGroup.w / 2
      const sectionCenterY = existingGroup.y + existingGroup.h / 2
      const viewport = canvasAreaRef.current
      if (viewport) {
        setZoom(1)
        setPan({ x: viewport.clientWidth / 2 - sectionCenterX, y: viewport.clientHeight / 2 - sectionCenterY })
      }
      return
    }

    // Grid layout: 3 columns, then wrap to next row
    const COLS = 2
    const COL_W = 1100  // column slot width (group ~1040 + gap ~60)
    const ROW_H = 380   // row slot height (group ~312 + gap ~68)

    const groupIndex = boardGroups.length
    const col = groupIndex % COLS
    const row = Math.floor(groupIndex / COLS)
    const xOffset = col * COL_W
    const yOffset = row * ROW_H

    const groupW = visuals.length * (VISUAL_W + VISUAL_GAP_X) - VISUAL_GAP_X + GROUP_PAD * 2
    const groupId = `group-${crypto.randomUUID()}`

    const newVisuals = visuals.map((type, i) => ({
      id: `visual-${crypto.randomUUID()}`,
      type,
      x: xOffset + i * (VISUAL_W + VISUAL_GAP_X),
      y: yOffset,
      groupId,
    }))

    setBoardGroups((g) => [...g, {
      id: groupId,
      tmplId,
      title: tmpl?.title ?? '',
      x: xOffset - GROUP_PAD,
      y: yOffset - GROUP_HEADER_H - GROUP_PAD,
      w: groupW,
      h: VISUAL_H + GROUP_HEADER_H + GROUP_PAD * 2,
    }])

    setBoardCardPositions((pos) => {
      const next = { ...pos }
      newVisuals.forEach((v) => { next[v.id] = { x: v.x, y: v.y } })
      return next
    })

    setBoardVisuals((prev) => [...prev, ...newVisuals])

    // Pan to center the new section at 100% zoom
    const sectionCenterX = xOffset + (visuals.length * (VISUAL_W + VISUAL_GAP_X) - VISUAL_GAP_X) / 2
    const sectionCenterY = yOffset + VISUAL_H / 2
    const viewport = canvasAreaRef.current
    if (viewport) {
      setZoom(1)
      setPan({ x: viewport.clientWidth / 2 - sectionCenterX, y: viewport.clientHeight / 2 - sectionCenterY })
    }

    const now = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    setCanvasMessages((prev) => [...prev, { id: crypto.randomUUID(), role: 'user', text: tmpl?.description ?? tmpl?.title ?? '', time: now }])
    setCanvasTyping(true)
    setTimeout(() => {
      const replyTime = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
      const reply = CATEGORY_REPLIES[tmplId] ?? "I've added the relevant visuals to the board for you."
      setCanvasMessages((prev) => [...prev, { id: crypto.randomUUID(), role: 'assistant', text: reply, time: replyTime }])
      setCanvasTyping(false)
    }, 1200)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardGroups])

  const handleCanvasSend = useCallback(() => {
    const text = chatInput.trim()
    if (!text) return
    const now = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    setCanvasMessages((prev) => [...prev, { id: crypto.randomUUID(), role: 'user', text, time: now }])
    setChatInput('')
    setCanvasTyping(true)
    setTimeout(() => {
      const m = text.toLowerCase()
      let reply = 'Got it. I\'m analyzing your network data now. Could you give me a bit more context about what you\'re looking for?'
      if (m.includes('health') || m.includes('overview') || m.includes('status') || m.includes('doing'))
        reply = 'Overall network health is at 87%. There are 3 critical alerts active across your Singapore and Sydney sites, and 12 sites with health scores below 80%. Would you like a breakdown by region?'
      else if (m.includes('down') || m.includes('site'))
        reply = '2 sites are currently unreachable: SG-Branch-07 and SY-Branch-03. Both went offline in the last 30 minutes. The likely cause is the BranchOptimize-v2 SD-WAN policy change. Shall I investigate further?'
      else if (m.includes('alert') || m.includes('critical'))
        reply = 'There are 3 critical alerts right now: (1) Network latency spike in Singapore, (2) VPN tunnel down at SG-Branch-07, (3) High packet loss on MPLS link AP-Southeast-1. Do you want me to prioritize one?'
      else if (m.includes('trend') || m.includes('performance') || m.includes('latency'))
        reply = 'Over the past 14 days, latency in APAC has increased by 42% since the policy change on Monday. Throughput is stable in NA and EMEA. The Singapore region is the primary outlier — max latency peaked at 795 ms today.'
      else if (m.includes('device') || m.includes('inventory'))
        reply = 'You have 4,821 managed devices across 38 sites. 47 devices are offline, 112 have pending firmware updates. The highest-risk devices are 6 Meraki MX appliances running firmware older than 3 versions.'
      else if (m.includes('security') || m.includes('access') || m.includes('policy'))
        reply = 'No active security incidents detected. However, 3 access policy changes were made in the last 24 hours — 2 by admin@cisco.com and 1 by auto-remediation. BranchOptimize-v2 is flagged for review.'
      else if (m.includes('topology') || m.includes('map') || m.includes('visual'))
        reply = 'I can generate a topology map for any site or region. Which would you like to visualize — the full network, a specific region, or the affected Singapore branch?'
      const replyTime = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
      const visual = getVisualForPrompt(m)
      setCanvasMessages((prev) => [...prev, { id: crypto.randomUUID(), role: 'assistant', text: reply, time: replyTime, visual }])
      setCanvasTyping(false)
    }, 1200)
  }, [chatInput])

  /* Auto-send initial prompt when navigating from Canvas page */
  useEffect(() => {
    if (!initialPrompt) return
    const text = initialPrompt.trim()
    if (!text) return
    const now = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    setCanvasMessages([{ id: crypto.randomUUID(), role: 'user', text, time: now }])
    setChatInput('')
    setCanvasTyping(true)
    const timer = setTimeout(() => {
      const m = text.toLowerCase()
      let reply = 'Got it. I\'m analyzing your network data now. Could you give me a bit more context about what you\'re looking for?'
      if (m.includes('health') || m.includes('overview') || m.includes('status') || m.includes('doing'))
        reply = 'Overall network health is at 87%. There are 3 critical alerts active across your Singapore and Sydney sites, and 12 sites with health scores below 80%. Would you like a breakdown by region?'
      else if (m.includes('down') || m.includes('site'))
        reply = '2 sites are currently unreachable: SG-Branch-07 and SY-Branch-03. Both went offline in the last 30 minutes. The likely cause is the BranchOptimize-v2 SD-WAN policy change. Shall I investigate further?'
      else if (m.includes('alert') || m.includes('critical'))
        reply = 'There are 3 critical alerts right now: (1) Network latency spike in Singapore, (2) VPN tunnel down at SG-Branch-07, (3) High packet loss on MPLS link AP-Southeast-1. Do you want me to prioritize one?'
      else if (m.includes('trend') || m.includes('performance') || m.includes('latency'))
        reply = 'Over the past 14 days, latency in APAC has increased by 42% since the policy change on Monday. Throughput is stable in NA and EMEA. The Singapore region is the primary outlier — max latency peaked at 795 ms today.'
      else if (m.includes('device') || m.includes('inventory'))
        reply = 'You have 4,821 managed devices across 38 sites. 47 devices are offline, 112 have pending firmware updates. The highest-risk devices are 6 Meraki MX appliances running firmware older than 3 versions.'
      else if (m.includes('security') || m.includes('access') || m.includes('policy'))
        reply = 'No active security incidents detected. However, 3 access policy changes were made in the last 24 hours — 2 by admin@cisco.com and 1 by auto-remediation. BranchOptimize-v2 is flagged for review.'
      else if (m.includes('topology') || m.includes('map') || m.includes('visual'))
        reply = 'I can generate a topology map for any site or region. Which would you like to visualize — the full network, a specific region, or the affected Singapore branch?'
      const replyTime = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
      const visual = getVisualForPrompt(m)
      setCanvasMessages((prev) => [...prev, { id: crypto.randomUUID(), role: 'assistant', text: reply, time: replyTime, visual }])
      setCanvasTyping(false)
    }, 1200)
    return () => clearTimeout(timer)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* Pan to position board content in the viewport when the canvas is shown */
  useEffect(() => {
    if (chatFullPage) return
    const run = () => {
      const viewport = canvasAreaRef.current
      const content = boardContentRef.current
      if (!viewport || !content) return
      const vw = viewport.clientWidth
      const vh = viewport.clientHeight
      const cw = content.offsetWidth
      const ch = content.offsetHeight
      if (!isIntersightCanvas && pathname === '/canvas/open') {
        // Position the template group: right-aligned with padding, near the top
        const groupVisualW = GROUP_W * 0.5  // 374px at scale(0.5)
        const rightPad = 48
        const panX = 80
        const newTmplLeft = Math.round(vw - rightPad - groupVisualW - panX)
        setTmplGroupLeft(newTmplLeft)
        setPan({ x: panX, y: 80 })
      } else if (showWelcome) {
        // Empty board: center it
        setPan({ x: vw / 2 - cw / 2, y: vh / 2 - ch / 2 })
      } else {
        // Cards board: show from top, centered horizontally
        setPan({ x: vw / 2 - cw / 2, y: 0 })
      }
    }
    const id = requestAnimationFrame(run)
    return () => cancelAnimationFrame(id)
  }, [chatFullPage, isIntersightCanvas, pathname, showWelcome])

  const handlePanMove = useCallback((e: MouseEvent) => {
    setPan({
      x: panStart.current.panX + (e.clientX - panStart.current.x),
      y: panStart.current.panY + (e.clientY - panStart.current.y),
    })
  }, [])

  const handlePanEnd = useCallback(() => {
    setIsPanning(false)
    window.removeEventListener('mousemove', handlePanMove)
    window.removeEventListener('mouseup', handlePanEnd)
  }, [handlePanMove])

  const handleBoardMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return
    const target = e.target as HTMLElement
    if (target.closest('.open-canvas__zoom-controls') || target.closest('button') || target.closest('a') || target.closest('.open-canvas__sticky-note') || target.closest('.open-canvas__assistant-resize') || target.closest('.open-canvas__board-card-draggable')) return
    e.preventDefault()
    setSelectedNoteId(null)
    setIsPanning(true)
    panStart.current = { x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y }
    window.addEventListener('mousemove', handlePanMove)
    window.addEventListener('mouseup', handlePanEnd)
  }, [pan.x, pan.y, handlePanMove, handlePanEnd])

  const NOTE_OFFSET_X = 220
  const NOTE_OFFSET_Y = 140

  const addStickyNote = useCallback(() => {
    const viewport = canvasAreaRef.current
    setStickyNotes((prev) => {
      const index = prev.length
      const z = zoomRef.current
      // Place at the center of whatever is currently visible, staggered for multiple notes
      const cx = viewport ? (viewport.clientWidth / 2 - pan.x) / z : 400
      const cy = viewport ? (viewport.clientHeight / 2 - pan.y) / z : 300
      const noteX = cx - 80 + (index % 3) * NOTE_OFFSET_X
      const noteY = cy - 60 + Math.floor(index / 3) * NOTE_OFFSET_Y
      const newNote = { id: crypto.randomUUID(), x: noteX, y: noteY, text: '' }
      lastCreatedNoteIdRef.current = newNote.id
      return [...prev, newNote]
    })
  }, [pan])

  const updateStickyNote = useCallback((id: string, updates: Partial<Pick<StickyNote, 'x' | 'y' | 'text'>>) => {
    setStickyNotes((prev) => prev.map((n) => (n.id === id ? { ...n, ...updates } : n)))
  }, [])

  const deleteStickyNote = useCallback((id: string) => {
    setStickyNotes((prev) => prev.filter((n) => n.id !== id))
    setSelectedNoteId((prev) => (prev === id ? null : prev))
  }, [])

  const handleStickyNoteDragMove = useCallback((e: MouseEvent) => {
    const { noteId, clientX, clientY, noteX, noteY } = dragStart.current
    if (!noteId) return
    const z = zoomRef.current
    const dx = (e.clientX - clientX) / z
    const dy = (e.clientY - clientY) / z
    setStickyNotes((prev) => prev.map((n) => (n.id === noteId ? { ...n, x: noteX + dx, y: noteY + dy } : n)))
  }, [])

  const handleStickyNoteDragEnd = useCallback(() => {
    dragStart.current.noteId = ''
    window.removeEventListener('mousemove', handleStickyNoteDragMove)
    window.removeEventListener('mouseup', handleStickyNoteDragEnd)
  }, [handleStickyNoteDragMove])

  const handleStickyNoteDragStart = useCallback((e: React.MouseEvent, id: string) => {
    if (e.button !== 0) return
    if ((e.target as HTMLElement).closest('.open-canvas__sticky-note-delete')) return
    e.preventDefault()
    const note = stickyNotes.find((n) => n.id === id)
    if (!note) return
    dragStart.current = { clientX: e.clientX, clientY: e.clientY, noteX: note.x, noteY: note.y, noteId: id }
    window.addEventListener('mousemove', handleStickyNoteDragMove)
    window.addEventListener('mouseup', handleStickyNoteDragEnd)
  }, [stickyNotes, handleStickyNoteDragMove, handleStickyNoteDragEnd])

  const getBoardCardPosition = useCallback((id: string) => {
    return boardCardPositions[id] ?? INITIAL_BOARD_CARD_POSITIONS[id as BoardCardId] ?? INITIAL_TEMPLATE_POSITIONS[id] ?? { x: 0, y: 0 }
  }, [boardCardPositions])

  const handleBoardCardDragMove = useCallback((e: MouseEvent) => {
    const { cardId, clientX, clientY, cardX, cardY } = cardDragStart.current
    if (!cardId) return
    const z = zoomRef.current
    const dx = (e.clientX - clientX) / z
    const dy = (e.clientY - clientY) / z
    setBoardCardPositions((prev) => ({
      ...prev,
      [cardId]: { x: cardX + dx, y: cardY + dy },
    }))
  }, [])

  const handleBoardCardDragEnd = useCallback(() => {
    cardDragStart.current.cardId = ''
    window.removeEventListener('mousemove', handleBoardCardDragMove)
    window.removeEventListener('mouseup', handleBoardCardDragEnd)
  }, [handleBoardCardDragMove])

  const handleBoardCardDragStart = useCallback((e: React.MouseEvent, cardId: string) => {
    if (e.button !== 0) return
    e.preventDefault()
    const pos = getBoardCardPosition(cardId)
    cardDragStart.current = { clientX: e.clientX, clientY: e.clientY, cardX: pos.x, cardY: pos.y, cardId }
    window.addEventListener('mousemove', handleBoardCardDragMove)
    window.addEventListener('mouseup', handleBoardCardDragEnd)
  }, [getBoardCardPosition, handleBoardCardDragMove, handleBoardCardDragEnd])

  const ASSISTANT_MIN_WIDTH = 280
  const ASSISTANT_MAX_WIDTH = 720

  const handleResizeAssistantMove = useCallback((e: MouseEvent) => {
    const delta = e.clientX - resizeStart.current.clientX
    setAssistantWidth((_) => Math.min(ASSISTANT_MAX_WIDTH, Math.max(ASSISTANT_MIN_WIDTH, resizeStart.current.width + delta)))
  }, [])

  const handleResizeAssistantEnd = useCallback(() => {
    setIsResizingAssistant(false)
    window.removeEventListener('mousemove', handleResizeAssistantMove)
    window.removeEventListener('mouseup', handleResizeAssistantEnd)
  }, [handleResizeAssistantMove])

  const handleResizeAssistantStart = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return
    e.preventDefault()
    setIsResizingAssistant(true)
    resizeStart.current = { clientX: e.clientX, width: assistantWidth }
    window.addEventListener('mousemove', handleResizeAssistantMove)
    window.addEventListener('mouseup', handleResizeAssistantEnd)
  }, [assistantWidth, handleResizeAssistantMove, handleResizeAssistantEnd])

  const canvasEdgeDragRef = useRef<{ startX: number; startWidth: number } | null>(null)

  const handleCanvasEdgeDragStart = useCallback((e: React.MouseEvent) => {
    if (!isIntersightCanvas || !onCanvasWidthChange) return
    if (e.button !== 0) return
    e.preventDefault()
    const startWidth = canvasWidth ?? window.innerWidth * 0.75
    canvasEdgeDragRef.current = { startX: e.clientX, startWidth }

    const onMove = (ev: MouseEvent) => {
      if (!canvasEdgeDragRef.current) return
      const delta = canvasEdgeDragRef.current.startX - ev.clientX
      const newWidth = Math.min(window.innerWidth, Math.max(window.innerWidth * 0.5, canvasEdgeDragRef.current.startWidth + delta))
      onCanvasWidthChange(newWidth)
    }
    const onUp = () => {
      canvasEdgeDragRef.current = null
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }, [isIntersightCanvas, canvasWidth, onCanvasWidthChange])

  const zoomIn = useCallback(() => setZoom((z) => Math.min(ZOOM_MAX, z + ZOOM_STEP)), [])
  const zoomOut = useCallback(() => setZoom((z) => Math.max(ZOOM_MIN, z - ZOOM_STEP)), [])
  const zoomReset = useCallback(() => {
    setZoom(1)
    const viewport = canvasAreaRef.current
    const content = boardContentRef.current
    if (viewport && content) {
      setPan({
        x: viewport.clientWidth / 2 - content.offsetWidth / 2,
        y: showWelcome ? viewport.clientHeight / 2 - content.offsetHeight / 2 : 0,
      })
    } else {
      setPan({ x: 0, y: 0 })
    }
  }, [isIntersightCanvas])

  return (
    <div
      className={`ai-assistant ai-assistant--open-canvas${chatFullPage ? ' ai-assistant--open-canvas--chat-full' : ''}${closingCanvas ? ' ai-assistant--open-canvas--closing' : ''}`}
      role="main"
      style={isIntersightCanvas ? { position: 'fixed', top: 56, right: 0, width: canvasWidth != null ? canvasWidth : '75vw', height: 'calc(100vh - 56px)', zIndex: 9 } : undefined}
    >
      <div className="ai-assistant__bg" aria-hidden />
      <div className="ai-assistant__bg-glow" aria-hidden />
      <div className="ai-assistant__bg-glow-overlay" aria-hidden />

      {isIntersightCanvas && (
        <div
          className="open-canvas__edge-drag-handle"
          aria-hidden
          onMouseDown={handleCanvasEdgeDragStart}
        />
      )}

      {threadsPanelOpen && (
        <>
          <div
            className="ai-assistant__thread-backdrop"
            onClick={() => setThreadsPanelOpen(false)}
            aria-hidden
          />
          <ChatPanel overlay onClose={() => setThreadsPanelOpen(false)} injectedThreads={threads} highlightThreadId={isIntersightCanvas ? intersightThreadId : (selectedBoardCategory || initialPrompt) ? canvasThreadId : undefined} />
        </>
      )}

      {/* Left: Assistant panel – resizable; full width when "Close canvas" */}
      <aside className="open-canvas__assistant" aria-label="Assistant" style={{ width: chatFullPage ? undefined : assistantWidth }}>
        <header className="open-canvas__chat-header">
          <button
            type="button"
            className="open-canvas__expand-btn"
            aria-label="Open threads"
            onClick={() => setThreadsPanelOpen(true)}
          >
            <IconNav />
          </button>
        </header>
        <div className="open-canvas__assistant-body">
          {showWelcome ? (
            <>
              <div className="canvas-welcome">
                {!selectedBoardCategory && (
                  <>
                    <div className="canvas-welcome__hero">
                      <h2 className="canvas-welcome__heading">Where should we begin?</h2>
                      <p className="canvas-welcome__desc">Welcome to your canvas. Use it to visualize your network, solve issues quickly, and work together with your team. Explore the prompt categories.</p>
                    </div>
                    {isIntersightCanvas && (
                      <div className="canvas-welcome__cats">
                        {INTERSIGHT_PROMPT_CATEGORIES.map((cat) => (
                          <IntersightPromptCat key={cat.id} label={cat.label} icon={cat.icon} />
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
              {canvasMessages.length > 0 && (
                <div className="canvas-chat-messages">
                  {canvasMessages.map((msg) => (
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
                      {msg.visual && <ChatVisual type={msg.visual} onAddToBoard={() => addVisualToBoard(msg.visual!)} />}
                    </div>
                  ))}
                  {canvasTyping && (
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
                  <div ref={canvasMsgsEndRef} />
                </div>
              )}
            </>
          ) : (
            <ActionsDetail hideOpenCanvas compact onAddMetricsToBoard={() => setMetricsOnBoard(true)} metricsOnBoard={metricsOnBoard} initialMessages={actionsMessages} />
          )}
        </div>
        {showWelcome && (
          <footer className="open-canvas__chat-footer">
            <div className="open-canvas__input-wrap">
              {!categoriesModalOpen && (
                <div className="open-canvas__shortcuts-row">
                  <button
                    type="button"
                    className="open-canvas__shortcut-chip"
                    onClick={() => { setBoardTemplatesHidden(false); setSelectedBoardCategory(null) }}
                  >
                    Show all prompts
                  </button>
                </div>
              )}
              <div className="open-canvas__input-field">
                <input
                  type="text"
                  className="open-canvas__input-placeholder"
                  placeholder="Ask AI Canvas a question, / for prompts"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleCanvasSend() } }}
                  aria-label="Ask AI Canvas"
                />
                <div className="open-canvas__input-toolbar">
                  <div className="open-canvas__input-chips">
                    <span className="open-canvas__input-chip open-canvas__input-chip--location">Washington</span>
                    <button type="button" className="open-canvas__input-auto-btn" aria-label="Model: Auto">
                      Auto <IconCaretDown className="open-canvas__input-auto-caret" />
                    </button>
                  </div>
                  <button type="button" className="open-canvas__submit-btn" aria-label="Send message" onClick={handleCanvasSend}>
                    <IconSend />
                  </button>
                </div>
              </div>
              <p className="open-canvas__disclaimer">
                AI Canvas can make mistakes. Verify responses. Learn how AI Canvas handles personal data at{' '}
                <a href="#" className="open-canvas__disclaimer-link">AI Canvas Data Privacy</a>.
              </p>
            </div>
          </footer>
        )}
        {!chatFullPage && (
          <div
            className="open-canvas__assistant-resize"
            onMouseDown={handleResizeAssistantStart}
            role="separator"
            aria-orientation="vertical"
            aria-label="Resize assistant panel"
            style={{ cursor: isResizingAssistant ? 'col-resize' : undefined }}
          />
        )}
      </aside>

      {/* Right: infinite board (hidden when chat is full page) */}
      <div className="open-canvas__canvas-area" style={{ display: chatFullPage ? 'none' : undefined }} ref={canvasAreaRef}>
        <div
          className="open-canvas__board-viewport"
          onMouseDown={handleBoardMouseDown}
          style={{
            cursor: isPanning ? 'grabbing' : 'grab',
            backgroundSize: `${32 * zoom}px ${32 * zoom}px`,
            backgroundPosition: `${pan.x % (32 * zoom)}px ${pan.y % (32 * zoom)}px`,
          }}
          role="application"
          aria-label="Canvas board"
        >
          <div className="open-canvas__board-actions">
            {(isIntersightCanvas || selectedBoardCategory || initialPrompt) && (
              <span className="open-canvas__board-title">
                {isIntersightCanvas
                  ? (threads.find((t) => t.id === intersightThreadId)?.title ?? intersightThreadTitle)
                  : (threads.find((t) => t.id === canvasThreadId)?.title ?? canvasThreadTitle)}
              </span>
            )}
            <div className="open-canvas__toolbar-avatars" aria-hidden>
              <span className="open-canvas__toolbar-avatar open-canvas__toolbar-avatar--a">A</span>
              <span className="open-canvas__toolbar-avatar open-canvas__toolbar-avatar--b">B</span>
              <span className="open-canvas__toolbar-avatar open-canvas__toolbar-avatar--overflow">+2</span>
            </div>
            <div className="open-canvas__toolbar-btn-group">
              <button type="button" className="open-canvas__toolbar-btn open-canvas__toolbar-btn--outline" aria-label="Generate summary">
                <IconStar className="open-canvas__toolbar-btn-icon" />
                Generate summary
              </button>
              <button type="button" className="open-canvas__toolbar-btn open-canvas__toolbar-btn--outline" aria-label="View activity">
                View activity
              </button>
              <button type="button" className="open-canvas__toolbar-btn open-canvas__toolbar-btn--primary" aria-label="Share" aria-haspopup="true">
                Share
                <IconCaretDown className="open-canvas__toolbar-btn-caret" aria-hidden />
              </button>
            </div>
            <button type="button" className="open-canvas__toolbar-dots" aria-label="More options">
              <IconDotsThree />
            </button>
          </div>
          <div
            className="open-canvas__board-surface"
            style={{
              width: BOARD_SIZE,
              height: BOARD_SIZE,
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: '0 0',
            }}
          >
            <div className="open-canvas__sticky-notes-layer" aria-hidden>
              {stickyNotes.map((note) => (
                <div
                  key={note.id}
                  className={`open-canvas__sticky-note${selectedNoteId === note.id ? ' open-canvas__sticky-note--selected' : ''}`}
                  style={{ left: note.x, top: note.y }}
                  role="article"
                  aria-label="Sticky note"
                  onClick={() => setSelectedNoteId(note.id)}
                >
                  <div
                    className="open-canvas__sticky-note-header"
                    onMouseDown={(e) => handleStickyNoteDragStart(e, note.id)}
                  >
                    <span className="open-canvas__sticky-note-grip" aria-hidden />
                    <button
                      type="button"
                      className="open-canvas__sticky-note-delete"
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteStickyNote(note.id)
                      }}
                      aria-label="Delete note"
                    >
                      &#10005;
                    </button>
                  </div>
                  <textarea
                    className="open-canvas__sticky-note-body"
                    value={note.text}
                    onChange={(e) => updateStickyNote(note.id, { text: e.target.value })}
                    placeholder="Write a note…"
                    rows={3}
                    onClick={(e) => e.stopPropagation()}
                    ref={(el) => {
                      if (el && note.id === lastCreatedNoteIdRef.current) {
                        el.focus()
                        lastCreatedNoteIdRef.current = null
                      }
                    }}
                  />
                </div>
              ))}
            </div>
            <div className="open-canvas__board-content" ref={boardContentRef}>
              <div className="open-canvas__cards">
                {boardGroups.map((grp) => (
                  <div
                    key={grp.id}
                    className="canvas-board-group canvas-board-group--labeled"
                    style={{ left: grp.x, top: grp.y, width: grp.w, height: grp.h }}
                  >
                    <span className="canvas-board-group__header">{grp.title}</span>
                    <button
                      type="button"
                      className="canvas-board-group__delete"
                      aria-label={`Delete ${grp.title} section`}
                      onClick={() => {
                        setBoardGroups((g) => g.filter((x) => x.id !== grp.id))
                        setBoardVisuals((v) => v.filter((x) => x.groupId !== grp.id))
                      }}
                    >✕</button>
                  </div>
                ))}
                {boardVisuals.map((bv) => (
                  <div
                    key={bv.id}
                    className="open-canvas__board-card-draggable open-canvas__board-visual-card"
                    style={{ left: getBoardCardPosition(bv.id).x, top: getBoardCardPosition(bv.id).y, width: 320 }}
                  >
                    <div className="open-canvas__board-card-drag-handle" onMouseDown={(e) => handleBoardCardDragStart(e, bv.id)} aria-hidden />
                    <div className="open-canvas__board-card-title">{VISUAL_TITLES[bv.type]}</div>
                    <button
                      type="button"
                      className="open-canvas__board-card-delete"
                      aria-label="Delete card"
                      onClick={() => {
                        const VISUAL_W = 320
                        const GROUP_PAD = 20
                        const remainingInGroup = boardVisuals.filter((v) => v.id !== bv.id && v.groupId === bv.groupId)
                        setBoardVisuals((prev) => prev.filter((v) => v.id !== bv.id))
                        if (bv.groupId) {
                          if (remainingInGroup.length === 0) {
                            setBoardGroups((g) => g.filter((x) => x.id !== bv.groupId))
                          } else {
                            setBoardGroups((groups) => groups.map((g) => {
                              if (g.id !== bv.groupId) return g
                              const xs = remainingInGroup.map((v) => boardCardPositions[v.id]?.x ?? v.x)
                              const minX = Math.min(...xs)
                              const maxX = Math.max(...xs)
                              return { ...g, x: minX - GROUP_PAD, w: maxX + VISUAL_W - minX + GROUP_PAD * 2 }
                            }))
                          }
                        }
                      }}
                    >
                      ✕
                    </button>
                    <ChatVisual type={bv.type} />
                  </div>
                ))}
                {!showWelcome && <>
                  {/* Incident Header Banner */}
                  <div
                    className="open-canvas__board-card-draggable"
                    style={{ left: getBoardCardPosition('incident-header').x, top: getBoardCardPosition('incident-header').y }}
                  >
                    <div className="open-canvas__board-card-drag-handle" onMouseDown={(e) => handleBoardCardDragStart(e, 'incident-header')} aria-hidden />
                    <div className="canvas-incident-header" aria-label="Incident overview">
                      <div className="canvas-incident-header__badges">
                        <span className="canvas-incident-header__badge canvas-incident-header__badge--critical">P2 Critical</span>
                        <span className="canvas-incident-header__badge canvas-incident-header__badge--live">
                          <span className="canvas-incident-header__status-dot" aria-hidden />
                          Live
                        </span>
                      </div>
                      <h2 className="canvas-incident-header__title">Network Degradation · Singapore SD-WAN</h2>
                      <div className="canvas-incident-header__meta">
                        <span className="canvas-incident-header__meta-item">Policy: BranchOptimize-v2</span>
                        <span className="canvas-incident-header__meta-sep" aria-hidden>·</span>
                        <span className="canvas-incident-header__meta-item">Region: Singapore</span>
                        <span className="canvas-incident-header__meta-sep" aria-hidden>·</span>
                        <span className="canvas-incident-header__meta-item">Started 11:02 today</span>
                        <span className="canvas-incident-header__meta-sep" aria-hidden>·</span>
                        <span className="canvas-incident-header__meta-item">Source: ThousandEyes</span>
                      </div>
                    </div>
                  </div>

                  {/* Metric: Duration */}
                  <div
                    className="open-canvas__board-card-draggable"
                    style={{ left: getBoardCardPosition('metric-duration').x, top: getBoardCardPosition('metric-duration').y }}
                  >
                    <div className="open-canvas__board-card-drag-handle" onMouseDown={(e) => handleBoardCardDragStart(e, 'metric-duration')} aria-hidden />
                    <div className="canvas-metric-card" aria-label="Incident duration">
                      <span className="canvas-metric-card__label">Incident Duration</span>
                      <span className="canvas-metric-card__value canvas-metric-card__value--red">3:45</span>
                      <div className="canvas-metric-card__sparkline" aria-hidden>
                        {[20, 25, 20, 30, 55, 80, 100, 88, 92, 96].map((h, i) => (
                          <div key={i} className={`canvas-metric-card__spark-bar${i >= 5 ? ' canvas-metric-card__spark-bar--red' : ''}`} style={{ height: `${h}%` }} />
                        ))}
                      </div>
                      <span className="canvas-metric-card__axis">10m ago — Live</span>
                    </div>
                  </div>

                  {/* Metric: Clients */}
                  <div
                    className="open-canvas__board-card-draggable"
                    style={{ left: getBoardCardPosition('metric-clients').x, top: getBoardCardPosition('metric-clients').y }}
                  >
                    <div className="open-canvas__board-card-drag-handle" onMouseDown={(e) => handleBoardCardDragStart(e, 'metric-clients')} aria-hidden />
                    <div className="canvas-metric-card" aria-label="Clients affected">
                      <span className="canvas-metric-card__label">Clients Affected</span>
                      <span className="canvas-metric-card__value canvas-metric-card__value--yellow">1,583</span>
                      <div className="canvas-metric-card__sparkline" aria-hidden>
                        {[10, 12, 18, 38, 70, 84, 92, 96, 100, 98].map((h, i) => (
                          <div key={i} className={`canvas-metric-card__spark-bar${i >= 4 ? ' canvas-metric-card__spark-bar--yellow' : ''}`} style={{ height: `${h}%` }} />
                        ))}
                      </div>
                      <span className="canvas-metric-card__axis">10m ago — Live</span>
                    </div>
                  </div>

                  {/* Metric: Latency */}
                  <div
                    className="open-canvas__board-card-draggable"
                    style={{ left: getBoardCardPosition('metric-latency').x, top: getBoardCardPosition('metric-latency').y }}
                  >
                    <div className="open-canvas__board-card-drag-handle" onMouseDown={(e) => handleBoardCardDragStart(e, 'metric-latency')} aria-hidden />
                    <div className="canvas-metric-card" aria-label="Max latency">
                      <span className="canvas-metric-card__label">Max Latency</span>
                      <span className="canvas-metric-card__value canvas-metric-card__value--red">795 ms</span>
                      <div className="canvas-metric-card__sparkline" aria-hidden>
                        {[15, 18, 20, 22, 48, 88, 100, 96, 98, 100].map((h, i) => (
                          <div key={i} className={`canvas-metric-card__spark-bar${i >= 4 ? ' canvas-metric-card__spark-bar--red' : ''}`} style={{ height: `${h}%` }} />
                        ))}
                      </div>
                      <span className="canvas-metric-card__axis">10m ago — Live</span>
                    </div>
                  </div>

                  {/* Root Cause Chain */}
                  <div
                    className="open-canvas__board-card-draggable"
                    style={{ left: getBoardCardPosition('root-cause').x, top: getBoardCardPosition('root-cause').y }}
                  >
                    <div className="open-canvas__board-card-drag-handle" onMouseDown={(e) => handleBoardCardDragStart(e, 'root-cause')} aria-hidden />
                    <div className="canvas-root-cause" aria-labelledby="canvas-root-cause-title">
                      <p id="canvas-root-cause-title" className="canvas-root-cause__title">Root Cause</p>
                      <div className="canvas-root-cause__chain" role="list">
                        <div className="canvas-root-cause__node" role="listitem">
                          <div className="canvas-root-cause__node-icon canvas-root-cause__node-icon--yellow" aria-hidden>01</div>
                          <span className="canvas-root-cause__node-label">Policy Change</span>
                          <span className="canvas-root-cause__node-sublabel">BranchOptimize-v2</span>
                        </div>
                        <span className="canvas-root-cause__arrow" aria-hidden>&#8594;</span>
                        <div className="canvas-root-cause__node" role="listitem">
                          <div className="canvas-root-cause__node-icon canvas-root-cause__node-icon--red" aria-hidden>02</div>
                          <span className="canvas-root-cause__node-label">High Latency</span>
                          <span className="canvas-root-cause__node-sublabel">+320 ms spike</span>
                        </div>
                        <span className="canvas-root-cause__arrow" aria-hidden>&#8594;</span>
                        <div className="canvas-root-cause__node" role="listitem">
                          <div className="canvas-root-cause__node-icon canvas-root-cause__node-icon--red" aria-hidden>03</div>
                          <span className="canvas-root-cause__node-label">Client Impact</span>
                          <span className="canvas-root-cause__node-sublabel">1,583 affected</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recommendation CTA */}
                  <div
                    className="open-canvas__board-card-draggable"
                    style={{ left: getBoardCardPosition('recommendation').x, top: getBoardCardPosition('recommendation').y }}
                  >
                    <div className="open-canvas__board-card-drag-handle" onMouseDown={(e) => handleBoardCardDragStart(e, 'recommendation')} aria-hidden />
                    <div className="canvas-recommendation" aria-labelledby="canvas-recommendation-title">
                      <p id="canvas-recommendation-title" className="canvas-recommendation__title">Recommendation</p>
                      <h3 className="canvas-recommendation__heading">Rollback &apos;BranchOptimize-v2&apos;</h3>
                      <p className="canvas-recommendation__detail">Reverting to the previous SD-WAN policy should restore latency to baseline and reconnect affected clients.</p>
                      <span className="canvas-recommendation__confidence">High Confidence</span>
                      <div className="canvas-recommendation__actions">
                        <button type="button" className="canvas-recommendation__btn-primary">Apply Rollback</button>
                        <button type="button" className="canvas-recommendation__btn-secondary">View Details</button>
                      </div>
                    </div>
                  </div>

                  {/* Entities Bar */}
                  <div
                    className="open-canvas__board-card-draggable"
                    style={{ left: getBoardCardPosition('entities').x, top: getBoardCardPosition('entities').y }}
                  >
                    <div className="open-canvas__board-card-drag-handle" onMouseDown={(e) => handleBoardCardDragStart(e, 'entities')} aria-hidden />
                    <div className="canvas-entities" aria-label="Key entities">
                      <span className="canvas-entities__label">Entities</span>
                      <div className="canvas-entities__tags">
                        <span className="canvas-entities__tag canvas-entities__tag--blue">Singapore</span>
                        <span className="canvas-entities__tag">BranchOptimize-v2</span>
                        <span className="canvas-entities__tag canvas-entities__tag--blue">Meraki</span>
                        <span className="canvas-entities__tag canvas-entities__tag--blue">ThousandEyes</span>
                        <span className="canvas-entities__tag">SD-WAN</span>
                        <span className="canvas-entities__tag">Sean McGinnis</span>
                      </div>
                    </div>
                  </div>
                </>}
              </div>
            </div>
          </div>
        </div>
        {/* Prompt templates overlay — pinned top-right under Share button */}
        {!isIntersightCanvas && !selectedBoardCategory && !fromActions && !initialPrompt && !boardTemplatesHidden && (
          <div className="canvas-tmpl-overlay">
            <div
              className="canvas-board-group"
              style={{ left: GROUP_X, top: GROUP_Y, width: GROUP_W, height: GROUP_H }}
              aria-hidden
            >
              <span className="canvas-board-group__header">Prompt categories</span>
            </div>
            {BOARD_TEMPLATES.map((tmpl) => (
              <div
                key={tmpl.id}
                className="open-canvas__board-card-draggable"
                style={{ left: getBoardCardPosition(tmpl.id).x, top: getBoardCardPosition(tmpl.id).y, width: CARD_W }}
              >
                <div
                  className={`canvas-page__template-card ${tmpl.color}`}
                  style={{ width: CARD_W, cursor: 'pointer' }}
                  onClick={() => handleCategorySelect(tmpl.id)}
                >
                  <div className="canvas-page__template-top">
                    <div className="canvas-page__template-icon">{tmpl.icon}</div>
                  </div>
                  <h3 className="canvas-page__template-title">{tmpl.title}</h3>
                  <p className="canvas-page__template-description">{tmpl.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Prompt categories modal — shown on load for /canvas/open */}
        {!isIntersightCanvas && !fromActions && categoriesModalOpen && (
          <div
            className="prompt-categories-modal-backdrop"
            onClick={() => { setCategoriesModalOpen(false); setBoardTemplatesHidden(true) }}
          >
            <div className="prompt-categories-modal" onClick={(e) => e.stopPropagation()}>
              <div className="prompt-categories-modal__header">
                <span className="prompt-categories-modal__title">Prompt templates</span>
                <button
                  type="button"
                  className="prompt-categories-modal__close"
                  onClick={() => { setCategoriesModalOpen(false); setBoardTemplatesHidden(true) }}
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>
              <div className="prompt-categories-modal__grid">
                {BOARD_TEMPLATES.map((tmpl) => (
                  <button
                    key={tmpl.id}
                    type="button"
                    className={`canvas-page__template-card ${tmpl.color} prompt-categories-modal__card`}
                    onClick={() => { handleCategorySelect(tmpl.id); setCategoriesModalOpen(false) }}
                  >
                    <div className="canvas-page__template-top">
                      <div className="canvas-page__template-icon">{tmpl.icon}</div>
                    </div>
                    <h3 className="canvas-page__template-title">{tmpl.title}</h3>
                    <p className="canvas-page__template-description">{tmpl.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        <div className="open-canvas__zoom-controls" aria-label="Board controls">
          {/* Add to canvas group */}
          <div className="open-canvas__toolbar-group">
            <button type="button" className="open-canvas__toolbar-icon-btn" onClick={() => {}} aria-label="Upload image" title="Upload image">
              <IconUpload />
            </button>
            <div className="open-canvas__toolbar-divider" aria-hidden />
            <button type="button" className="open-canvas__toolbar-icon-btn" onClick={addStickyNote} aria-label="Add sticky note" title="Add sticky note">
              <IconStickyNote />
            </button>
          </div>
          {/* Zoom group */}
          <div className="open-canvas__toolbar-group">
            <button type="button" className="open-canvas__toolbar-icon-btn" onClick={zoomOut} aria-label="Zoom out" title="Zoom out">
              <IconMinus />
            </button>
            <div className="open-canvas__toolbar-divider" aria-hidden />
            <button type="button" className="open-canvas__toolbar-icon-btn open-canvas__toolbar-icon-btn--zoom-pct" onClick={zoomReset} aria-label="Reset zoom" title="Reset zoom">
              {Math.round(zoom * 100)}%
            </button>
            <div className="open-canvas__toolbar-divider" aria-hidden />
            <button type="button" className="open-canvas__toolbar-icon-btn" onClick={zoomIn} aria-label="Zoom in" title="Zoom in">
              <IconPlus />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
