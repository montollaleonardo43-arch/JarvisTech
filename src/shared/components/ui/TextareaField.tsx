import { TextareaHTMLAttributes } from 'react'

interface TextareaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  helperText?: string
  error?: string
}

export default function TextareaField({
  label,
  helperText,
  error,
  className = '',
  id,
  ...props
}: TextareaFieldProps) {
  const textareaId = id || label.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className={className}>
      <label htmlFor={textareaId} className="block text-text-secondary text-small mb-sm">
        {label}
      </label>
      <textarea
        id={textareaId}
        className={`glass-input w-full rounded-xl py-3 px-4 text-white text-sm resize-none ${
          error ? 'border-error' : ''
        }`}
        {...props}
      />
      {error && <p className="mt-1 text-caption text-error">{error}</p>}
      {!error && helperText && <p className="mt-1 text-caption text-text-tertiary">{helperText}</p>}
    </div>
  )
}
