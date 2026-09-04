import { useState, useEffect, useCallback } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { promotionsApi } from '../services/promotionsApi'
import { productsApi } from '../services/productsApi'
import { servicesApi } from '../services/servicesApi'
import { imagesApi } from '../services/imagesApi'
import type { Promotion, Product, Service } from '@/shared/types'
import AdminTable, { TableRow, TableCell } from '../components/AdminTable'
import SearchBar from '../components/SearchBar'
import Pagination from '../components/Pagination'
import StatusBadge from '../components/StatusBadge'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import ImageUploader from '../components/ImageUploader'

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [filtered, setFiltered] = useState<Promotion[]>([])
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [allServices, setAllServices] = useState<Service[]>([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Promotion | null>(null)
  const [deleting, setDeleting] = useState<Promotion | null>(null)
  const [formLoading, setFormLoading] = useState(false)
  const [error, setError] = useState('')
  const [imgLoading, setImgLoading] = useState(false)
  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([])
  const [selectedServiceIds, setSelectedServiceIds] = useState<number[]>([])
  const [form, setForm] = useState({
    title: '', description: '', promotionType: '', startDate: '', endDate: '',
  })

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [promoRes, prodRes, svcRes] = await Promise.all([
        promotionsApi.getAll(page),
        productsApi.getAll(0, 200),
        servicesApi.getAll(0, 200),
      ])
      setPromotions(promoRes.data.content)
      setTotalPages(promoRes.data.totalPages)
      setAllProducts(prodRes.data.content)
      setAllServices(svcRes.data.content)
    } catch { /* empty */ }
    setLoading(false)
  }, [page])

  useEffect(() => { load() }, [load])

  useEffect(() => {
    setFiltered(
      promotions.filter((p) => p.title.toLowerCase().includes(search.toLowerCase()))
    )
  }, [promotions, search])

  const openCreate = () => {
    setEditing(null)
    setForm({ title: '', description: '', promotionType: '', startDate: '', endDate: '' })
    setSelectedProductIds([])
    setSelectedServiceIds([])
    setError('')
    setShowForm(true)
  }

  const openEdit = (promo: Promotion) => {
    setEditing(promo)
    setForm({
      title: promo.title, description: promo.description || '',
      promotionType: promo.promotionType || '',
      startDate: promo.startDate.slice(0, 16),
      endDate: promo.endDate.slice(0, 16),
    })
    setSelectedProductIds([])
    setSelectedServiceIds([])
    setError('')
    setShowForm(true)
  }

  const toggleProduct = (id: number) => {
    setSelectedProductIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])
  }

  const toggleService = (id: number) => {
    setSelectedServiceIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormLoading(true)
    setError('')
    const payload = {
      ...form,
      startDate: form.startDate + ':00',
      endDate: form.endDate + ':00',
      productIds: selectedProductIds.length > 0 ? selectedProductIds : undefined,
      serviceIds: selectedServiceIds.length > 0 ? selectedServiceIds : undefined,
    }
    try {
      if (editing) {
        await promotionsApi.update(editing.id, payload)
      } else {
        await promotionsApi.create(payload)
      }
      setShowForm(false)
      load()
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Error al guardar'
      setError(msg)
    }
    setFormLoading(false)
  }

  const handleDelete = async () => {
    if (!deleting) return
    try {
      await promotionsApi.delete(deleting.id)
      setDeleting(null)
      load()
    } catch { /* empty */ }
  }

  const handleUploadImage = async (file: File) => {
    if (!editing) return
    setImgLoading(true)
    try {
      await imagesApi.uploadPromotion(editing.id, file)
      const { data } = await promotionsApi.getById(editing.id)
      setEditing(data)
      load()
    } catch { /* empty */ }
    setImgLoading(false)
  }

  const handleDeleteImage = async (imageId: number) => {
    try {
      await imagesApi.delete(imageId)
      if (editing) {
        const { data } = await promotionsApi.getById(editing.id)
        setEditing(data)
      }
      load()
    } catch { /* empty */ }
  }

  const handleSetPrimaryImage = async (imageId: number) => {
    try {
      await imagesApi.setPrimary(imageId)
      if (editing) {
        const { data } = await promotionsApi.getById(editing.id)
        setEditing(data)
      }
    } catch { /* empty */ }
  }

  const formatDate = (d: string) => new Date(d).toLocaleDateString('es-CL')

  const inputClass = "w-full glass-input rounded-xl py-2.5 px-4 text-white text-sm"
  const labelClass = "block text-text-secondary text-small mb-sm"

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-xl">
        <h1 className="text-h2 text-white">Promociones</h1>
        <button onClick={openCreate} className="flex items-center gap-2 bg-gradient-to-r from-green-400 to-emerald-700 hover:from-green-300 hover:to-emerald-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 shadow-lg shadow-green-500/25">
          <Plus size={18} /> Nueva Promocion
        </button>
      </div>

      <div className="mb-lg max-w-sm">
        <SearchBar value={search} onChange={setSearch} placeholder="Buscar promociones..." />
      </div>

      <div className="glass rounded-xl">
        {loading ? (
          <div className="p-xl text-center text-text-secondary">Cargando...</div>
        ) : filtered.length === 0 ? (
          <div className="p-xl text-center text-text-secondary">No hay promociones</div>
        ) : (
          <>
            <AdminTable headers={['Titulo', 'Tipo', 'Inicio', 'Fin', 'Productos', 'Servicios', 'Estado', 'Acciones']}>
              {filtered.map((promo) => (
                <TableRow key={promo.id}>
                  <TableCell className="text-white font-medium">{promo.title}</TableCell>
                  <TableCell className="text-text-tertiary">{promo.promotionType || '-'}</TableCell>
                  <TableCell>{formatDate(promo.startDate)}</TableCell>
                  <TableCell>{formatDate(promo.endDate)}</TableCell>
                  <TableCell>{promo.productCount}</TableCell>
                  <TableCell>{promo.serviceCount}</TableCell>
                  <TableCell><StatusBadge active={promo.active} /></TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(promo)} className="text-text-secondary hover:text-primary-400 transition-colors"><Pencil size={16} /></button>
                      <button onClick={() => setDeleting(promo)} className="text-text-secondary hover:text-error transition-colors"><Trash2 size={16} /></button>
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

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editing ? 'Editar Promocion' : 'Nueva Promocion'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-lg">
          {error && (
            <div className="bg-rose-500/15 border border-rose-400/30 text-rose-300 px-4 py-3 rounded-xl text-sm">{error}</div>
          )}
          <div>
            <label className={labelClass}>Titulo *</label>
            <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required maxLength={200} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Tipo</label>
            <input type="text" value={form.promotionType} onChange={(e) => setForm({ ...form, promotionType: e.target.value })} maxLength={50} placeholder="ej: OFERTA, DESCUENTO" className={inputClass} />
          </div>
          <div className="grid grid-cols-1 tablet:grid-cols-2 gap-lg">
            <div>
              <label className={labelClass}>Fecha Inicio *</label>
              <input type="datetime-local" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} required className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Fecha Fin *</label>
              <input type="datetime-local" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} required className={inputClass} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Descripcion</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className={`${inputClass} resize-none`} />
          </div>

          {allProducts.length > 0 && (
            <div>
              <label className={labelClass}>Productos asociados</label>
              <div className="bg-surface-secondary border border-border rounded-md p-3 max-h-40 overflow-y-auto">
                {allProducts.map((p) => (
                  <label key={p.id} className="flex items-center gap-2 py-1 cursor-pointer">
                    <input type="checkbox" checked={selectedProductIds.includes(p.id)} onChange={() => toggleProduct(p.id)} className="w-4 h-4 rounded border-border bg-surface text-primary-500 focus:ring-primary-500" />
                    <span className="text-text-secondary text-sm">{p.name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {allServices.length > 0 && (
            <div>
              <label className={labelClass}>Servicios asociados</label>
              <div className="bg-surface-secondary border border-border rounded-md p-3 max-h-40 overflow-y-auto">
                {allServices.map((s) => (
                  <label key={s.id} className="flex items-center gap-2 py-1 cursor-pointer">
                    <input type="checkbox" checked={selectedServiceIds.includes(s.id)} onChange={() => toggleService(s.id)} className="w-4 h-4 rounded border-border bg-surface text-primary-500 focus:ring-primary-500" />
                    <span className="text-text-secondary text-sm">{s.name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

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

      <ConfirmDialog isOpen={!!deleting} onClose={() => setDeleting(null)} onConfirm={handleDelete} title="Desactivar Promocion" confirmText="Desactivar" message={`¿Estas seguro de desactivar "${deleting?.title}"? La promocion no sera visible en la tienda.`} />
    </div>
  )
}
