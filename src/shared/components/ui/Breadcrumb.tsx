import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { Home } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  to?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export default function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  return (
    <nav className={`flex items-center gap-2 text-small text-text-tertiary ${className}`}>
      <Link to="/admin/dashboard" className="hover:text-white transition-colors flex items-center gap-1">
        <Home size={14} />
      </Link>
      {items.map((item, index) => {
        const isLast = index === items.length - 1

        return (
          <span key={index} className="flex items-center gap-2">
            <ChevronRight size={14} className="text-text-tertiary" />
            {item.to && !isLast ? (
              <Link to={item.to} className="hover:text-white transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? 'text-white' : ''}>{item.label}</span>
            )}
          </span>
        )
      })}
    </nav>
  )
}
