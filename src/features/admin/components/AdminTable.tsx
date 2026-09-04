import { ReactNode } from 'react'

interface AdminTableProps {
  headers: string[]
  children: ReactNode
}

export default function AdminTable({ headers, children }: AdminTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/10 bg-white/5">
            {headers.map((header) => (
              <th
                key={header}
                className="text-left py-3.5 px-4 text-text-secondary text-small font-semibold uppercase tracking-wide"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  )
}

interface TableRowProps {
  children: ReactNode
}

export function TableRow({ children }: TableRowProps) {
  return (
    <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
      {children}
    </tr>
  )
}

interface TableCellProps {
  children: ReactNode
  className?: string
}

export function TableCell({ children, className = '' }: TableCellProps) {
  return <td className={`py-3.5 px-4 text-sm ${className}`}>{children}</td>
}
