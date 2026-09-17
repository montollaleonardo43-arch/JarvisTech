import { NextRequest } from 'next/server'
import { apiOk, withApi } from '@/lib/http'
import { requireAuth } from '@/lib/auth'
import * as authService from '@/services/auth'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export const GET = withApi(async (request: NextRequest) => {
  const user = await requireAuth(request)
  return apiOk('Usuario autenticado', authService.getMe(user))
})