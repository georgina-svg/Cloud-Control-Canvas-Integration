import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { HomePage } from './pages/HomePage'
import { AgentStudioPage } from './pages/AgentStudioPage'
import { ActionsPage } from './pages/ActionsPage'
import { CanvasPage } from './pages/CanvasPage'
import { OpenCanvasPage } from './pages/OpenCanvasPage'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="agent-studio" element={<AgentStudioPage />} />
        <Route path="actions" element={<ActionsPage />} />
        <Route path="canvas" element={<CanvasPage />} />
        <Route path="canvas/open" element={<OpenCanvasPage />} />
      </Route>
    </Routes>
  )
}
