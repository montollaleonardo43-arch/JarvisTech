import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
}

export default function Card({ children, className = '', hover = true }: CardProps) {
  return (
    <div
      className={`glass rounded-xl p-lg transition-all duration-200 ${
        hover ? 'hover:border-white/28 hover:-translate-y-1 hover:shadow-level-3' : ''
      } ${className}`}
    >
      {children}
    </div>
  )
}
