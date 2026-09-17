import { randomUUID } from 'crypto'
import { prisma } from '@/lib/db'
import { notFound } from '@/lib/errors'
import { ensureBucket, deleteFile, downloadFile, uploadFile } from '@/lib/supabase'
import { toImageResponse, type ImageResponse } from '@/lib/resolvers'
import type { images } from '@prisma/client'

export type ImageParentKind = 'product' | 'service' | 'promotion'

function extensionFromName(fileName: string | undefined): string {
  if (!fileName || !fileName.includes('.')) return ''
  const dot = fileName.lastIndexOf('.')
  return fileName.substring(dot)
}

async function assertParent(kind: ImageParentKind, parentId: number) {
  if (kind === 'product') {
    const row = await prisma.products.findUnique({ where: { product_id: parentId } })
    if (!row) throw notFound('Producto', parentId)
  } else if (kind === 'service') {
    const row = await prisma.services.findUnique({ where: { service_id: parentId } })
    if (!row) throw notFound('Servicio', parentId)
  } else {
    const row = await prisma.promotions.findUnique({ where: { promotion_id: parentId } })
    if (!row) throw notFound('Promocion', parentId)
  }
}

export async function upload(
  kind: ImageParentKind,
  parentId: number,
  file: File,
  altText: string | null,
  isPrimary: boolean,
): Promise<ImageResponse> {
  await assertParent(kind, parentId)

  const fileName = `${randomUUID()}${extensionFromName(file.name)}`
  const buffer = await file.arrayBuffer()

  await ensureBucket()
  await uploadFile(fileName, buffer, file.type || 'application/octet-stream')

  if (isPrimary) {
    await resetPrimary(kind, parentId)
  }

  const displayOrder =
    kind === 'product'
      ? await prisma.images.count({ where: { product_id: parentId } })
      : kind === 'service'
        ? await prisma.images.count({ where: { service_id: parentId } })
        : await prisma.images.count({ where: { promotion_id: parentId } })

  const data: Partial<images> = {
    file_name: fileName,
    path: `/api/v1/images/file/${fileName}`,
    alt_text: altText,
    size: BigInt(buffer.byteLength),
    is_primary: isPrimary,
    display_order: displayOrder,
    created_at: new Date(),
  }
  if (kind === 'product') data.product_id = BigInt(parentId)
  if (kind === 'service') data.service_id = BigInt(parentId)
  if (kind === 'promotion') data.promotion_id = BigInt(parentId)

  const row = await prisma.images.create({ data: data as never })
  return toImageResponse(row)
}

export async function serve(fileName: string): Promise<Response> {
  const downloaded = await downloadFile(fileName)
  if (!downloaded) return new Response(null, { status: 404 })
  return new Response(new Uint8Array(downloaded.data), {
    headers: { 'Content-Type': downloaded.contentType },
  })
}

export async function deleteById(imageId: number): Promise<void> {
  const image = await prisma.images.findUnique({ where: { image_id: imageId } })
  if (!image) throw notFound('Imagen', imageId)

  await deleteFile(image.file_name)
  await prisma.images.delete({ where: { image_id: imageId } })
}

export async function setPrimary(imageId: number): Promise<void> {
  const image = await prisma.images.findUnique({ where: { image_id: imageId } })
  if (!image) throw notFound('Imagen', imageId)

  if (image.product_id !== null) {
    await resetPrimary('product', Number(image.product_id))
  } else if (image.service_id !== null) {
    await resetPrimary('service', Number(image.service_id))
  } else if (image.promotion_id !== null) {
    await resetPrimary('promotion', Number(image.promotion_id))
  }

  await prisma.images.update({ where: { image_id: imageId }, data: { is_primary: true } })
}

async function resetPrimary(kind: ImageParentKind, parentId: number): Promise<void> {
  const where =
    kind === 'product'
      ? { product_id: BigInt(parentId) }
      : kind === 'service'
        ? { service_id: BigInt(parentId) }
        : { promotion_id: BigInt(parentId) }
  await prisma.images.updateMany({ where: where as never, data: { is_primary: false } })
}