export type VisualType =
  | 'health-overview'
  | 'site-status'
  | 'alerts-list'
  | 'perf-trend'
  | 'device-summary'

export function ChatVisual({ type, onAddToBoard }: { type: VisualType; onAddToBoard?: () => void }) {
  return (
    <div className="chat-visual-wrap">
      {onAddToBoard && (
        <button
          type="button"
          className="chat-visual__add-btn"
          onClick={onAddToBoard}
          title="Add to board"
          aria-label="Add to board"
        >
          +
        </button>
      )}
      {type === 'health-overview' && <HealthOverview />}
      {type === 'site-status'     && <SiteStatus />}
      {type === 'alerts-list'     && <AlertsList />}
      {type === 'perf-trend'      && <PerfTrend />}
      {type === 'device-summary'  && <DeviceSummary />}
    </div>
  )
}

function HealthOverview() {
  const score = 87
  return (
    <div className="chat-visual chat-visual--health">
      <div className="chat-visual__row chat-visual__row--space">
        <span className="chat-visual__label">Overall Health</span>
        <span className="chat-visual__score chat-visual__score--good">{score}%</span>
      </div>
      <div className="chat-visual__bar-track">
        <div className="chat-visual__bar-fill chat-visual__bar-fill--good" style={{ width: `${score}%` }} />
      </div>
      <div className="chat-visual__stats">
        <div className="chat-visual__stat chat-visual__stat--critical">
          <span className="chat-visual__stat-dot" />
          <span>3 Critical alerts</span>
        </div>
        <div className="chat-visual__stat chat-visual__stat--warning">
          <span className="chat-visual__stat-dot" />
          <span>2 Sites offline</span>
        </div>
        <div className="chat-visual__stat chat-visual__stat--info">
          <span className="chat-visual__stat-dot" />
          <span>12 Sites below 80%</span>
        </div>
      </div>
    </div>
  )
}

function SiteStatus() {
  const sites = [
    { name: 'SG-Branch-07', status: 'down', since: '30m ago', region: 'Singapore' },
    { name: 'SY-Branch-03', status: 'down', since: '28m ago', region: 'Sydney' },
    { name: 'AP-Hub-01',    status: 'up',   since: '—',       region: 'APAC Hub' },
    { name: 'NA-Branch-12', status: 'up',   since: '—',       region: 'Americas' },
  ]
  return (
    <div className="chat-visual chat-visual--table">
      <table className="chat-visual__table">
        <thead>
          <tr>
            <th>Site</th>
            <th>Region</th>
            <th>Status</th>
            <th>Since</th>
          </tr>
        </thead>
        <tbody>
          {sites.map((s) => (
            <tr key={s.name}>
              <td className="chat-visual__td--name">{s.name}</td>
              <td>{s.region}</td>
              <td>
                <span className={`chat-visual__badge chat-visual__badge--${s.status}`}>
                  {s.status === 'down' ? 'Offline' : 'Online'}
                </span>
              </td>
              <td className="chat-visual__td--muted">{s.since}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function AlertsList() {
  const alerts = [
    { id: 1, severity: 'P1', color: 'critical', title: 'SD-WAN latency spike in Singapore', time: '11:02 AM' },
    { id: 2, severity: 'P2', color: 'critical', title: 'VPN tunnel down at SG-Branch-07',   time: '11:08 AM' },
    { id: 3, severity: 'P2', color: 'warning',  title: 'High packet loss on MPLS AP-SE-1',  time: '11:15 AM' },
  ]
  return (
    <div className="chat-visual chat-visual--alerts">
      {alerts.map((a) => (
        <div key={a.id} className="chat-visual__alert-row">
          <span className={`chat-visual__severity chat-visual__severity--${a.color}`}>{a.severity}</span>
          <span className="chat-visual__alert-title">{a.title}</span>
          <span className="chat-visual__alert-time">{a.time}</span>
        </div>
      ))}
    </div>
  )
}

function PerfTrend() {
  const days = [
    { label: 'Mon', value: 42 },
    { label: 'Tue', value: 48 },
    { label: 'Wed', value: 45 },
    { label: 'Thu', value: 51 },
    { label: 'Fri', value: 44 },
    { label: 'Sat', value: 120 },
    { label: 'Today', value: 795 },
  ]
  const max = Math.max(...days.map((d) => d.value))
  return (
    <div className="chat-visual chat-visual--chart">
      <div className="chat-visual__chart-label">APAC Latency (ms) — Last 7 days</div>
      <div className="chat-visual__bars">
        {days.map((d) => {
          const pct = (d.value / max) * 100
          const isSpike = d.value > 200
          return (
            <div key={d.label} className="chat-visual__bar-col">
              <span className="chat-visual__bar-val">{d.value > 999 ? `${(d.value/1000).toFixed(1)}s` : `${d.value}`}</span>
              <div
                className={`chat-visual__bar ${isSpike ? 'chat-visual__bar--spike' : 'chat-visual__bar--normal'}`}
                style={{ height: `${Math.max(pct, 4)}%` }}
              />
              <span className="chat-visual__bar-day">{d.label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function DeviceSummary() {
  const stats = [
    { label: 'Total',          value: '4,821', color: 'neutral' },
    { label: 'Offline',        value: '47',    color: 'critical' },
    { label: 'Needs update',   value: '112',   color: 'warning' },
    { label: 'Healthy',        value: '4,662', color: 'good' },
  ]
  return (
    <div className="chat-visual chat-visual--devices">
      {stats.map((s) => (
        <div key={s.label} className={`chat-visual__device-card chat-visual__device-card--${s.color}`}>
          <span className="chat-visual__device-val">{s.value}</span>
          <span className="chat-visual__device-label">{s.label}</span>
        </div>
      ))}
    </div>
  )
}
