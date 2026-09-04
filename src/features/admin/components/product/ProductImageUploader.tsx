import { useRef, useState } from 'react'
import { Upload, X, Star, GripVertical } from 'lucide-react'

interface ImagePreview {
  id: string
  file: File
  url: string
  isPrimary: boolean
}

interface ProductImageUploaderProps {
  images: ImagePreview[]
  onAdd: (files: FileList | File[]) => void
  onRemove: (id: string) => void
  onSetPrimary: (id: string) => void
}

export default function ProductImageUploader({
  images,
  onAdd,
  onRemove,
  onSetPrimary,
}: ProductImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files.length > 0) {
      onAdd(e.dataTransfer.files)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onAdd(e.target.files)
    }
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-xl text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-primary-400 bg-primary-500/10'
            : 'border-white/20 hover:border-green-400/60 hover:bg-white/5'
        }`}
      >
        <Upload
          size={32}
          className={`mx-auto mb-3 ${isDragging ? 'text-primary-300' : 'text-text-tertiary'}`}
        />
        <p className="text-text-secondary text-body mb-1">
          {isDragging
            ? 'Suelta las imagenes aqui'
            : 'Arrastra imagenes aqui o haz click para seleccionar'}
        </p>
        <p className="text-text-tertiary text-caption">PNG, JPG, WEBP (max. 5MB por imagen)</p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {images.length > 0 && (
        <div className="mt-lg">
          <div className="flex items-center justify-between mb-sm">
            <span className="text-text-secondary text-small">
              {images.length} imagen(es) seleccionada(s)
            </span>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-primary-400 hover:text-primary-300 text-caption font-medium transition-colors"
            >
              + Agregar mas
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {images.map((img) => (
              <div
                key={img.id}
                className={`relative group rounded-lg overflow-hidden border transition-all ${
                  img.isPrimary
                    ? 'border-primary-500 ring-1 ring-primary-500/30'
                    : 'border-border'
                }`}
              >
                <div className="aspect-square bg-surface-secondary flex items-center justify-center">
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="absolute top-2 left-2">
                  <div className="p-1.5 bg-surface/80 rounded-md opacity-0 group-hover:opacity-100 transition-opacity cursor-grab">
                    <GripVertical size={14} className="text-white" />
                  </div>
                </div>
                <div className="absolute top-2 right-2 flex items-center gap-1.5">
                  {!img.isPrimary && (
                    <button
                      type="button"
                      onClick={() => onSetPrimary(img.id)}
                      className="p-1.5 bg-surface/80 rounded-md hover:bg-primary-500 transition-colors opacity-0 group-hover:opacity-100"
                      title="Marcar como principal"
                    >
                      <Star size={14} className="text-white" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => onRemove(img.id)}
                    className="p-1.5 bg-surface/80 rounded-md hover:bg-error transition-colors opacity-0 group-hover:opacity-100"
                    title="Eliminar"
                  >
                    <X size={14} className="text-white" />
                  </button>
                </div>
                {img.isPrimary && (
                  <div className="absolute bottom-2 left-2 bg-primary-500 text-white text-[10px] px-2 py-0.5 rounded font-medium">
                    Principal
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
