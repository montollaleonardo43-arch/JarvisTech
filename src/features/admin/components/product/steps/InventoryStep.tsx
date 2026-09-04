import SectionCard from '@/shared/components/ui/SectionCard'
import TextField from '@/shared/components/ui/TextField'
import SwitchField from '@/shared/components/ui/SwitchField'
import FormActions from '../../FormActions'

interface InventoryForm {
  price: string
  offerPrice: string
  stock: string
  warranty: string
  featured: boolean
  status: 'active' | 'inactive' | 'draft'
}

interface InventoryStepProps {
  form: InventoryForm
  onUpdate: (field: keyof InventoryForm, value: string | boolean) => void
  onSaveDraft: () => void
  onBack: () => void
  onNext: () => void
}

export default function InventoryStep({
  form,
  onUpdate,
  onSaveDraft,
  onBack,
  onNext,
}: InventoryStepProps) {
  const canProceed = form.price.trim() !== ''

  return (
    <>
      <SectionCard title="Precios y Stock" description="Configuracion de precios e inventario.">
        <div className="space-y-lg">
          <div className="grid grid-cols-1 tablet:grid-cols-3 gap-lg">
            <TextField
              label="Precio"
              type="number"
              placeholder="0"
              value={form.price}
              onChange={(e) => onUpdate('price', e.target.value)}
            />
            <TextField
              label="Precio Oferta"
              type="number"
              placeholder="0"
              value={form.offerPrice}
              onChange={(e) => onUpdate('offerPrice', e.target.value)}
              helperText="Dejar vacio si no aplica"
            />
            <TextField
              label="Stock"
              type="number"
              placeholder="0"
              value={form.stock}
              onChange={(e) => onUpdate('stock', e.target.value)}
            />
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Detalles Adicionales" description="Garantia y estado del producto.">
        <div className="space-y-lg">
          <TextField
            label="Garantia"
            placeholder="Ej: 6 meses, 1 ano, Sin garantia"
            value={form.warranty}
            onChange={(e) => onUpdate('warranty', e.target.value)}
          />
          <SwitchField
            label="Producto Destacado"
            checked={form.featured}
            onChange={(checked) => onUpdate('featured', checked)}
          />
          <div>
            <span className="block text-text-secondary text-small mb-sm">Estado</span>
            <div className="flex flex-wrap gap-3">
              {(['active', 'inactive', 'draft'] as const).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => onUpdate('status', status)}
                  className={`px-4 py-2.5 rounded-md text-small font-medium transition-all ${
                    form.status === status
                      ? 'bg-primary-500/20 text-primary-400 ring-1 ring-primary-500'
                      : 'bg-surface-secondary border border-border text-text-secondary hover:text-white'
                  }`}
                >
                  {status === 'active'
                    ? 'Activo'
                    : status === 'inactive'
                      ? 'Inactivo'
                      : 'Borrador'}
                </button>
              ))}
            </div>
          </div>
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
