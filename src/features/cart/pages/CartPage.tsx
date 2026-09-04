import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Minus, Plus, ShoppingCart, Trash2, ArrowLeft, ShoppingBag, MessageCircle, ShieldCheck } from 'lucide-react'
import { useCart } from '../hooks/useCart'
import { useBusinessSettings, getWhatsappUrl } from '@/shared/hooks/useBusinessSettings'
import { useRevealOnScroll } from '@/shared/hooks/useRevealOnScroll'
import ConfirmDialog from '@/features/admin/components/ConfirmDialog'
import type { CartItem } from '@/shared/types'

function getErrorMessage(err: unknown, fallback: string): string {
  return (err as { response?: { data?: { message?: string } } })?.response?.data?.message || fallback
}

interface ItemRowProps {
  item: CartItem
  updating: boolean
  onUpdate: (quantity: number) => void
  onRemove: () => void
}

function ItemRow({ item, updating, onUpdate, onRemove }: ItemRowProps) {
  const [value, setValue] = useState(String(item.quantity))

  const commit = (raw: string) => {
    const parsed = parseInt(raw, 10)
    if (isNaN(parsed) || parsed < 1) {
      setValue(String(item.quantity))
      return
    }
    const quantity = Math.min(parsed, item.stock)
    setValue(String(quantity))
    if (quantity !== item.quantity) onUpdate(quantity)
  }

  return (
    <div className="glass rounded-xl p-md flex gap-md hover:border-white/25 transition-colors">
      <Link
        to={`/store/${item.slug}`}
        className="w-20 h-20 md:w-24 md:h-24 flex-shrink-0 rounded-xl overflow-hidden bg-white/5 flex items-center justify-center border border-white/10"
      >
        {item.image ? (
          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <ShoppingCart size={24} className="text-text-tertiary" />
        )}
      </Link>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-text-tertiary text-xs mb-sm uppercase tracking-wide">{item.brand}</p>
            <Link
              to={`/store/${item.slug}`}
              className="text-h5 text-white mb-sm block truncate hover:text-primary-300 transition-colors"
            >
              {item.name}
            </Link>
            <p className="text-text-tertiary text-xs">SKU: {item.sku}</p>
          </div>
          <button
            onClick={onRemove}
            disabled={updating}
            className="text-text-tertiary hover:text-error transition-colors p-1 disabled:opacity-40"
            aria-label="Eliminar producto"
          >
            <Trash2 size={18} />
          </button>
        </div>

        <div className="mt-md flex flex-wrap items-end justify-between gap-md">
          <div className="flex items-center gap-2">
            <button
              onClick={() => commit(String(item.quantity - 1))}
              disabled={updating || item.quantity <= 1}
              className="w-8 h-8 flex items-center justify-center rounded-xl glass text-text-secondary hover:text-white hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Disminuir cantidad"
            >
              <Minus size={16} />
            </button>
            <input
              type="number"
              min={1}
              max={item.stock}
              value={value}
              disabled={updating}
              onChange={(e) => setValue(e.target.value)}
              onBlur={(e) => commit(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') (e.target as HTMLInputElement).blur()
              }}
              className="w-14 text-center glass-input rounded-xl py-1.5 text-white text-sm"
              aria-label="Cantidad"
            />
            <button
              onClick={() => commit(String(item.quantity + 1))}
              disabled={updating || item.quantity >= item.stock}
              className="w-8 h-8 flex items-center justify-center rounded-xl glass text-text-secondary hover:text-white hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Aumentar cantidad"
            >
              <Plus size={16} />
            </button>
          </div>
          <div className="text-right">
            <p className="text-text-tertiary text-xs mb-sm">
              Precio unitario: ${item.unitPrice.toLocaleString()}
            </p>
            <p className="text-white font-semibold">Subtotal: ${item.subtotal.toLocaleString()}</p>
          </div>
        </div>

        {item.quantity >= item.stock && (
          <p className="text-xs text-warning mt-sm">Stock máximo disponible: {item.stock} unidades</p>
        )}
      </div>
    </div>
  )
}

export default function CartPage() {
  const { cart, loading, itemCount, updateQuantity, removeItem, clearCart } = useCart()
  const settings = useBusinessSettings()
  const whatsappUrl = getWhatsappUrl(settings)
  const [updatingItemId, setUpdatingItemId] = useState<number | null>(null)
  const [itemError, setItemError] = useState<string | null>(null)
  const [confirmClear, setConfirmClear] = useState(false)
  const [clearing, setClearing] = useState(false)
  useRevealOnScroll([cart?.items.length ?? 0, loading])

  const handleUpdate = async (item: CartItem, quantity: number) => {
    setUpdatingItemId(item.itemId)
    setItemError(null)
    try {
      await updateQuantity(item.itemId, quantity)
    } catch (err) {
      setItemError(getErrorMessage(err, 'No se pudo actualizar la cantidad'))
    } finally {
      setUpdatingItemId(null)
    }
  }

  const handleRemove = async (itemId: number) => {
    setUpdatingItemId(itemId)
    setItemError(null)
    try {
      await removeItem(itemId)
    } catch (err) {
      setItemError(getErrorMessage(err, 'No se pudo eliminar el producto'))
    } finally {
      setUpdatingItemId(null)
    }
  }

  const handleClear = async () => {
    setClearing(true)
    setItemError(null)
    try {
      await clearCart()
      setConfirmClear(false)
    } catch (err) {
      setItemError(getErrorMessage(err, 'No se pudo vaciar el carrito'))
    } finally {
      setClearing(false)
    }
  }

  const isEmpty = !loading && cart && cart.items.length === 0

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

          <div className="reveal">
            <h1 className="text-h1 text-white mb-md">Carrito de Compras</h1>
            <p className="text-text-secondary text-body-large mb-xl">
              Revisa los productos seleccionados y prepara tu compra.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 laptop:grid-cols-3 gap-xl">
              <div className="laptop:col-span-2 space-y-md">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="glass rounded-xl p-md animate-pulse">
                    <div className="flex gap-md">
                      <div className="w-24 h-24 bg-white/10 rounded-xl flex-shrink-0" />
                      <div className="flex-1 space-y-sm">
                        <div className="h-3 bg-white/10 rounded w-1/4" />
                        <div className="h-5 bg-white/10 rounded w-3/4" />
                        <div className="h-4 bg-white/10 rounded w-1/2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="glass rounded-xl p-md animate-pulse">
                <div className="h-5 bg-white/10 rounded w-1/2 mb-md" />
                <div className="space-y-sm">
                  <div className="h-4 bg-white/10 rounded w-full" />
                  <div className="h-4 bg-white/10 rounded w-2/3" />
                  <div className="h-4 bg-white/10 rounded w-1/3" />
                </div>
              </div>
            </div>
          ) : isEmpty ? (
            <div className="text-center py-2xl glass rounded-xl reveal">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-2xl mb-md animate-float">
                <ShoppingBag size={28} className="text-text-tertiary" />
              </div>
              <h2 className="text-h3 text-white mb-sm">Tu carrito está vacío</h2>
              <p className="text-text-secondary mb-xl">Agrega productos desde la tienda para comenzar tu compra.</p>
              <Link
                to="/store"
                className="btn-shine inline-flex items-center gap-2 bg-gradient-to-r from-green-400 to-emerald-700 hover:from-green-300 hover:to-emerald-700 text-white px-8 py-3.5 rounded-xl font-medium transition-all duration-200 hover:-translate-y-0.5 shadow-lg shadow-green-500/25"
              >
                Ir a la tienda
                <ArrowLeft size={18} className="rotate-180" />
              </Link>
            </div>
          ) : cart && (
            <>
              {itemError && (
                <div className="mb-lg bg-rose-500/15 border border-rose-400/30 text-rose-300 rounded-xl px-md py-sm text-sm animate-fade-up">
                  {itemError}
                </div>
              )}

              <div className="grid grid-cols-1 laptop:grid-cols-3 gap-xl">
                <div className="laptop:col-span-2 space-y-md">
                  {cart.items.map((item, i) => (
                    <div key={item.itemId} data-delay={(i % 3) + 1} className="reveal">
                      <ItemRow
                        item={item}
                        updating={updatingItemId === item.itemId}
                        onUpdate={(quantity) => handleUpdate(item, quantity)}
                        onRemove={() => handleRemove(item.itemId)}
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <div className="glass-strong rounded-xl p-md sticky top-24 reveal" data-delay="3">
                    <h2 className="text-h4 text-white mb-lg">Resumen</h2>
                    <dl className="space-y-md text-sm">
                      <div className="flex items-center justify-between gap-2">
                        <dt className="text-text-secondary">Subtotal</dt>
                        <dd className="text-white font-medium">${cart.subtotal.toLocaleString()}</dd>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <dt className="text-text-secondary">Cantidad total de productos</dt>
                        <dd className="text-white font-medium">{itemCount}</dd>
                      </div>
                      <div className="flex items-center justify-between gap-2 pt-md border-t border-white/10">
                        <dt className="text-h5 text-white">Total</dt>
                        <dd className="text-h5 text-primary-300">${cart.total.toLocaleString()}</dd>
                      </div>
                    </dl>

                    {whatsappUrl && (
                      <a
                        href={`${whatsappUrl}?text=${encodeURIComponent(`Hola, me gustaría finalizar mi compra.\n\nProductos:\n${cart.items.map((it) => `- ${it.name} x${it.quantity}: $${it.subtotal.toLocaleString()}`).join('\n')}\n\nTotal: $${cart.total.toLocaleString()}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-shine mt-lg w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-green-400 to-emerald-700 hover:from-green-300 hover:to-emerald-700 text-white text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 shadow-lg shadow-green-500/25"
                      >
                        <MessageCircle size={18} />
                        Finalizar compra por WhatsApp
                      </a>
                    )}

                    <button
                      onClick={() => setConfirmClear(true)}
                      className="mt-md w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-white/15 text-text-secondary hover:text-error hover:border-error/50 transition-colors text-sm font-medium"
                    >
                      <Trash2 size={16} />
                      Vaciar carrito
                    </button>

                    <p className="mt-lg flex items-center gap-2 text-xs text-text-tertiary">
                      <ShieldCheck size={14} className="text-primary-300" />
                      Compra segura y respaldada con garantía.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          <ConfirmDialog
            isOpen={confirmClear}
            onClose={() => setConfirmClear(false)}
            onConfirm={handleClear}
            title="Vaciar carrito"
            confirmText="Vaciar"
            isLoading={clearing}
            message="¿Estás seguro de vaciar el carrito? Se eliminarán todos los productos seleccionados."
          />
        </div>
      </section>
    </div>
  )
}
