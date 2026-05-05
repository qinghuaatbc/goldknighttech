import { Link } from 'react-router-dom'
import { Shield, ArrowRight, Sparkles, ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import ReadAloud from '../components/ReadAloud'

export default function About() {
  const { t } = useTranslation()
  const items = [
    { key: 'expert', emoji: '🔧' }, { key: 'quality', emoji: '⭐' }, { key: 'custom', emoji: '🎯' },
    { key: 'support', emoji: '💬' }, { key: 'integration', emoji: '🔄' }, { key: 'peace', emoji: '🛡️' },
  ]

  return (
    <div>
      <section className="relative overflow-hidden hero-gradient py-24 md:py-28 lg:py-32">
        <div className="absolute inset-0 bg-grid-light opacity-[0.06]" />
        <div className="absolute top-5 left-10 w-48 h-48 bg-white/10 rounded-full blur-[80px] animate-float" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center relative">
          <div className="tag-white mb-5"><Sparkles className="w-4 h-4" /> {t('about.badge')}</div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-extrabold text-white mb-3">{t('about.title')}</h1>
          <p className="text-white/70 text-xl max-w-2xl mx-auto">{t('about.subtitle')}</p>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-10 items-center mb-16">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-3xl md:text-5xl font-display font-bold text-gray-900">{t('about.sectionTitle')}</h2>
                <ReadAloud text={`${t('about.p1')} ${t('about.p2')} ${t('about.p3')}`} label="Listen" />
              </div>
              <div className="space-y-4 text-gray-500 text-lg leading-relaxed">
                <p>{t('about.p1')}</p>
                <p>{t('about.p2')}</p>
                <p>{t('about.p3')}</p>
              </div>
            </div>
            <div className="card p-8 md:p-10 text-center">
              <div className="w-20 h-20 mx-auto hero-gradient rounded-2xl flex items-center justify-center shadow-lg mb-5"><Shield className="w-10 h-10 text-white" /></div>
              <p className="font-display font-bold text-2xl text-gray-900">Gold Knight Tech</p>
              <p className="text-gray-400 text-base">Est. 2014</p>
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {['DSC', 'Honeywell', 'Vista', 'RTI'].map(b => (
                  <span key={b} className="px-3 py-1.5 rounded-lg bg-violet-50 text-violet-700 text-sm font-medium border border-violet-200">{b}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="card p-8 md:p-12">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900">{t('about.chooseTitle')}</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {items.map(item => (
                <div key={item.key} className="p-5 rounded-xl bg-gradient-to-br from-violet-50/30 to-pink-50/30 border border-violet-100/50">
                  <span className="text-3xl mb-3 block">{item.emoji}</span>
                  <h3 className="font-bold text-gray-900 text-lg mb-1">{t(`about.items.${item.key}`)}</h3>
                  <p className="text-gray-500">{t(`about.items.${item.key}Desc`)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 text-center">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-2">{t('about.ctaTitle')}</h2>
          <p className="text-gray-500 text-lg mb-5">{t('about.ctaSub')}</p>
          <Link to="/contact" className="btn-primary text-lg px-8 py-4"><ArrowRight className="w-5 h-5" /> {t('about.ctaBtn')}</Link>
        </div>
      </section>
    </div>
  )
}
