import { prisma } from '@/lib/db'
import { badRequest, notFound } from '@/lib/errors'
import { toCartResponse, type CartResponse } from '@/lib/resolvers'
import type { AddCartItemInput, UpdateCartItemInput } from '@/lib/validators'

const cartInclude = {
  cart_items: {
    include: {
      products: { include: { images: true, brands: true } },
    },
  },
} as const

async function findCart(guid: string) {
  return prisma.carts.findUnique({ where: { cart_guid: guid }, include: cartInclude })
}

async function loadOrCreate(guid: string) {
  const existing = await prisma.carts.findUnique({ where: { cart_guid: guid } })
  if (existing) return existing
  const now = new Date()
  return prisma.carts.create({
    data: { cart_guid: guid, status: 'ACTIVE', created_at: now, updated_at: now },
  })
}

export async function getCart(guid: string): Promise<CartResponse> {
  const cart = await findCart(guid)
  return toCartResponse(cart)
}

export async function addItem(guid: string, input: AddCartItemInput): Promise<CartResponse> {
  const product = await prisma.products.findUnique({ where: { product_id: input.productId } })
  if (!product || !product.active) throw notFound('Producto', input.productId)

  if (product.stock <= 0) {
    throw badRequest(`El producto ${product.name} no tiene stock disponible`)
  }
  if (input.quantity > product.stock) {
    throw badRequest(`Stock insuficiente para ${product.name}`)
  }

  const cart = await loadOrCreate(guid)
  const existingItem = await prisma.cart_items.findFirst({
    where: { cart_id: cart.cart_id, product_id: input.productId },
  })

  if (existingItem) {
    const newQuantity = existingItem.quantity + input.quantity
    if (newQuantity > product.stock) {
      throw badRequest(`Stock insuficiente para ${product.name}`)
    }
    await prisma.cart_items.update({
      where: { cart_item_id: existingItem.cart_item_id },
      data: { quantity: newQuantity, updated_at: new Date() },
    })
  } else {
    await prisma.cart_items.create({
      data: {
        cart_id: cart.cart_id,
        product_id: input.productId,
        quantity: input.quantity,
        created_at: new Date(),
        updated_at: new Date(),
      },
    })
  }

  const refreshed = await findCart(guid)
  return toCartResponse(refreshed)
}

export async function updateItem(
  guid: string,
  itemId: number,
  input: UpdateCartItemInput,
): Promise<CartResponse> {
  const cart = await findCart(guid)
  if (!cart) throw notFound('Carrito')

  const item = cart.cart_items.find((i) => Number(i.cart_item_id) === itemId)
  if (!item) throw notFound('Producto del carrito', itemId)

  const product = item.products
  if (!product.active) {
    throw badRequest(`El producto ${product.name} ya no esta disponible`)
  }
  if (input.quantity > product.stock) {
    throw badRequest(`Stock insuficiente para ${product.name}`)
  }

  await prisma.cart_items.update({
    where: { cart_item_id: itemId },
    data: { quantity: input.quantity, updated_at: new Date() },
  })

  const refreshed = await findCart(guid)
  return toCartResponse(refreshed)
}

export async function removeItem(guid: string, itemId: number): Promise<CartResponse> {
  const cart = await findCart(guid)
  if (!cart) throw notFound('Carrito')

  const item = cart.cart_items.find((i) => Number(i.cart_item_id) === itemId)
  if (!item) throw notFound('Producto del carrito', itemId)

  await prisma.cart_items.delete({ where: { cart_item_id: Number(item.cart_item_id) } })
  return toCartResponse(await findCart(guid))
}

export async function clearCart(guid: string): Promise<CartResponse> {
  const cart = await findCart(guid)
  if (cart) {
    await prisma.cart_items.deleteMany({ where: { cart_id: cart.cart_id } })
  }
  return toCartResponse(await findCart(guid))
}