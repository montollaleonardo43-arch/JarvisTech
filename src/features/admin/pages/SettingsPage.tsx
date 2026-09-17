import { useState, useEffect, useCallback } from 'react'
import { Save, AlertCircle, CheckCircle2, Plus, Trash2 } from 'lucide-react'
import { settingsApi } from '../services/settingsApi'
import SectionCard from '@/shared/components/ui/SectionCard'
import SettingsImageUploader from '../components/SettingsImageUploader'
import { invalidateBusinessSettings } from '@/shared/hooks/useBusinessSettings'
import type { BusinessSettings } from '@/shared/types'

type SettingsField = keyof BusinessSettings

export default function SettingsPage() {
  const [settings, setSettings] = useState<Partial<BusinessSettings>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)
  const [pending, setPending] = useState<Record<'logoLight' | 'heroImage', { file: File; preview: string } | null>>({
    logoLight: null,
    heroImage: null,
  })

  useEffect(() => {
    settingsApi.get().then(({ data }) => {
      setSettings(data)
      setLoading(false)
    }).catch(() => {
      setError('Error al cargar la configuracion')
      setLoading(false)
    })
  }, [])

  const handleChange = useCallback((field: SettingsField, value: string) => {
    setSettings((prev) => ({ ...prev, [field]: value }))
    setSaved(false)
    setError('')
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const payload = { ...settings }
      for (const field of ['logoLight', 'heroImage'] as const) {
        const staged = pending[field]
        if (staged) {
          const { data: res } = await settingsApi.uploadImage(field, staged.file)
          payload[field] = res.data
          setSettings((prev) => ({ ...prev, [field]: res.data }))
        }
      }
      await settingsApi.update(payload)
      setPending((prev) => {
        Object.values(prev).forEach((staged) => staged && URL.revokeObjectURL(staged.preview))
        return { logoLight: null, heroImage: null }
      })
      invalidateBusinessSettings()
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {
      setError('Error al guardar la configuracion')
    }
    setSaving(false)
  }

  const handleUploadImage = useCallback(async (field: 'logoLight' | 'heroImage', file: File) => {
    const preview = URL.createObjectURL(file)
    setPending((prev) => {
      const old = prev[field]
      if (old) URL.revokeObjectURL(old.preview)
      return { ...prev, [field]: { file, preview } }
    })
    setSaved(false)
    setError('')
  }, [])

  const handleRemoveImage = useCallback((field: 'logoLight' | 'heroImage') => {
    const staged = pending[field]
    if (staged) {
      URL.revokeObjectURL(staged.preview)
      setPending((prev) => ({ ...prev, [field]: null }))
    } else {
      setSettings((prev) => ({ ...prev, [field]: null }))
    }
    setSaved(false)
    setError('')
  }, [pending])

  const handleBenefitChange = useCallback((index: number, field: 'title' | 'description', value: string) => {
    setSettings((prev) => {
      const current = Array.isArray(prev.benefits) ? prev.benefits : []
      const next = current.map((b, i) => (i === index ? { ...b, [field]: value } : b))
      return { ...prev, benefits: next }
    })
    setSaved(false)
    setError('')
  }, [])

  const handleAddBenefit = useCallback(() => {
    setSettings((prev) => ({
      ...prev,
      benefits: [...(Array.isArray(prev.benefits) ? prev.benefits : []), { title: '', description: '' }],
    }))
    setSaved(false)
    setError('')
  }, [])

  const handleRemoveBenefit = useCallback((index: number) => {
    setSettings((prev) => ({
      ...prev,
      benefits: (Array.isArray(prev.benefits) ? prev.benefits : []).filter((_, i) => i !== index),
    }))
    setSaved(false)
    setError('')
  }, [])

  const inputClass = "w-full glass-input rounded-xl py-2.5 px-4 text-white text-sm"
  const labelClass = "block text-text-secondary text-small mb-sm"

  if (loading) {
    return (
      <div className="flex items-center justify-center py-3xl">
        <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-xl">
        <div>
          <h1 className="text-h2 text-white">Configuracion del Negocio</h1>
          <p className="text-text-secondary text-body mt-1">Administra la informacion de tu negocio</p>
        </div>
        <div className="flex items-center gap-3">
          {error && (
            <span className="flex items-center gap-1.5 text-error text-small">
              <AlertCircle size={14} />
              {error}
            </span>
          )}
          {saved && (
            <span className="flex items-center gap-1.5 text-emerald-300 text-small">
              <CheckCircle2 size={14} />
              Guardado exitosamente
            </span>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-xl">
        <SectionCard title="Logo del Sitio" description="Logo que se muestra en el navbar y pie de pagina">
          <SettingsImageUploader
            label="Logo"
            currentUrl={pending.logoLight?.preview ?? (settings.logoLight || null)}
            onUpload={(file) => handleUploadImage('logoLight', file)}
            onRemove={() => handleRemoveImage('logoLight')}
          />
        </SectionCard>

        <SectionCard title="Hero del Sitio" description="Contenido que se muestra en la parte superior del sitio">
          <div className="mb-lg">
            <label className={labelClass}>Descripcion del Hero</label>
            <textarea
              value={settings.heroDescription || ''}
              onChange={(e) => handleChange('heroDescription', e.target.value)}
              rows={3}
              placeholder="Reparación profesional de dispositivos electrónicos..."
              className={`${inputClass} resize-none`}
            />
          </div>
          <SettingsImageUploader
            label="Imagen del Hero"
            currentUrl={pending.heroImage?.preview ?? (settings.heroImage || null)}
            onUpload={(file) => handleUploadImage('heroImage', file)}
            onRemove={() => handleRemoveImage('heroImage')}
          />
        </SectionCard>

        <SectionCard title="¿Por qué elegirnos?" description="Los beneficios que se muestran en la seccion principal del sitio">
          <div className="space-y-lg">
            {(Array.isArray(settings.benefits) ? settings.benefits : []).map((benefit, i) => (
              <div key={i} className="glass rounded-xl p-md">
                <div className="flex items-center justify-between mb-md">
                  <span className="text-text-secondary text-small">Beneficio {i + 1}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveBenefit(i)}
                    className="text-error hover:text-error/80 text-xs font-medium transition-colors flex items-center gap-1"
                  >
                    <Trash2 size={14} />
                    Quitar
                  </button>
                </div>
                <div className="grid grid-cols-1 tablet:grid-cols-2 gap-md">
                  <div>
                    <label className={labelClass}>Titulo</label>
                    <input
                      type="text"
                      value={benefit.title}
                      onChange={(e) => handleBenefitChange(i, 'title', e.target.value)}
                      placeholder="Diagnostico honesto"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Descripcion</label>
                    <textarea
                      value={benefit.description}
                      onChange={(e) => handleBenefitChange(i, 'description', e.target.value)}
                      rows={2}
                      placeholder="Explicamos el problema antes de cualquier reparacion..."
                      className={`${inputClass} resize-none`}
                    />
                  </div>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddBenefit}
              className="flex items-center gap-2 glass hover:bg-white/10 text-white text-sm px-4 py-2.5 rounded-xl transition-colors"
            >
              <Plus size={16} />
              Agregar beneficio
            </button>
            <p className="text-text-tertiary text-caption">
              Los iconos se asignan automaticamente en el sitio. Si dejas la lista vacia se usan los beneficios por defecto.
            </p>
          </div>
        </SectionCard>

        <SectionCard title="Informacion General" description="Datos principales de tu negocio">
          <div className="grid grid-cols-1 tablet:grid-cols-2 gap-lg">
            <div>
              <label className={labelClass}>Nombre del Negocio</label>
              <input type="text" value={settings.businessName || ''} onChange={(e) => handleChange('businessName', e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Slogan</label>
              <input type="text" value={settings.slogan || ''} onChange={(e) => handleChange('slogan', e.target.value)} className={inputClass} />
            </div>
          </div>
          <div className="mt-lg">
            <label className={labelClass}>Mision</label>
            <textarea value={settings.mission || ''} onChange={(e) => handleChange('mission', e.target.value)} rows={3} className={`${inputClass} resize-none`} />
          </div>
          <div className="mt-lg">
            <label className={labelClass}>Vision</label>
            <textarea value={settings.vision || ''} onChange={(e) => handleChange('vision', e.target.value)} rows={3} className={`${inputClass} resize-none`} />
          </div>
        </SectionCard>

        <SectionCard title="Contacto y Ubicacion" description="Datos de contacto, direccion y horarios de atencion">
          <div className="grid grid-cols-1 tablet:grid-cols-3 gap-lg">
            <div>
              <label className={labelClass}>Telefono</label>
              <input type="text" value={settings.phone || ''} onChange={(e) => handleChange('phone', e.target.value)} placeholder="+56 9 1234 5678" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>WhatsApp</label>
              <input type="text" value={settings.whatsapp || ''} onChange={(e) => handleChange('whatsapp', e.target.value)} placeholder="56912345678" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <input type="email" value={settings.email || ''} onChange={(e) => handleChange('email', e.target.value)} placeholder="contacto@empresa.cl" className={inputClass} />
            </div>
          </div>
          <div className="mt-lg mb-lg">
            <label className={labelClass}>Direccion</label>
            <input type="text" value={settings.address || ''} onChange={(e) => handleChange('address', e.target.value)} className={inputClass} />
          </div>
          <div className="mb-lg">
            <label className={labelClass}>Link Google Maps (opcional)</label>
            <input type="text" value={settings.googleMaps || ''} onChange={(e) => handleChange('googleMaps', e.target.value)} placeholder="Pega aqui el URL de embed de Google Maps" className={inputClass} />
            <p className="text-text-tertiary text-caption mt-1">Si lo dejas vacio, el mapa se genera automaticamente desde la direccion.</p>
          </div>
          <div className="grid grid-cols-1 tablet:grid-cols-3 gap-lg">
            <div>
              <label className={labelClass}>Lunes a Viernes</label>
              <input type="text" value={settings.weekdaySchedule || ''} onChange={(e) => handleChange('weekdaySchedule', e.target.value)} placeholder="10:00 - 19:00" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Sabado</label>
              <input type="text" value={settings.saturdaySchedule || ''} onChange={(e) => handleChange('saturdaySchedule', e.target.value)} placeholder="10:00 - 14:00" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Domingo</label>
              <input type="text" value={settings.sundaySchedule || ''} onChange={(e) => handleChange('sundaySchedule', e.target.value)} placeholder="Cerrado" className={inputClass} />
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Redes Sociales" description="Links a tus redes sociales">
          <div className="grid grid-cols-1 tablet:grid-cols-2 gap-lg">
            <div>
              <label className={labelClass}>Instagram</label>
              <input type="text" value={settings.instagram || ''} onChange={(e) => handleChange('instagram', e.target.value)} placeholder="https://instagram.com/..." className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Facebook</label>
              <input type="text" value={settings.facebook || ''} onChange={(e) => handleChange('facebook', e.target.value)} placeholder="https://facebook.com/..." className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>TikTok</label>
              <input type="text" value={settings.tiktok || ''} onChange={(e) => handleChange('tiktok', e.target.value)} placeholder="https://tiktok.com/..." className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>YouTube</label>
              <input type="text" value={settings.youtube || ''} onChange={(e) => handleChange('youtube', e.target.value)} placeholder="https://youtube.com/..." className={inputClass} />
            </div>
          </div>
        </SectionCard>

        <div className="flex justify-end">
          <button type="submit" disabled={saving} className="flex items-center gap-2 bg-gradient-to-r from-green-400 to-emerald-700 hover:from-green-300 hover:to-emerald-700 text-white px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 shadow-lg shadow-green-500/25 disabled:opacity-50 disabled:hover:translate-y-0">
            <Save size={18} />
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </form>
    </div>
  )
}
