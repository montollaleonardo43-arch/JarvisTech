import { prisma } from '@/lib/db'
import { conflict, notFound } from '@/lib/errors'
import { buildSpringPage, type PageableDescriptor, toOrderBy } from '@/lib/pagination'
import { toServiceCategoryResponse, type ServiceCategoryResponse } from '@/lib/resolvers'
import type { ServiceCategoryInput } from '@/lib/validators'

export async function findAll(pageable: PageableDescriptor) {
  const [rows, total] = await Promise.all([
    prisma.service_categories.findMany({
      where: { active: true },
      orderBy: toOrderBy('serviceCategories', pageable.orderBy),
      skip: pageable.page * pageable.size,
      take: pageable.size,
    }),
    prisma.service_categories.count({ where: { active: true } }),
  ])
  return buildSpringPage(
    rows.map((row) => toServiceCategoryResponse(row)),
    total,
    pageable.page,
    pageable.size,
    pageable.orderBy,
  )
}

export async function findById(id: number): Promise<ServiceCategoryResponse> {
  const row = await prisma.service_categories.findUnique({ where: { service_category_id: id } })
  if (!row || !row.active) throw notFound('Categoria de servicio', id)
  return toServiceCategoryResponse(row)
}

export async function create(input: ServiceCategoryInput): Promise<ServiceCategoryResponse> {
  if ((await prisma.service_categories.count({ where: { name: input.name } })) > 0) {
    throw conflict(`Ya existe una categoria de servicio con el nombre: ${input.name}`)
  }
  const now = new Date()
  const row = await prisma.service_categories.create({
    data: {
      name: input.name,
      description: input.description ?? null,
      active: true,
      created_at: now,
      updated_at: now,
    },
  })
  return toServiceCategoryResponse(row)
}

export async function update(id: number, input: ServiceCategoryInput): Promise<ServiceCategoryResponse> {
  const existing = await prisma.service_categories.findUnique({
    where: { service_category_id: id },
  })
  if (!existing || !existing.active) throw notFound('Categoria de servicio', id)

  if (
    existing.name !== input.name &&
    (await prisma.service_categories.count({ where: { name: input.name } })) > 0
  ) {
    throw conflict(`Ya existe una categoria de servicio con el nombre: ${input.name}`)
  }

  const row = await prisma.service_categories.update({
    where: { service_category_id: id },
    data: {
      name: input.name,
      description: input.description ?? null,
      updated_at: new Date(),
    },
  })
  return toServiceCategoryResponse(row)
}

export async function deactivate(id: number): Promise<void> {
  const existing = await prisma.service_categories.findUnique({
    where: { service_category_id: id },
  })
  if (!existing || !existing.active) throw notFound('Categoria de servicio', id)

  await prisma.service_categories.update({
    where: { service_category_id: id },
    data: { active: false, updated_at: new Date() },
  })
}