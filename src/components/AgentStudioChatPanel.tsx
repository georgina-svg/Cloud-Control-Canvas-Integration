import { IconNav, IconClose } from './icons'
import { ChatInput } from './ChatInput'

export type ChatMessage = { id: string; role: 'user' | 'assistant'; text: string }

export interface AgentStudioChatPanelProps {
  onClose: () => void
  messages: ChatMessage[]
  onSend: (text: string) => void
  /** When set, hamburger opens threads overlay; show close button to go back */
  onOpenThreads?: () => void
}

export function AgentStudioChatPanel({ onClose, messages, onSend, onOpenThreads }: AgentStudioChatPanelProps) {
  return (
    <aside
      className="agent-studio-chat-panel"
      aria-label="Chat"
      role="complementary"
    >
      <div className="agent-studio-chat-panel__header">
        <h2 className="agent-studio-chat-panel__title">Chat</h2>
        <div className="agent-studio-chat-panel__header-actions">
          {onOpenThreads ? (
            <>
              <button
                type="button"
                className="agent-studio-chat-panel__close"
                onClick={onOpenThreads}
                aria-label="Open threads"
              >
                <IconNav />
              </button>
              <button
                type="button"
                className="agent-studio-chat-panel__close"
                onClick={onClose}
                aria-label="Close chat and go back"
              >
                <IconClose />
              </button>
            </>
          ) : (
            <button
              type="button"
              className="agent-studio-chat-panel__close"
              onClick={onClose}
              aria-label="Close chat panel"
            >
              <IconNav />
            </button>
          )}
        </div>
      </div>

      <div className="agent-studio-chat-panel__messages">
        {messages.length === 0 ? (
          <p className="agent-studio-chat-panel__empty">Send a message to start the conversation.</p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`agent-studio-chat-panel__message agent-studio-chat-panel__message--${msg.role}`}
            >
              <span className="agent-studio-chat-panel__message-text">{msg.text}</span>
            </div>
          ))
        )}
      </div>

      <div className="agent-studio-chat-panel__input-wrap">
        <ChatInput
          placeholder="Type a message..."
          showChips={false}
          onSubmit={onSend}
        />
      </div>
    </aside>
  )
}
