import { prisma } from '@/lib/db'
import { notFound } from '@/lib/errors'
import { buildSpringPage, type PageableDescriptor, toOrderBy } from '@/lib/pagination'
import { toServiceResponse, type ServiceResponse } from '@/lib/resolvers'
import type { ServiceInput } from '@/lib/validators'
import type { Prisma } from '@prisma/client'

const serviceInclude = {
  images: true,
  service_categories: true,
} satisfies Prisma.servicesInclude

const activeWhere: Prisma.servicesWhereInput = { active: true }

async function paginate(where: Prisma.servicesWhereInput, pageable: PageableDescriptor) {
  const [rows, total] = await prisma.$transaction([
    prisma.services.findMany({
      where,
      include: serviceInclude,
      skip: pageable.page * pageable.size,
      take: pageable.size,
      orderBy: toOrderBy('services', pageable.orderBy),
    }),
    prisma.services.count({ where }),
  ])
  return buildSpringPage(
    rows.map((row) => toServiceResponse(row)),
    total,
    pageable.page,
    pageable.size,
    pageable.orderBy,
  )
}

export function findAll(pageable: PageableDescriptor) {
  return paginate(activeWhere, pageable)
}

export function findFeatured(pageable: PageableDescriptor) {
  return paginate({ ...activeWhere, featured: true }, pageable)
}

export function search(query: string, pageable: PageableDescriptor) {
  return paginate({ ...activeWhere, name: { contains: query, mode: 'insensitive' } }, pageable)
}

export async function findById(id: number): Promise<ServiceResponse> {
  const row = await prisma.services.findUnique({ where: { service_id: id }, include: serviceInclude })
  if (!row || !row.active) throw notFound('Servicio', id)
  return toServiceResponse(row)
}

export async function create(input: ServiceInput): Promise<ServiceResponse> {
  const serviceCategory = await prisma.service_categories.findUnique({
    where: { service_category_id: input.serviceCategoryId },
  })
  if (!serviceCategory) throw notFound('Categoria de servicio', input.serviceCategoryId)

  const now = new Date()
  const row = await prisma.services.create({
    data: {
      name: input.name,
      description: input.description ?? null,
      reference_price: input.referencePrice ?? null,
      estimated_time: input.estimatedTime ?? null,
      requires_diagnosis: input.requiresDiagnosis ?? false,
      warranty: input.warranty ?? null,
      featured: input.featured ?? false,
      active: true,
      service_category_id: serviceCategory.service_category_id,
      created_at: now,
      updated_at: now,
    },
    include: serviceInclude,
  })
  return toServiceResponse(row)
}

export async function update(id: number, input: ServiceInput): Promise<ServiceResponse> {
  const existing = await prisma.services.findUnique({ where: { service_id: id } })
  if (!existing || !existing.active) throw notFound('Servicio', id)

  const serviceCategory = await prisma.service_categories.findUnique({
    where: { service_category_id: input.serviceCategoryId },
  })
  if (!serviceCategory) throw notFound('Categoria de servicio', input.serviceCategoryId)

  const row = await prisma.services.update({
    where: { service_id: id },
    data: {
      name: input.name,
      description: input.description ?? null,
      reference_price: input.referencePrice ?? null,
      estimated_time: input.estimatedTime ?? null,
      requires_diagnosis: input.requiresDiagnosis ?? existing.requires_diagnosis,
      warranty: input.warranty ?? null,
      featured: input.featured ?? existing.featured,
      service_category_id: serviceCategory.service_category_id,
      updated_at: new Date(),
    },
    include: serviceInclude,
  })
  return toServiceResponse(row)
}

export async function deactivate(id: number): Promise<void> {
  const existing = await prisma.services.findUnique({ where: { service_id: id } })
  if (!existing || !existing.active) throw notFound('Servicio', id)

  await prisma.services.update({
    where: { service_id: id },
    data: { active: false, updated_at: new Date() },
  })
}