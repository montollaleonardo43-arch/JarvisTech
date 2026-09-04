import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { productsApi } from '../services/productsApi'
import { categoriesApi } from '../services/categoriesApi'
import { brandsApi } from '../services/brandsApi'
import { imagesApi } from '../services/imagesApi'
import type { Product, Category, Brand } from '@/shared/types'
import AdminTable, { TableRow, TableCell } from '../components/AdminTable'
import SearchBar from '../components/SearchBar'
import Pagination from '../components/Pagination'
import StatusBadge from '../components/StatusBadge'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import ImageUploader from '../components/ImageUploader'

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filtered, setFiltered] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [deleting, setDeleting] = useState<Product | null>(null)
  const [formLoading, setFormLoading] = useState(false)
  const [error, setError] = useState('')
  const [imgLoading, setImgLoading] = useState(false)
  const [form, setForm] = useState({
    name: '', sku: '', shortDescription: '', description: '',
    price: '', offerPrice: '', stock: '0', warranty: '',
    featured: false, categoryId: '', brandId: '',
  })

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [prodRes, catRes, brandRes] = await Promise.all([
        productsApi.getAll(page),
        categoriesApi.getAll(0, 500),
        brandsApi.getAll(0, 500),
      ])
      setProducts(prodRes.data.content)
      setTotalPages(prodRes.data.totalPages)
      setCategories(catRes.data.content)
      setBrands(brandRes.data.content)
    } catch { /* empty */ }
    setLoading(false)
  }, [page])

  useEffect(() => { load() }, [load])

  useEffect(() => {
    setFiltered(
      products.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase())
      )
    )
  }, [products, search])

  const openEdit = (prod: Product) => {
    setEditing(prod)
    setForm({
      name: prod.name, sku: prod.sku, shortDescription: prod.shortDescription || '',
      description: prod.description || '', price: String(prod.price),
      offerPrice: prod.offerPrice ? String(prod.offerPrice) : '', stock: String(prod.stock),
      warranty: prod.warranty || '', featured: prod.featured,
      categoryId: String(prod.category.id), brandId: String(prod.brand.id),
    })
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormLoading(true)
    setError('')
    const payload = {
      ...form,
      price: parseFloat(form.price),
      offerPrice: form.offerPrice ? parseFloat(form.offerPrice) : null,
      stock: parseInt(form.stock),
      categoryId: parseInt(form.categoryId),
      brandId: parseInt(form.brandId),
    }
    try {
      if (editing) {
        await productsApi.update(editing.id, payload)
        setShowForm(false)
        load()
      } else {
        const { data: res } = await productsApi.create(payload)
        setEditing(res.data)
        load()
      }
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Error al guardar'
      setError(msg)
    }
    setFormLoading(false)
  }

  const handleDelete = async () => {
    if (!deleting) return
    try {
      await productsApi.delete(deleting.id)
      setDeleting(null)
      load()
    } catch { /* empty */ }
  }

  const handleUploadImage = async (file: File) => {
    if (!editing) return
    setImgLoading(true)
    try {
      await imagesApi.uploadProduct(editing.id, file)
      const { data } = await productsApi.getById(editing.id)
      setEditing(data)
      load()
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Error al subir imagen'
      setError(msg)
    }
    setImgLoading(false)
  }

  const handleDeleteImage = async (imageId: number) => {
    try {
      await imagesApi.delete(imageId)
      if (editing) {
        const { data } = await productsApi.getById(editing.id)
        setEditing(data)
      }
      load()
    } catch { /* empty */ }
  }

  const handleSetPrimaryImage = async (imageId: number) => {
    try {
      await imagesApi.setPrimary(imageId)
      if (editing) {
        const { data } = await productsApi.getById(editing.id)
        setEditing(data)
      }
    } catch { /* empty */ }
  }

  const inputClass = "w-full glass-input rounded-xl py-2.5 px-4 text-white text-sm"
  const labelClass = "block text-text-secondary text-small mb-sm"

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-xl">
        <h1 className="text-h2 text-white">Productos</h1>
        <Link to="/admin/products/new" className="flex items-center gap-2 bg-gradient-to-r from-green-400 to-emerald-700 hover:from-green-300 hover:to-emerald-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 shadow-lg shadow-green-500/25">
          <Plus size={18} /> Nuevo Producto
        </Link>
      </div>

      <div className="mb-lg max-w-sm">
        <SearchBar value={search} onChange={setSearch} placeholder="Buscar por nombre o SKU..." />
      </div>

      <div className="glass rounded-xl">
        {loading ? (
          <div className="p-xl text-center text-text-secondary">Cargando...</div>
        ) : filtered.length === 0 ? (
          <div className="p-xl text-center text-text-secondary">No hay productos</div>
        ) : (
          <>
            <AdminTable headers={['Imagen', 'SKU', 'Nombre', 'Categoria', 'Marca', 'Precio', 'Stock', 'Destacado', 'Estado', 'Acciones']}>
              {filtered.map((prod) => (
                <TableRow key={prod.id}>
                  <TableCell>
                    <div className="w-10 h-10 bg-surface-secondary rounded-md flex items-center justify-center overflow-hidden">
                      {prod.images.length > 0 ? (
                        <img src={prod.images[0]!.path} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-text-tertiary text-xs">IMG</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-text-tertiary font-mono text-xs">{prod.sku}</TableCell>
                  <TableCell className="text-white font-medium">{prod.name}</TableCell>
                  <TableCell>{prod.category.name}</TableCell>
                  <TableCell>{prod.brand.name}</TableCell>
                  <TableCell className="text-primary-400 font-medium">${prod.price.toLocaleString()}</TableCell>
                  <TableCell>{prod.stock}</TableCell>
                  <TableCell>{prod.featured ? '⭐' : '-'}</TableCell>
                  <TableCell><StatusBadge active={prod.active} /></TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(prod)} className="text-text-secondary hover:text-primary-400 transition-colors"><Pencil size={16} /></button>
                      <button onClick={() => setDeleting(prod)} className="text-text-secondary hover:text-error transition-colors"><Trash2 size={16} /></button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </AdminTable>
            <div className="px-lg pb-lg">
              <Pagination currentPage={page + 1} totalPages={totalPages} onPageChange={(p) => setPage(p - 1)} />
            </div>
          </>
        )}
      </div>

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editing ? 'Editar Producto' : 'Nuevo Producto'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-lg">
          {error && (
            <div className="bg-rose-500/15 border border-rose-400/30 text-rose-300 px-4 py-3 rounded-xl text-sm">{error}</div>
          )}
          <div className="grid grid-cols-1 tablet:grid-cols-2 gap-lg">
            <div>
              <label className={labelClass}>Nombre *</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required maxLength={200} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>SKU *</label>
              <input type="text" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} required maxLength={50} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Categoria *</label>
              <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} required className={inputClass}>
                <option value="">Seleccionar...</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Marca *</label>
              <select value={form.brandId} onChange={(e) => setForm({ ...form, brandId: e.target.value })} required className={inputClass}>
                <option value="">Seleccionar...</option>
                {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Precio *</label>
              <input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Precio Oferta</label>
              <input type="number" step="0.01" value={form.offerPrice} onChange={(e) => setForm({ ...form, offerPrice: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Stock</label>
              <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Garantia</label>
              <input type="text" value={form.warranty} onChange={(e) => setForm({ ...form, warranty: e.target.value })} placeholder="ej: 6 meses" className={inputClass} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Descripcion Corta</label>
            <input type="text" value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Descripcion Completa</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className={`${inputClass} resize-none`} />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="featured" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="w-4 h-4 rounded border-border bg-surface-secondary text-primary-500 focus:ring-primary-500" />
            <label htmlFor="featured" className="text-text-secondary text-small">Producto destacado</label>
          </div>
          {editing && (
            <div className="border-t border-border pt-lg">
              <ImageUploader
                images={editing.images}
                onUpload={handleUploadImage}
                onDelete={handleDeleteImage}
                onSetPrimary={handleSetPrimaryImage}
                loading={imgLoading}
              />
            </div>
          )}
          <div className="flex justify-end gap-3 pt-md">
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2.5 rounded-xl border border-white/15 text-text-secondary hover:text-white hover:bg-white/10 text-sm font-medium transition-all duration-200">Cancelar</button>
            <button type="submit" disabled={formLoading} className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-green-400 to-emerald-700 hover:from-green-300 hover:to-emerald-700 text-white text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 shadow-lg shadow-green-500/25 disabled:opacity-50 disabled:hover:translate-y-0">
              {formLoading ? 'Guardando...' : editing ? 'Guardar Cambios' : 'Crear'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={!!deleting} onClose={() => setDeleting(null)} onConfirm={handleDelete} title="Desactivar Producto" confirmText="Desactivar" message={`¿Estas seguro de desactivar "${deleting?.name}"? El producto no sera visible en la tienda.`} />
    </div>
  )
}
