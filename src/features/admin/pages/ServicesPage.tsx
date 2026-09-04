import { useState, useEffect, useCallback } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { servicesApi } from '../services/servicesApi'
import { serviceCategoriesApi } from '../services/serviceCategoriesApi'
import { imagesApi } from '../services/imagesApi'
import type { Service, ServiceCategory } from '@/shared/types'
import AdminTable, { TableRow, TableCell } from '../components/AdminTable'
import SearchBar from '../components/SearchBar'
import Pagination from '../components/Pagination'
import StatusBadge from '../components/StatusBadge'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import ImageUploader from '../components/ImageUploader'

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [filtered, setFiltered] = useState<Service[]>([])
  const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Service | null>(null)
  const [deleting, setDeleting] = useState<Service | null>(null)
  const [formLoading, setFormLoading] = useState(false)
  const [error, setError] = useState('')
  const [imgLoading, setImgLoading] = useState(false)
  const [form, setForm] = useState({
    name: '', description: '', referencePrice: '', estimatedTime: '',
    requiresDiagnosis: false, warranty: '', featured: false, serviceCategoryId: '',
  })

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [svcRes, catRes] = await Promise.allSettled([
        servicesApi.getAll(page),
        serviceCategoriesApi.getAll(0, 100),
      ])
      if (svcRes.status === 'fulfilled') {
        setServices(svcRes.value.data.content)
        setTotalPages(svcRes.value.data.totalPages)
      }
      if (catRes.status === 'fulfilled') {
        setServiceCategories(catRes.value.data.content)
      }
    } catch {
      setError('Error al cargar los datos del servidor')
    }
    setLoading(false)
  }, [page])

  useEffect(() => { load() }, [load])

  useEffect(() => {
    setFiltered(
      services.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()))
    )
  }, [services, search])

  const openCreate = () => {
    setEditing(null)
    setForm({ name: '', description: '', referencePrice: '', estimatedTime: '', requiresDiagnosis: false, warranty: '', featured: false, serviceCategoryId: serviceCategories[0]?.id ? String(serviceCategories[0].id) : '' })
    setError('')
    setShowForm(true)
  }

  const openEdit = (svc: Service) => {
    setEditing(svc)
    setForm({
      name: svc.name, description: svc.description || '',
      referencePrice: svc.referencePrice ? String(svc.referencePrice) : '',
      estimatedTime: svc.estimatedTime || '', requiresDiagnosis: svc.requiresDiagnosis,
      warranty: svc.warranty || '', featured: svc.featured,
      serviceCategoryId: String(svc.serviceCategory.id),
    })
    setError('')
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormLoading(true)
    setError('')
    const payload = {
      ...form,
      referencePrice: form.referencePrice ? parseFloat(form.referencePrice) : null,
      serviceCategoryId: parseInt(form.serviceCategoryId),
    }
    try {
      if (editing) {
        await servicesApi.update(editing.id, payload)
      } else {
        await servicesApi.create(payload)
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
      await servicesApi.delete(deleting.id)
      setDeleting(null)
      load()
    } catch { /* empty */ }
  }

  const handleUploadImage = async (file: File) => {
    if (!editing) return
    setImgLoading(true)
    try {
      await imagesApi.uploadService(editing.id, file)
      const { data } = await servicesApi.getById(editing.id)
      setEditing(data)
      load()
    } catch { /* empty */ }
    setImgLoading(false)
  }

  const handleDeleteImage = async (imageId: number) => {
    try {
      await imagesApi.delete(imageId)
      if (editing) {
        const { data } = await servicesApi.getById(editing.id)
        setEditing(data)
      }
      load()
    } catch { /* empty */ }
  }

  const handleSetPrimaryImage = async (imageId: number) => {
    try {
      await imagesApi.setPrimary(imageId)
      if (editing) {
        const { data } = await servicesApi.getById(editing.id)
        setEditing(data)
      }
    } catch { /* empty */ }
  }

  const inputClass = "w-full glass-input rounded-xl py-2.5 px-4 text-white text-sm"
  const labelClass = "block text-text-secondary text-small mb-sm"

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-xl">
        <h1 className="text-h2 text-white">Servicios</h1>
        <button onClick={openCreate} className="flex items-center gap-2 bg-gradient-to-r from-green-400 to-emerald-700 hover:from-green-300 hover:to-emerald-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 shadow-lg shadow-green-500/25">
          <Plus size={18} /> Nuevo Servicio
        </button>
      </div>

      <div className="mb-lg max-w-sm">
        <SearchBar value={search} onChange={setSearch} placeholder="Buscar servicios..." />
      </div>

      <div className="glass rounded-xl">
        {loading ? (
          <div className="p-xl text-center text-text-secondary">Cargando...</div>
        ) : filtered.length === 0 ? (
          <div className="p-xl text-center text-text-secondary">No hay servicios</div>
        ) : (
          <>
            <AdminTable headers={['Nombre', 'Categoria', 'Precio Ref.', 'Tiempo Est.', 'Diagnostico', 'Destacado', 'Estado', 'Acciones']}>
              {filtered.map((svc) => (
                <TableRow key={svc.id}>
                  <TableCell className="text-white font-medium">{svc.name}</TableCell>
                  <TableCell>{svc.serviceCategory.name}</TableCell>
                  <TableCell className="text-primary-400 font-medium">
                    {svc.referencePrice ? `$${svc.referencePrice.toLocaleString()}` : '-'}
                  </TableCell>
                  <TableCell>{svc.estimatedTime || '-'}</TableCell>
                  <TableCell>{svc.requiresDiagnosis ? 'Si' : 'No'}</TableCell>
                  <TableCell>{svc.featured ? '⭐' : '-'}</TableCell>
                  <TableCell><StatusBadge active={svc.active} /></TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(svc)} className="text-text-secondary hover:text-primary-400 transition-colors"><Pencil size={16} /></button>
                      <button onClick={() => setDeleting(svc)} className="text-text-secondary hover:text-error transition-colors"><Trash2 size={16} /></button>
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

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editing ? 'Editar Servicio' : 'Nuevo Servicio'} size="lg">
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
              <label className={labelClass}>Categoria *</label>
              <select value={form.serviceCategoryId} onChange={(e) => setForm({ ...form, serviceCategoryId: e.target.value })} required className={inputClass}>
                <option value="">Seleccionar...</option>
                {serviceCategories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Precio Referencia</label>
              <input type="number" step="0.01" value={form.referencePrice} onChange={(e) => setForm({ ...form, referencePrice: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Tiempo Estimado</label>
              <input type="text" value={form.estimatedTime} onChange={(e) => setForm({ ...form, estimatedTime: e.target.value })} maxLength={100} placeholder="ej: 2-4 horas" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Garantia</label>
              <input type="text" value={form.warranty} onChange={(e) => setForm({ ...form, warranty: e.target.value })} maxLength={200} placeholder="ej: 3 meses" className={inputClass} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Descripcion</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className={`${inputClass} resize-none`} />
          </div>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.requiresDiagnosis} onChange={(e) => setForm({ ...form, requiresDiagnosis: e.target.checked })} className="w-4 h-4 rounded border-border bg-surface-secondary text-primary-500 focus:ring-primary-500" />
              <span className="text-text-secondary text-small">Requiere diagnostico</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="w-4 h-4 rounded border-border bg-surface-secondary text-primary-500 focus:ring-primary-500" />
              <span className="text-text-secondary text-small">Destacado</span>
            </label>
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

      <ConfirmDialog isOpen={!!deleting} onClose={() => setDeleting(null)} onConfirm={handleDelete} title="Desactivar Servicio" confirmText="Desactivar" message={`¿Estas seguro de desactivar "${deleting?.name}"? El servicio no sera visible en la tienda.`} />
    </div>
  )
}
