interface StatusBadgeProps {
  active: boolean
}

export default function StatusBadge({ active }: StatusBadgeProps) {
  return (
    <span
      className={`glass-chip inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        active ? 'text-emerald-300' : 'text-text-tertiary'
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${active ? 'bg-emerald-400' : 'bg-slate-500'}`} />
      {active ? 'Activo' : 'Inactivo'}
    </span>
  )
}
