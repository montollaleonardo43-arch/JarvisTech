import { useState, FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Lock, AlertCircle, CheckCircle2, KeyRound } from 'lucide-react'
import { authService } from '../services/authService'

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') || ''
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (!token) {
      setError('El enlace de recuperacion es invalido o no tiene token')
      return
    }

    if (password !== confirm) {
      setError('Las contrasenas no coinciden')
      return
    }

    setIsSubmitting(true)

    try {
      await authService.resetPassword(token, password)
      setSuccess(true)
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { message?: string } } }
      setError(apiError.response?.data?.message || 'El enlace es invalido o ha expirado')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] w-[45rem] h-[45rem] rounded-full bg-green-600/25 blur-[130px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] rounded-full bg-emerald-600/20 blur-[130px]" />
      </div>

      <div className="w-full max-w-md relative z-10 animate-fade-up">
        <div className="text-center mb-xl">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-green-400 to-emerald-700 rounded-2xl mb-sm shadow-lg shadow-green-500/30">
            <KeyRound size={30} className="text-white" />
          </div>
          <h1 className="text-h2 text-text-primary mb-sm">Nueva contrasena</h1>
          <p className="text-text-secondary">Elige una nueva contrasena para tu cuenta</p>
        </div>

        <div className="glass-strong rounded-2xl p-xl">
          {success ? (
            <div className="text-center">
              <CheckCircle2 size={40} className="mx-auto mb-md text-emerald-400" />
              <p className="text-text-primary text-body font-medium mb-sm">Contrasena actualizada</p>
              <p className="text-text-secondary text-small">
                Ya puedes iniciar sesion con tu nueva contrasena.
              </p>
              <Link
                to="/login"
                className="inline-block mt-lg bg-gradient-to-r from-green-400 to-emerald-700 hover:from-green-300 hover:to-emerald-700 text-white font-medium px-6 py-3 rounded-xl transition-all duration-200 hover:-translate-y-0.5 shadow-lg shadow-green-500/25"
              >
                Iniciar sesion
              </Link>
            </div>
          ) : (
            <>
              {error && (
                <div className="flex items-center gap-sm bg-rose-500/15 border border-rose-400/30 text-rose-300 rounded-xl p-md mb-lg text-small">
                  <AlertCircle size={18} />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-lg">
                <div>
                  <label htmlFor="password" className="block text-text-secondary text-small mb-sm">
                    Nueva contrasena
                  </label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimo 6 caracteres"
                      minLength={6}
                      required
                      className="w-full glass-input rounded-xl py-3 pl-10 pr-4 text-text-primary text-body placeholder:text-text-disabled"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="confirm" className="block text-text-secondary text-small mb-sm">
                    Repite la contrasena
                  </label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
                    <input
                      id="confirm"
                      type="password"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      placeholder="Repite la contrasena"
                      minLength={6}
                      required
                      className="w-full glass-input rounded-xl py-3 pl-10 pr-4 text-text-primary text-body placeholder:text-text-disabled"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-green-400 to-emerald-700 hover:from-green-300 hover:to-emerald-700 text-white font-medium py-3 rounded-xl transition-all duration-200 hover:-translate-y-0.5 shadow-lg shadow-green-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                  {isSubmitting ? 'Guardando...' : 'Guardar nueva contrasena'}
                </button>
              </form>

              <p className="text-center text-text-secondary text-small mt-lg">
                <Link to="/login" className="text-primary-300 hover:text-white font-medium">
                  Volver al inicio de sesion
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}