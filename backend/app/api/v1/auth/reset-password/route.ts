import { NextRequest } from 'next/server'
import { apiOk, withApi } from '@/lib/http'
import { validate, resetPasswordRequest } from '@/lib/validators'
import * as authService from '@/services/auth'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export const POST = withApi(async (request: NextRequest) => {
  const input = validate(resetPasswordRequest, await request.json())
  await authService.resetPassword(input)
  return apiOk('Contrasena actualizada correctamente', {})
})