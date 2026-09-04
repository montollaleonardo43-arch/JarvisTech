import Modal from './Modal'

interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  isLoading?: boolean
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Eliminar',
  isLoading = false,
}: ConfirmDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <p className="text-text-secondary mb-lg">{message}</p>
      <div className="flex justify-end gap-3">
        <button
          onClick={onClose}
          disabled={isLoading}
          className="px-4 py-2 rounded-xl border border-white/15 text-text-secondary hover:text-white hover:bg-white/10 text-sm font-medium transition-all duration-200 disabled:opacity-50"
        >
          Cancelar
        </button>
        <button
          onClick={onConfirm}
          disabled={isLoading}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-400 hover:to-red-400 text-white text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 shadow-lg shadow-rose-500/25 disabled:opacity-50 disabled:hover:translate-y-0"
        >
          {isLoading ? 'Eliminando...' : confirmText}
        </button>
      </div>
    </Modal>
  )
}
