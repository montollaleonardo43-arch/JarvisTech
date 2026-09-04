import { useRef, useState, useCallback } from 'react'
import { ImageIcon } from 'lucide-react'

interface SettingsImageUploaderProps {
  label: string
  currentUrl: string | null
  onUpload: (file: File) => Promise<void>
  onRemove: () => void
  loading?: boolean
}

export default function SettingsImageUploader({
  label,
  currentUrl,
  onUpload,
  onRemove,
  loading = false,
}: SettingsImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) return
    await onUpload(file)
  }, [onUpload])

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) await handleFile(file)
  }, [handleFile])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback(() => setIsDragging(false), [])

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) await handleFile(file)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div>
      <label className="block text-text-secondary text-small mb-sm">{label}</label>

      {currentUrl ? (
        <div className="relative group">
          <div className="glass rounded-lg p-4 flex items-center gap-4">
            <div className="w-20 h-20 bg-white/5 rounded-md flex items-center justify-center overflow-hidden flex-shrink-0">
              <img
                src={currentUrl}
                alt={label}
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm truncate">{currentUrl}</p>
              <p className="text-text-tertiary text-xs mt-1">Imagen cargada</p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={loading}
                className="text-primary-400 hover:text-primary-300 text-xs font-medium transition-colors disabled:opacity-50"
              >
                Cambiar
              </button>
              <button
                type="button"
                onClick={onRemove}
                disabled={loading}
                className="text-error hover:text-error/80 text-xs font-medium transition-colors disabled:opacity-50"
              >
                Quitar
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            isDragging
              ? 'border-primary-400 bg-primary-500/10'
              : 'border-white/20 hover:border-green-400/60'
          }`}
        >
          {loading ? (
            <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          ) : (
            <ImageIcon size={24} className="mx-auto mb-2 text-text-tertiary" />
          )}
          <p className="text-text-tertiary text-xs">
            {loading ? 'Subiendo...' : 'Arrastra una imagen o haz clic para seleccionar'}
          </p>
          <p className="text-text-tertiary/60 text-[10px] mt-1">PNG, JPG, SVG, WebP</p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />
    </div>
  )
}
