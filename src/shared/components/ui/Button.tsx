import { ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className = '', children, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0'

    const variants = {
      primary:
        'bg-gradient-to-r from-green-400 to-emerald-700 hover:from-green-300 hover:to-emerald-700 text-white shadow-lg shadow-green-500/25',
      secondary:
        'glass text-white hover:border-white/30 hover:bg-white/10',
      ghost: 'bg-transparent hover:bg-white/10 text-primary-300',
      outline:
        'bg-transparent border border-primary-400/40 text-primary-300 hover:bg-primary-400/10',
      danger:
        'bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-400 hover:to-red-400 text-white shadow-lg shadow-rose-500/25',
    }

    const sizes = {
      sm: 'px-3 py-1.5 text-small',
      md: 'px-6 py-3 text-body',
      lg: 'px-8 py-4 text-body-lg',
    }

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button
