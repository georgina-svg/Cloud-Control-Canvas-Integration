import { IconNav } from './icons'
import { ChatInput } from './ChatInput'

export type ChatMessage = { id: string; role: 'user' | 'assistant'; text: string }

export interface AgentStudioChatPanelProps {
  onClose: () => void
  messages: ChatMessage[]
  onSend: (text: string) => void
}

export function AgentStudioChatPanel({ onClose, messages, onSend }: AgentStudioChatPanelProps) {
  return (
    <aside
      className="agent-studio-chat-panel"
      aria-label="Chat"
      role="complementary"
    >
      <div className="agent-studio-chat-panel__header">
        <h2 className="agent-studio-chat-panel__title">Chat</h2>
        <button
          type="button"
          className="agent-studio-chat-panel__close"
          onClick={onClose}
          aria-label="Close chat panel"
        >
          <IconNav />
        </button>
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
