import { z, ZodError } from 'zod'
import { validationErrors } from '@/lib/errors'

function buildErrors(error: ZodError): Record<string, string> {
  const errors: Record<string, string> = {}
  for (const issue of error.issues) {
    const key = issue.path.join('.') || '@root'
    if (!(key in errors)) errors[key] = issue.message
  }
  return errors
}

export function validate<T>(schema: z.ZodType<T>, data: unknown): T {
  const result = schema.safeParse(data)
  if (!result.success) throw validationErrors(buildErrors(result.error))
  return result.data
}

function requiredString(message: string, max?: number, maxMessage?: string) {
  let schema = z.string({ message })
  if (max !== undefined) schema = schema.max(max, maxMessage ?? message)
  return schema.refine((value) => value.trim().length > 0, message)
}

function optionalString(max?: number, maxMessage?: string) {
  let schema = z.string()
  if (max !== undefined) schema = schema.max(max, maxMessage ?? '')
  return schema.optional()
}

function optionalInt(
  minMessage?: string,
  min?: number,
): z.ZodType<number | null | undefined> {
  let schema = z.number().int()
  if (min !== undefined) schema = schema.min(min, minMessage ?? '')
  return schema.nullable().optional()
}

const optionalLongList = z.array(z.number()).optional()

export const productRequest = z.object({
  name: requiredString('El nombre es obligatorio', 200, 'El nombre no puede exceder 200 caracteres'),
  sku: requiredString('El SKU es obligatorio', 50, 'El SKU no puede exceder 50 caracteres'),
  shortDescription: optionalString(500, 'La descripcion corta no puede exceder 500 caracteres'),
  description: optionalString(),
  price: z
    .number({ message: 'El precio es obligatorio' })
    .positive('El precio debe ser mayor a 0'),
  offerPrice: z.number().nullable().optional(),
  stock: optionalInt('El stock no puede ser negativo', 0),
  warranty: optionalString(200, 'La garantia no puede exceder 200 caracteres'),
  featured: z.boolean().optional(),
  categoryId: z.number({ message: 'La categoria es obligatoria' }),
  brandId: z.number({ message: 'La marca es obligatoria' }),
})

export const categoryRequest = z.object({
  name: requiredString('El nombre es obligatorio', 100, 'El nombre no puede exceder 100 caracteres'),
  description: optionalString(500, 'La descripcion no puede exceder 500 caracteres'),
  icon: optionalString(50, 'El icono no puede exceder 50 caracteres'),
})

export const brandRequest = z.object({
  name: requiredString('El nombre es obligatorio', 100, 'El nombre no puede exceder 100 caracteres'),
  logo: optionalString(500, 'El logo no puede exceder 500 caracteres'),
})

export const serviceRequest = z.object({
  name: requiredString('El nombre es obligatorio', 200, 'El nombre no puede exceder 200 caracteres'),
  description: optionalString(),
  referencePrice: z.number().positive('El precio de referencia debe ser mayor a 0').nullable().optional(),
  estimatedTime: optionalString(100, 'El tiempo estimado no puede exceder 100 caracteres'),
  requiresDiagnosis: z.boolean().nullable().optional(),
  warranty: optionalString(200, 'La garantia no puede exceder 200 caracteres'),
  featured: z.boolean().nullable().optional(),
  serviceCategoryId: z.number({ message: 'La categoria de servicio es obligatoria' }),
})

export const serviceCategoryRequest = z.object({
  name: requiredString('El nombre es obligatorio', 100, 'El nombre no puede exceder 100 caracteres'),
  description: optionalString(500, 'La descripcion no puede exceder 500 caracteres'),
})

export const promotionRequest = z.object({
  title: requiredString('El titulo es obligatorio', 200, 'El titulo no puede exceder 200 caracteres'),
  description: optionalString(),
  promotionType: optionalString(50, 'El tipo no puede exceder 50 caracteres'),
  startDate: z.string({ message: 'La fecha de inicio es obligatoria' }),
  endDate: z.string({ message: 'La fecha de fin es obligatoria' }),
  productIds: optionalLongList,
  serviceIds: optionalLongList,
})

export const loginRequest = z.object({
  email: requiredString('El email es obligatorio')
    .max(150, 'El email no puede exceder 150 caracteres')
    .email('El formato del email no es valido'),
  password: requiredString('La contrasena es obligatoria'),
  rememberMe: z.boolean().optional(),
})

export const forgotPasswordRequest = z.object({
  email: requiredString('El email es obligatorio')
    .max(150, 'El email no puede exceder 150 caracteres')
    .email('El formato del email no es valido'),
})

export const resetPasswordRequest = z.object({
  token: requiredString('El token es obligatorio'),
  password: requiredString('La contrasena es obligatoria').min(
    6,
    'La contrasena debe tener al menos 6 caracteres',
  ),
})

export const registerRequest = z.object({
  name: requiredString('El nombre es obligatorio', 150, 'El nombre no puede exceder 150 caracteres'),
  email: requiredString('El email es obligatorio')
    .max(150, 'El email no puede exceder 150 caracteres')
    .email('El formato del email no es valido'),
  password: requiredString('La contrasena es obligatoria').min(
    6,
    'La contrasena debe tener al menos 6 caracteres',
  ),
})

export const addCartItemRequest = z.object({
  productId: z.number({ message: 'El producto es obligatorio' }),
  quantity: z
    .number({ message: 'La cantidad es obligatoria' })
    .int()
    .positive('La cantidad debe ser mayor que cero'),
})

export const updateCartItemRequest = z.object({
  quantity: z
    .number({ message: 'La cantidad es obligatoria' })
    .int()
    .positive('La cantidad debe ser mayor que cero'),
})

export type ProductInput = z.infer<typeof productRequest>
export type CategoryInput = z.infer<typeof categoryRequest>
export type BrandInput = z.infer<typeof brandRequest>
export type ServiceInput = z.infer<typeof serviceRequest>
export type ServiceCategoryInput = z.infer<typeof serviceCategoryRequest>
export type PromotionInput = z.infer<typeof promotionRequest>
export type LoginInput = z.infer<typeof loginRequest>
export type RegisterInput = z.infer<typeof registerRequest>
export type ForgotPasswordInput = z.infer<typeof forgotPasswordRequest>
export type ResetPasswordInput = z.infer<typeof resetPasswordRequest>
export type AddCartItemInput = z.infer<typeof addCartItemRequest>
export type UpdateCartItemInput = z.infer<typeof updateCartItemRequest>