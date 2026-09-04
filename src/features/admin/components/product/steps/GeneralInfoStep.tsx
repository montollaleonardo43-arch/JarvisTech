import { Sparkles } from 'lucide-react'
import SectionCard from '@/shared/components/ui/SectionCard'
import TextField from '@/shared/components/ui/TextField'
import SelectField from '@/shared/components/ui/SelectField'
import TextareaField from '@/shared/components/ui/TextareaField'
import FormActions from '../../FormActions'

interface GeneralInfoForm {
  name: string
  sku: string
  slug: string
  categoryId: string
  brandId: string
  shortDescription: string
  description: string
}

interface GeneralInfoStepProps {
  form: GeneralInfoForm
  categories: { value: string; label: string }[]
  brands: { value: string; label: string }[]
  onUpdate: (field: keyof GeneralInfoForm, value: string) => void
  onGenerateSku: () => void
  onNewCategory: () => void
  onNewBrand: () => void
  onSaveDraft: () => void
  onBack: () => void
  onNext: () => void
}

export default function GeneralInfoStep({
  form,
  categories,
  brands,
  onUpdate,
  onGenerateSku,
  onNewCategory,
  onNewBrand,
  onSaveDraft,
  onBack,
  onNext,
}: GeneralInfoStepProps) {
  const canProceed = form.name.trim() !== '' && form.sku.trim() !== '' && form.categoryId !== '' && form.brandId !== ''

  return (
    <>
      <SectionCard title="Informacion del Producto" description="Datos basicos del producto.">
        <div className="space-y-lg">
          <div className="grid grid-cols-1 tablet:grid-cols-2 gap-lg">
            <TextField
              label="Nombre del Producto"
              placeholder="Ej: Pantalla LCD Samsung Galaxy S23"
              value={form.name}
              onChange={(e) => onUpdate('name', e.target.value)}
            />
            <div>
              <TextField
                label="SKU"
                placeholder="Ej: SKU-ABC123"
                value={form.sku}
                onChange={(e) => onUpdate('sku', e.target.value)}
                icon={
                  <button
                    type="button"
                    onClick={onGenerateSku}
                    className="flex items-center gap-1 text-primary-400 hover:text-primary-300 text-caption font-medium transition-colors whitespace-nowrap"
                    title="Generar SKU aleatorio"
                  >
                    <Sparkles size={14} />
                    Generar
                  </button>
                }
              />
            </div>
          </div>
          <TextField
            label="Slug"
            placeholder="Se genera automaticamente"
            value={form.slug}
            readOnly
            helperText="Se genera a partir del nombre del producto"
          />
          <div className="grid grid-cols-1 tablet:grid-cols-2 gap-lg">
            <SelectField
              label="Categoria"
              value={form.categoryId}
              onChange={(e) => onUpdate('categoryId', e.target.value)}
              options={categories}
              placeholder="Seleccionar categoria..."
              action={
                <button
                  type="button"
                  onClick={onNewCategory}
                  className="text-primary-400 hover:text-primary-300 text-caption font-medium transition-colors"
                >
                  + Nueva
                </button>
              }
            />
            <SelectField
              label="Marca"
              value={form.brandId}
              onChange={(e) => onUpdate('brandId', e.target.value)}
              options={brands}
              placeholder="Seleccionar marca..."
              action={
                <button
                  type="button"
                  onClick={onNewBrand}
                  className="text-primary-400 hover:text-primary-300 text-caption font-medium transition-colors"
                >
                  + Nueva
                </button>
              }
            />
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Descripcion" description="Informacion descriptiva del producto.">
        <div className="space-y-lg">
          <TextareaField
            label="Descripcion Corta"
            placeholder="Breve descripcion del producto (visible en listados)"
            value={form.shortDescription}
            onChange={(e) => onUpdate('shortDescription', e.target.value)}
            rows={2}
          />
          <TextareaField
            label="Descripcion Completa"
            placeholder="Descripcion detallada del producto..."
            value={form.description}
            onChange={(e) => onUpdate('description', e.target.value)}
            rows={5}
          />
        </div>
      </SectionCard>

      <FormActions
        onBack={onBack}
        onSkip={onSaveDraft}
        onNext={onNext}
        nextDisabled={!canProceed}
      />
    </>
  )
}
