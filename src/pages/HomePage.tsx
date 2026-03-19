import { useState, useRef, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Sidebar } from '../components/Sidebar'
import { ChatPanel } from '../components/ChatPanel'
import { HeroSection } from '../components/HeroSection'
import { ChatInput } from '../components/ChatInput'
import { Footer } from '../components/Footer'
import type { LayoutOutletContext } from '../components/Layout'

function generateHomeReply(message: string): string {
  const m = message.toLowerCase()
  if (m.includes('health') || m.includes('status') || m.includes('overview') || m.includes('doing'))
    return 'Your network is currently healthy across most regions. There are 8 open actions — 3 are critical. Singapore is showing elevated latency due to an SD-WAN policy change from earlier today. Would you like me to summarize the top issues?'
  if (m.includes('alert') || m.includes('action') || m.includes('critical'))
    return 'There are 3 critical actions open right now: (1) SD-WAN latency spike in Singapore, (2) VPN tunnel down at SG-Branch-07, and (3) High packet loss on MPLS link AP-Southeast-1. I can walk you through any of them.'
  if (m.includes('report'))
    return 'I can generate a network health report covering the last 7, 14, or 30 days. Which timeframe would you like, and should I include all regions or focus on a specific one?'
  if (m.includes('wireless') || m.includes('wifi') || m.includes('wi-fi'))
    return 'Wireless performance is stable across 34 of 38 sites. 4 sites in APAC are showing elevated retry rates, which may be related to the SD-WAN change today. Want me to investigate further?'
  if (m.includes('wan') || m.includes('performance') || m.includes('latency'))
    return 'WAN performance is degraded in APAC. The Singapore hub is showing 795 ms max latency — up from a 42 ms baseline. EMEA and Americas are within normal ranges. The root cause is the BranchOptimize-v2 policy pushed at 11:02 AM.'
  if (m.includes('switch') || m.includes('deploy'))
    return 'To deploy a switch, I need a few details: target site, switch model, and desired VLAN configuration. Do you have a deployment template, or would you like me to suggest one based on your existing sites?'
  if (m.includes('user') || m.includes('group'))
    return 'There are 2,847 active users across your managed sites. 12 users in the Singapore office have been affected by today\'s WAN degradation. User groups are configured across 6 VLAN segments. What would you like to do?'
  return 'Got it. I\'m looking into that now. Can you give me a bit more context so I can give you the most relevant information?'
}

export function HomePage() {
  const { chatPanelOpen, setChatPanelOpen, threads, setThreads } = useOutletContext<LayoutOutletContext>()
  const [messages, setMessages] = useState<{ id: string; role: 'user' | 'assistant'; text: string; time: string }[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const isChatting = messages.length > 0 || isTyping

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const handleSubmit = (text: string) => {
    const now = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    const msgId = crypto.randomUUID()
    if (messages.length === 0) {
      setThreads((prev) => [{ id: msgId, title: text.length > 50 ? text.slice(0, 49) + '…' : text }, ...prev])
    }
    setMessages((prev) => [...prev, { id: msgId, role: 'user', text, time: now }])
    setIsTyping(true)
    setTimeout(() => {
      const replyTime = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
      setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: 'assistant', text: generateHomeReply(text), time: replyTime }])
      setIsTyping(false)
    }, 1200)
  }

  return (
    <div className={`ai-assistant${isChatting ? ' ai-assistant--home-chatting' : ''}`} role="main">
      <div className="ai-assistant__bg" aria-hidden />
      <div className="ai-assistant__bg-glow" aria-hidden />
      <div className="ai-assistant__bg-glow-overlay" aria-hidden />
      {!chatPanelOpen && (
        <Sidebar
          onToggleChatPanel={() => setChatPanelOpen(true)}
          isChatPanelOpen={chatPanelOpen}
        />
      )}
      {chatPanelOpen && (
        <ChatPanel onClose={() => setChatPanelOpen(false)} injectedThreads={threads} highlightThreadId={isChatting ? threads[0]?.id : undefined} />
      )}
      {!isChatting && <HeroSection />}
      {isChatting && (
        <div className="home-chat-messages">
          {messages.map((msg) => (
            <div key={msg.id} className={`canvas-chat-msg canvas-chat-msg--${msg.role}`}>
              <div className="canvas-chat-msg__header">
                {msg.role === 'user' ? (
                  <>
                    <span className="canvas-chat-msg__avatar" aria-hidden>A</span>
                    <span className="canvas-chat-msg__name">You</span>
                  </>
                ) : (
                  <>
                    <span className="canvas-chat-msg__ai-icon" aria-hidden>AI</span>
                    <span className="canvas-chat-msg__name">AI Assistant</span>
                    <span className="canvas-chat-msg__timestamp">{msg.time}</span>
                  </>
                )}
              </div>
              <p className="canvas-chat-msg__text">{msg.text}</p>
            </div>
          ))}
          {isTyping && (
            <div className="canvas-chat-msg canvas-chat-msg--assistant">
              <div className="canvas-chat-msg__header">
                <span className="canvas-chat-msg__ai-icon" aria-hidden>AI</span>
                <span className="canvas-chat-msg__name">AI Assistant</span>
              </div>
              <div className="actions-detail__typing" aria-label="Assistant is typing">
                <span /><span /><span />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      )}
      <ChatInput showChips={!isChatting} onSubmit={handleSubmit} />
      <Footer />
    </div>
  )
}
