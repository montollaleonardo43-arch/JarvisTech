import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Clock, Shield, CheckCircle, Wrench } from 'lucide-react'
import { servicesApi } from '../services/publicServicesApi'
import { useRevealOnScroll } from '@/shared/hooks/useRevealOnScroll'
import type { Service } from '@/shared/types'

export default function ServiceDetailPage() {
  const { id } = useParams()
  const [service, setService] = useState<Service | null>(null)
  const [loading, setLoading] = useState(true)
  useRevealOnScroll([service !== null])

  useEffect(() => {
    if (!id) return
    setLoading(true)
    servicesApi.getById(Number(id))
      .then(({ data }) => setService(data))
      .catch(() => setService(null))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="pt-24">
        <section className="section-spacing">
          <div className="container-app">
            <div className="animate-pulse space-y-lg">
              <div className="h-4 bg-white/10 rounded w-32" />
              <div className="grid grid-cols-1 laptop:grid-cols-2 gap-xl">
                <div className="h-96 bg-white/10 rounded-xl" />
                <div className="space-y-md">
                  <div className="h-8 bg-white/10 rounded w-3/4" />
                  <div className="h-4 bg-white/10 rounded w-1/2" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }

  if (!service) {
    return (
      <div className="pt-24">
        <section className="section-spacing">
          <div className="container-app text-center">
            <h1 className="text-h2 text-white mb-lg">Servicio no encontrado</h1>
            <Link to="/services" className="text-primary-300 hover:text-white text-sm">Volver a servicios</Link>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="pt-24">
      <section className="section-spacing">
        <div className="container-app">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 text-text-secondary hover:text-white mb-xl transition-colors"
          >
            <ArrowLeft size={18} />
            Volver a servicios
          </Link>

          <div className="grid grid-cols-1 laptop:grid-cols-2 gap-xl reveal">
            <div>
              <div className="glass rounded-xl h-96 flex items-center justify-center overflow-hidden">
                {service.images.length > 0 ? (
                  <img
                    src={service.images[0]!.path}
                    alt={service.images[0]!.altText || service.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-tr from-green-500/30 to-emerald-700/30 border border-white/15 rounded-2xl flex items-center justify-center mx-auto mb-md">
                      <Wrench size={28} className="text-primary-300" />
                    </div>
                    <span className="text-text-tertiary text-small">{service.name}</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <p className="text-primary-300 text-xs mb-sm uppercase tracking-wide font-medium">
                {service.serviceCategory.name}
              </p>
              <h1 className="text-h1 text-white mb-md">{service.name}</h1>

              {service.referencePrice && (
                <div className="mb-lg">
                  <span className="text-h2 text-primary-300">Desde ${service.referencePrice.toLocaleString()}</span>
                </div>
              )}

              <p className="text-text-secondary mb-lg leading-relaxed">{service.description}</p>

              <div className="glass rounded-xl p-lg mb-lg space-y-md">
                {service.estimatedTime && (
                  <div className="flex items-center gap-3 text-sm">
                    <Clock size={18} className="text-primary-300" />
                    <div>
                      <span className="text-text-tertiary">Tiempo estimado: </span>
                      <span className="text-white">{service.estimatedTime}</span>
                    </div>
                  </div>
                )}
                {service.warranty && (
                  <div className="flex items-center gap-3 text-sm">
                    <Shield size={18} className="text-primary-300" />
                    <div>
                      <span className="text-text-tertiary">Garantía: </span>
                      <span className="text-white">{service.warranty}</span>
                    </div>
                  </div>
                )}
                {service.requiresDiagnosis && (
                  <div className="flex items-center gap-3 text-sm">
                    <CheckCircle size={18} className="text-emerald-400" />
                    <span className="text-white">Requiere diagnóstico previo</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
