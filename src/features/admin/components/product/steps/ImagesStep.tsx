import SectionCard from '@/shared/components/ui/SectionCard'
import FormActions from '../../FormActions'
import ProductImageUploader from '../ProductImageUploader'

interface ImagePreview {
  id: string
  file: File
  url: string
  isPrimary: boolean
}

interface ImagesStepProps {
  images: ImagePreview[]
  onAddImages: (files: FileList | File[]) => void
  onRemoveImage: (id: string) => void
  onSetPrimary: (id: string) => void
  onBack: () => void
  onFinish: () => void
  loading?: boolean
}

export default function ImagesStep({
  images,
  onAddImages,
  onRemoveImage,
  onSetPrimary,
  onBack,
  onFinish,
  loading = false,
}: ImagesStepProps) {
  return (
    <>
      <SectionCard
        title="Imagenes del Producto"
        description="Arrastra o selecciona las imagenes del producto."
      >
        <ProductImageUploader
          images={images}
          onAdd={onAddImages}
          onRemove={onRemoveImage}
          onSetPrimary={onSetPrimary}
        />
      </SectionCard>

      <FormActions
        onBack={onBack}
        onNext={onFinish}
        nextLabel="Finalizar"
        loading={loading}
      />
    </>
  )
}
