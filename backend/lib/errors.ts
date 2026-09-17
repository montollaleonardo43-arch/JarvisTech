export interface HttpErrorOptions {
  path?: string
  errors?: Record<string, string>
}

export class HttpError extends Error {
  readonly status: number
  readonly error: string
  readonly path?: string
  readonly errors?: Record<string, string>

  constructor(status: number, error: string, message: string, options?: HttpErrorOptions) {
    super(message)
    this.name = 'HttpError'
    this.status = status
    this.error = error
    this.path = options?.path
    this.errors = options?.errors
  }
}

export const invalidCredentials = (): HttpError =>
  new HttpError(401, 'Unauthorized', 'Credenciales invalidas. Verifique su email y contrasena.')

export const authenticationError = (detail: string): HttpError =>
  new HttpError(401, 'Unauthorized', `Error de autenticacion: ${detail}`)

export const notAuthenticated = (path: string): HttpError =>
  new HttpError(401, 'Unauthorized', 'No autenticado. Se requiere un token JWT valido.', { path })

export const forbidden = (path: string): HttpError =>
  new HttpError(403, 'Forbidden', 'No tiene permisos para acceder a este recurso.', { path })

export const notFound = (resource: string, id?: number | string): HttpError =>
  new HttpError(
    404,
    'Not Found',
    id === undefined ? resource : `${resource} con id ${id} no encontrado`,
  )

export const badRequest = (message: string): HttpError => new HttpError(400, 'Bad Request', message)

export const conflict = (message: string): HttpError => new HttpError(409, 'Conflict', message)

export const validationErrors = (errors: Record<string, string>): HttpError =>
  new HttpError(400, 'Validation Error', 'Error de validacion', { errors })

export const notImplemented = (message: string): HttpError =>
  new HttpError(501, 'Not Implemented', message)