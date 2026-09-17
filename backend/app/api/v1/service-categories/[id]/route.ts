import { NextRequest } from 'next/server'
import { jsonOk, apiOk, withApi } from '@/lib/http'
import { validate, serviceCategoryRequest } from '@/lib/validators'
import { requireAuth } from '@/lib/auth'
import * as serviceCategoryService from '@/services/serviceCategories'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export const GET = withApi(async (_request: NextRequest, ctx: { params: Promise<{ id: string }> }) => {
  const { id } = await ctx.params
  const category = await serviceCategoryService.findById(Number(id))
  return jsonOk(category)
})

export const PUT = withApi(async (request: NextRequest, ctx: { params: Promise<{ id: string }> }) => {
  await requireAuth(request)
  const { id } = await ctx.params
  const input = validate(serviceCategoryRequest, await request.json())
  const result = await serviceCategoryService.update(Number(id), input)
  return apiOk('Categoria de servicio actualizada exitosamente', result)
})

export const DELETE = withApi(async (request: NextRequest, ctx: { params: Promise<{ id: string }> }) => {
  await requireAuth(request)
  const { id } = await ctx.params
  await serviceCategoryService.deactivate(Number(id))
  return apiOk('Categoria de servicio desactivada exitosamente', null)
})