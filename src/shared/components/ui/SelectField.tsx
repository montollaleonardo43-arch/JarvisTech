import { ReactNode, SelectHTMLAttributes } from 'react'

interface SelectOption {
  value: string | number
  label: string
}

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  options: SelectOption[]
  placeholder?: string
  error?: string
  action?: ReactNode
}

export default function SelectField({
  label,
  options,
  placeholder = 'Seleccionar...',
  error,
  action,
  className = '',
  id,
  ...props
}: SelectFieldProps) {
  const selectId = id || label.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-sm">
        <label htmlFor={selectId} className="text-text-secondary text-small">
          {label}
        </label>
        {action}
      </div>
      <select
        id={selectId}
        className={`glass-input w-full rounded-xl py-3 px-4 text-white text-sm appearance-none bg-no-repeat ${
          error ? 'border-error' : ''
        }`}
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23a5b4fc' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E\")",
          backgroundPosition: 'right 12px center',
          backgroundSize: '18px',
        }}
        {...props}
      >
        <option value="" className="bg-slate-900">
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-slate-900">
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-caption text-error">{error}</p>}
    </div>
  )
}
