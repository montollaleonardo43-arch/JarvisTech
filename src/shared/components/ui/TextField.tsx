import { InputHTMLAttributes, ReactNode } from 'react'

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  helperText?: string
  error?: string
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
}

export default function TextField({
  label,
  helperText,
  error,
  icon,
  iconPosition = 'right',
  className = '',
  id,
  ...props
}: TextFieldProps) {
  const inputId = id || label.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className={className}>
      <label htmlFor={inputId} className="block text-text-secondary text-small mb-sm">
        {label}
      </label>
      <div className="relative">
        <input
          id={inputId}
          className={`glass-input w-full rounded-xl py-3 px-4 text-white text-sm ${
            error ? 'border-error' : ''
          } ${icon ? (iconPosition === 'left' ? 'pl-10' : 'pr-24') : ''}`}
          {...props}
        />
        {icon && (
          <div className={`absolute top-1/2 -translate-y-1/2 ${iconPosition === 'left' ? 'left-3' : 'right-3'}`}>
            {icon}
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-caption text-error">{error}</p>}
      {!error && helperText && <p className="mt-1 text-caption text-text-tertiary">{helperText}</p>}
    </div>
  )
}
