import { useState, useEffect } from 'react'
import { useAuth } from '../../auth/hooks/useAuth'
import { Package, Wrench, Tags, Award, Megaphone } from 'lucide-react'
import api from '@/shared/services/api'

interface Stats {
  products: number
  services: number
  categories: number
  brands: number
  promotions: number
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState<Stats>({ products: 0, services: 0, categories: 0, brands: 0, promotions: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [prodRes, svcRes, catRes, brandRes, promoRes] = await Promise.all([
          api.get('/products', { params: { page: 0, size: 1 } }),
          api.get('/services', { params: { page: 0, size: 1 } }),
          api.get('/categories', { params: { page: 0, size: 1 } }),
          api.get('/brands', { params: { page: 0, size: 1 } }),
          api.get('/promotions', { params: { page: 0, size: 1 } }),
        ])
        setStats({
          products: prodRes.data.totalElements || 0,
          services: svcRes.data.totalElements || 0,
          categories: catRes.data.totalElements || 0,
          brands: brandRes.data.totalElements || 0,
          promotions: promoRes.data.totalElements || 0,
        })
      } catch {
        setError(true)
      }
      setLoading(false)
    }
    loadStats()
  }, [])

  const cards = [
    { name: 'Productos', value: stats.products, icon: Package, color: 'text-green-400', bg: 'bg-green-400/10' },
    { name: 'Servicios', value: stats.services, icon: Wrench, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { name: 'Categorias', value: stats.categories, icon: Tags, color: 'text-lime-400', bg: 'bg-lime-400/10' },
    { name: 'Marcas', value: stats.brands, icon: Award, color: 'text-teal-400', bg: 'bg-teal-400/10' },
    { name: 'Promociones', value: stats.promotions, icon: Megaphone, color: 'text-green-300', bg: 'bg-green-300/10' },
  ]

  return (
    <div>
      <div className="mb-xl">
        <h1 className="text-h2 text-white mb-sm">
          Bienvenido, {user?.name}
        </h1>
        <p className="text-text-secondary">
          Panel de administracion de Jarvis Technology
        </p>
      </div>

      {error && (
        <div className="bg-rose-500/15 border border-rose-400/30 text-rose-300 px-4 py-3 rounded-xl text-sm mb-xl">
          Error al cargar las estadisticas. Verifica que el servidor este activo.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-lg">
        {cards.map((card) => (
          <div key={card.name} className="glass rounded-xl p-lg hover:-translate-y-1 hover:border-white/25 transition-all duration-200">
            <div className={`inline-flex items-center justify-center w-12 h-12 ${card.bg} border border-white/15 rounded-xl mb-md`}>
              <card.icon size={24} className={card.color} />
            </div>
            <p className="text-h3 text-white">
              {loading ? (
                <span className="inline-block w-12 h-8 bg-white/10 rounded animate-pulse" />
              ) : (
                card.value
              )}
            </p>
            <p className="text-text-secondary text-small">{card.name}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
