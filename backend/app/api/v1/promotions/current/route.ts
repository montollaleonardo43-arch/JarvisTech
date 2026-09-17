import { NextRequest } from 'next/server'
import { jsonOk, withApi } from '@/lib/http'
import { parsePageable } from '@/lib/pagination'
import * as promotionService from '@/services/promotions'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export const GET = withApi(async (request: NextRequest) => {
  const pageable = parsePageable(new URL(request.url), 20)
  const page = await promotionService.findCurrent(pageable)
  return jsonOk(page)
})