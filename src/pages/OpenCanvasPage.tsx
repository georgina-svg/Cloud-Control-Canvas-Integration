import { useState, useRef, useCallback, useEffect } from 'react'
import { IconNav, IconPlus, IconFile, IconPencil } from '../components/icons'
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

export function OpenCanvasPage() {
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
  const resizeStart = useRef({ clientX: 0, width: 0 })
  const panStart = useRef({ x: 0, y: 0, panX: 0, panY: 0 })
  const dragStart = useRef({ clientX: 0, clientY: 0, noteX: 0, noteY: 0, noteId: '' })
  const zoomRef = useRef(zoom)
  const canvasAreaRef = useRef<HTMLDivElement>(null)
  const boardContentRef = useRef<HTMLDivElement>(null)

  zoomRef.current = zoom

  /* Pan to center the board content in the viewport when the canvas is shown */
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
      setPan({
        x: vw / 2 - cw / 2,
        y: vh / 2 - ch / 2,
      })
    }
    const id = requestAnimationFrame(run)
    return () => cancelAnimationFrame(id)
  }, [chatFullPage])

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
    if (target.closest('.open-canvas__zoom-controls') || target.closest('button') || target.closest('a') || target.closest('.open-canvas__sticky-note') || target.closest('.open-canvas__assistant-resize')) return
    e.preventDefault()
    setSelectedNoteId(null)
    setIsPanning(true)
    panStart.current = { x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y }
    window.addEventListener('mousemove', handlePanMove)
    window.addEventListener('mouseup', handlePanEnd)
  }, [pan.x, pan.y, handlePanMove, handlePanEnd])

  const NOTE_OFFSET_X = 220
  const NOTE_OFFSET_Y = 140
  const NOTE_START_X = 280
  const NOTE_START_Y = 120

  const addStickyNote = useCallback(() => {
    setStickyNotes((prev) => {
      const index = prev.length
      const noteX = NOTE_START_X + (index % 3) * NOTE_OFFSET_X
      const noteY = NOTE_START_Y + Math.floor(index / 3) * NOTE_OFFSET_Y
      const newNote = { id: crypto.randomUUID(), x: noteX, y: noteY, text: '' }
      /* Pan board so the new note is centered in view */
      const viewport = canvasAreaRef.current
      if (viewport) {
        const z = zoomRef.current
        setPan({
          x: viewport.clientWidth / 2 - noteX * z,
          y: viewport.clientHeight / 2 - noteY * z,
        })
      }
      return [...prev, newNote]
    })
  }, [])

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
        y: viewport.clientHeight / 2 - content.offsetHeight / 2,
      })
    } else {
      setPan({ x: 0, y: 0 })
    }
  }, [])

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
          <ActionsDetail hideOpenCanvas compact onAddMetricsToBoard={() => setMetricsOnBoard(true)} metricsOnBoard={metricsOnBoard} />
        </div>
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

      {/* Right: Infinite board with grid, pan and zoom (hidden when chat is full page) */}
      <div className="open-canvas__canvas-area" hidden={chatFullPage} ref={canvasAreaRef}>
        <div
          className="open-canvas__board-viewport"
          onMouseDown={handleBoardMouseDown}
          style={{ cursor: isPanning ? 'grabbing' : 'grab' }}
          role="application"
          aria-label="Canvas board"
        >
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
                    {selectedNoteId === note.id && (
                      <button
                        type="button"
                        className="open-canvas__sticky-note-delete"
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteStickyNote(note.id)
                        }}
                        aria-label="Delete note"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                  <textarea
                    className="open-canvas__sticky-note-body"
                    value={note.text}
                    onChange={(e) => updateStickyNote(note.id, { text: e.target.value })}
                    placeholder="Write a note…"
                    rows={3}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              ))}
            </div>
            <div className="open-canvas__board-content" ref={boardContentRef}>
              <div className="open-canvas__cards">
                <p className="open-canvas__context-pill" aria-label="Conversation context">
                  Singapore SD‑WAN latency • BranchOptimize-v2 • Rollback recommended
                </p>

          <section className="open-canvas__summary-card" aria-labelledby="open-canvas-summary">
            <h2 id="open-canvas-summary" className="open-canvas__summary-title">Summary</h2>
            <p className="open-canvas__summary-text">
              Network performance degradation was observed in Singapore as a result of elevated network latency. The latency increase correlated with a recent SD‑WAN policy change (BranchOptimize‑v2), impacting traffic performance across affected connections.
            </p>
            <p className="open-canvas__summary-text">
              <strong>Recommendation:</strong> Rollback policy &apos;BranchOptimize-v2&apos;. Confidence: High. Would you like to apply the recommended action and roll back the SD-WAN policy?
            </p>
          </section>

          <section className="open-canvas__board-card open-canvas__timeline-card" aria-labelledby="open-canvas-timeline">
            <h2 id="open-canvas-timeline" className="open-canvas__board-card-title">Timeline</h2>
            <ul className="open-canvas__timeline-list">
              <li><span className="open-canvas__timeline-time">11:02</span> Incident detected (Singapore)</li>
              <li><span className="open-canvas__timeline-time">11:05</span> Recommendation: rollback BranchOptimize-v2</li>
              <li><span className="open-canvas__timeline-time">11:06</span> You asked about impact</li>
              <li><span className="open-canvas__timeline-time">11:07</span> Assistant outlined 1,583 clients affected</li>
            </ul>
          </section>

          <section className="open-canvas__board-card open-canvas__entities-card" aria-labelledby="open-canvas-entities">
            <h2 id="open-canvas-entities" className="open-canvas__board-card-title">Key entities</h2>
            <div className="open-canvas__entity-tags">
              <span className="open-canvas__entity-tag">Singapore</span>
              <span className="open-canvas__entity-tag">BranchOptimize-v2</span>
              <span className="open-canvas__entity-tag">Meraki</span>
              <span className="open-canvas__entity-tag">ThousandEyes</span>
              <span className="open-canvas__entity-tag">SD-WAN</span>
              <span className="open-canvas__entity-tag">Sean McGinnis</span>
            </div>
          </section>

          <section className="open-canvas__board-card open-canvas__recommendations-card" aria-labelledby="open-canvas-recommendations">
            <h2 id="open-canvas-recommendations" className="open-canvas__board-card-title">Recommendations</h2>
            <ul className="open-canvas__rec-list">
              <li className="open-canvas__rec-item">
                <span className="open-canvas__rec-text">Rollback policy &apos;BranchOptimize-v2&apos;</span>
                <span className="open-canvas__rec-meta">Confidence: High • Pending</span>
              </li>
            </ul>
          </section>

          <section className="open-canvas__board-card open-canvas__actions-card" aria-labelledby="open-canvas-actions">
            <h2 id="open-canvas-actions" className="open-canvas__board-card-title">Actions</h2>
            <ul className="open-canvas__action-list">
              <li className="open-canvas__action-item open-canvas__action-item--pending">Rollback policy — Recommended</li>
              <li className="open-canvas__action-item open-canvas__action-item--mentioned">Escalate to incident manager — Mentioned</li>
              <li className="open-canvas__action-item open-canvas__action-item--mentioned">Show issues in Topology — Not taken</li>
            </ul>
          </section>

          <section className="open-canvas__board-card open-canvas__conv-summary-card" aria-labelledby="open-canvas-conv-summary">
            <h2 id="open-canvas-conv-summary" className="open-canvas__board-card-title">Conversation summary</h2>
            <ul className="open-canvas__conv-bullets">
              <li>You asked about Singapore latency and policy impact.</li>
              <li>Assistant recommended rollback and outlined 1,583 clients affected.</li>
              <li>Escalation and Topology were discussed.</li>
            </ul>
          </section>

          <section className="open-canvas__board-card open-canvas__quotes-card" aria-labelledby="open-canvas-quotes">
            <h2 id="open-canvas-quotes" className="open-canvas__board-card-title">Key messages</h2>
            <blockquote className="open-canvas__quote">Would you like to apply the recommended action and roll back the SD-WAN policy &apos;BranchOptimize-v2&apos;?</blockquote>
            <p className="open-canvas__quote-attribution">Assistant</p>
          </section>

          <section className="open-canvas__board-card open-canvas__decisions-card" aria-labelledby="open-canvas-decisions">
            <h2 id="open-canvas-decisions" className="open-canvas__board-card-title">Decisions</h2>
            <ul className="open-canvas__decision-list">
              <li>No actions applied yet — rollback pending your confirmation.</li>
            </ul>
          </section>

          <section className="open-canvas__board-card open-canvas__links-card" aria-labelledby="open-canvas-links">
            <h2 id="open-canvas-links" className="open-canvas__board-card-title">Next steps</h2>
            <ul className="open-canvas__links-list">
              <li><a href="#topology" className="open-canvas__link">Open in Topology</a></li>
              <li><a href="#policy" className="open-canvas__link">View policy BranchOptimize-v2</a></li>
            </ul>
          </section>

          {metricsOnBoard && (
            <section className="open-canvas__board-metrics-widget" aria-label="Incident metrics">
              <div className="actions-detail__metrics-widget">
                <div className="actions-detail__metrics-widget-header actions-detail__metrics-widget-header--board">
                  <p className="actions-detail__section-intro">Here’s a quick overview of the incident duration and estimated impact:</p>
                </div>
                <div className="actions-detail__metrics">
                  <div className="actions-detail__metric">
                    <span className="actions-detail__metric-value actions-detail__metric-value--red">00:03:45</span>
                    <span className="actions-detail__metric-label">Incident Duration</span>
                    <div className="actions-detail__metric-bar actions-detail__metric-bar--red" />
                    <span className="actions-detail__metric-axis">10m ago — Live</span>
                  </div>
                  <div className="actions-detail__metric">
                    <span className="actions-detail__metric-value">1,583 Clients</span>
                    <span className="actions-detail__metric-label">Estimated Impact</span>
                    <div className="actions-detail__metric-chart" />
                    <span className="actions-detail__metric-axis">10m ago — Live</span>
                  </div>
                  <div className="actions-detail__metric">
                    <span className="actions-detail__metric-value">795 ms</span>
                    <span className="actions-detail__metric-label">Max Latency</span>
                    <div className="actions-detail__metric-line" />
                    <span className="actions-detail__metric-axis">10m ago — Live</span>
                    <button type="button" className="actions-detail__metric-expand" aria-label="Expand chart">
                      <IconPlus />
                    </button>
                  </div>
                </div>
              </div>
            </section>
          )}
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
