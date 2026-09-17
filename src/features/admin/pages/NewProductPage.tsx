import { useState, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ProductStepper from '../components/ProductStepper'
import Breadcrumb from '@/shared/components/ui/Breadcrumb'
import GeneralInfoStep from '../components/product/steps/GeneralInfoStep'
import InventoryStep from '../components/product/steps/InventoryStep'
import ImagesStep from '../components/product/steps/ImagesStep'
import { productsApi } from '../services/productsApi'
import { imagesApi } from '../services/imagesApi'
import { categoriesApi } from '../services/categoriesApi'
import { brandsApi } from '../services/brandsApi'
import type { Category, Brand } from '@/shared/types'

const steps = [
  { label: 'Informacion General' },
  { label: 'Inventario' },
  { label: 'Imagenes' },
]

const breadcrumbItems = [
  { label: 'Dashboard', to: '/admin/dashboard' },
  { label: 'Catalogo', to: '/admin/products' },
  { label: 'Productos', to: '/admin/products' },
  { label: 'Nuevo Producto' },
]

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

function generateSku(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = 'SKU-'
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

interface ProductFormData {
  name: string
  sku: string
  slug: string
  categoryId: string
  brandId: string
  shortDescription: string
  description: string
  price: string
  offerPrice: string
  stock: string
  warranty: string
  featured: boolean
  active: boolean
  status: 'active' | 'inactive' | 'draft'
}

interface ImagePreview {
  id: string
  file: File
  url: string
  isPrimary: boolean
}

const initialForm: ProductFormData = {
  name: '',
  sku: '',
  slug: '',
  categoryId: '',
  brandId: '',
  shortDescription: '',
  description: '',
  price: '',
  offerPrice: '',
  stock: '0',
  warranty: '',
  featured: false,
  active: true,
  status: 'draft',
}

export default function NewProductPage() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)
  const [form, setForm] = useState<ProductFormData>(initialForm)
  const [images, setImages] = useState<ImagePreview[]>([])
  const [categories, setCategories] = useState<{ value: string; label: string }[]>([])
  const [brands, setBrands] = useState<{ value: string; label: string }[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const updateField = useCallback((field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }, [])

  useEffect(() => {
    if (form.name) {
      setForm((prev) => ({ ...prev, slug: generateSlug(form.name) }))
    }
  }, [form.name])

  useEffect(() => {
    Promise.all([
      categoriesApi.getAll(0, 500),
      brandsApi.getAll(0, 500),
    ])
      .then(([catRes, brandRes]) => {
        setCategories(
          catRes.data.content.map((c: Category) => ({
            value: String(c.id),
            label: c.name,
          }))
        )
        setBrands(
          brandRes.data.content.map((b: Brand) => ({
            value: String(b.id),
            label: b.name,
          }))
        )
      })
      .catch(() => {})
  }, [])

  const handleGenerateSku = () => {
    setForm((prev) => ({ ...prev, sku: generateSku() }))
  }

  const addImages = (files: FileList | File[]) => {
    const newImages: ImagePreview[] = Array.from(files)
      .filter((file) => file.type.startsWith('image/'))
      .map((file, i) => ({
        id: `${Date.now()}-${i}`,
        file,
        url: URL.createObjectURL(file),
        isPrimary: images.length === 0 && i === 0,
      }))
    setImages((prev) => [...prev, ...newImages])
  }

  const removeImage = (id: string) => {
    setImages((prev) => {
      const removed = prev.find((img) => img.id === id)
      if (removed) URL.revokeObjectURL(removed.url)
      const filtered = prev.filter((img) => img.id !== id)
      if (removed?.isPrimary && filtered.length > 0) {
        filtered[0] = { ...filtered[0]!, isPrimary: true }
      }
      return filtered
    })
  }

  const setPrimaryImage = (id: string) => {
    setImages((prev) =>
      prev.map((img) => ({ ...img, isPrimary: img.id === id }))
    )
  }

  const handleFinish = async () => {
    setIsSubmitting(true)
    setError('')
    try {
      const payload = {
        name: form.name,
        sku: form.sku,
        shortDescription: form.shortDescription,
        description: form.description,
        price: parseFloat(form.price),
        offerPrice: form.offerPrice ? parseFloat(form.offerPrice) : null,
        stock: parseInt(form.stock) || 0,
        warranty: form.warranty,
        featured: form.featured,
        categoryId: parseInt(form.categoryId),
        brandId: parseInt(form.brandId),
      }

      const { data: res } = await productsApi.create(payload)
      const productId = res.data.id

      if (images.length > 0) {
        const uploadPromises = images.map((img) =>
          imagesApi.uploadProduct(productId, img.file, undefined, img.isPrimary)
        )
        await Promise.all(uploadPromises)
      }

      navigate('/admin/products')
    } catch (err: unknown) {
      console.error('Error creating product:', err)
      const axiosErr = err as { response?: { status?: number; data?: { message?: string } } }
      if (axiosErr.response?.status === 401) {
        setError('Tu sesion ha expirado. Seras redirigido al login...')
      } else {
        const msg = axiosErr.response?.data?.message || 'Error al crear el producto'
        setError(msg)
      }
    }
    setIsSubmitting(false)
  }

  return (
    <div>
      <Breadcrumb items={breadcrumbItems} className="mb-xl" />

      <div className="mb-2xl">
        <h1 className="text-h2 text-white mb-2">Nuevo Producto</h1>
        <p className="text-text-secondary text-body">
          Crear un nuevo producto para Jarvis Technology.
        </p>
      </div>

      <div className="mb-2xl">
        <ProductStepper steps={steps} currentStep={currentStep} />
      </div>

      <div className="space-y-xl">
        {error && (
          <div className="bg-rose-500/15 border border-rose-400/30 rounded-xl p-md text-rose-300 text-small">
            {error}
          </div>
        )}

        {currentStep === 0 && (
          <GeneralInfoStep
            form={form}
            categories={categories}
            brands={brands}
            onUpdate={updateField}
            onGenerateSku={handleGenerateSku}
            onBack={() => window.history.back()}
            onNext={() => setCurrentStep(1)}
          />
        )}

        {currentStep === 1 && (
          <InventoryStep
            form={form}
            onUpdate={updateField}
            onBack={() => setCurrentStep(0)}
            onNext={() => setCurrentStep(2)}
          />
        )}

        {currentStep === 2 && (
          <ImagesStep
            images={images}
            onAddImages={addImages}
            onRemoveImage={removeImage}
            onSetPrimary={setPrimaryImage}
            onBack={() => setCurrentStep(1)}
            onFinish={handleFinish}
            loading={isSubmitting}
          />
        )}
      </div>
    </div>
  )
}
