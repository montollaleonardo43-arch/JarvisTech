import { fmtDateTime } from '@/lib/format'
import type {
  BrandRow,
  CartWithItems,
  CategoryRow,
  ImageRow,
  ProductRow,
  PromotionRow,
  ServiceCategoryRow,
  ServiceRow,
} from '@/lib/types'

export interface ImageResponse {
  id: number
  fileName: string
  path: string
  altText: string | null
  width: number | null
  height: number | null
  isPrimary: boolean | null
  displayOrder: number | null
}

export function toImageResponse(image: ImageRow): ImageResponse {
  return {
    id: Number(image.image_id),
    fileName: image.file_name,
    path: image.path,
    altText: image.alt_text,
    width: image.width,
    height: image.height,
    isPrimary: image.is_primary,
    displayOrder: image.display_order,
  }
}

export interface ProductResponse {
  id: number
  name: string
  sku: string
  slug: string
  shortDescription: string | null
  description: string | null
  price: number
  offerPrice: number | null
  stock: number
  warranty: string | null
  featured: boolean
  active: boolean
  category: { id: number; name: string }
  brand: { id: number; name: string; logo: string | null }
  images: ImageResponse[]
  createdAt: string | null
}

export function toProductResponse(product: ProductRow): ProductResponse {
  return {
    id: Number(product.product_id),
    name: product.name,
    sku: product.sku,
    slug: product.slug,
    shortDescription: product.short_description,
    description: product.description,
    price: Number(product.price),
    offerPrice: product.offer_price === null ? null : Number(product.offer_price),
    stock: product.stock,
    warranty: product.warranty,
    featured: product.featured,
    active: product.active,
    category: { id: Number(product.categories.category_id), name: product.categories.name },
    brand: {
      id: Number(product.brands.brand_id),
      name: product.brands.name,
      logo: product.brands.logo,
    },
    images: product.images.map(toImageResponse),
    createdAt: fmtDateTime(product.created_at),
  }
}

export interface CategoryResponse {
  id: number
  name: string
  description: string | null
  icon: string | null
  active: boolean
  productCount: number
  createdAt: string | null
}

export function toCategoryResponse(category: CategoryRow, productCount: number): CategoryResponse {
  return {
    id: Number(category.category_id),
    name: category.name,
    description: category.description,
    icon: category.icon,
    active: category.active,
    productCount,
    createdAt: fmtDateTime(category.created_at),
  }
}

export interface BrandResponse {
  id: number
  name: string
  logo: string | null
  active: boolean
  productCount: number
  createdAt: string | null
}

export function toBrandResponse(brand: BrandRow, productCount: number): BrandResponse {
  return {
    id: Number(brand.brand_id),
    name: brand.name,
    logo: brand.logo,
    active: brand.active,
    productCount,
    createdAt: fmtDateTime(brand.created_at),
  }
}

export interface ServiceCategoryResponse {
  id: number
  name: string
  description: string | null
  active: boolean
}

export function toServiceCategoryResponse(category: ServiceCategoryRow): ServiceCategoryResponse {
  return {
    id: Number(category.service_category_id),
    name: category.name,
    description: category.description,
    active: category.active,
  }
}

export interface ServiceResponse {
  id: number
  name: string
  description: string | null
  referencePrice: number | null
  estimatedTime: string | null
  requiresDiagnosis: boolean | null
  warranty: string | null
  featured: boolean
  active: boolean
  serviceCategory: ServiceCategoryResponse
  images: ImageResponse[]
  createdAt: string | null
}

export function toServiceResponse(service: ServiceRow): ServiceResponse {
  return {
    id: Number(service.service_id),
    name: service.name,
    description: service.description,
    referencePrice: service.reference_price === null ? null : Number(service.reference_price),
    estimatedTime: service.estimated_time,
    requiresDiagnosis: service.requires_diagnosis,
    warranty: service.warranty,
    featured: service.featured,
    active: service.active,
    serviceCategory: toServiceCategoryResponse(service.service_categories),
    images: [...service.images]
      .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
      .map(toImageResponse),
    createdAt: fmtDateTime(service.created_at),
  }
}

export interface PromotionResponse {
  id: number
  title: string
  description: string | null
  promotionType: string | null
  startDate: string | null
  endDate: string | null
  active: boolean
  images: ImageResponse[]
  productCount: number
  serviceCount: number
  createdAt: string | null
}

export function toPromotionResponse(promotion: PromotionRow): PromotionResponse {
  return {
    id: Number(promotion.promotion_id),
    title: promotion.title,
    description: promotion.description,
    promotionType: promotion.promotion_type,
    startDate: fmtDateTime(promotion.start_date),
    endDate: fmtDateTime(promotion.end_date),
    active: promotion.active,
    images: [...promotion.images]
      .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
      .map(toImageResponse),
    productCount: promotion.product_promotions.length,
    serviceCount: promotion.service_promotions.length,
    createdAt: fmtDateTime(promotion.created_at),
  }
}

export interface CartItemResponse {
  itemId: number
  productId: number
  name: string
  slug: string
  sku: string
  brand: string
  unitPrice: number
  originalPrice: number
  quantity: number
  subtotal: number
  stock: number
  image: string | null
}

export interface CartResponse {
  id: number | null
  guid: string | null
  status: string
  items: CartItemResponse[]
  itemCount: number
  subtotal: number
  shippingCost: number | null
  discount: number | null
  total: number
}

const round2 = (value: number): number => Math.round(value * 100) / 100

export function toCartResponse(cart: CartWithItems | null): CartResponse {
  if (!cart) {
    return {
      id: null,
      guid: null,
      status: 'ACTIVE',
      items: [],
      itemCount: 0,
      subtotal: 0,
      shippingCost: null,
      discount: null,
      total: 0,
    }
  }

  const items = cart.cart_items.map((item) => {
    const product = item.products
    const unitPrice = product.offer_price === null ? Number(product.price) : Number(product.offer_price)
    const subtotal = round2(unitPrice * item.quantity)
    const primaryImage =
      product.images.find((img) => img.is_primary === true) ?? product.images[0]
    return {
      itemId: Number(item.cart_item_id),
      productId: Number(product.product_id),
      name: product.name,
      slug: product.slug,
      sku: product.sku,
      brand: product.brands.name,
      unitPrice,
      originalPrice: Number(product.price),
      quantity: item.quantity,
      subtotal,
      stock: product.stock,
      image: primaryImage ? primaryImage.path : null,
    }
  })

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0)
  const subtotal = round2(items.reduce((acc, item) => acc + item.subtotal, 0))

  return {
    id: Number(cart.cart_id),
    guid: cart.cart_guid,
    status: cart.status,
    items,
    itemCount,
    subtotal,
    shippingCost: null,
    discount: null,
    total: subtotal,
  }
}