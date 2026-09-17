import { NextRequest } from 'next/server'
import { jsonOk, withApi } from '@/lib/http'
import { parsePageable } from '@/lib/pagination'
import * as serviceService from '@/services/repairServices'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export const GET = withApi(async (request: NextRequest) => {
  const pageable = parsePageable(new URL(request.url), 8)
  const page = await serviceService.findFeatured(pageable)
  return jsonOk(page)
})