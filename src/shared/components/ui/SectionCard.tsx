import { ReactNode } from 'react'

interface SectionCardProps {
  title: string
  description?: string
  children: ReactNode
  action?: ReactNode
  className?: string
}

export default function SectionCard({ title, description, children, action, className = '' }: SectionCardProps) {
  return (
    <div className={`glass rounded-xl p-lg ${className}`}>
      <div className="flex items-start justify-between mb-lg">
        <div>
          <h3 className="text-h5 text-white">{title}</h3>
          {description && <p className="text-text-tertiary text-small mt-1">{description}</p>}
        </div>
        {action}
      </div>
      {children}
    </div>
  )
}
