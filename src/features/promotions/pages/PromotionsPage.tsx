import { useState, useEffect } from 'react'
import { Tag, Calendar, Package, Wrench, Sparkles } from 'lucide-react'
import { promotionsApi } from '../services/publicPromotionsApi'
import { useRevealOnScroll } from '@/shared/hooks/useRevealOnScroll'
import type { Promotion } from '@/shared/types'

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [loading, setLoading] = useState(true)
  useRevealOnScroll([promotions.length, loading])

  useEffect(() => {
    promotionsApi.getCurrent(0, 20)
      .then(({ data }) => setPromotions(data.content))
      .catch(() => setPromotions([]))
      .finally(() => setLoading(false))
  }, [])

  const formatDate = (d: string) => new Date(d).toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div className="pt-24">
      <section className="section-spacing">
        <div className="container-app">
          <div className="mb-xl max-w-2xl reveal">
            <h1 className="text-h1 text-white mb-md">Promociones</h1>
            <p className="text-text-secondary text-body-large">
              Aprovecha nuestras ofertas especiales en servicios de reparación y productos de tecnología.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-lg">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="glass rounded-xl p-lg animate-pulse">
                  <div className="h-6 bg-white/10 rounded w-1/3 mb-md" />
                  <div className="h-4 bg-white/10 rounded w-3/4 mb-sm" />
                  <div className="h-4 bg-white/10 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : promotions.length === 0 ? (
            <div className="text-center py-2xl glass rounded-xl">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-lg">
                <Tag size={32} className="text-text-tertiary" />
              </div>
              <h2 className="text-h3 text-white mb-sm">No hay promociones activas</h2>
              <p className="text-text-secondary">Vuelve pronto para descubrir nuestras ofertas.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-lg">
              {promotions.map((promo, i) => (
                <div
                  key={promo.id}
                  data-delay={(i % 3) + 1}
                  className="reveal glass rounded-xl overflow-hidden hover:border-white/25 hover:-translate-y-1.5 transition-all duration-300"
                >
                  <div className="h-2 bg-gradient-to-r from-green-500 via-emerald-500 to-green-400" />
                  <div className="p-lg">
                    <div className="flex items-start justify-between mb-md">
                      <div>
                        {promo.promotionType && (
                          <span className="inline-flex items-center gap-1 bg-gradient-to-r from-green-500/25 to-emerald-700/25 text-primary-200 text-xs font-medium px-2.5 py-1 rounded-full mb-sm border border-white/15">
                            <Sparkles size={12} />
                            {promo.promotionType}
                          </span>
                        )}
                        <h3 className="text-h4 text-white">{promo.title}</h3>
                      </div>
                    </div>

                    {promo.description && (
                      <p className="text-text-secondary text-sm mb-lg leading-relaxed">
                        {promo.description}
                      </p>
                    )}

                    <div className="flex flex-col gap-sm text-xs text-text-tertiary">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-primary-300" />
                        <span>{formatDate(promo.startDate)} - {formatDate(promo.endDate)}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        {promo.productCount > 0 && (
                          <div className="flex items-center gap-2">
                            <Package size={14} className="text-primary-300" />
                            <span>{promo.productCount} productos</span>
                          </div>
                        )}
                        {promo.serviceCount > 0 && (
                          <div className="flex items-center gap-2">
                            <Wrench size={14} className="text-primary-300" />
                            <span>{promo.serviceCount} servicios</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
