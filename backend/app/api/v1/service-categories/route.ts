import { NextRequest } from 'next/server'
import { jsonOk, apiOk, withApi } from '@/lib/http'
import { parsePageable } from '@/lib/pagination'
import { validate, serviceCategoryRequest } from '@/lib/validators'
import { requireAuth } from '@/lib/auth'
import * as serviceCategoryService from '@/services/serviceCategories'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export const GET = withApi(async (request: NextRequest) => {
  const pageable = parsePageable(new URL(request.url), 50)
  const page = await serviceCategoryService.findAll(pageable)
  return jsonOk(page)
})

export const POST = withApi(async (request: NextRequest) => {
  await requireAuth(request)
  const input = validate(serviceCategoryRequest, await request.json())
  const result = await serviceCategoryService.create(input)
  return apiOk('Categoria de servicio creada exitosamente', result, 201)
})