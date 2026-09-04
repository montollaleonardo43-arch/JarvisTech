import { useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/hooks/useAuth'
import {
  LayoutDashboard,
  Package,
  Wrench,
  Tags,
  Award,
  Megaphone,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react'

const sidebarLinks = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Productos', path: '/admin/products', icon: Package },
  { name: 'Servicios', path: '/admin/services', icon: Wrench },
  { name: 'Categorias', path: '/admin/categories', icon: Tags },
  { name: 'Marcas', path: '/admin/brands', icon: Award },
  { name: 'Promociones', path: '/admin/promotions', icon: Megaphone },
  { name: 'Configuracion', path: '/admin/settings', icon: Settings },
]

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  const currentPage = sidebarLinks.find((link) => location.pathname.startsWith(link.path))

  return (
    <div className="min-h-screen flex relative">
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a120b] via-[#050604] to-[#020403]" />
        <div className="absolute top-[-10%] right-[-10%] w-[45rem] h-[45rem] rounded-full bg-green-600/20 blur-[130px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40rem] h-[40rem] rounded-full bg-emerald-600/15 blur-[120px]" />
      </div>
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 glass-strong border-r border-white/10 transform transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } laptop:translate-x-0`}
      >
        <div className="flex items-center justify-between h-16 px-lg border-b border-white/10">
          <Link to="/admin/dashboard" className="flex items-center gap-1.5">
            <span className="text-lg font-extrabold bg-gradient-to-r from-green-300 to-emerald-400 bg-clip-text text-transparent">Jarvis</span>
            <span className="text-lg font-bold text-white">Admin</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="laptop:hidden text-text-secondary hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="p-md space-y-1">
          {sidebarLinks.map((link) => {
            const isActive = location.pathname.startsWith(link.path)
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-md py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-green-500/25 to-emerald-700/25 text-white border border-white/15 shadow-lg shadow-green-500/10'
                    : 'text-text-secondary hover:text-white hover:bg-white/10'
                }`}
              >
                <link.icon size={18} className={isActive ? 'text-primary-300' : ''} />
                {link.name}
              </Link>
            )
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-md border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-md py-2.5 rounded-xl text-sm font-medium text-text-secondary hover:text-white hover:bg-white/10 transition-all duration-200"
          >
            <LogOut size={18} />
            Cerrar sesion
          </button>
        </div>
      </aside>

      <div className="flex-1 laptop:ml-64">
        <header className="sticky top-0 z-40 h-16 glass-strong border-b border-white/10 flex items-center justify-between px-lg" style={{ borderTop: 'none', borderLeft: 'none', borderRight: 'none' }}>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="laptop:hidden text-text-secondary hover:text-white"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-2 text-text-secondary text-small">
              <span>Admin</span>
              {currentPage && (
                <>
                  <ChevronRight size={14} />
                  <span className="text-white">{currentPage.name}</span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm text-white font-medium">{user?.name}</p>
              <p className="text-caption text-text-tertiary">{user?.role}</p>
            </div>
            <div className="w-9 h-9 bg-gradient-to-tr from-green-400 to-emerald-700 rounded-full flex items-center justify-center shadow shadow-green-500/30">
              <span className="text-white font-semibold text-sm">
                {user?.name?.charAt(0)}
              </span>
            </div>
          </div>
        </header>

        <main className="p-lg">
          <Outlet />
        </main>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 laptop:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}
