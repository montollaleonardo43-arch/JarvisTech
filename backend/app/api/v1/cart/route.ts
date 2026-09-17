import { NextRequest } from 'next/server'
import { jsonOk, withApi } from '@/lib/http'
import * as cartService from '@/services/cart'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

function cartGuid(request: NextRequest): string {
  const guid = request.headers.get('x-cart-id')
  if (!guid) throw new Error('Missing request header X-Cart-Id')
  return guid
}

export const GET = withApi(async (request: NextRequest) => {
  const cart = await cartService.getCart(cartGuid(request))
  return jsonOk(cart)
})