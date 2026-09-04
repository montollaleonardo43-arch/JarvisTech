import { useState, useEffect, useRef, useCallback } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, Search, MessageCircle, ShoppingCart } from 'lucide-react'
import { useBusinessSettings, getWhatsappUrl } from '@/shared/hooks/useBusinessSettings'
import { storeApi } from '@/features/store/services/storeApi'
import { servicesApi } from '@/features/services/services/publicServicesApi'
import { useCart } from '@/features/cart/hooks/useCart'
import type { Product, Service } from '@/shared/types'

const navLinks = [
  { name: 'Inicio', path: '/' },
  { name: 'Tienda', path: '/store' },
  { name: 'Servicios', path: '/services' },
  { name: 'Promociones', path: '/promotions' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchProducts, setSearchProducts] = useState<Product[]>([])
  const [searchServices, setSearchServices] = useState<Service[]>([])
  const [searching, setSearching] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const location = useLocation()
  const navigate = useNavigate()
  const settings = useBusinessSettings()
  const whatsappUrl = getWhatsappUrl(settings, '#')
  const { itemCount } = useCart()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsOpen(false)
    setSearchOpen(false)
    setSearchQuery('')
  }, [location])

  const openSearch = useCallback(() => {
    setSearchOpen(true)
    setTimeout(() => searchInputRef.current?.focus(), 100)
  }, [])

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query)
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current)
    if (!query.trim()) {
      setSearchProducts([])
      setSearchServices([])
      return
    }
    setSearching(true)
    searchTimerRef.current = setTimeout(() => {
      Promise.all([
        storeApi.search(query, 0, 5).then(({ data }) => data.content).catch(() => []),
        servicesApi.search(query, 0, 5).then(({ data }) => data.content).catch(() => []),
      ]).then(([products, services]) => {
        setSearchProducts(products)
        setSearchServices(services)
        setSearching(false)
      })
    }, 300)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'glass-strong h-16 shadow-level-3' : 'bg-transparent h-20'
      }`}
      style={isScrolled ? { borderLeft: 'none', borderRight: 'none', borderTop: 'none' } : undefined}
    >
      <div className="container-app h-full flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          {settings?.logoLight && (
            <img src={settings.logoLight} alt={settings.businessName || 'Logo'} className="h-10 w-auto drop-shadow" />
          )}
          {(() => {
            const name = settings?.businessName || 'Jarvis'
            const parts = name.split(' ')
            return (
              <>
                <span className="text-xl font-extrabold text-white drop-shadow">{parts[0]}</span>
                {parts.length > 1 && (
                  <span className="text-xl font-extrabold bg-gradient-to-r from-green-300 to-emerald-400 bg-clip-text text-transparent">
                    {parts.slice(1).join(' ')}
                  </span>
                )}
              </>
            )
          })()}
        </Link>

        <div className="hidden laptop:flex items-center gap-7">
          {navLinks.map((link) => {
            const active = location.pathname === link.path ||
              (link.path !== '/' && location.pathname.startsWith(link.path))
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`relative text-sm font-medium transition-all duration-200 group py-2 ${
                  active ? 'text-white' : 'text-text-secondary hover:text-white'
                }`}
              >
                {link.name}
                <span
                  className={`absolute -bottom-0.5 left-0 h-0.5 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full transition-all duration-300 ${
                    active ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </Link>
            )
          })}
        </div>

        <div className="hidden laptop:flex items-center gap-3">
          <button
            onClick={openSearch}
            className="p-2.5 text-text-secondary hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Buscar"
          >
            <Search size={20} />
          </button>
          <Link
            to="/cart"
            className="relative p-2.5 text-text-secondary hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Carrito de compras"
          >
            <ShoppingCart size={20} />
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-gradient-to-r from-green-400 to-emerald-700 text-white text-[10px] font-bold shadow shadow-green-500/40">
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            )}
          </Link>
          <Link
            to="/admin/login"
            className="text-text-tertiary hover:text-text-secondary text-caption transition-colors"
          >
            Admin
          </Link>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 shadow-lg shadow-emerald-500/25"
          >
            <MessageCircle size={18} />
            WhatsApp
          </a>
        </div>

        <div className="flex items-center gap-3 laptop:hidden">
          <Link
            to="/cart"
            className="relative text-text-secondary"
            aria-label="Carrito de compras"
          >
            <ShoppingCart size={24} />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-2 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-gradient-to-r from-green-400 to-emerald-700 text-white text-[10px] font-bold shadow">
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            )}
          </Link>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-400"
            aria-label="WhatsApp"
          >
            <MessageCircle size={24} />
          </a>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white p-1"
            aria-label="Menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="laptop:hidden glass-strong border-t border-white/10 animate-fade-up">
          <div className="container-app py-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block py-3 text-sm font-medium transition-colors ${
                  location.pathname === link.path
                    ? 'text-white'
                    : 'text-text-secondary hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link to="/admin/login" className="block py-3 text-sm font-medium text-text-tertiary">
              Admin
            </Link>
          </div>
        </div>
      )}
      {searchOpen && (
        <div className="absolute top-full left-0 right-0 glass-strong border-b border-white/10 shadow-level-3 z-50">
          <div className="container-app py-4">
            <div className="relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Buscar productos y servicios..."
                className="w-full glass-input rounded-xl py-3 pl-11 pr-10 text-white text-sm"
              />
              <button
                onClick={() => { setSearchOpen(false); setSearchQuery('') }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-white"
              >
                <X size={18} />
              </button>
            </div>
            {searchQuery.trim() && (
              <div className="mt-3 max-h-80 overflow-y-auto">
                {searching ? (
                  <p className="text-text-tertiary text-sm text-center py-4">Buscando...</p>
                ) : searchProducts.length === 0 && searchServices.length === 0 ? (
                  <p className="text-text-tertiary text-sm text-center py-4">No se encontraron resultados</p>
                ) : (
                  <div className="space-y-3">
                    {searchProducts.length > 0 && (
                      <div>
                        <p className="text-text-tertiary text-xs uppercase tracking-wide mb-2">Productos</p>
                        {searchProducts.map((product) => (
                          <button
                            key={product.id}
                            onClick={() => { navigate(`/store/${product.slug}`); setSearchOpen(false); setSearchQuery('') }}
                            className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-white/10 transition-colors text-left"
                          >
                            <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                              {product.images.length > 0 ? (
                                <img src={product.images[0]!.path} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <span className="text-text-tertiary text-xs">-</span>
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="text-white text-sm truncate">{product.name}</p>
                              <p className="text-primary-300 text-xs font-medium">
                                ${product.offerPrice?.toLocaleString() || product.price.toLocaleString()}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                    {searchServices.length > 0 && (
                      <div>
                        <p className="text-text-tertiary text-xs uppercase tracking-wide mb-2">Servicios</p>
                        {searchServices.map((service) => (
                          <button
                            key={service.id}
                            onClick={() => { navigate(`/services/${service.id}`); setSearchOpen(false); setSearchQuery('') }}
                            className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-white/10 transition-colors text-left"
                          >
                            <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                              <span className="text-primary-300 text-xs">SRV</span>
                            </div>
                            <div className="min-w-0">
                              <p className="text-white text-sm truncate">{service.name}</p>
                              {service.referencePrice && (
                                <p className="text-primary-300 text-xs font-medium">Desde ${service.referencePrice.toLocaleString()}</p>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
