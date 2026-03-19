import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { ActionsPanel } from '../components/ActionsPanel'
import { ActionsDetail } from '../components/ActionsDetail'
import { ChatPanel } from '../components/ChatPanel'
import { ProgressPanel } from '../components/ProgressPanel'
import type { LayoutOutletContext } from '../components/Layout'

export function ActionsPage() {
  const { threads } = useOutletContext<LayoutOutletContext>()
  const [chatPanelOpen, setChatPanelOpen] = useState(false)
  const [selectedActionId, setSelectedActionId] = useState<string | null>('1')

  return (
    <div className="ai-assistant ai-assistant--actions" role="main">
      <div className="ai-assistant__bg" aria-hidden />
      <div className="ai-assistant__bg-glow" aria-hidden />
      <div className="ai-assistant__bg-glow-overlay" aria-hidden />
      {chatPanelOpen ? (
        <div className="actions-page__threads-slot">
          <ChatPanel onClose={() => setChatPanelOpen(false)} docked highlightThreadId="1" injectedThreads={threads} />
        </div>
      ) : (
        <ActionsPanel
          onOpenChatPanel={() => setChatPanelOpen(true)}
          selectedActionId={selectedActionId}
          onSelectAction={setSelectedActionId}
          hideHamburger
        />
      )}
      <ActionsDetail />
      <ProgressPanel />
    </div>
  )
}
