import { type ButtonHTMLAttributes } from 'react'

type ButtonVariant = 'primary' | 'secondary'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  children: React.ReactNode
}

export function Button({ variant = 'secondary', children, className = '', ...props }: ButtonProps) {
  const base = 'ai-button'
  const mod = variant === 'primary' ? `${base}--primary` : `${base}--secondary`
  return (
    <button
      type="button"
      className={`${base} ${mod} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  )
}
