import { Link } from 'react-router-dom'
import { ArrowRight, Shield, Lightbulb, Music, Film, Wifi, Smartphone, Camera, Lock, Sparkles, ChevronRight, Star, Zap, Home as HomeIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import ReadAloud from '../components/ReadAloud'

const services = [
  { icon: <Shield className="w-6 h-6" />, title: 'Security Systems', desc: 'Advanced alarm systems with 24/7 zone monitoring, motion detectors, and smart sensors for complete peace of mind.', emoji: '🛡️', gradient: 'from-violet-500/10 to-purple-600/5', border: 'border-violet-200' },
  { icon: <Lightbulb className="w-6 h-6" />, title: 'Smart Lighting', desc: 'Intelligent lighting control with automated schedules, dimming, and remote access for ambiance and energy savings.', emoji: '💡', gradient: 'from-amber-500/10 to-orange-600/5', border: 'border-amber-200' },
  { icon: <Camera className="w-6 h-6" />, title: 'Surveillance & CCTV', desc: 'High-definition security cameras with remote viewing, motion-triggered recording, and cloud storage.', emoji: '📹', gradient: 'from-sky-500/10 to-blue-600/5', border: 'border-sky-200' },
  { icon: <Lock className="w-6 h-6" />, title: 'Access Control', desc: 'Smart locks, intercom systems, and gate control for seamless and secure entry management.', emoji: '🔑', gradient: 'from-pink-500/10 to-rose-600/5', border: 'border-pink-200' },
  { icon: <Wifi className="w-6 h-6" />, title: 'Home Networking', desc: 'Whole-home WiFi, wired networking, and structured cabling for reliable connectivity across all your devices.', emoji: '🌐', gradient: 'from-emerald-500/10 to-teal-600/5', border: 'border-emerald-200' },
  { icon: <Film className="w-6 h-6" />, title: 'Home Theater', desc: 'Professional home theater setup with surround sound, projection, and smart control for cinema-quality experience.', emoji: '🎬', gradient: 'from-purple-500/10 to-violet-600/5', border: 'border-purple-200' },
  { icon: <Music className="w-6 h-6" />, title: 'Multi-Room Audio', desc: 'Whole-home audio systems with independent zone control, streaming services, and high-fidelity sound throughout.', emoji: '🎵', gradient: 'from-orange-500/10 to-amber-600/5', border: 'border-orange-200' },
  { icon: <Smartphone className="w-6 h-6" />, title: 'Smart Home Integration', desc: 'Unified control of all your smart home systems through a single app with voice assistant support.', emoji: '📱', gradient: 'from-violet-500/10 to-pink-600/5', border: 'border-violet-200' },
]

export default function Home() {
  const { t } = useTranslation()

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden hero-gradient">
        <div className="absolute inset-0 bg-grid-light opacity-[0.08]" />
        <div className="absolute top-5 left-10 w-72 h-72 bg-white/10 rounded-full blur-[100px] animate-float" />
        <div className="absolute bottom-5 right-10 w-96 h-96 bg-orange-500/20 rounded-full blur-[120px]" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-24 md:py-32 lg:py-36">
          <div className="max-w-3xl">
            <div className="tag-white mb-6 animate-in text-base"><Sparkles className="w-4 h-4" /> {t('home.badge')}</div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-extrabold text-white leading-[1.05] mb-6 animate-in animate-in-d1">
              Intelligent<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-amber-100 to-orange-200">Home Automation</span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-xl mb-8 animate-in animate-in-d2 leading-relaxed">{t('home.subtitle')}</p>
            <div className="flex flex-wrap gap-3 animate-in animate-in-d3">
              <Link to="/services" className="btn-primary bg-white text-violet-700 hover:shadow-xl hover:shadow-white/20">
                {t('home.explore')} <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/contact" className="btn-outline bg-white/15 text-white border-white/20 hover:bg-white/25 hover:text-white hover:border-white/30">
                {t('home.quote')} <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative -mt-7 z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="card overflow-hidden">
            <div className="grid grid-cols-2 md:grid-cols-4">
              {[
                { value: '40+', emoji: '🏠', key: 'homes' },
                { value: '10+', emoji: '⭐', key: 'years' },
                { value: '24/7', emoji: '🔧', key: 'support' },
                { value: '100%', emoji: '💯', key: 'happy' },
              ].map((s, i) => (
                <div key={i} className={`text-center py-8 px-4 ${i < 3 ? 'border-r border-violet-100/50' : ''} ${i >= 2 ? 'border-t md:border-t-0 border-violet-100/50' : ''}`}>
                  <span className="text-4xl mb-2 block">{s.emoji}</span>
                  <div className="text-3xl md:text-4xl font-display font-bold text-gray-900">{s.value}</div>
                  <div className="text-sm text-gray-400 mt-0.5">{t(`home.stats.${s.key}`)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { to: '/services', emoji: '🛠️', key: 'services', gradient: 'from-violet-500 to-purple-600' },
              { to: '/demo', emoji: '🎮', key: 'demo', gradient: 'from-pink-500 to-rose-600' },
              { to: '/about', emoji: '📖', key: 'story', gradient: 'from-amber-500 to-orange-600' },
            ].map((link, i) => (
              <Link key={i} to={link.to} className="group card-hover p-6 flex items-center gap-5">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${link.gradient} flex items-center justify-center text-3xl shadow-lg shrink-0 group-hover:scale-110 transition-transform duration-300`}>{link.emoji}</div>
                <div>
                  <p className="font-bold text-gray-900 text-lg group-hover:text-violet-600 transition-colors">{t(`home.quickLinks.${link.key}`)}</p>
                  <p className="text-sm text-gray-400 mt-0.5">{t(`home.quickLinks.${link.key}Desc`)}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-violet-500 group-hover:translate-x-1 transition-all ml-auto shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Full Services */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-transparent via-violet-50/30 to-transparent">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-3">
              Everything Your <span className="text-gradient">Smart Home</span> Needs
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">Professional-grade automation for modern living</p>
            <ReadAloud text={services.map(s => `${s.title}: ${s.desc}`).join('. ')} label="Listen to services" className="mt-3" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {services.map((s, i) => (
              <div key={i} className={`card-hover p-6 border ${s.border} bg-gradient-to-br ${s.gradient} animate-in`} style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="text-3xl mb-3">{s.emoji}</div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{s.title}</h3>
                <p className="text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust section */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="card p-8 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-violet-200/50 to-transparent rounded-full blur-[60px]" />
            <div className="relative grid md:grid-cols-2 gap-10 items-center">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="tag bg-violet-100 text-violet-700"><Star className="w-4 h-4" /> Trusted Since 2014</span>
                  <ReadAloud text="Gold Knight Tech is Vancouver's trusted home automation partner with years of experience working with DSC, Honeywell, and Vista." label="Listen" />
                </div>
                <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">Vancouver's <span className="text-gradient">Home Automation</span> Partner</h2>
                <p className="text-gray-500 text-lg mb-6 leading-relaxed">With years of experience designing and installing smart home systems, Gold Knight Tech works with leading brands like DSC, Honeywell, and Vista.</p>
                <Link to="/about" className="btn-outline text-base"><ChevronRight className="w-5 h-5" /> {t('about.ctaBtn')}</Link>
              </div>
              <div className="card p-8 text-center">
                <div className="w-20 h-20 mx-auto hero-gradient rounded-2xl flex items-center justify-center shadow-lg mb-4"><Shield className="w-10 h-10 text-white" /></div>
                <p className="font-display font-bold text-2xl text-gray-900">Gold Knight Tech</p>
                <p className="text-gray-400">Smart Home Solutions</p>
                <div className="flex flex-wrap justify-center gap-2 mt-4">
                  {['DSC', 'Honeywell', 'Vista'].map(b => (
                    <span key={b} className="px-3 py-1.5 rounded-lg bg-violet-50 text-violet-700 text-sm font-medium border border-violet-200">{b}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 text-center">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="relative hero-gradient rounded-3xl p-10 md:p-16 overflow-hidden">
            <div className="absolute inset-0 bg-grid-light opacity-[0.06]" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px]" />
            <div className="relative">
              <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-3">{t('home.ctaTitle')}</h2>
              <p className="text-white/70 text-lg max-w-md mx-auto mb-6">{t('home.ctaSub')}</p>
              <Link to="/contact" className="btn-primary bg-white text-violet-700 hover:shadow-xl hover:shadow-white/20 text-lg px-8 py-4">
                {t('home.ctaBtn')} <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
