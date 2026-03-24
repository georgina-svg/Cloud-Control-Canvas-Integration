import { useState } from 'react'
import type React from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Header } from './Header'
import { ModeSwitcher } from './ModeSwitcher'

export type IntersightMessage = { id: string; role: 'user' | 'assistant'; text: string; time: string }

export type LayoutOutletContext = {
  chatPanelOpen: boolean
  setChatPanelOpen: (open: boolean) => void
  threads: { id: string; title: string }[]
  setThreads: React.Dispatch<React.SetStateAction<{ id: string; title: string }[]>>
  intersightMessages: IntersightMessage[]
  setIntersightMessages: React.Dispatch<React.SetStateAction<IntersightMessage[]>>
  intersightTyping: boolean
  setIntersightTyping: React.Dispatch<React.SetStateAction<boolean>>
  assistantOpen: boolean
  setAssistantOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export function Layout() {
  const [chatPanelOpen, setChatPanelOpen] = useState(true)
  const [threads, setThreads] = useState<{ id: string; title: string }[]>([])
  const [intersightMessages, setIntersightMessages] = useState<IntersightMessage[]>([])
  const [intersightTyping, setIntersightTyping] = useState(false)
  const [assistantOpen, setAssistantOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const onHomeClick = () => {
    if (location.pathname !== '/') {
      navigate('/')
    }
    setChatPanelOpen(false)
  }

  const showModeSwitcher =
    location.pathname !== '/canvas/open' &&
    !location.pathname.startsWith('/agent-studio') &&
    !location.pathname.startsWith('/intersight') &&
    !location.pathname.startsWith('/admin-console')
  const isOpenCanvas =
    location.pathname === '/canvas/open' ||
    location.pathname.startsWith('/intersight/canvas')

  return (
    <div className={`ai-assistant-layout${isOpenCanvas ? ' ai-assistant-layout--open-canvas' : ''}`}>
      <Header onHomeClick={onHomeClick} onAssistantClick={() => setAssistantOpen((v) => !v)} assistantOpen={assistantOpen} />
      {showModeSwitcher && <ModeSwitcher />}
      <main
        className="ai-assistant-layout__main"
        style={isOpenCanvas ? {
          height: '100vh',
          paddingTop: 0,
          display: 'block',
          overflow: 'hidden',
        } : {
          paddingTop: 56,
          minHeight: 'calc(100vh - 56px)',
          display: 'block',
          position: 'relative',
          overflow: 'visible',
        }}
      >
        <Outlet context={{ chatPanelOpen, setChatPanelOpen, threads, setThreads, intersightMessages, setIntersightMessages, intersightTyping, setIntersightTyping, assistantOpen, setAssistantOpen } satisfies LayoutOutletContext} />
      </main>
    </div>
  )
}
