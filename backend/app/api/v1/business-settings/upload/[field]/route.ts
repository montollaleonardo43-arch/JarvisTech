import { randomUUID } from 'crypto'
import { NextRequest } from 'next/server'
import { apiOk, jsonOk, withApi } from '@/lib/http'
import { requireAuth } from '@/lib/auth'
import { ensureBucket, uploadFile } from '@/lib/supabase'
import * as businessSettingsService from '@/services/businessSettings'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const ALLOWED_FIELDS = new Set(['logoLight', 'heroImage'])

export const POST = withApi(async (request: NextRequest, ctx: { params: Promise<{ field: string }> }) => {
  await requireAuth(request)
  const { field } = await ctx.params

  if (!ALLOWED_FIELDS.has(field)) {
    return jsonOk({ success: false, message: `Campo no valido: ${field}` }, 400)
  }

  const formData = await request.formData()
  const file = formData.get('file')
  if (!(file instanceof File)) {
    throw new Error('Archivo no recibido')
  }

  const originalName = file.name ?? ''
  const dot = originalName.lastIndexOf('.')
  const extension = dot >= 0 ? originalName.substring(dot) : ''

  const fileName = `settings-${field}-${randomUUID()}${extension}`
  await ensureBucket()
  await uploadFile(fileName, await file.arrayBuffer(), file.type || 'application/octet-stream')

  const fileUrl = `/api/v1/images/file/${fileName}`
  const current = await businessSettingsService.getSettings()
  await businessSettingsService.update({ ...current, [field]: fileUrl })

  return apiOk('Imagen subida exitosamente', fileUrl)
})