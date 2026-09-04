export interface Product {
  id: number
  name: string
  sku: string
  slug: string
  shortDescription: string
  description: string
  price: number
  offerPrice: number | null
  stock: number
  warranty: string | null
  featured: boolean
  active: boolean
  category: CategorySummary
  brand: BrandSummary
  images: Image[]
  createdAt: string
}

export interface CategorySummary {
  id: number
  name: string
}

export interface BrandSummary {
  id: number
  name: string
  logo: string | null
}

export interface Category {
  id: number
  name: string
  description: string | null
  icon: string | null
  active: boolean
  productCount: number
  createdAt: string
}

export interface Brand {
  id: number
  name: string
  logo: string | null
  active: boolean
  productCount: number
  createdAt: string
}

export interface Service {
  id: number
  name: string
  description: string
  referencePrice: number | null
  estimatedTime: string | null
  requiresDiagnosis: boolean
  warranty: string | null
  featured: boolean
  active: boolean
  serviceCategory: ServiceCategory
  images: Image[]
  createdAt: string
}

export interface ServiceCategory {
  id: number
  name: string
  description: string | null
  active: boolean
}

export interface Promotion {
  id: number
  title: string
  description: string | null
  promotionType: string | null
  startDate: string
  endDate: string
  active: boolean
  images: Image[]
  productCount: number
  serviceCount: number
  createdAt: string
}

export interface Image {
  id: number
  fileName: string
  path: string
  altText: string | null
  width: number | null
  height: number | null
  isPrimary: boolean
  displayOrder: number
}

export interface BusinessSettings {
  id: number
  businessName: string | null
  slogan: string | null
  mission: string | null
  vision: string | null
  phone: string | null
  whatsapp: string | null
  email: string | null
  address: string | null
  weekdaySchedule: string | null
  saturdaySchedule: string | null
  sundaySchedule: string | null
  googleMaps: string | null
  instagram: string | null
  facebook: string | null
  tiktok: string | null
  youtube: string | null
  logoLight: string | null
  logoDark: string | null
  favicon: string | null
  heroImage: string | null
  heroDescription: string | null
}

export interface PaginatedResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export interface CartItem {
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

export interface Cart {
  id: number | null
  guid: string | null
  status: string
  items: CartItem[]
  itemCount: number
  subtotal: number
  shippingCost: number | null
  discount: number | null
  total: number
}
