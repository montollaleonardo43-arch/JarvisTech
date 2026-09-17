import { NextRequest } from 'next/server'
import { jsonOk, withApi } from '@/lib/http'
import { validate, addCartItemRequest } from '@/lib/validators'
import * as cartService from '@/services/cart'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

function cartGuid(request: NextRequest): string {
  const guid = request.headers.get('x-cart-id')
  if (!guid) throw new Error('Missing request header X-Cart-Id')
  return guid
}

export const POST = withApi(async (request: NextRequest) => {
  const input = validate(addCartItemRequest, await request.json())
  const cart = await cartService.addItem(cartGuid(request), input)
  return jsonOk(cart, 201)
})

export const DELETE = withApi(async (request: NextRequest) => {
  const cart = await cartService.clearCart(cartGuid(request))
  return jsonOk(cart)
})