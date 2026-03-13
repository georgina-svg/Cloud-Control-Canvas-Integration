import { useState } from 'react'
import { ActionsPanel } from '../components/ActionsPanel'
import { ActionsDetail } from '../components/ActionsDetail'
import { ChatPanel } from '../components/ChatPanel'
import { ProgressPanel } from '../components/ProgressPanel'

export function ActionsPage() {
  const [chatPanelOpen, setChatPanelOpen] = useState(false)

  return (
    <div className="ai-assistant ai-assistant--actions" role="main">
      <div className="ai-assistant__bg" aria-hidden />
      <div className="ai-assistant__bg-glow" aria-hidden />
      <div className="ai-assistant__bg-glow-overlay" aria-hidden />
      {chatPanelOpen ? (
        <div className="actions-page__threads-slot">
          <ChatPanel onClose={() => setChatPanelOpen(false)} docked highlightThreadId="1" />
        </div>
      ) : (
        <ActionsPanel onOpenChatPanel={() => setChatPanelOpen(true)} />
      )}
      <ActionsDetail />
      <ProgressPanel />
    </div>
  )
}
