import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, ShoppingCart, Check, PackageOpen } from 'lucide-react'
import { storeApi } from '../services/storeApi'
import { useCart } from '@/features/cart/hooks/useCart'
import { useRevealOnScroll } from '@/shared/hooks/useRevealOnScroll'
import type { Product } from '@/shared/types'

export default function StorePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [addingId, setAddingId] = useState<number | null>(null)
  const [justAddedId, setJustAddedId] = useState<number | null>(null)
  const { addItem } = useCart()
  useRevealOnScroll([products.length, loading])

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const res = search
          ? await storeApi.search(search, page)
          : await storeApi.getAll(page)
        setProducts(res.data.content)
        setTotalPages(res.data.totalPages)
      } catch { /* empty */ }
      setLoading(false)
    }
    load()
  }, [page, search])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(0)
    setSearch(searchInput)
  }

  const handleAdd = async (product: Product) => {
    setAddingId(product.id)
    try {
      await addItem(product.id, 1)
      setJustAddedId(product.id)
      window.setTimeout(() => {
        setJustAddedId((prev) => (prev === product.id ? null : prev))
      }, 1500)
    } catch { /* empty */ }
    setAddingId(null)
  }

  return (
    <div className="pt-24">
      <section className="section-spacing">
        <div className="container-app">
          <div className="mb-xl reveal">
            <h1 className="text-h1 text-white mb-md">Tienda</h1>
            <p className="text-text-secondary text-body-large max-w-2xl">
              Encuentra los mejores accesorios y dispositivos tecnológicos con la mejor calidad y garantía.
            </p>
          </div>

          <form onSubmit={handleSearch} className="mb-xl max-w-md">
            <div className="relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Buscar productos..."
                className="w-full glass glass-input rounded-xl py-3 pl-12 pr-4 text-white text-sm"
              />
              <button type="submit" className="hidden">Buscar</button>
            </div>
          </form>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-lg">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="glass rounded-xl overflow-hidden animate-pulse">
                  <div className="w-full h-48 bg-white/10" />
                  <div className="p-md space-y-sm">
                    <div className="h-4 bg-white/10 rounded w-3/4" />
                    <div className="h-3 bg-white/10 rounded w-1/2" />
                    <div className="h-5 bg-white/10 rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-2xl glass rounded-xl">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-2xl mb-md">
                <PackageOpen size={28} className="text-text-tertiary" />
              </div>
              <p className="text-text-secondary text-body-large">No se encontraron productos.</p>
              {search && (
                <button onClick={() => { setSearchInput(''); setSearch(''); setPage(0) }} className="mt-md text-primary-300 hover:text-white text-sm font-medium transition-colors">
                  Limpiar búsqueda
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-lg">
                {products.map((product, i) => (
                  <div
                    key={product.id}
                    data-delay={(i % 4) + 1}
                    className="reveal group glass rounded-xl overflow-hidden hover:border-white/25 hover:-translate-y-1.5 transition-all duration-300 flex flex-col"
                  >
                    <Link to={`/store/${product.slug}`} className="block flex-1">
                      <div className="w-full h-48 bg-white/5 flex items-center justify-center overflow-hidden">
                        {product.images.length > 0 ? (
                          <img
                            src={product.images[0]!.path}
                            alt={product.images[0]!.altText || product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <span className="text-text-tertiary text-small">Sin imagen</span>
                        )}
                      </div>
                      <div className="p-md pb-0">
                        <p className="text-text-tertiary text-xs mb-sm uppercase tracking-wide">{product.category.name}</p>
                        <h3 className="text-h5 text-white mb-sm line-clamp-2 group-hover:text-primary-300 transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-text-secondary text-xs mb-md line-clamp-2">{product.shortDescription}</p>
                      </div>
                    </Link>
                    <div className="p-md flex items-center justify-between gap-2">
                      <div className="flex flex-col">
                        {product.offerPrice ? (
                          <>
                            <span className="text-primary-300 font-semibold">${product.offerPrice.toLocaleString()}</span>
                            <span className="text-text-tertiary text-xs line-through">${product.price.toLocaleString()}</span>
                          </>
                        ) : (
                          <span className="text-primary-300 font-semibold">${product.price.toLocaleString()}</span>
                        )}
                      </div>
                      <button
                        onClick={() => handleAdd(product)}
                        disabled={addingId === product.id || product.stock <= 0}
                        className={`flex items-center gap-1.5 text-white text-sm font-medium px-4 py-2 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                          justAddedId === product.id
                            ? 'bg-emerald-500 shadow shadow-emerald-500/25'
                            : 'bg-gradient-to-r from-green-400 to-emerald-700 hover:from-green-300 hover:to-emerald-700 shadow shadow-green-500/25'
                        }`}
                        aria-label={`Agregar ${product.name} al carrito`}
                      >
                        {justAddedId === product.id ? (
                          <Check size={16} />
                        ) : (
                          <ShoppingCart size={16} />
                        )}
                        {product.stock <= 0 ? 'Sin stock' : justAddedId === product.id ? 'Agregado' : 'Agregar'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-xl">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i)}
                      className={`w-10 h-10 rounded-xl text-sm font-medium transition-all duration-200 ${
                        page === i
                          ? 'bg-gradient-to-r from-green-400 to-emerald-700 text-white shadow shadow-green-500/25'
                          : 'glass text-text-secondary hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  )
}
