import { NextRequest } from 'next/server'
import { jsonOk, apiOk, withApi } from '@/lib/http'
import { parsePageable } from '@/lib/pagination'
import { validate, serviceRequest } from '@/lib/validators'
import { requireAuth } from '@/lib/auth'
import * as serviceService from '@/services/repairServices'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export const GET = withApi(async (request: NextRequest) => {
  const pageable = parsePageable(new URL(request.url), 20)
  const page = await serviceService.findAll(pageable)
  return jsonOk(page)
})

export const POST = withApi(async (request: NextRequest) => {
  await requireAuth(request)
  const input = validate(serviceRequest, await request.json())
  const result = await serviceService.create(input)
  return apiOk('Servicio creado exitosamente', result, 201)
})