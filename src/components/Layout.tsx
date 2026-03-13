import { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Header } from './Header'
import { ModeSwitcher } from './ModeSwitcher'

export type LayoutOutletContext = {
  chatPanelOpen: boolean
  setChatPanelOpen: (open: boolean) => void
}

export function Layout() {
  const [chatPanelOpen, setChatPanelOpen] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()

  const onHomeClick = () => {
    if (location.pathname !== '/') {
      navigate('/')
    }
    setChatPanelOpen(false)
  }

  const showModeSwitcher = location.pathname !== '/canvas/open' && location.pathname !== '/agent-studio'
  const isOpenCanvas = location.pathname === '/canvas/open'

  return (
    <div className={`ai-assistant-layout${isOpenCanvas ? ' ai-assistant-layout--open-canvas' : ''}`}>
      <Header onHomeClick={onHomeClick} />
      {showModeSwitcher && <ModeSwitcher />}
      <main
        className="ai-assistant-layout__main"
        style={{
          paddingTop: 56,
          minHeight: 'calc(100vh - 56px)',
          display: 'block',
          position: 'relative',
          overflow: 'visible',
        }}
      >
        <Outlet context={{ chatPanelOpen, setChatPanelOpen } satisfies LayoutOutletContext} />
      </main>
    </div>
  )
}
