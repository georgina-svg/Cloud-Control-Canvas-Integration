import { useState, useCallback } from 'react'
import { useNavigate, useLocation, useOutletContext } from 'react-router-dom'
import type { LayoutOutletContext } from '../components/Layout'
import { AgentStudioChatPanel } from '../components/AgentStudioChatPanel'
import { ChatPanel } from '../components/ChatPanel'
import type { ChatMessage } from '../components/AgentStudioChatPanel'

export function AgentStudioChatPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { threads } = useOutletContext<LayoutOutletContext>()
  const initialMessage = (location.state as { initialMessage?: string } | null)?.initialMessage

  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    initialMessage ? [{ id: '0', role: 'user', text: initialMessage }] : [],
  )
  const [threadsPanelOpen, setThreadsPanelOpen] = useState(false)

  const handleClose = useCallback(() => {
    navigate('/agent-studio', { replace: true })
  }, [navigate])

  const handleSend = useCallback((text: string) => {
    const trimmed = text.trim()
    if (!trimmed) return
    setMessages((prev) => [...prev, { id: String(prev.length), role: 'user', text: trimmed }])
  }, [])

  const currentThreadId = 'agent-studio-current'
  const currentThreadTitle = initialMessage?.trim() ?? ''
  const localThread = currentThreadTitle ? [{ id: currentThreadId, title: currentThreadTitle }] : []
  const allThreads = [...localThread, ...threads]

  return (
    <div className="agent-studio-chat-page" role="main">
      {threadsPanelOpen && (
        <>
          <div
            className="ai-assistant__thread-backdrop"
            onClick={() => setThreadsPanelOpen(false)}
            aria-hidden
          />
          <ChatPanel
            overlay
            onClose={() => setThreadsPanelOpen(false)}
            injectedThreads={allThreads}
            highlightThreadId={currentThreadTitle ? currentThreadId : undefined}
          />
        </>
      )}
      <div className="agent-studio-chat-page__panel-wrap">
        <AgentStudioChatPanel
          onClose={handleClose}
          messages={messages}
          onSend={handleSend}
          onOpenThreads={() => setThreadsPanelOpen(true)}
        />
      </div>
      <div className="agent-studio-chat-page__main" aria-hidden />
    </div>
  )
}
