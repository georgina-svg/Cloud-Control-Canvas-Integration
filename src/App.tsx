import { useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { Layout } from './components/Layout'
import { HomePage } from './pages/HomePage'
import { AgentStudioPage } from './pages/AgentStudioPage'
import { AgentStudioChatPage } from './pages/AgentStudioChatPage'
import { IntersightPage } from './pages/IntersightPage'
import { ActionsPage } from './pages/ActionsPage'
import { CanvasPage } from './pages/CanvasPage'
import { OpenCanvasPage } from './pages/OpenCanvasPage'
import { AdminConsolePage } from './pages/AdminConsolePage'
import { BuildAgentPage } from './pages/BuildAgentPage'

function IntersightCanvasWrapper() {
  const [closing, setClosing] = useState(false)
  const [canvasWidth, setCanvasWidth] = useState<number | null>(null)
  const navigate = useNavigate()

  const handleDismiss = () => {
    if (closing) return
    setClosing(true)
    setTimeout(() => navigate('/intersight'), 500)
  }

  return (
    <>
      <IntersightPage onDismissCanvas={handleDismiss} canvasWidth={canvasWidth} />
      <OpenCanvasPage closingCanvas={closing} canvasWidth={canvasWidth} onCanvasWidthChange={setCanvasWidth} />
    </>
  )
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="agent-studio" element={<AgentStudioPage />} />
        <Route path="agent-studio/build" element={<BuildAgentPage />} />
        <Route path="agent-studio/chat" element={<AgentStudioChatPage />} />
        <Route path="intersight" element={<IntersightPage />} />
        <Route path="actions" element={<ActionsPage />} />
        <Route path="canvas" element={<CanvasPage />} />
        <Route path="canvas/open" element={<OpenCanvasPage />} />
        <Route path="intersight/canvas" element={<IntersightCanvasWrapper />} />
        <Route path="admin-console" element={<AdminConsolePage />} />
      </Route>
    </Routes>
  )
}
