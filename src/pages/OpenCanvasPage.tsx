import { useState, useRef, useCallback, useEffect } from 'react'
import type { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import {
  IconNav, IconFile, IconPencil, IconStar, IconCaretDown, IconMic, IconWaveform,
  IconHeartPulse, IconChart, IconSettings, IconDevice, IconShield, IconTopologyNodes, IconSend,
} from '../components/icons'
import { ChatPanel } from '../components/ChatPanel'
import { ActionsDetail } from '../components/ActionsDetail'

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

const CANVAS_PROMPT_CATEGORIES: Array<{ id: string; label: string; icon: ReactNode }> = [
  { id: 'health',         label: 'Health & Overview',       icon: <IconHeartPulse /> },
  { id: 'performance',    label: 'Performance & Trends',    icon: <IconChart /> },
  { id: 'troubleshoot',   label: 'Troubleshooting',         icon: <IconSettings /> },
  { id: 'devices',        label: 'Devices & Inventory',     icon: <IconDevice /> },
  { id: 'security',       label: 'Security & Access',       icon: <IconShield /> },
  { id: 'visualization',  label: 'Visualization & Topology',icon: <IconTopologyNodes /> },
]

function CanvasPromptCat({ label, icon }: { label: string; icon: ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`canvas-prompt-cat${open ? ' canvas-prompt-cat--open' : ''}`}>
      <button
        type="button"
        className="canvas-prompt-cat__btn"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="canvas-prompt-cat__icon" aria-hidden>{icon}</span>
        <span className="canvas-prompt-cat__label">{label}</span>
        <IconCaretDown className="canvas-prompt-cat__chevron" />
      </button>
      {open && <div className="canvas-prompt-cat__body" />}
    </div>
  )
}

export function OpenCanvasPage() {
  const { pathname, state: routeState } = useLocation()
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
  const showWelcome = isIntersightCanvas || pathname === '/canvas/open'
  const showContextBar = isIntersightCanvas
  const [threadsPanelOpen, setThreadsPanelOpen] = useState(false)
  const [chatFullPage, setChatFullPage] = useState(false)
  const [metricsOnBoard, setMetricsOnBoard] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)
  const [stickyNotes, setStickyNotes] = useState<StickyNote[]>([])
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null)
  const [assistantWidth, setAssistantWidth] = useState(440)
  const [isResizingAssistant, setIsResizingAssistant] = useState(false)
  const [boardCardPositions, setBoardCardPositions] = useState<Record<string, { x: number; y: number }>>(() => ({ ...INITIAL_BOARD_CARD_POSITIONS }))
  const resizeStart = useRef({ clientX: 0, width: 0 })
  const panStart = useRef({ x: 0, y: 0, panX: 0, panY: 0 })
  const dragStart = useRef({ clientX: 0, clientY: 0, noteX: 0, noteY: 0, noteId: '' })
  const cardDragStart = useRef({ clientX: 0, clientY: 0, cardX: 0, cardY: 0, cardId: '' })
  const lastCreatedNoteIdRef = useRef<string | null>(null)
  const zoomRef = useRef(zoom)
  const canvasAreaRef = useRef<HTMLDivElement>(null)
  const boardContentRef = useRef<HTMLDivElement>(null)


  zoomRef.current = zoom

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
      if (showWelcome) {
        // Empty board: center it
        setPan({ x: vw / 2 - cw / 2, y: vh / 2 - ch / 2 })
      } else {
        // Cards board: show from top, centered horizontally
        setPan({ x: vw / 2 - cw / 2, y: 0 })
      }
    }
    const id = requestAnimationFrame(run)
    return () => cancelAnimationFrame(id)
  }, [chatFullPage, isIntersightCanvas])

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
    return boardCardPositions[id] ?? INITIAL_BOARD_CARD_POSITIONS[id as BoardCardId] ?? { x: 0, y: 0 }
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
      className={`ai-assistant ai-assistant--open-canvas${chatFullPage ? ' ai-assistant--open-canvas--chat-full' : ''}`}
      role="main"
    >
      <div className="ai-assistant__bg" aria-hidden />
      <div className="ai-assistant__bg-glow" aria-hidden />
      <div className="ai-assistant__bg-glow-overlay" aria-hidden />

      {threadsPanelOpen && (
        <>
          <div
            className="ai-assistant__thread-backdrop"
            onClick={() => setThreadsPanelOpen(false)}
            aria-hidden
          />
          <ChatPanel overlay onClose={() => setThreadsPanelOpen(false)} highlightThreadId="1" />
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
          <button
            type="button"
            className="open-canvas__close-canvas-btn"
            onClick={() => setChatFullPage((prev) => !prev)}
          >
            {chatFullPage ? 'Open canvas' : 'Close canvas'}
          </button>
        </header>
        <div className="open-canvas__assistant-body">
          {showWelcome ? (
            <div className="canvas-welcome">
              <div className="canvas-welcome__hero">
                <h2 className="canvas-welcome__heading">Where should we begin?</h2>
                <p className="canvas-welcome__desc">Welcome to your canvas. Use it to visualize your network, solve issues quickly, and work together with your team. Explore prompts below.</p>
              </div>
              <div className="canvas-welcome__cats">
                {CANVAS_PROMPT_CATEGORIES.map((cat) => (
                  <CanvasPromptCat key={cat.id} label={cat.label} icon={cat.icon} />
                ))}
              </div>
            </div>
          ) : (
            <ActionsDetail hideOpenCanvas compact onAddMetricsToBoard={() => setMetricsOnBoard(true)} metricsOnBoard={metricsOnBoard} />
          )}
        </div>
        {showWelcome && (
          <footer className="open-canvas__chat-footer">
            <div className="open-canvas__input-wrap">
              <div className="open-canvas__input-field">
                <span className="open-canvas__input-placeholder">Ask AI Canvas a question, / for prompts</span>
                <div className="open-canvas__input-toolbar">
                  <div className="open-canvas__input-chips">
                    <span className="open-canvas__input-chip open-canvas__input-chip--location">Washington</span>
                    <button type="button" className="open-canvas__input-auto-btn" aria-label="Model: Auto">
                      Auto <IconCaretDown className="open-canvas__input-auto-caret" />
                    </button>
                  </div>
                  <button type="button" className="open-canvas__submit-btn" aria-label="Send message">
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
            <span className="open-canvas__toolbar-avatar" aria-hidden>A</span>
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
          {showContextBar && (
            <div className="open-canvas__context-bar" aria-label="Canvas context from Intersight">
              <nav className="open-canvas__context-breadcrumb" aria-label="Source path">
                {canvasContext.breadcrumb.map((crumb, i) => (
                  <span key={crumb} className="open-canvas__context-crumb">
                    {i > 0 && <span className="open-canvas__context-sep" aria-hidden>/</span>}
                    {crumb}
                  </span>
                ))}
              </nav>
              <div className="open-canvas__context-title-row">
                <span className="open-canvas__context-severity open-canvas__context-severity--critical">
                  {canvasContext.severity}
                </span>
                <span className="open-canvas__context-title">{canvasContext.title}</span>
              </div>
              <div className="open-canvas__context-meta">
                <span className="open-canvas__context-meta-item">
                  {canvasContext.affectedClients.toLocaleString()} affected clients
                </span>
                <span className="open-canvas__context-dot" aria-hidden />
                <span className="open-canvas__context-meta-item">{canvasContext.triggered}</span>
              </div>
            </div>
          )}
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
        <div className="open-canvas__zoom-controls" aria-label="Board controls">
          <button type="button" className="open-canvas__tool-btn" onClick={() => {}} aria-label="Add an image" title="Add an image">
            <IconFile className="open-canvas__tool-btn-icon" aria-hidden />
            <span className="open-canvas__tool-btn-label">Add image</span>
          </button>
          <button type="button" className="open-canvas__tool-btn" onClick={addStickyNote} aria-label="Add a sticky note" title="Add a sticky note">
            <IconPencil className="open-canvas__tool-btn-icon" aria-hidden />
            <span className="open-canvas__tool-btn-label">Sticky note</span>
          </button>
          <div className="open-canvas__zoom-sep" aria-hidden />
          <button type="button" className="open-canvas__zoom-btn" onClick={zoomOut} aria-label="Zoom out" title="Zoom out">−</button>
          <button type="button" className="open-canvas__zoom-btn" onClick={zoomIn} aria-label="Zoom in" title="Zoom in">+</button>
          <button type="button" className="open-canvas__zoom-reset" onClick={zoomReset} aria-label="Reset zoom" title="Reset zoom">
            {Math.round(zoom * 100)}%
          </button>
        </div>
      </div>
    </div>
  )
}
