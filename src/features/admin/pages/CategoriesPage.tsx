import { useState, useEffect, useCallback } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { categoriesApi } from '../services/categoriesApi'
import type { Category } from '@/shared/types'
import AdminTable, { TableRow, TableCell } from '../components/AdminTable'
import SearchBar from '../components/SearchBar'
import Pagination from '../components/Pagination'
import StatusBadge from '../components/StatusBadge'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [filtered, setFiltered] = useState<Category[]>([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)
  const [deleting, setDeleting] = useState<Category | null>(null)
  const [formLoading, setFormLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', description: '', icon: '' })

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await categoriesApi.getAll(page)
      setCategories(data.content)
      setTotalPages(data.totalPages)
    } catch { /* empty */ }
    setLoading(false)
  }, [page])

  useEffect(() => { load() }, [load])

  useEffect(() => {
    setFiltered(
      categories.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase())
      )
    )
  }, [categories, search])

  const openCreate = () => {
    setEditing(null)
    setForm({ name: '', description: '', icon: '' })
    setError('')
    setShowForm(true)
  }

  const openEdit = (cat: Category) => {
    setEditing(cat)
    setForm({ name: cat.name, description: cat.description || '', icon: cat.icon || '' })
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormLoading(true)
    setError('')
    try {
      if (editing) {
        await categoriesApi.update(editing.id, form)
      } else {
        await categoriesApi.create(form)
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
      await categoriesApi.delete(deleting.id)
      setDeleting(null)
      load()
    } catch { /* empty */ }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-xl">
        <h1 className="text-h2 text-white">Categorias</h1>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-gradient-to-r from-green-400 to-emerald-700 hover:from-green-300 hover:to-emerald-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 shadow-lg shadow-green-500/25"
        >
          <Plus size={18} />
          Nueva Categoria
        </button>
      </div>

      <div className="mb-lg max-w-sm">
        <SearchBar value={search} onChange={setSearch} placeholder="Buscar categorias..." />
      </div>

      <div className="glass rounded-xl">
        {loading ? (
          <div className="p-xl text-center text-text-secondary">Cargando...</div>
        ) : filtered.length === 0 ? (
          <div className="p-xl text-center text-text-secondary">No hay categorias</div>
        ) : (
          <>
            <AdminTable headers={['Nombre', 'Descripcion', 'Icono', 'Productos', 'Estado', 'Acciones']}>
              {filtered.map((cat) => (
                <TableRow key={cat.id}>
                  <TableCell className="text-white font-medium">{cat.name}</TableCell>
                  <TableCell className="text-text-secondary">{cat.description || '-'}</TableCell>
                  <TableCell className="text-text-tertiary">{cat.icon || '-'}</TableCell>
                  <TableCell>{cat.productCount}</TableCell>
                  <TableCell><StatusBadge active={cat.active} /></TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(cat)} className="text-text-secondary hover:text-primary-400 transition-colors"><Pencil size={16} /></button>
                      <button onClick={() => setDeleting(cat)} className="text-text-secondary hover:text-error transition-colors"><Trash2 size={16} /></button>
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

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editing ? 'Editar Categoria' : 'Nueva Categoria'}>
        <form onSubmit={handleSubmit} className="space-y-lg">
          {error && (
            <div className="bg-rose-500/15 border border-rose-400/30 text-rose-300 px-4 py-3 rounded-xl text-sm">{error}</div>
          )}
          <div>
            <label className="block text-text-secondary text-small mb-sm">Nombre *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              maxLength={100}
              className="w-full bg-surface-secondary border border-border rounded-md py-2.5 px-4 text-white text-sm focus:outline-none focus:border-primary-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-text-secondary text-small mb-sm">Descripcion</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full bg-surface-secondary border border-border rounded-md py-2.5 px-4 text-white text-sm focus:outline-none focus:border-primary-500 transition-colors resize-none"
            />
          </div>
          <div>
            <label className="block text-text-secondary text-small mb-sm">Icono</label>
            <input
              type="text"
              value={form.icon}
              onChange={(e) => setForm({ ...form, icon: e.target.value })}
              placeholder="ej: cable, headphones"
              className="w-full bg-surface-secondary border border-border rounded-md py-2.5 px-4 text-white text-sm focus:outline-none focus:border-primary-500 transition-colors"
            />
          </div>
          <div className="flex justify-end gap-3 pt-md">
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2.5 rounded-xl border border-white/15 text-text-secondary hover:text-white hover:bg-white/10 text-sm font-medium transition-all duration-200">Cancelar</button>
            <button type="submit" disabled={formLoading} className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-green-400 to-emerald-700 hover:from-green-300 hover:to-emerald-700 text-white text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 shadow-lg shadow-green-500/25 disabled:opacity-50 disabled:hover:translate-y-0">
              {formLoading ? 'Guardando...' : editing ? 'Guardar Cambios' : 'Crear'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        title="Desactivar Categoria"
        confirmText="Desactivar"
        message={`¿Estas seguro de desactivar "${deleting?.name}"? Los productos asociados seguiran visibles.`}
      />
    </div>
  )
}
