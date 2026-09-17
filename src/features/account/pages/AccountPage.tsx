import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { Mail, Shield, LogOut, Package, ChevronRight } from 'lucide-react'

export default function AccountPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="pt-24 pb-16">
      <div className="container-app">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-xl">
            <div>
              <h1 className="text-h2 text-text-primary">Mi Cuenta</h1>
              <p className="text-text-secondary text-body mt-1">Administra tu informacion y tus pedidos</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-text-secondary hover:text-text-primary text-sm font-medium transition-colors"
            >
              <LogOut size={16} />
              Cerrar sesion
            </button>
          </div>

          <div className="space-y-xl">
            <div className="glass-strong rounded-2xl p-xl">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-green-400 to-emerald-700 flex items-center justify-center shadow-lg shadow-green-500/30">
                  <span className="text-white text-xl font-bold">
                    {user?.name?.charAt(0) || 'C'}
                  </span>
                </div>
                <div className="min-w-0">
                  <h2 className="text-h4 text-text-primary truncate">{user?.name || 'Cliente'}</h2>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-text-secondary text-small">
                    <span className="flex items-center gap-1.5">
                      <Mail size={14} />
                      {user?.email}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Shield size={14} />
                      Rol: {user?.role || 'CUSTOMER'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass rounded-2xl overflow-hidden">
              <div className="p-xl">
                <div className="flex items-center gap-3 mb-lg">
                  <Package size={20} className="text-primary-300" />
                  <h2 className="text-h4 text-text-primary">Mis pedidos</h2>
                </div>
                <p className="text-text-secondary text-body">
                  El historial y seguimiento de tus pedidos estara disponible proximamente.
                </p>
              </div>
            </div>

            <Link
              to="/store"
              className="flex items-center justify-between glass rounded-2xl p-lg hover:bg-white/10 transition-colors"
            >
              <div>
                <h3 className="text-text-primary text-sm font-medium">Seguir comprando</h3>
                <p className="text-text-tertiary text-caption mt-0.5">Explora la tienda de productos</p>
              </div>
              <ChevronRight size={20} className="text-text-tertiary" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}