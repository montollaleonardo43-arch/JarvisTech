import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Lock, Mail, AlertCircle, Cpu } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      await login(email, password)
      navigate('/admin/dashboard')
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { message?: string } } }
      setError(apiError.response?.data?.message || 'Credenciales invalidas')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] w-[45rem] h-[45rem] rounded-full bg-green-600/25 blur-[130px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] rounded-full bg-emerald-600/20 blur-[130px]" />
      </div>

      <div className="w-full max-w-md relative z-10 animate-fade-up">
        <div className="text-center mb-xl">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-green-400 to-emerald-700 rounded-2xl mb-sm shadow-lg shadow-green-500/30">
            <Cpu size={30} className="text-white" />
          </div>
          <h1 className="text-h2 text-white mb-sm">Jarvis Platform</h1>
          <p className="text-text-secondary">Panel de administracion</p>
        </div>

        <div className="glass-strong rounded-2xl p-xl">
          <h2 className="text-h4 text-white mb-lg text-center">Iniciar sesion</h2>

          {error && (
            <div className="flex items-center gap-sm bg-rose-500/15 border border-rose-400/30 text-rose-300 rounded-xl p-md mb-lg text-small">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-lg">
            <div>
              <label htmlFor="email" className="block text-text-secondary text-small mb-sm">
                Email
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@jarvistechnology.cl"
                  required
                  className="w-full glass-input rounded-xl py-3 pl-10 pr-4 text-white text-body placeholder:text-text-disabled"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-text-secondary text-small mb-sm">
                Contrasena
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Tu contrasena"
                  required
                  className="w-full glass-input rounded-xl py-3 pl-10 pr-4 text-white text-body placeholder:text-text-disabled"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-green-400 to-emerald-700 hover:from-green-300 hover:to-emerald-700 text-white font-medium py-3 rounded-xl transition-all duration-200 hover:-translate-y-0.5 shadow-lg shadow-green-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Ingresando...
                </span>
              ) : (
                'Ingresar'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
