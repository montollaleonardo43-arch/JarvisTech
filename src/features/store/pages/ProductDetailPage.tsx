import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Shield, Truck, Clock, MessageCircle, ShoppingCart, Check, Minus, Plus } from 'lucide-react'
import { storeApi } from '../services/storeApi'
import { useBusinessSettings, getWhatsappUrl } from '@/shared/hooks/useBusinessSettings'
import { useCart } from '@/features/cart/hooks/useCart'
import { useRevealOnScroll } from '@/shared/hooks/useRevealOnScroll'
import type { Product } from '@/shared/types'

export default function ProductDetailPage() {
  const { slug } = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [adding, setAdding] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const settings = useBusinessSettings()
  const whatsappUrl = getWhatsappUrl(settings)
  const { addItem } = useCart()
  useRevealOnScroll([product !== null])

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    storeApi.getBySlug(slug)
      .then(({ data }) => {
        setProduct(data)
        setQuantity(1)
        setFeedback(null)
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false))
  }, [slug])

  const handleAddToCart = async () => {
    if (!product) return
    setAdding(true)
    setFeedback(null)
    try {
      await addItem(product.id, quantity)
      setFeedback({ type: 'success', message: `${quantity} unidad${quantity > 1 ? 'es' : ''} agregada${quantity > 1 ? 's' : ''} al carrito` })
      window.setTimeout(() => setFeedback(null), 3000)
    } catch (err) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'No se pudo agregar el producto al carrito'
      setFeedback({ type: 'error', message })
    } finally {
      setAdding(false)
    }
  }

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
                  <div className="h-12 bg-white/10 rounded w-1/3" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="pt-24">
        <section className="section-spacing">
          <div className="container-app text-center">
            <h1 className="text-h2 text-white mb-lg">Producto no encontrado</h1>
            <Link to="/store" className="text-primary-300 hover:text-white text-sm">Volver a la tienda</Link>
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
            to="/store"
            className="inline-flex items-center gap-2 text-text-secondary hover:text-white mb-xl transition-colors"
          >
            <ArrowLeft size={18} />
            Volver a la tienda
          </Link>

          <div className="grid grid-cols-1 laptop:grid-cols-2 gap-xl reveal">
            <div>
              <div className="glass rounded-xl h-96 flex items-center justify-center overflow-hidden mb-md">
                {product.images.length > 0 ? (
                  <img
                    src={product.images[selectedImage]?.path}
                    alt={product.images[selectedImage]?.altText || product.name}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <span className="text-text-tertiary">Sin imagen</span>
                )}
              </div>
              {product.images.length > 1 && (
                <div className="flex gap-2">
                  {product.images.map((img, i) => (
                    <button
                      key={img.id}
                      onClick={() => setSelectedImage(i)}
                      className={`w-16 h-16 glass rounded-xl overflow-hidden transition-all ${
                        selectedImage === i ? 'border-primary-400 ring-1 ring-primary-400/40' : 'hover:border-white/25'
                      }`}
                    >
                      <img src={img.path} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <p className="text-text-tertiary text-xs mb-sm uppercase tracking-wide">{product.brand.name}</p>
              <h1 className="text-h1 text-white mb-md">{product.name}</h1>

              <div className="flex items-baseline gap-3 mb-lg">
                {product.offerPrice ? (
                  <>
                    <span className="text-h2 text-primary-300">${product.offerPrice.toLocaleString()}</span>
                    <span className="text-text-tertiary text-body-large line-through">${product.price.toLocaleString()}</span>
                  </>
                ) : (
                  <span className="text-h2 text-primary-300">${product.price.toLocaleString()}</span>
                )}
              </div>

              <p className="text-text-secondary mb-lg leading-relaxed">{product.description || product.shortDescription}</p>

              <div className="glass rounded-xl p-md mb-lg space-y-sm">
                <div className="flex items-center gap-3 text-sm text-text-secondary">
                  <Shield size={16} className="text-primary-300" />
                  <span>{product.warranty || 'Garantía del producto'}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-text-secondary">
                  <Truck size={16} className="text-primary-300" />
                  <span>Despacho a todo Chile</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-text-secondary">
                  <Clock size={16} className="text-primary-300" />
                  <span>Stock: {product.stock} unidades</span>
                </div>
              </div>

              <p className="text-text-tertiary text-xs mb-lg">SKU: {product.sku}</p>

              {feedback && (
                <div
                  className={`flex items-center gap-2 rounded-xl px-md py-sm text-sm mb-md animate-fade-up ${
                    feedback.type === 'success'
                      ? 'bg-emerald-500/15 border border-emerald-400/30 text-emerald-300'
                      : 'bg-rose-500/15 border border-rose-400/30 text-rose-300'
                  }`}
                >
                  {feedback.type === 'success' && <Check size={16} />}
                  {feedback.message}
                </div>
              )}

              <div className="flex items-center gap-2 mb-lg">
                <span className="text-text-secondary text-sm mr-2">Cantidad</span>
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  className="w-9 h-9 flex items-center justify-center rounded-xl glass text-text-secondary hover:text-white hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  aria-label="Disminuir cantidad"
                >
                  <Minus size={16} />
                </button>
                <input
                  type="number"
                  min={1}
                  max={product.stock}
                  value={quantity}
                  onChange={(e) => {
                    const parsed = parseInt(e.target.value, 10)
                    setQuantity(isNaN(parsed) ? 1 : Math.max(1, Math.min(parsed, product.stock)))
                  }}
                  className="w-14 text-center glass-input rounded-xl py-2 text-white text-sm"
                  aria-label="Cantidad"
                />
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  disabled={quantity >= product.stock}
                  className="w-9 h-9 flex items-center justify-center rounded-xl glass text-text-secondary hover:text-white hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  aria-label="Aumentar cantidad"
                >
                  <Plus size={16} />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={adding || product.stock <= 0}
                className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-green-400 to-emerald-700 hover:from-green-300 hover:to-emerald-700 text-white py-3.5 px-8 rounded-xl font-medium transition-all duration-200 hover:-translate-y-0.5 shadow-lg shadow-green-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 mb-md"
              >
                <ShoppingCart size={20} />
                {product.stock <= 0 ? 'Sin stock' : adding ? 'Agregando...' : 'Agregar al carrito'}
              </button>

              {whatsappUrl && (
                <a
                  href={`${whatsappUrl}?text=${encodeURIComponent(`Hola, me interesa el producto "${product.name}" (SKU: ${product.sku}). Quisiera más información.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-white py-3.5 px-8 rounded-xl font-medium transition-all duration-200 hover:-translate-y-0.5 shadow-lg shadow-emerald-500/25"
                >
                  <MessageCircle size={20} />
                  Consultar por WhatsApp
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
