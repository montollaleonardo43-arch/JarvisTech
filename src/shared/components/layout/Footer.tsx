import { Link } from 'react-router-dom'
import { MessageCircle, Instagram, Facebook, Youtube, MapPin, Phone, Mail, Clock } from 'lucide-react'
import { useBusinessSettings, getWhatsappUrl } from '@/shared/hooks/useBusinessSettings'

const navLinks = [
  { name: 'Inicio', path: '/' },
  { name: 'Tienda', path: '/store' },
  { name: 'Servicios', path: '/services' },
  { name: 'Promociones', path: '/promotions' },
]

export default function Footer() {
  const settings = useBusinessSettings()
  const whatsappUrl = getWhatsappUrl(settings)

  return (
    <footer className="mt-auto glass-strong">
      <div className="container-app py-3xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-xl">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-md">
              {settings?.logoLight && (
                <img src={settings.logoLight} alt={settings.businessName || 'Logo'} className="h-10 w-auto drop-shadow" />
              )}
              {(() => {
                const name = settings?.businessName || 'Jarvis'
                const parts = name.split(' ')
                return (
                  <>
                    <span className="text-xl font-extrabold text-white">{parts[0]}</span>
                    {parts.length > 1 && (
                      <span className="text-xl font-extrabold bg-gradient-to-r from-green-300 to-emerald-400 bg-clip-text text-transparent">
                        {parts.slice(1).join(' ')}
                      </span>
                    )}
                  </>
                )
              })()}
            </Link>
            {settings?.slogan && (
              <p className="text-text-secondary text-small leading-relaxed">{settings.slogan}</p>
            )}
          </div>

          <div>
            <h4 className="text-h5 text-white mb-md">Navegacion</h4>
            <ul className="space-y-sm">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-text-secondary hover:text-white text-small transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-h5 text-white mb-md">Contacto</h4>
            <ul className="space-y-sm text-text-secondary text-small">
              {settings?.phone && (
                <li className="flex items-center gap-2">
                  <Phone size={14} className="text-primary-300 flex-shrink-0" />
                  <span>{settings.phone}</span>
                </li>
              )}
              {settings?.email && (
                <li className="flex items-center gap-2">
                  <Mail size={14} className="text-primary-300 flex-shrink-0" />
                  <span className="break-all">{settings.email}</span>
                </li>
              )}
              {settings?.address && (
                <li className="flex items-center gap-2">
                  <MapPin size={14} className="text-primary-300 flex-shrink-0" />
                  <span>{settings.address}</span>
                </li>
              )}
            </ul>
          </div>

          <div>
            <h4 className="text-h5 text-white mb-md">Horario</h4>
            <ul className="space-y-sm text-text-secondary text-small">
              {settings?.weekdaySchedule && (
                <li className="flex items-center gap-2">
                  <Clock size={14} className="text-primary-300 flex-shrink-0" />
                  <span>Lunes a Viernes: {settings.weekdaySchedule}</span>
                </li>
              )}
              {settings?.saturdaySchedule && (
                <li className="flex items-center gap-2">
                  <Clock size={14} className="text-primary-300 flex-shrink-0" />
                  <span>Sabado: {settings.saturdaySchedule}</span>
                </li>
              )}
              {settings?.sundaySchedule && (
                <li className="flex items-center gap-2">
                  <Clock size={14} className="text-primary-300 flex-shrink-0" />
                  <span>Domingo: {settings.sundaySchedule}</span>
                </li>
              )}
            </ul>
            <div className="flex gap-md mt-md">
              {whatsappUrl && (
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 transition-colors" aria-label="WhatsApp">
                  <MessageCircle size={20} />
                </a>
              )}
              {settings?.instagram && (
                <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-pink-400 transition-colors" aria-label="Instagram">
                  <Instagram size={20} />
                </a>
              )}
              {settings?.facebook && (
                <a href={settings.facebook} target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-blue-400 transition-colors" aria-label="Facebook">
                  <Facebook size={20} />
                </a>
              )}
              {settings?.youtube && (
                <a href={settings.youtube} target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-red-400 transition-colors" aria-label="YouTube">
                  <Youtube size={20} />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-app py-md flex flex-col tablet:flex-row justify-between items-center gap-sm">
          <p className="text-text-tertiary text-caption">
            &copy; {new Date().getFullYear()} {settings?.businessName || 'Jarvis Technology'}. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
