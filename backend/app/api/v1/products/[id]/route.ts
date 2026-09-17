import { NextRequest } from 'next/server'
import { jsonOk, apiOk, withApi } from '@/lib/http'
import { validate, productRequest } from '@/lib/validators'
import { requireAuth } from '@/lib/auth'
import * as productService from '@/services/products'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export const GET = withApi(async (_request: NextRequest, ctx: { params: Promise<{ id: string }> }) => {
  const { id } = await ctx.params
  const product = await productService.findById(Number(id))
  return jsonOk(product)
})

export const PUT = withApi(async (request: NextRequest, ctx: { params: Promise<{ id: string }> }) => {
  await requireAuth(request)
  const { id } = await ctx.params
  const input = validate(productRequest, await request.json())
  const result = await productService.update(Number(id), input)
  return apiOk('Producto actualizado exitosamente', result)
})

export const DELETE = withApi(async (request: NextRequest, ctx: { params: Promise<{ id: string }> }) => {
  await requireAuth(request)
  const { id } = await ctx.params
  await productService.deactivate(Number(id))
  return apiOk('Producto desactivado exitosamente', null)
})