import { NextRequest } from 'next/server'
import { jsonOk, apiOk, withApi } from '@/lib/http'
import { parsePageable } from '@/lib/pagination'
import { validate, productRequest } from '@/lib/validators'
import { requireAuth } from '@/lib/auth'
import * as productService from '@/services/products'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export const GET = withApi(async (request: NextRequest) => {
  const pageable = parsePageable(new URL(request.url), 20)
  const page = await productService.findAll(pageable)
  return jsonOk(page)
})

export const POST = withApi(async (request: NextRequest) => {
  await requireAuth(request)
  const input = validate(productRequest, await request.json())
  const result = await productService.create(input)
  return apiOk('Producto creado exitosamente', result, 201)
})