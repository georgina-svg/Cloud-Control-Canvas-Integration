import { Link } from 'react-router-dom'
import {
  IconArrowUpRight,
  IconPlus,
  IconMic,
  IconWaveform,
  IconDotsThree,
  IconStatusNegative,
} from './icons'
import { Button } from './Button'

const TAGS = ['Meraki', 'ThousandEyes', 'SD-WAN Manager', 'Splunk', 'Security Cloud Control']

export interface ActionsDetailProps {
  /** When true, hide the Open canvas button (e.g. when embedded on Open Canvas page) */
  hideOpenCanvas?: boolean
  /** When true, use compact layout for narrow panels */
  compact?: boolean
  /** When provided, "+" in metrics widget calls this (e.g. to add widget to Open Canvas board) */
  onAddMetricsToBoard?: () => void
  /** When true, hide the "+" in metrics widget (e.g. widget already on board) */
  metricsOnBoard?: boolean
}

export function ActionsDetail({ hideOpenCanvas, compact, onAddMetricsToBoard, metricsOnBoard }: ActionsDetailProps = {}) {
  const scrollContent = (
    <>
      <header className="actions-detail__header">
        <div className="actions-detail__toolbar">
          <div className="actions-detail__toolbar-left">
            <IconStatusNegative className="actions-detail__header-status" aria-hidden />
            <h1 className="actions-detail__title">
              Network performance degradation in Singapore caused by latency from an SD‑WAN policy change
            </h1>
          </div>
          <div className="actions-detail__toolbar-actions">
            <button type="button" className="actions-detail__dots-btn" aria-label="More options">
              <IconDotsThree />
            </button>
            {!hideOpenCanvas && (
              <Link to="/canvas/open" className="ai-button ai-button--primary actions-detail__open-canvas">
                Open canvas
                <IconArrowUpRight className="actions-detail__open-icon" />
              </Link>
            )}
          </div>
        </div>
        <div className="actions-detail__header-meta">
          <span className="actions-detail__header-tag">Risk Exposure</span>
          <span className="actions-detail__header-time">Today, 11:05 am</span>
          <span className="actions-detail__assignee-row">
            <span className="actions-detail__avatar">S</span>
            <span>Sean McGinnis</span>
          </span>
        </div>
      </header>

      <hr className="actions-detail__divider" />

      <section className="actions-detail__section">
        <p className="actions-detail__summary">
          <strong>Summary:</strong> Network performance degradation was observed in Singapore as a result of elevated network latency. The latency increase correlated with a recent SD‑WAN policy change (BranchOptimize‑v2), impacting traffic performance across affected connections.
        </p>
        <div className="actions-detail__tags">
          {TAGS.map((tag) => (
            <span key={tag} className="actions-detail__tag">{tag}</span>
          ))}
        </div>
      </section>

      <section className="actions-detail__section">
        <div className="actions-detail__metrics-widget">
          <div className="actions-detail__metrics-widget-header">
            <p className="actions-detail__section-intro">Here’s a quick overview of the incident duration and estimated impact:</p>
            {!metricsOnBoard && onAddMetricsToBoard != null && (
              <button
                type="button"
                className="actions-detail__metrics-widget-add"
                aria-label="Add metric to board"
                onClick={onAddMetricsToBoard}
              >
                <IconPlus />
              </button>
            )}
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

      <section className="actions-detail__section">
        <p className="actions-detail__recommendation">
          <strong>Recommendation:</strong> Rollback policy &apos;BranchOptimize-v2&apos;.
          <br />
          <strong>Confidence:</strong> High
        </p>
        <p className="actions-detail__prompt">
          Would you like to apply the recommended action and roll back the SD-WAN policy &apos;BranchOptimize-v2&apos;?
        </p>
      </section>

      <div className="actions-detail__actions">
        <Button variant="primary" type="button">Rollback policy &apos;BranchOptimize-v2&apos;</Button>
        <Button variant="secondary" type="button">Escalate to incident manager</Button>
        <Button variant="secondary" type="button">Show issues in Topology</Button>
      </div>
    </>
  )

  return (
    <div className={`actions-detail${compact ? ' actions-detail--compact' : ''}`}>
      {compact ? <div className="actions-detail__scroll">{scrollContent}</div> : scrollContent}

      <div className="actions-detail__chat">
        <div className="ai-assistant__chat-field">
          <div className="ai-assistant__chat-field-inner">
            <button type="button" className="ai-assistant__chat-field-btn" aria-label="Add attachment">
              <IconPlus />
            </button>
            <input
              type="text"
              className="ai-assistant__chat-placeholder"
              placeholder="Ask anything"
              aria-label="Ask anything"
              autoComplete="off"
            />
          </div>
          <button type="button" className="ai-assistant__chat-field-btn" aria-label="Voice input">
            <IconMic />
          </button>
          <button type="button" className="ai-assistant__chat-field-btn ai-assistant__chat-field-btn--highlight" aria-label="Waveform">
            <IconWaveform />
          </button>
        </div>
      </div>

      <footer className="ai-assistant__footer actions-detail__footer">
        Prompts and responses are only visible to you. Assistant can make mistakes. Verify responses.
      </footer>
    </div>
  )
}
