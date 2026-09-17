import { prisma } from '@/lib/db'
import { badRequest, conflict, notFound } from '@/lib/errors'
import { buildSpringPage, type PageableDescriptor, toOrderBy } from '@/lib/pagination'
import { toCategoryResponse, type CategoryResponse } from '@/lib/resolvers'
import type { CategoryInput } from '@/lib/validators'

async function productCounts(): Promise<Map<number, number>> {
  const groups = await prisma.products.groupBy({
    by: ['category_id'],
    where: { active: true },
    _count: { _all: true },
  })
  return new Map(groups.map((g) => [Number(g.category_id), g._count._all]))
}

export async function findAll(pageable: PageableDescriptor) {
  const [rows, total, counts] = await Promise.all([
    prisma.categories.findMany({
      where: { active: true },
      orderBy: toOrderBy('categories', pageable.orderBy),
      skip: pageable.page * pageable.size,
      take: pageable.size,
    }),
    prisma.categories.count({ where: { active: true } }),
    productCounts(),
  ])
  return buildSpringPage(
    rows.map((row) => toCategoryResponse(row, counts.get(Number(row.category_id)) ?? 0)),
    total,
    pageable.page,
    pageable.size,
    pageable.orderBy,
  )
}

export async function findById(id: number): Promise<CategoryResponse> {
  const row = await prisma.categories.findUnique({ where: { category_id: id } })
  if (!row || !row.active) throw notFound('Categoria', id)
  const count = await prisma.products.count({ where: { active: true, category_id: id } })
  return toCategoryResponse(row, count)
}

export async function create(input: CategoryInput): Promise<CategoryResponse> {
  if ((await prisma.categories.count({ where: { name: input.name } })) > 0) {
    throw conflict(`Ya existe una categoria con el nombre: ${input.name}`)
  }
  const now = new Date()
  const row = await prisma.categories.create({
    data: {
      name: input.name,
      description: input.description ?? null,
      icon: input.icon ?? null,
      active: true,
      created_at: now,
      updated_at: now,
    },
  })
  return toCategoryResponse(row, 0)
}

export async function update(id: number, input: CategoryInput): Promise<CategoryResponse> {
  const existing = await prisma.categories.findUnique({ where: { category_id: id } })
  if (!existing || !existing.active) throw notFound('Categoria', id)

  if (
    existing.name !== input.name &&
    (await prisma.categories.count({ where: { name: input.name } })) > 0
  ) {
    throw conflict(`Ya existe una categoria con el nombre: ${input.name}`)
  }

  const row = await prisma.categories.update({
    where: { category_id: id },
    data: {
      name: input.name,
      description: input.description ?? null,
      icon: input.icon ?? null,
      updated_at: new Date(),
    },
  })
  const count = await prisma.products.count({ where: { active: true, category_id: id } })
  return toCategoryResponse(row, count)
}

export async function deactivate(id: number): Promise<void> {
  const existing = await prisma.categories.findUnique({ where: { category_id: id } })
  if (!existing || !existing.active) throw notFound('Categoria', id)

  const productCount = await prisma.products.count({ where: { active: true, category_id: id } })
  if (productCount > 0) {
    throw badRequest(
      `No se puede desactivar la categoria porque tiene ${productCount} productos asociados`,
    )
  }

  await prisma.categories.update({
    where: { category_id: id },
    data: { active: false, updated_at: new Date() },
  })
}