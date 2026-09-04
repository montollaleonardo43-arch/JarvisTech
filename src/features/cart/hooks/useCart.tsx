import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { cartApi } from '../services/cartApi'
import type { Cart } from '@/shared/types'

interface CartContextValue {
  cart: Cart | null
  loading: boolean
  itemCount: number
  addItem: (productId: number, quantity?: number) => Promise<void>
  updateQuantity: (itemId: number, quantity: number) => Promise<void>
  removeItem: (itemId: number) => Promise<void>
  clearCart: () => Promise<void>
  refreshCart: () => Promise<void>
}

const CartContext = createContext<CartContextValue | null>(null)

const EMPTY_CART: Cart = {
  id: null,
  guid: null,
  status: 'ACTIVE',
  items: [],
  itemCount: 0,
  subtotal: 0,
  shippingCost: null,
  discount: null,
  total: 0,
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshCart = useCallback(async () => {
    try {
      const { data } = await cartApi.get()
      setCart(data)
    } catch {
      setCart(EMPTY_CART)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshCart()
  }, [refreshCart])

  const addItem = useCallback(async (productId: number, quantity = 1) => {
    const { data } = await cartApi.addItem(productId, quantity)
    setCart(data)
  }, [])

  const updateQuantity = useCallback(async (itemId: number, quantity: number) => {
    const { data } = await cartApi.updateQuantity(itemId, quantity)
    setCart(data)
  }, [])

  const removeItem = useCallback(async (itemId: number) => {
    const { data } = await cartApi.removeItem(itemId)
    setCart(data)
  }, [])

  const clearCart = useCallback(async () => {
    const { data } = await cartApi.clearCart()
    setCart(data)
  }, [])

  const value = useMemo(
    () => ({
      cart,
      loading,
      itemCount: cart?.itemCount ?? 0,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      refreshCart,
    }),
    [cart, loading, addItem, updateQuantity, removeItem, clearCart, refreshCart],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart debe usarse dentro de CartProvider')
  }
  return context
}
