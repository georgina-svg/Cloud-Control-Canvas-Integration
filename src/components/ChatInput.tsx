import { useState, useCallback } from 'react'
import {
  IconPlus,
  IconMic,
  IconWaveform,
  IconSend,
  IconReportMagnetic,
  IconWifiMagnetic,
  IconGaugeMagnetic,
  IconSwitchMagnetic,
  IconUsersMagnetic,
  IconRocketMagnetic,
} from './icons'

const CHIPS: { label: string; Icon: React.ComponentType<{ className?: string }> }[] = [
  { label: 'Create report', Icon: IconReportMagnetic },
  { label: 'Analyze wireless', Icon: IconWifiMagnetic },
  { label: 'Review WAN performance', Icon: IconGaugeMagnetic },
  { label: 'Deploy a switch', Icon: IconSwitchMagnetic },
  { label: 'Manage user groups', Icon: IconUsersMagnetic },
  { label: 'View hero stats', Icon: IconRocketMagnetic },
]

export type ChatInputProps = {
  placeholder?: string
  showChips?: boolean
  /** When set, show send button when user has typed; on send call with message and clear input */
  onSubmit?: (message: string) => void
}

export function ChatInput({ placeholder = 'Ask anything', showChips = true, onSubmit }: ChatInputProps = {}) {
  const [value, setValue] = useState('')
  const hasText = value.trim().length > 0
  const showSend = hasText && onSubmit != null

  const handleSubmit = useCallback(() => {
    const trimmed = value.trim()
    if (!trimmed || !onSubmit) return
    onSubmit(trimmed)
    setValue('')
  }, [value, onSubmit])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleSubmit()
      }
    },
    [handleSubmit],
  )

  return (
    <div className="ai-assistant__chat-wrap">
      <div className="ai-assistant__chat-input-wrap">
        <div className="ai-assistant__chat-field" role="group" aria-label="Chat input">
          <div className="ai-assistant__chat-field-inner">
            {!showSend && (
              <button
                type="button"
                className="ai-assistant__chat-field-btn"
                aria-label="Add attachment"
              >
                <IconPlus />
              </button>
            )}
            <input
              type="text"
              className="ai-assistant__chat-placeholder"
              placeholder={placeholder}
              aria-label={placeholder}
              autoComplete="off"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          {showSend ? (
            <button
              type="button"
              className="ai-assistant__chat-field-btn ai-assistant__chat-field-btn--highlight"
              aria-label="Send message"
              onClick={handleSubmit}
            >
              <IconSend />
            </button>
          ) : (
            <>
              <button
                type="button"
                className="ai-assistant__chat-field-btn"
                aria-label="Voice input"
              >
                <IconMic />
              </button>
              <button
                type="button"
                className="ai-assistant__chat-field-btn ai-assistant__chat-field-btn--highlight"
                aria-label="Voice output or waveform"
              >
                <IconWaveform />
              </button>
            </>
          )}
        </div>
      </div>
      {showChips && (
        <div className="ai-assistant__chips">
          {CHIPS.map(({ label, Icon }) => (
            <a
              key={label}
              href="#"
              className="ai-assistant__chip"
              aria-label={`Suggestion: ${label}`}
            >
              <Icon className="ai-assistant__chip-icon" />
              <span>{label}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
