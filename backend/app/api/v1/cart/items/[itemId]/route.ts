import { NextRequest } from 'next/server'
import { jsonOk, withApi } from '@/lib/http'
import { validate, updateCartItemRequest } from '@/lib/validators'
import * as cartService from '@/services/cart'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

function cartGuid(request: NextRequest): string {
  const guid = request.headers.get('x-cart-id')
  if (!guid) throw new Error('Missing request header X-Cart-Id')
  return guid
}

export const PUT = withApi(async (request: NextRequest, ctx: { params: Promise<{ itemId: string }> }) => {
  const { itemId } = await ctx.params
  const input = validate(updateCartItemRequest, await request.json())
  const cart = await cartService.updateItem(cartGuid(request), Number(itemId), input)
  return jsonOk(cart)
})

export const DELETE = withApi(async (request: NextRequest, ctx: { params: Promise<{ itemId: string }> }) => {
  const { itemId } = await ctx.params
  const cart = await cartService.removeItem(cartGuid(request), Number(itemId))
  return jsonOk(cart)
})