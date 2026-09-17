export interface SpringSort {
  empty: boolean
  sorted: boolean
  unsorted: boolean
  properties?: Array<{
    direction: 'ASC' | 'DESC'
    property: string
    ignoreCase: boolean
    nullHandling: string
    ascending: boolean
    descending: boolean
  }>
}

export interface PageableDescriptor {
  page: number
  size: number
  orderBy: { column: string; direction: 'asc' | 'desc' } | null
}

export function parsePageable(url: URL, defaultSize: number): PageableDescriptor {
  const rawPage = Number.parseInt(url.searchParams.get('page') ?? '0', 10)
  const page = Number.isNaN(rawPage) || rawPage < 0 ? 0 : rawPage

  const rawSize = Number.parseInt(url.searchParams.get('size') ?? String(defaultSize), 10)
  const size = Number.isNaN(rawSize) || rawSize <= 0 ? defaultSize : rawSize

  const sortParam = url.searchParams.get('sort')
  let orderBy: PageableDescriptor['orderBy'] = null
  if (sortParam) {
    const [property, direction] = sortParam.split(',')
    if (property) {
      orderBy = {
        column: property,
        direction: direction?.toUpperCase() === 'DESC' ? 'desc' : 'asc',
      }
    }
  }

  return { page, size, orderBy }
}

const unsorted = (): SpringSort => ({ empty: true, sorted: false, unsorted: true })

export function sorted(
  direction: 'ASC' | 'DESC',
  property: string,
): SpringSort {
  return {
    empty: false,
    sorted: true,
    unsorted: false,
    properties: [
      {
        direction,
        property,
        ignoreCase: false,
        nullHandling: 'NATIVE',
        ascending: direction === 'ASC',
        descending: direction === 'DESC',
      },
    ],
  }
}

export interface SpringPage<T> {
  content: T[]
  pageable: {
    sort: SpringSort
    offset: number
    pageNumber: number
    pageSize: number
    paged: boolean
    unpaged: boolean
  }
  totalPages: number
  totalElements: number
  last: boolean
  size: number
  number: number
  sort: SpringSort
  first: boolean
  numberOfElements: number
  empty: boolean
}

export function buildSpringPage<T>(
  content: T[],
  totalElements: number,
  page: number,
  size: number,
  sortDescriptor: PageableDescriptor['orderBy'],
): SpringPage<T> {
  const totalPages = totalElements === 0 ? 0 : Math.ceil(totalElements / size)
  const sortValue: SpringSort =
    sortDescriptor && sortDescriptor.column
      ? sorted(sortDescriptor.direction === 'desc' ? 'DESC' : 'ASC', sortDescriptor.column)
      : unsorted()

  return {
    content,
    pageable: {
      sort: sortValue,
      offset: page * size,
      pageNumber: page,
      pageSize: size,
      paged: true,
      unpaged: false,
    },
    totalPages,
    totalElements,
    last: page === totalPages - 1 || totalElements === 0,
    size,
    number: page,
    sort: sortValue,
    first: page === 0,
    numberOfElements: content.length,
    empty: content.length === 0,
  }
}

const SORTABLE_COLUMNS: Record<string, Record<string, string>> = {
  products: { id: 'product_id', name: 'name', createdAt: 'created_at', price: 'price', stock: 'stock' },
  categories: { id: 'category_id', name: 'name', createdAt: 'created_at' },
  brands: { id: 'brand_id', name: 'name', createdAt: 'created_at' },
  services: { id: 'service_id', name: 'name', createdAt: 'created_at' },
  serviceCategories: { id: 'service_category_id', name: 'name', createdAt: 'created_at' },
  promotions: { id: 'promotion_id', title: 'title', createdAt: 'created_at', startDate: 'start_date', endDate: 'end_date' },
}

export function toOrderBy(
  table: keyof typeof SORTABLE_COLUMNS,
  orderBy: PageableDescriptor['orderBy'],
): Record<string, 'asc' | 'desc'> | undefined {
  if (!orderBy || !orderBy.column) return undefined
  const column = SORTABLE_COLUMNS[table][orderBy.column]
  if (!column) return undefined
  return { [column]: orderBy.direction }
}