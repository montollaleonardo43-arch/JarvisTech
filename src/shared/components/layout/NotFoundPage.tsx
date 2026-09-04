import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-7xl font-extrabold bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent mb-md">404</p>
        <h1 className="text-h2 text-white mb-md">Pagina no encontrada</h1>
        <p className="text-body-lg text-text-secondary mb-xl">
          La pagina que buscas no existe o fue movida.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-green-400 to-emerald-700 hover:from-green-300 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:-translate-y-0.5 shadow-lg shadow-green-500/25"
        >
          <Home size={18} />
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}
