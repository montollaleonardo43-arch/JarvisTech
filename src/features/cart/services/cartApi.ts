import api from '@/shared/services/api'
import type { Cart } from '@/shared/types'

const CART_ID_KEY = 'jarvis_cart_id'

export function getCartId(): string {
  let id = localStorage.getItem(CART_ID_KEY)
  if (!id) {
    id = generateCartId()
    localStorage.setItem(CART_ID_KEY, id)
  }
  return id
}

function generateCartId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `cart-${Date.now()}-${Math.random().toString(36).slice(2, 12)}`
}

export const cartApi = {
  get: () =>
    api.get<Cart>('/cart', { headers: { 'X-Cart-Id': getCartId() } }),

  addItem: (productId: number, quantity: number) =>
    api.post<Cart>('/cart/items', { productId, quantity }, { headers: { 'X-Cart-Id': getCartId() } }),

  updateQuantity: (itemId: number, quantity: number) =>
    api.put<Cart>(`/cart/items/${itemId}`, { quantity }, { headers: { 'X-Cart-Id': getCartId() } }),

  removeItem: (itemId: number) =>
    api.delete<Cart>(`/cart/items/${itemId}`, { headers: { 'X-Cart-Id': getCartId() } }),

  clearCart: () =>
    api.delete<Cart>('/cart/items', { headers: { 'X-Cart-Id': getCartId() } }),
}
