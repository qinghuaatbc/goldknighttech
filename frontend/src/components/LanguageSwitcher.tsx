import { useTranslation } from 'react-i18next'
import { Globe } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

const langs = [
  { code: 'en', label: 'English', dir: 'ltr' },
  { code: 'zh', label: '中文', dir: 'ltr' },
  { code: 'fa', label: 'فارسی', dir: 'rtl' },
]

export default function LanguageSwitcher({ sidebar = false }: { sidebar?: boolean }) {
  const { i18n } = useTranslation()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const current = langs.find(l => l.code === i18n.language) || langs[0]

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const switchLang = (code: string) => {
    i18n.changeLanguage(code)
    localStorage.setItem('lang', code)
    const lang = langs.find(l => l.code === code)
    document.documentElement.dir = lang?.dir || 'ltr'
    setOpen(false)
  }

  if (sidebar) {
    return (
      <div className="space-y-1">
        <p className="text-xs font-medium text-gray-400 px-4 mb-2 uppercase tracking-wider">Language</p>
        {langs.map(l => (
          <button key={l.code} onClick={() => switchLang(l.code)}
            className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              i18n.language === l.code ? 'bg-brand-50 text-brand-700' : 'text-gray-500 hover:bg-gray-50'
            }`}>
            <Globe className="w-4 h-4" />
            {l.label}
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all">
        <Globe className="w-3.5 h-3.5" />
        {current.label}
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 w-36 bg-white rounded-xl border border-gray-200 shadow-xl z-50 py-1">
          {langs.map(l => (
            <button key={l.code} onClick={() => switchLang(l.code)}
              className={`flex items-center gap-2 w-full px-4 py-2 text-sm transition-all ${
                i18n.language === l.code ? 'text-brand-600 bg-brand-50' : 'text-gray-600 hover:bg-gray-50'
              }`}>
              <Globe className="w-3.5 h-3.5" />
              {l.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
