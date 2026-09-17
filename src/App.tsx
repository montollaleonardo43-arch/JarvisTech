import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './features/auth/hooks/useAuth'
import { CartProvider } from './features/cart/hooks/useCart'
import PublicLayout from './shared/components/layout/PublicLayout'
import ProtectedRoute from './features/auth/components/ProtectedRoute'
import AdminLayout from './features/admin/components/AdminLayout'
import LoginPage from './features/auth/pages/LoginPage'
import RegisterPage from './features/auth/pages/RegisterPage'
import ForgotPasswordPage from './features/auth/pages/ForgotPasswordPage'
import ResetPasswordPage from './features/auth/pages/ResetPasswordPage'
import AccountPage from './features/account/pages/AccountPage'
import DashboardPage from './features/admin/pages/DashboardPage'
import ProductsPage from './features/admin/pages/ProductsPage'
import NewProductPage from './features/admin/pages/NewProductPage'
import CategoriesPage from './features/admin/pages/CategoriesPage'
import BrandsPage from './features/admin/pages/BrandsPage'
import ServicesPage from './features/admin/pages/ServicesPage'
import PromotionsPage from './features/admin/pages/PromotionsPage'
import SettingsPage from './features/admin/pages/SettingsPage'
import HomePage from './features/home/pages/HomePage'
import StorePage from './features/store/pages/StorePage'
import ProductDetailPage from './features/store/pages/ProductDetailPage'
import CartPage from './features/cart/pages/CartPage'
import PublicServicesPage from './features/services/pages/ServicesPage'
import ServiceDetailPage from './features/services/pages/ServiceDetailPage'
import PromotionsPublicPage from './features/promotions/pages/PromotionsPage'
import NotFoundPage from './shared/components/layout/NotFoundPage'

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/store" element={<StorePage />} />
            <Route path="/store/:slug" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/services" element={<PublicServicesPage />} />
            <Route path="/services/:id" element={<ServiceDetailPage />} />
            <Route path="/promotions" element={<PromotionsPublicPage />} />
            <Route
              path="/account"
              element={
                <ProtectedRoute requireAdmin={false}>
                  <AccountPage />
                </ProtectedRoute>
              }
            />
          </Route>

          <Route path="/admin/login" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          <Route
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/admin/dashboard" element={<DashboardPage />} />
            <Route path="/admin/products/new" element={<NewProductPage />} />
            <Route path="/admin/products" element={<ProductsPage />} />
            <Route path="/admin/categories" element={<CategoriesPage />} />
            <Route path="/admin/brands" element={<BrandsPage />} />
            <Route path="/admin/services" element={<ServicesPage />} />
            <Route path="/admin/promotions" element={<PromotionsPage />} />
            <Route path="/admin/settings" element={<SettingsPage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </CartProvider>
    </AuthProvider>
  )
}

export default App
