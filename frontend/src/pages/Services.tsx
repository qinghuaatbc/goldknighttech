import { ArrowRight, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import ReadAloud from '../components/ReadAloud'

const services = [
  { emoji: '🛡️', title: 'Security Systems', subtitle: 'Complete alarm installation with 24/7 monitoring', desc: 'Complete alarm system installation including motion sensors, door/window contacts, glass break detectors, and 24/7 monitoring. We work with DSC, Vista, and Honeywell panels to ensure your home and family are protected around the clock.', features: ['Zone-based alarm systems', 'Motion & glass break detectors', 'Door/window sensors', '24/7 professional monitoring', 'Smartphone alerts & remote arm/disarm'], color: 'from-violet-500 to-purple-600' },
  { emoji: '💡', title: 'Smart Lighting', subtitle: 'Intelligent lighting control for any mood', desc: 'Transform your home with intelligent lighting control. Automated schedules, dimming scenes, and remote access let you create the perfect ambiance while saving energy. Works with voice assistants and your smartphone.', features: ['Automated schedules & routines', 'Dimming & scene control', 'Remote access via app', 'Energy savings & automation', 'Voice control (Alexa, Google, Siri)'], color: 'from-amber-500 to-orange-600' },
  { emoji: '📹', title: 'Surveillance & CCTV', subtitle: 'Keep an eye on your property anywhere', desc: 'High-definition security cameras with remote viewing, motion-triggered recording, and cloud storage options. Monitor your property from anywhere in the world with crystal-clear video quality.', features: ['HD/4K camera systems', 'Remote viewing on any device', 'Motion-triggered recording', 'Night vision & wide dynamic range', 'Cloud & local storage options'], color: 'from-sky-500 to-blue-600' },
  { emoji: '🔑', title: 'Access Control', subtitle: 'Seamless and secure entry management', desc: 'Smart locks, video intercom systems, and gate control for seamless entry management. Keyless entry with PIN codes, smartphones, or biometrics. Complete access logs and remote control.', features: ['Smart locks & keyless entry', 'Video doorbell & intercom', 'Gate & garage control', 'Remote access & temporary codes', 'Detailed access logs'], color: 'from-pink-500 to-rose-600' },
  { emoji: '🌐', title: 'Home Networking', subtitle: 'Reliable connectivity everywhere', desc: 'Whole-home WiFi, wired Ethernet, and structured cabling for reliable connectivity across all your smart devices. No dead zones, no buffering, no compromises on speed.', features: ['Mesh WiFi systems', 'Wired Ethernet backbone', 'Structured cabling', 'Network security & VLAN', 'Device optimization & QoS'], color: 'from-emerald-500 to-teal-600' },
  { emoji: '🎬', title: 'Home Theater', subtitle: 'Cinema-grade entertainment at home', desc: 'Professional home theater design and installation with surround sound, projection, and smart control. Experience cinema-quality picture and audio in the comfort of your own home.', features: ['Surround sound systems', 'Projector & screen setups', 'Acoustic treatment', 'Smart universal control', 'Multi-zone audio/video'], color: 'from-purple-500 to-violet-600' },
  { emoji: '🎵', title: 'Multi-Room Audio', subtitle: 'Music in every room, perfectly synced', desc: 'Whole-home audio systems with independent zone control, streaming services integration, and high-fidelity speakers throughout your home. Enjoy your favorite music in every room.', features: ['Independent zone control', 'Streaming services (Spotify, TIDAL)', 'In-ceiling & in-wall speakers', 'Outdoor audio systems', 'Whole-home synchronization'], color: 'from-orange-500 to-amber-600' },
  { emoji: '📱', title: 'Smart Home Integration', subtitle: 'One app to control it all', desc: 'Unified control of all your smart home systems through a single, intuitive interface. Compatible with Alexa, Google Home, and Apple HomeKit for seamless voice control and automation.', features: ['Single app for all systems', 'Voice assistant integration', 'Custom automation routines', 'Remote monitoring & alerts', 'Professional programming & support'], color: 'from-violet-500 to-pink-600' },
]

export default function Services() {
  const { t } = useTranslation()
  return (
    <div>
      <section className="relative overflow-hidden hero-gradient py-24 md:py-28 lg:py-32">
        <div className="absolute inset-0 bg-grid-light opacity-[0.06]" />
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-white/10 rounded-full blur-[100px] animate-float" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center relative">
          <div className="tag-white mb-5"><Sparkles className="w-4 h-4" /> {t('services.badge')}</div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-extrabold text-white mb-3">{t('services.title')}</h1>
          <p className="text-white/70 text-xl max-w-2xl mx-auto">{t('services.subtitle')}</p>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-6">
          {services.map((s, i) => (
            <div key={i} className="card-hover p-8 md:p-10 animate-in" style={{ animationDelay: `${i * 0.04}s` }}>
              <div className="grid md:grid-cols-5 gap-8">
                <div className="md:col-span-2">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center text-3xl shadow-lg mb-4`}>{s.emoji}</div>
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="text-2xl font-display font-bold text-gray-900 mb-1">{s.title}</h2>
                    <ReadAloud text={`${s.title}. ${s.subtitle}. ${s.desc}. ${s.features.join('. ')}`} label="" className="shrink-0" />
                  </div>
                  <p className="text-violet-600 font-medium text-sm mb-3">{s.subtitle}</p>
                  <p className="text-gray-500 leading-relaxed">{s.desc}</p>
                </div>
                <div className="md:col-span-3">
                  <h3 className="font-bold text-gray-700 text-base mb-4">{t('services.includes')}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {s.features.map((f, j) => (
                      <div key={j} className="flex items-start gap-3 p-3 rounded-xl bg-gradient-to-br from-violet-50/50 to-pink-50/50 border border-violet-100/50">
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-br ${s.color} mt-2 shrink-0`} />
                        <span className="text-gray-600">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 md:py-20 text-center">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="relative hero-gradient rounded-3xl p-10 md:p-16 overflow-hidden">
            <div className="absolute inset-0 bg-grid-light opacity-[0.06]" />
            <div className="relative">
              <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-3">{t('services.ctaTitle')}</h2>
              <p className="text-white/70 text-lg mb-6">{t('services.ctaSub')}</p>
              <Link to="/contact" className="btn-primary bg-white text-violet-700 text-lg px-8 py-4">{t('services.ctaBtn')} <ArrowRight className="w-5 h-5" /></Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
