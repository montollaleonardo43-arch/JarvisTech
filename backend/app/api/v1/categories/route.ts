import { NextRequest } from 'next/server'
import { jsonOk, apiOk, withApi } from '@/lib/http'
import { parsePageable } from '@/lib/pagination'
import { validate, categoryRequest } from '@/lib/validators'
import { requireAuth } from '@/lib/auth'
import * as categoryService from '@/services/categories'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export const GET = withApi(async (request: NextRequest) => {
  const pageable = parsePageable(new URL(request.url), 50)
  const page = await categoryService.findAll(pageable)
  return jsonOk(page)
})

export const POST = withApi(async (request: NextRequest) => {
  await requireAuth(request)
  const input = validate(categoryRequest, await request.json())
  const result = await categoryService.create(input)
  return apiOk('Categoria creada exitosamente', result, 201)
})