import { Check } from 'lucide-react'

interface Step {
  label: string
}

interface ProductStepperProps {
  steps: Step[]
  currentStep: number
}

export default function ProductStepper({ steps, currentStep }: ProductStepperProps) {
  return (
    <div className="flex items-center justify-center">
      {steps.map((step, index) => {
        const isCompleted = index < currentStep
        const isCurrent = index === currentStep

        return (
          <div key={step.label} className="flex items-center">
            <div className="flex flex-col items-center gap-2">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                  isCompleted
                    ? 'bg-gradient-to-r from-green-400 to-emerald-700 text-white shadow shadow-green-500/30'
                    : isCurrent
                      ? 'bg-white/10 text-primary-200 ring-2 ring-primary-400 border border-white/20'
                      : 'bg-white/5 border border-white/15 text-text-tertiary'
                }`}
              >
                {isCompleted ? <Check size={18} /> : index + 1}
              </div>
              <span
                className={`text-small font-medium whitespace-nowrap ${
                  isCurrent ? 'text-white' : isCompleted ? 'text-primary-300' : 'text-text-tertiary'
                }`}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`w-16 sm:w-24 h-0.5 mx-3 mt-[-20px] rounded-full transition-colors duration-300 ${
                  index < currentStep ? 'bg-gradient-to-r from-green-400 to-emerald-700' : 'bg-white/10'
                }`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
