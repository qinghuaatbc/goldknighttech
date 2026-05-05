import { Mail, Phone, MapPin, Send, Sparkles, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import ReadAloud from '../components/ReadAloud'

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const { t } = useTranslation()

  return (
    <div>
      <section className="relative overflow-hidden hero-gradient py-24 md:py-28 lg:py-32">
        <div className="absolute inset-0 bg-grid-light opacity-[0.06]" />
        <div className="absolute top-5 left-10 w-48 h-48 bg-white/10 rounded-full blur-[80px] animate-float" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center relative">
          <div className="tag-white mb-5"><Sparkles className="w-4 h-4" /> {t('contact.badge')}</div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-extrabold text-white mb-3">{t('contact.title')}</h1>
          <p className="text-white/70 text-xl max-w-2xl mx-auto">{t('contact.subtitle')}</p>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-5 gap-8">
            <div className="md:col-span-2 space-y-4">
              <div className="card p-6 space-y-5">
                {[
                  { icon: <Mail className="w-5 h-5" />, key: 'email', value: 'info@goldknighttech.com', href: 'mailto:info@goldknighttech.com' },
                  { icon: <Phone className="w-5 h-5" />, key: 'phone', value: '(604) 555-0123' },
                  { icon: <MapPin className="w-5 h-5" />, key: 'area', value: 'Greater Vancouver, BC, Canada' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-12 h-12 hero-gradient rounded-xl flex items-center justify-center text-white shrink-0 shadow-md">{item.icon}</div>
                    <div>
                      <p className="text-sm text-gray-400">{t(`contact.${item.key}`)}</p>
                      {item.href ? <a href={item.href} className="text-lg font-medium text-gray-900 hover:text-violet-600">{item.value}</a> : <p className="text-lg font-medium text-gray-900">{item.value}</p>}
                    </div>
                  </div>
                ))}
              </div>
              <div className="card p-6">
                <h3 className="font-bold text-gray-900 text-base mb-3">{t('contact.areas')}</h3>
                <div className="flex flex-wrap gap-2">
                  {['Vancouver', 'West Vancouver', 'North Vancouver', 'Richmond', 'Burnaby', 'Surrey'].map(area => (
                    <span key={area} className="px-3 py-1.5 rounded-lg bg-violet-50 text-violet-700 text-sm font-medium border border-violet-200">{area}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="md:col-span-3">
              {submitted ? (
                <div className="card p-12 text-center">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg mb-4"><Send className="w-7 h-7 text-white" /></div>
                  <h3 className="text-2xl font-display font-bold text-gray-900 mb-1">{t('contact.thankYou')}</h3>
                  <p className="text-gray-500">{t('contact.thankYouSub')}</p>
                </div>
              ) : (
                <form onSubmit={e => { e.preventDefault(); setSubmitted(true) }} className="card p-8 md:p-10">
                  <h2 className="text-2xl font-display font-bold text-gray-900 mb-1">{t('contact.formTitle')}</h2>
                  <p className="text-gray-500 mb-6">{t('contact.formSub')}</p>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm text-gray-500 mb-1.5">{t('contact.name')}</label>
                      <input type="text" required className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-base focus:border-violet-500 focus:ring-2 focus:ring-violet-100 outline-none" placeholder={t('contact.name')} />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500 mb-1.5">{t('contact.emailLabel')}</label>
                      <input type="email" required className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-base focus:border-violet-500 focus:ring-2 focus:ring-violet-100 outline-none" placeholder="your@email.com" />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm text-gray-500 mb-1.5">{t('contact.phoneLabel')}</label>
                    <input type="tel" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-base focus:border-violet-500 focus:ring-2 focus:ring-violet-100 outline-none" placeholder="(604) 555-0000" />
                  </div>
                  <div className="mb-6">
                    <label className="block text-sm text-gray-500 mb-1.5">{t('contact.message')}</label>
                    <textarea rows={3} required className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-base focus:border-violet-500 focus:ring-2 focus:ring-violet-100 outline-none resize-none" placeholder={t('contact.message')} />
                  </div>
                  <button type="submit" className="btn-primary w-full text-lg py-4"><Send className="w-5 h-5" /> {t('contact.send')}</button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
