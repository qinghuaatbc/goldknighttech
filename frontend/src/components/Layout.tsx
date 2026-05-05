import { Link, Outlet, useLocation } from 'react-router-dom'
import { Menu, X, ChevronRight, Sparkles, Shield, Home, Wifi, Smartphone, Globe, Volume2, VolumeX } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { playClick, getSoundMode, setSoundMode, speak, SoundMode } from '../lib/sound'
import ChatAssistant from './ChatAssistant'

const pageIcons: Record<string, JSX.Element> = {
  '/': <Home className="w-5 h-5" />,
  '/demo': <Sparkles className="w-5 h-5" />,
  '/services': <Wifi className="w-5 h-5" />,
  '/about': <Shield className="w-5 h-5" />,
  '/contact': <Smartphone className="w-5 h-5" />,
}

const langs = [
  { code: 'en', label: 'English' },
  { code: 'zh', label: '中文' },
  { code: 'fa', label: 'فارسی' },
]

export default function Layout() {
  const { t, i18n } = useTranslation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [soundMode, setSoundModeState] = useState<SoundMode>(getSoundMode())
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')
  const isAdminLogin = location.pathname === '/admin'

  const nav = ['/', '/demo', '/services', '/about', '/contact'].map(p => ({
    to: p,
    label: p === '/' ? t('nav.home') : p === '/demo' ? t('nav.demo') : p === '/services' ? t('nav.services') : p === '/about' ? t('nav.about') : t('nav.contact'),
  }))

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMenuOpen(false); setLangOpen(false) }, [location])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (getSoundMode() === 'mute') return
      playClick()
      if (getSoundMode() === 'voice') {
        const target = e.target as HTMLElement
        const text = target?.getAttribute('aria-label') || target?.textContent?.trim()
        if (text && text.length < 60 && !['INPUT', 'TEXTAREA', 'SELECT'].includes(target?.tagName || '')) {
          speak(text)
        }
      }
    }
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [])

  const cycleSound = () => {
    const modes: SoundMode[] = ['voice', 'click', 'mute']
    const current = getSoundMode()
    const idx = modes.indexOf(current)
    const next = modes[(idx + 1) % modes.length]
    setSoundMode(next)
    setSoundModeState(next)
    if (next !== 'mute') playClick()
  }

  const switchLang = (code: string) => {
    i18n.changeLanguage(code)
    localStorage.setItem('lang', code)
    document.documentElement.dir = code === 'fa' ? 'rtl' : 'ltr'
    setLangOpen(false)
  }

  if (isAdmin) return <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-pink-50"><Outlet /></div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-pink-50">
      {/* Desktop sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col z-50">
        <div className="flex flex-col h-full bg-white/90 backdrop-blur-xl border-r border-violet-100/50">
          <div className="flex items-center gap-3 px-6 h-20 border-b border-violet-100/30">
            <div className="w-11 h-11 hero-gradient rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/20">
              <span className="text-white font-bold text-xl font-display">GK</span>
            </div>
            <div>
              <div className="font-display font-bold text-gray-900 text-lg leading-tight">Gold Knight</div>
              <div className="text-gradient font-display font-bold -mt-0.5">Tech</div>
            </div>
          </div>
          <nav className="flex-1 px-4 py-6 space-y-1">
            {nav.map(item => {
              const active = location.pathname === item.to
              return (
                <Link key={item.to} to={item.to}
                  className={`flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-base font-medium transition-all ${
                    active ? 'bg-gradient-to-r from-violet-50 via-pink-50 to-orange-50 text-violet-700 border border-violet-200/50' : 'text-gray-500 hover:text-gray-700 hover:bg-white/60'
                  }`}>
                  <span className={active ? 'text-violet-500' : 'text-gray-400'}>{pageIcons[item.to]}</span>
                  {item.label}
                  {active && <div className="ml-auto w-2 h-2 rounded-full hero-gradient" />}
                </Link>
              )
            })}
          </nav>
            <div className="px-4 pb-6 space-y-2">
            <div className="px-4 py-3 rounded-xl bg-gradient-to-r from-violet-50 to-pink-50 border border-violet-100/50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-violet-500" />
                    <span className="text-sm font-medium text-gray-700">{t('language')}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-medium text-gray-400">
                      {soundMode === 'voice' ? 'VOICE' : soundMode === 'click' ? 'BEEP' : 'MUTE'}
                    </span>
                    <button onClick={cycleSound} className={`p-1.5 rounded-lg transition-all ${
                      soundMode === 'voice' ? 'text-violet-500 hover:bg-violet-100' :
                      soundMode === 'click' ? 'text-amber-500 hover:bg-amber-50' :
                      'text-gray-300 hover:bg-gray-100'
                    }`} title={
                      soundMode === 'voice' ? 'Voice & sound on' :
                      soundMode === 'click' ? 'Sound only' : 'Muted'
                    }>
                      {soundMode === 'voice' ? <Volume2 className="w-4 h-4" /> :
                       soundMode === 'click' ? <Volume2 className="w-4 h-4" /> :
                       <VolumeX className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              <div className="flex gap-1.5">
                {langs.map(l => (
                  <button key={l.code} onClick={() => switchLang(l.code)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      i18n.language === l.code ? 'bg-white text-violet-700 shadow-sm border border-violet-200' : 'text-gray-400 hover:text-gray-600'
                    }`}>{l.label}</button>
                ))}
              </div>
            </div>
            <Link to="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-400 hover:text-gray-600 hover:bg-white/60 transition-all">
              <Shield className="w-4 h-4" /> {t('nav.admin')} <ChevronRight className="w-3 h-3 ml-auto" />
            </Link>
          </div>
        </div>
      </aside>

      {/* Mobile header */}
      <header className={`lg:hidden sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-xl border-b border-violet-100/30 shadow-sm' : 'bg-transparent'}`}>
        <div className="flex items-center justify-between h-16 px-4">
          <button onClick={() => setMenuOpen(true)} className="w-10 h-10 flex items-center justify-center -ml-1 text-gray-500 hover:text-violet-600">
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 hero-gradient rounded-lg flex items-center justify-center shadow-md"><span className="text-white font-bold text-sm">GK</span></div>
            <span className="font-display font-semibold text-gray-900">Gold Knight Tech</span>
          </div>
          <div className="relative">
            <button onClick={() => setLangOpen(!langOpen)} className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-violet-600">
              <Globe className="w-5 h-5" />
            </button>
            {langOpen && (
              <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-xl border border-gray-200 shadow-xl z-50 py-1 overflow-hidden">
                {langs.map(l => (
                  <button key={l.code} onClick={() => switchLang(l.code)}
                    className={`w-full px-4 py-2.5 text-sm text-left transition-all ${i18n.language === l.code ? 'bg-violet-50 text-violet-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}>{l.label}</button>
                ))}
              </div>
            )}
          </div>
        </div>
        {menuOpen && (
          <div className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
            <div className="absolute left-0 top-0 bottom-0 w-72 bg-white/95 backdrop-blur-xl shadow-2xl">
              <div className="flex items-center justify-between px-5 h-16 border-b border-violet-100/30">
                <span className="font-display font-semibold text-gray-900 text-lg">Menu</span>
                <button onClick={() => setMenuOpen(false)} className="w-8 h-8 flex items-center justify-center text-gray-400"><X className="w-5 h-5" /></button>
              </div>
              <div className="px-4 py-6 space-y-1">
                {nav.map(item => (
                  <Link key={item.to} to={item.to}
                    className={`flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-base font-medium transition-all ${
                      location.pathname === item.to ? 'bg-gradient-to-r from-violet-50 to-pink-50 text-violet-700' : 'text-gray-600 hover:bg-white/60'
                    }`}>
                    <span className={location.pathname === item.to ? 'text-violet-500' : 'text-gray-400'}>{pageIcons[item.to]}</span>
                    {item.label}
                  </Link>
                ))}
                <hr className="my-3 border-violet-100/50" />
                <Link to="/admin" className="flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-base font-medium text-gray-400 hover:bg-white/60 transition-all">
                  <Shield className="w-5 h-5" /> {t('nav.admin')}
                </Link>
                <hr className="my-3 border-violet-100/50" />
                <button onClick={cycleSound} className="flex items-center gap-3.5 w-full px-4 py-3.5 rounded-xl text-base font-medium text-gray-400 hover:bg-white/60 transition-all">
                  {soundMode === 'voice' ? <Volume2 className="w-5 h-5" /> :
                   soundMode === 'click' ? <Volume2 className="w-5 h-5" /> :
                   <VolumeX className="w-5 h-5" />}
                  {soundMode === 'voice' ? 'Sound + Voice' :
                   soundMode === 'click' ? 'Sound Only' : 'Muted'}
                </button>
                <hr className="my-3 border-violet-100/50" />
                <div className="px-4 py-2">
                  <p className="text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">{t('language')}</p>
                  <div className="flex gap-1.5">
                    {langs.map(l => (
                      <button key={l.code} onClick={() => switchLang(l.code)}
                        className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                          i18n.language === l.code ? 'bg-gradient-to-r from-violet-50 to-pink-50 text-violet-700 border border-violet-200' : 'text-gray-400 hover:text-gray-600 hover:bg-white/60'
                        }`}>{l.label}</button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      <div className="lg:pl-72">
        <main><Outlet /></main>
        <footer className="relative overflow-hidden bg-gray-900 text-white">
          <div className="absolute inset-0 bg-grid-light opacity-[0.05]" />
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
            <div className="grid md:grid-cols-4 gap-8 mb-10">
              <div className="md:col-span-2">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 hero-gradient rounded-xl flex items-center justify-center shadow-lg"><span className="text-white font-bold text-lg">GK</span></div>
                  <span className="font-display font-bold text-white text-xl">Gold Knight Tech</span>
                </div>
                <p className="text-gray-400 max-w-md leading-relaxed">{t('footer.tagline')}</p>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-4">{t('footer.navigate')}</h3>
                <div className="space-y-3">
                  {nav.map(item => (
                    <Link key={item.to} to={item.to} className="block text-gray-400 hover:text-violet-400 transition-colors">{item.label}</Link>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-4">{t('footer.contact')}</h3>
                <div className="space-y-3 text-gray-400">
                  <p>Vancouver, BC, Canada</p>
                  <a href="mailto:info@goldknighttech.com" className="block hover:text-violet-400">info@goldknighttech.com</a>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-800 pt-8 text-sm text-gray-500 text-center">&copy; {new Date().getFullYear()} Gold Knight Tech</div>
          </div>
        </footer>
      </div>
      <ChatAssistant />
    </div>
  )
}
