interface SwitchFieldProps {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
}

export default function SwitchField({ label, checked, onChange, disabled }: SwitchFieldProps) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-text-secondary text-small">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked
            ? 'bg-gradient-to-r from-green-400 to-emerald-700 shadow shadow-green-500/30'
            : 'bg-white/10 border border-white/15'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  )
}
