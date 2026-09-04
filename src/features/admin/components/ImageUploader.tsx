import { useRef } from 'react'
import { Upload, Trash2, Star } from 'lucide-react'
import type { Image } from '@/shared/types'

interface ImageUploaderProps {
  images: Image[]
  onUpload: (file: File) => Promise<void>
  onDelete: (imageId: number) => Promise<void>
  onSetPrimary: (imageId: number) => Promise<void>
  loading?: boolean
}

export default function ImageUploader({ images, onUpload, onDelete, onSetPrimary, loading }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    await onUpload(file)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-sm">
        <span className="text-text-secondary text-small">Imagenes ({images.length})</span>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={loading}
          className="flex items-center gap-1.5 text-primary-300 hover:text-white text-xs font-medium transition-colors disabled:opacity-50"
        >
          <Upload size={14} />
          Subir imagen
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {images.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {images.map((img) => (
            <div key={img.id} className={`relative group rounded-xl overflow-hidden border ${img.isPrimary ? 'border-primary-400' : 'border-white/15'}`}>
              <img
                src={img.path}
                alt={img.altText || ''}
                className="w-full h-24 object-cover"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {!img.isPrimary && (
                  <button
                    type="button"
                    onClick={() => onSetPrimary(img.id)}
                    className="p-1.5 bg-white/15 backdrop-blur rounded-md hover:bg-green-500 transition-colors"
                    title="Marcar como principal"
                  >
                    <Star size={14} className="text-white" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => onDelete(img.id)}
                  className="p-1.5 bg-white/15 backdrop-blur rounded-md hover:bg-rose-500 transition-colors"
                  title="Eliminar"
                >
                  <Trash2 size={14} className="text-white" />
                </button>
              </div>
              {img.isPrimary && (
                <div className="absolute top-1 left-1 bg-gradient-to-r from-green-400 to-emerald-700 text-white text-[10px] px-1.5 py-0.5 rounded font-medium">
                  Principal
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={loading}
          className="w-full border-2 border-dashed border-white/20 rounded-xl p-6 text-center hover:border-green-400/60 hover:bg-white/5 transition-colors"
        >
          <Upload size={24} className="mx-auto mb-2 text-text-tertiary" />
          <p className="text-text-tertiary text-xs">Click para subir imagen</p>
        </button>
      )}
    </div>
  )
}
