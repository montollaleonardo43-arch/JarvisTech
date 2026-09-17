import { NextRequest } from 'next/server'
import { apiOk, withApi } from '@/lib/http'
import { requireAuth } from '@/lib/auth'
import * as imageService from '@/services/images'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

async function parseUpload(request: NextRequest) {
  await requireAuth(request)
  const formData = await request.formData()
  const file = formData.get('file')
  if (!(file instanceof File)) {
    throw new Error('Archivo no recibido en el campo file')
  }
  const altText = formData.get('altText')
  const isPrimary = formData.get('isPrimary') === 'true'
  const alt = typeof altText === 'string' && altText.length > 0 ? altText : null
  return { file, altText: alt, isPrimary }
}

export const POST = withApi(
  async (request: NextRequest, ctx: { params: Promise<{ productId: string }> }) => {
    const { productId } = await ctx.params
    const { file, altText, isPrimary } = await parseUpload(request)
    const result = await imageService.upload('product', Number(productId), file, altText, isPrimary)
    return apiOk('Imagen subida exitosamente', result)
  },
)