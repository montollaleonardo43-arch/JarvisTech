import { ReactNode } from 'react'
import Button from '@/shared/components/ui/Button'

interface FormActionsProps {
  onBack?: () => void
  onNext?: () => void
  backLabel?: string
  nextLabel?: string
  nextDisabled?: boolean
  loading?: boolean
  extra?: ReactNode
}

export default function FormActions({
  onBack,
  onNext,
  backLabel = 'Volver',
  nextLabel = 'Siguiente',
  nextDisabled = false,
  loading = false,
  extra,
}: FormActionsProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-xl border-t border-border">
      <div className="flex items-center gap-3">
        {onBack && (
          <Button type="button" variant="ghost" onClick={onBack}>
            {backLabel}
          </Button>
        )}
        {extra}
      </div>
      {onNext && (
        <Button type="button" onClick={onNext} disabled={nextDisabled || loading}>
          {loading ? 'Guardando...' : nextLabel}
        </Button>
      )}
    </div>
  )
}
