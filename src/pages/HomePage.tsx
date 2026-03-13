import { useOutletContext } from 'react-router-dom'
import { Sidebar } from '../components/Sidebar'
import { ChatPanel } from '../components/ChatPanel'
import { HeroSection } from '../components/HeroSection'
import { ChatInput } from '../components/ChatInput'
import { Footer } from '../components/Footer'
import type { LayoutOutletContext } from '../components/Layout'

export function HomePage() {
  const { chatPanelOpen, setChatPanelOpen } = useOutletContext<LayoutOutletContext>()

  return (
    <div className="ai-assistant" role="main">
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
        <ChatPanel onClose={() => setChatPanelOpen(false)} />
      )}
      <HeroSection />
      <ChatInput />
      <Footer />
    </div>
  )
}
