import { MessageCircle } from 'lucide-react'
import { useBusinessSettings, getWhatsappUrl } from '@/shared/hooks/useBusinessSettings'

export default function WhatsAppButton() {
  const settings = useBusinessSettings()
  const whatsappUrl = getWhatsappUrl(settings)

  if (!whatsappUrl) return null

  return (
    <a
      href={`${whatsappUrl}?text=Hola,%20me%20gustaria%20recibir%20mas%20informacion`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-gradient-to-tr from-emerald-500 to-green-400 hover:from-emerald-400 hover:to-green-300 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-level-4 shadow-emerald-500/30 transition-all duration-200 hover:scale-110"
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle size={28} />
    </a>
  )
}
