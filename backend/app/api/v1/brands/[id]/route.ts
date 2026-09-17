import { NextRequest } from 'next/server'
import { jsonOk, apiOk, withApi } from '@/lib/http'
import { validate, brandRequest } from '@/lib/validators'
import { requireAuth } from '@/lib/auth'
import * as brandService from '@/services/brands'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export const GET = withApi(async (_request: NextRequest, ctx: { params: Promise<{ id: string }> }) => {
  const { id } = await ctx.params
  const brand = await brandService.findById(Number(id))
  return jsonOk(brand)
})

export const PUT = withApi(async (request: NextRequest, ctx: { params: Promise<{ id: string }> }) => {
  await requireAuth(request)
  const { id } = await ctx.params
  const input = validate(brandRequest, await request.json())
  const result = await brandService.update(Number(id), input)
  return apiOk('Marca actualizada exitosamente', result)
})

export const DELETE = withApi(async (request: NextRequest, ctx: { params: Promise<{ id: string }> }) => {
  await requireAuth(request)
  const { id } = await ctx.params
  await brandService.deactivate(Number(id))
  return apiOk('Marca desactivada exitosamente', null)
})