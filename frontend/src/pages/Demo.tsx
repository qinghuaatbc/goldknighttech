import { Suspense, useState } from 'react'
import Scene3D from '../components/Scene3D'
import FloorPlan2D from '../components/FloorPlan2D'
import { Sparkles } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function Demo() {
  const [selectedZone, setSelectedZone] = useState<string>('Living')
  const { t } = useTranslation()

  return (
    <div>
      <section className="relative overflow-hidden hero-gradient py-20 md:py-24 lg:py-28">
        <div className="absolute inset-0 bg-grid-light opacity-[0.06]" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center relative">
          <div className="tag-white mb-5"><Sparkles className="w-4 h-4" /> {t('demo.badge')}</div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-extrabold text-white">{t('demo.title')}</h1>
          <p className="text-white/70 text-xl max-w-2xl mx-auto mt-2">{t('demo.subtitle')}</p>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-4">
            <div className="lg:col-span-3">
              <div className="card p-3">
                <div className="h-[400px] md:h-[480px] rounded-xl overflow-hidden">
                  <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-base text-gray-400 bg-gradient-to-br from-violet-50 to-pink-50">Loading 3D Scene...</div>}>
                    <Scene3D onSelectZone={z => setSelectedZone(z)} />
                  </Suspense>
                </div>
              </div>
            </div>
            <div className="lg:col-span-2">
              <FloorPlan2D onSelectRoom={r => setSelectedZone(r)} />
            </div>
          </div>

          {selectedZone && (
            <div className="card mt-4 p-6 animate-in">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 hero-gradient rounded-xl flex items-center justify-center text-white shadow-md"><Sparkles className="w-6 h-6" /></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-400">{t('demo.selectedZone')}</p>
                  <p className="font-bold text-gray-900 text-xl">{selectedZone}</p>
                </div>
                <span className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 font-medium border border-green-200">{t('demo.systemOnline')}</span>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="py-16 md:py-20 bg-gradient-to-b from-transparent via-violet-50/30 to-transparent">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { emoji: '🖱️', key: 'feature1' },
              { emoji: '🎛️', key: 'feature2' },
              { emoji: '📊', key: 'feature3' },
            ].map((f, i) => (
              <div key={i} className="card-hover p-6 text-center">
                <span className="text-4xl mb-3 block">{f.emoji}</span>
                <h3 className="font-bold text-gray-900 text-xl mb-2">{t(`demo.${f.key}`)}</h3>
                <p className="text-gray-500">{t(`demo.${f.key}Desc`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
