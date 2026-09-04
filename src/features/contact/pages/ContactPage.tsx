import { MapPin, Phone, Mail, Clock, MessageCircle } from 'lucide-react'
import { useBusinessSettings, getWhatsappUrl } from '@/shared/hooks/useBusinessSettings'

export default function ContactPage() {
  const settings = useBusinessSettings()
  const whatsappUrl = getWhatsappUrl(settings)

  return (
    <div className="pt-24">
      <section className="section-spacing">
        <div className="container-app">
          <h1 className="text-h1 text-white mb-lg">Contacto</h1>
          <p className="text-text-secondary mb-xl">
            Estamos aqui para ayudarte. Contactanos por el canal que prefieras.
          </p>

          <div className="grid grid-cols-1 tablet:grid-cols-2 gap-xl">
            <div className="space-y-lg">
              {settings?.phone && (
                <div className="card">
                  <div className="flex items-start gap-md">
                    <Phone className="text-primary-300 mt-1" size={20} />
                    <div>
                      <h3 className="text-h5 text-white mb-sm">Telefono</h3>
                      <p className="text-text-secondary">{settings.phone}</p>
                    </div>
                  </div>
                </div>
              )}

              {whatsappUrl && (
                <div className="card">
                  <div className="flex items-start gap-md">
                    <MessageCircle className="text-emerald-400 mt-1" size={20} />
                    <div>
                      <h3 className="text-h5 text-white mb-sm">WhatsApp</h3>
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-400 hover:text-emerald-300 transition-colors"
                      >
                        Enviar mensaje
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {settings?.email && (
                <div className="card">
                  <div className="flex items-start gap-md">
                    <Mail className="text-primary-300 mt-1" size={20} />
                    <div>
                      <h3 className="text-h5 text-white mb-sm">Email</h3>
                      <p className="text-text-secondary break-all">{settings.email}</p>
                    </div>
                  </div>
                </div>
              )}

              {settings?.address && (
                <div className="card">
                  <div className="flex items-start gap-md">
                    <MapPin className="text-primary-300 mt-1" size={20} />
                    <div>
                      <h3 className="text-h5 text-white mb-sm">Direccion</h3>
                      <p className="text-text-secondary">{settings.address}</p>
                    </div>
                  </div>
                </div>
              )}

              {(settings?.weekdaySchedule || settings?.saturdaySchedule || settings?.sundaySchedule) && (
                <div className="card">
                  <div className="flex items-start gap-md">
                    <Clock className="text-primary-300 mt-1" size={20} />
                    <div>
                      <h3 className="text-h5 text-white mb-sm">Horario</h3>
                      <ul className="text-text-secondary text-small space-y-1">
                        {settings?.weekdaySchedule && <li>Lunes a Viernes: {settings.weekdaySchedule}</li>}
                        {settings?.saturdaySchedule && <li>Sabado: {settings.saturdaySchedule}</li>}
                        {settings?.sundaySchedule && <li>Domingo: {settings.sundaySchedule}</li>}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="glass rounded-xl h-[500px] flex items-center justify-center overflow-hidden">
              {settings?.googleMaps ? (
                <iframe
                  src={settings.googleMaps}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  title="Google Maps"
                />
              ) : (
                <span className="text-text-tertiary">Google Maps</span>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
