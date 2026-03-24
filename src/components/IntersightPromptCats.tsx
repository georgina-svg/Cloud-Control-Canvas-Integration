import { useState } from 'react'
import type { ReactNode } from 'react'
import {
  IconHeartPulse, IconChart, IconSettings, IconDevice, IconCaretDown,
} from './icons'

export const INTERSIGHT_PROMPT_CATEGORIES: Array<{ id: string; label: string; icon: ReactNode }> = [
  { id: 'health',       label: 'Health & Overview',    icon: <IconHeartPulse /> },
  { id: 'devices',      label: 'Devices & Inventory',  icon: <IconDevice /> },
  { id: 'troubleshoot', label: 'Troubleshooting',      icon: <IconSettings /> },
  { id: 'performance',  label: 'Performance & Trends', icon: <IconChart /> },
]

export function IntersightPromptCat({ label, icon }: { label: string; icon: ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`canvas-prompt-cat${open ? ' canvas-prompt-cat--open' : ''}`}>
      <button
        type="button"
        className="canvas-prompt-cat__btn"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="canvas-prompt-cat__icon" aria-hidden>{icon}</span>
        <span className="canvas-prompt-cat__label">{label}</span>
        <IconCaretDown className="canvas-prompt-cat__chevron" />
      </button>
      {open && <div className="canvas-prompt-cat__body" />}
    </div>
  )
}
