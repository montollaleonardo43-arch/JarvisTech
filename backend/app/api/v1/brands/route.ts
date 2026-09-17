import { NextRequest } from 'next/server'
import { jsonOk, apiOk, withApi } from '@/lib/http'
import { parsePageable } from '@/lib/pagination'
import { validate, brandRequest } from '@/lib/validators'
import { requireAuth } from '@/lib/auth'
import * as brandService from '@/services/brands'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export const GET = withApi(async (request: NextRequest) => {
  const pageable = parsePageable(new URL(request.url), 50)
  const page = await brandService.findAll(pageable)
  return jsonOk(page)
})

export const POST = withApi(async (request: NextRequest) => {
  await requireAuth(request)
  const input = validate(brandRequest, await request.json())
  const result = await brandService.create(input)
  return apiOk('Marca creada exitosamente', result, 201)
})