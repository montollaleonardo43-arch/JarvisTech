import { NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { HttpError } from '@/lib/errors'
import { fmtNow } from '@/lib/format'

function errorBody(status: number, error: string, message: string, path?: string) {
  const body: Record<string, unknown> = {
    timestamp: fmtNow(),
    status,
    error,
    message,
  }
  if (path !== undefined) body.path = path
  return body
}

function validationBody(errors: Record<string, string>) {
  return {
    timestamp: fmtNow(),
    status: 400,
    error: 'Validation Error',
    errors,
    message: 'Error de validacion',
  }
}

function zodBody(error: ZodError) {
  const errors: Record<string, string> = {}
  for (const issue of error.issues) {
    const key = issue.path.join('.') || '@root'
    if (!(key in errors)) errors[key] = issue.message
  }
  return validationBody(errors)
}

type ApiHandler<Args extends unknown[]> = (...args: Args) => Promise<Response>

export function withApi<Args extends unknown[]>(
  handler: ApiHandler<Args>,
): (...args: Args) => Promise<Response> {
  return async (...args) => {
    try {
      return await handler(...args)
    } catch (error) {
      if (error instanceof HttpError) {
        return NextResponse.json(
          errorBody(error.status, error.error, error.message, error.path),
          { status: error.status },
        )
      }
      if (error instanceof ZodError) {
        return NextResponse.json(zodBody(error), { status: 400 })
      }
      return NextResponse.json(
        errorBody(500, 'Internal Server Error', 'Error interno del servidor'),
        { status: 500 },
      )
    }
  }
}

export function jsonOk(data: unknown, status = 200): NextResponse {
  return NextResponse.json(data, { status })
}

export function apiOk(message: string, data: unknown, status = 200): NextResponse {
  return NextResponse.json({ success: true, message, data }, { status })
}