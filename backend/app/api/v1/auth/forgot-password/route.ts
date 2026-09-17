import { NextRequest } from 'next/server'
import { apiOk, withApi } from '@/lib/http'
import { validate, forgotPasswordRequest } from '@/lib/validators'
import * as authService from '@/services/auth'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export const POST = withApi(async (request: NextRequest) => {
  const input = validate(forgotPasswordRequest, await request.json())
  await authService.forgotPassword(input)
  return apiOk('Si el correo existe, se ha enviado un enlace de recuperacion.', {})
})