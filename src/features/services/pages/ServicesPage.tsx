import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Wrench, Clock, Shield, ArrowRight } from 'lucide-react'
import { servicesApi } from '../services/publicServicesApi'
import { useRevealOnScroll } from '@/shared/hooks/useRevealOnScroll'
import type { Service } from '@/shared/types'

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  useRevealOnScroll([services.length, loading])

  useEffect(() => {
    servicesApi.getAll(0, 20)
      .then(({ data }) => setServices(data.content))
      .catch(() => setServices([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="pt-24">
      <section className="section-spacing">
        <div className="container-app">
          <div className="mb-xl max-w-2xl reveal">
            <h1 className="text-h1 text-white mb-md">Servicios</h1>
            <p className="text-text-secondary text-body-large">
              Reparaciones profesionales con garantía y transparencia. Diagnósticos gratuitos y presupuestos sin compromiso.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-lg">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="glass rounded-xl p-lg animate-pulse">
                  <div className="w-12 h-12 bg-white/10 rounded-xl mb-md" />
                  <div className="h-5 bg-white/10 rounded w-3/4 mb-sm" />
                  <div className="h-4 bg-white/10 rounded w-full mb-sm" />
                  <div className="h-4 bg-white/10 rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-2xl glass rounded-xl">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-2xl mx-auto mb-md">
                <Wrench size={28} className="text-text-tertiary" />
              </div>
              <p className="text-text-secondary text-body-large">No hay servicios disponibles aún.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-lg">
                {services.map((service, i) => (
                  <Link
                    key={service.id}
                    to={`/services/${service.id}`}
                    data-delay={(i % 4) + 1}
                    className="reveal group glass rounded-xl p-lg hover:border-white/25 hover:-translate-y-1.5 transition-all duration-300"
                  >
                  <div className="w-12 h-12 bg-gradient-to-tr from-green-500/30 to-emerald-700/30 border border-white/15 rounded-xl flex items-center justify-center mb-md">
                    <Wrench size={24} className="text-primary-300" />
                  </div>
                  <h3 className="text-h5 text-white mb-sm group-hover:text-primary-300 transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-text-secondary text-small mb-md line-clamp-3">
                    {service.description}
                  </p>
                  <div className="flex flex-col gap-sm text-xs text-text-tertiary mb-md">
                    {service.estimatedTime && (
                      <div className="flex items-center gap-2">
                        <Clock size={14} />
                        <span>{service.estimatedTime}</span>
                      </div>
                    )}
                    {service.warranty && (
                      <div className="flex items-center gap-2">
                        <Shield size={14} />
                        <span>{service.warranty}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    {service.referencePrice && (
                      <span className="text-primary-300 font-semibold">
                        Desde ${service.referencePrice.toLocaleString()}
                      </span>
                    )}
                    <ArrowRight size={16} className="text-text-tertiary group-hover:text-primary-300 group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
