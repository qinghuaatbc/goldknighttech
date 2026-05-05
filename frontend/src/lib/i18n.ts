import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from '../locales/en.json'
import zh from '../locales/zh.json'
import fa from '../locales/fa.json'

const savedLang = typeof window !== 'undefined' ? localStorage.getItem('lang') || 'en' : 'en'

i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, zh: { translation: zh }, fa: { translation: fa } },
  lng: savedLang,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
})

export default i18n
