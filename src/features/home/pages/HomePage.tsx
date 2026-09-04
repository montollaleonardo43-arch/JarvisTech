import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Shield, Clock, Award, Wrench, Phone, MessageCircle, Mail, MapPin } from 'lucide-react'
import { storeApi } from '@/features/store/services/storeApi'
import { servicesApi } from '@/features/services/services/publicServicesApi'
import { useBusinessSettings, getWhatsappUrl } from '@/shared/hooks/useBusinessSettings'
import { useRevealOnScroll } from '@/shared/hooks/useRevealOnScroll'
import type { Product, Service } from '@/shared/types'

const benefits = [
  { icon: Shield, title: 'Diagnóstico Honesto', description: 'Explicamos el problema antes de cualquier reparación, sin sorpresas ni costos ocultos.' },
  { icon: Clock, title: 'Atención Rápida', description: 'Tiempos de respuesta eficientes para que no pierdas tu dispositivo por más tiempo del necesario.' },
  { icon: Award, title: 'Servicio Profesional', description: 'Técnicos especializados con amplia experiencia en múltiples marcas y modelos.' },
]

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [featuredServices, setFeaturedServices] = useState<Service[]>([])
  const settings = useBusinessSettings()
  const whatsappUrl = getWhatsappUrl(settings)
  useRevealOnScroll([featuredProducts.length, featuredServices.length])

  useEffect(() => {
    storeApi.getFeatured(0, 4).then(({ data }: { data: { content: Product[] } }) => setFeaturedProducts(data.content)).catch(() => {})
    servicesApi.getFeatured(0, 4).then(({ data }: { data: { content: Service[] } }) => setFeaturedServices(data.content)).catch(() => {})
  }, [])

  return (
    <div>
      <section className="relative min-h-[70vh] laptop:min-h-[88vh] flex items-center pt-24">
        {settings?.heroImage && (
          <img
            src={settings.heroImage}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/25 to-transparent" />
        <div className="container-app relative z-10 py-16 laptop:py-0">
          <div className="max-w-2xl">
            <div className="glass-chip inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium text-white/90 mb-md animate-fade-up">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Servicio técnico especializado
            </div>
            <h1 className="text-3xl sm:text-4xl laptop:text-display text-white mb-lg leading-tight animate-fade-up" style={{ animationDelay: '0.08s' }}>
              {settings?.slogan || 'Soluciones tecnológicas confiables'}
            </h1>
            <p className="text-sm sm:text-body-lg text-text-secondary mb-xl max-w-lg animate-fade-up" style={{ animationDelay: '0.16s' }}>
              {settings?.heroDescription || 'Reparación profesional de dispositivos electrónicos y selección de accesorios tecnológicos de calidad. Tu confianza es nuestra prioridad.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-md animate-fade-up" style={{ animationDelay: '0.24s' }}>
              <Link
                to="/store"
                className="btn-shine inline-flex items-center justify-center gap-2 bg-gradient-to-r from-green-400 to-emerald-700 hover:from-green-300 hover:to-emerald-700 text-white px-8 py-3.5 rounded-xl font-medium transition-all duration-200 hover:-translate-y-0.5 shadow-lg shadow-green-500/30"
              >
                Ver Productos
                <ArrowRight size={18} />
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center justify-center gap-2 glass hover:bg-white/10 hover:border-white/25 text-white px-8 py-3.5 rounded-xl font-medium transition-all duration-200 hover:-translate-y-0.5"
              >
                Ver Servicios
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section-spacing">
        <div className="container-app">
          <div className="text-center mb-2xl reveal">
            <span className="inline-block glass-chip px-4 py-1 rounded-full text-xs font-medium text-primary-300 mb-md">Nuestra ventaja</span>
            <h2 className="text-h1 text-white mb-sm">¿Por qué elegirnos?</h2>
            <p className="text-text-secondary max-w-2xl mx-auto">Más que un servicio, una experiencia de confianza respaldada por la calidad y el compromiso.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-xl">
            {benefits.map((benefit, i) => (
              <div
                key={benefit.title}
                data-delay={(i % 3) + 1}
                className="reveal group glass rounded-xl p-lg text-center hover:-translate-y-1.5 hover:border-primary-400/30 transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-green-500/30 to-emerald-700/30 border border-white/15 rounded-2xl mb-md group-hover:animate-glow transition-all">
                  <benefit.icon className="text-primary-300 group-hover:scale-110 transition-transform duration-300" size={28} />
                </div>
                <h3 className="text-h4 text-white mb-sm">{benefit.title}</h3>
                <p className="text-text-secondary text-small">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-spacing">
        <div className="container-app">
          <div className="text-center mb-2xl reveal">
            <h2 className="text-h1 text-white mb-sm">Productos Destacados</h2>
            <p className="text-text-secondary">Accesorios tecnológicos seleccionados cuidadosamente para ti.</p>
          </div>
          {featuredProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-lg">
                {featuredProducts.map((product, i) => (
                  <Link
                    key={product.id}
                    to={`/store/${product.slug}`}
                    data-delay={(i % 4) + 1}
                    className="reveal group glass rounded-xl overflow-hidden hover:border-white/25 hover:-translate-y-1.5 transition-all duration-300"
                  >
                    <div className="w-full h-40 bg-white/5 flex items-center justify-center overflow-hidden">
                      {product.images.length > 0 ? (
                        <img src={product.images[0]!.path} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <span className="text-text-tertiary text-xs">Sin imagen</span>
                      )}
                    </div>
                    <div className="p-md">
                      <h3 className="text-h5 text-white mb-sm line-clamp-1 group-hover:text-primary-300 transition-colors">{product.name}</h3>
                      <span className="text-primary-300 font-semibold text-sm">
                        {product.offerPrice ? `$${product.offerPrice.toLocaleString()}` : `$${product.price.toLocaleString()}`}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="text-center mt-xl reveal">
                <Link to="/store" className="inline-flex items-center gap-2 text-primary-300 hover:text-white font-medium transition-colors group">
                  Ver tienda completa <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center reveal">
              <Link to="/store" className="inline-flex items-center gap-2 text-primary-300 hover:text-white font-medium transition-colors group">
                Ver tienda completa <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="section-spacing">
        <div className="container-app">
          <div className="text-center mb-2xl reveal">
            <h2 className="text-h1 text-white mb-sm">Nuestros Servicios</h2>
            <p className="text-text-secondary">Reparaciones profesionales con garantía y transparencia.</p>
          </div>
          {featuredServices.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-lg">
                {featuredServices.map((service, i) => (
                  <Link
                    key={service.id}
                    to={`/services/${service.id}`}
                    data-delay={(i % 4) + 1}
                    className="reveal group glass rounded-xl p-lg hover:border-white/25 hover:-translate-y-1.5 transition-all duration-300"
                  >
                    <div className="w-10 h-10 bg-gradient-to-tr from-green-500/30 to-emerald-700/30 border border-white/15 rounded-xl flex items-center justify-center mb-md group-hover:scale-110 group-hover:animate-glow transition-all">
                      <Wrench size={20} className="text-primary-300" />
                    </div>
                    <h3 className="text-h5 text-white mb-sm group-hover:text-primary-300 transition-colors">{service.name}</h3>
                    {service.referencePrice && (
                      <span className="text-primary-300 font-semibold text-sm">Desde ${service.referencePrice.toLocaleString()}</span>
                    )}
                  </Link>
                ))}
              </div>
              <div className="text-center mt-xl reveal">
                <Link to="/services" className="inline-flex items-center gap-2 text-primary-300 hover:text-white font-medium transition-colors group">
                  Ver todos los servicios <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center reveal">
              <Link to="/services" className="inline-flex items-center gap-2 text-primary-300 hover:text-white font-medium transition-colors group">
                Ver todos los servicios <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="section-spacing">
        <div className="container-app">
          <div className="text-center mb-2xl reveal">
            <h2 className="text-h1 text-white mb-sm">Contáctanos</h2>
            <p className="text-text-secondary">Estamos aquí para ayudarte. Contactanos por el canal que prefieras.</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-xl">
            <div className="space-y-lg">
              {settings?.phone && (
                <div className="card reveal" data-delay="1">
                  <div className="flex items-start gap-md">
                    <Phone className="text-primary-300 mt-1" size={20} />
                    <div>
                      <h3 className="text-h5 text-white mb-sm">Teléfono</h3>
                      <p className="text-text-secondary">{settings.phone}</p>
                    </div>
                  </div>
                </div>
              )}
              {whatsappUrl && (
                <div className="card reveal" data-delay="2">
                  <div className="flex items-start gap-md">
                    <MessageCircle className="text-emerald-400 mt-1" size={20} />
                    <div>
                      <h3 className="text-h5 text-white mb-sm">WhatsApp</h3>
                      <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 transition-colors">
                        Enviar mensaje
                      </a>
                    </div>
                  </div>
                </div>
              )}
              {settings?.email && (
                <div className="card reveal" data-delay="3">
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
                <div className="card reveal" data-delay="4">
                  <div className="flex items-start gap-md">
                    <MapPin className="text-primary-300 mt-1" size={20} />
                    <div>
                      <h3 className="text-h5 text-white mb-sm">Dirección</h3>
                      <p className="text-text-secondary">{settings.address}</p>
                    </div>
                  </div>
                </div>
              )}
              {(settings?.weekdaySchedule || settings?.saturdaySchedule || settings?.sundaySchedule) && (
                <div className="card reveal" data-delay="5">
                  <div className="flex items-start gap-md">
                    <Clock className="text-primary-300 mt-1" size={20} />
                    <div>
                      <h3 className="text-h5 text-white mb-sm">Horario</h3>
                      <ul className="text-text-secondary text-small space-y-1">
                        {settings?.weekdaySchedule && <li>Lunes a Viernes: {settings.weekdaySchedule}</li>}
                        {settings?.saturdaySchedule && <li>Sábado: {settings.saturdaySchedule}</li>}
                        {settings?.sundaySchedule && <li>Domingo: {settings.sundaySchedule}</li>}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="glass rounded-xl h-[400px] laptop:h-full min-h-[400px] flex items-center justify-center overflow-hidden reveal" data-delay="2">
              {(settings?.googleMaps || settings?.address) ? (
                <iframe
                  src={settings?.googleMaps || `https://maps.google.com/maps?q=${encodeURIComponent(settings?.address || '')}&t=&z=16&ie=UTF8&iwloc=&output=embed`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
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
