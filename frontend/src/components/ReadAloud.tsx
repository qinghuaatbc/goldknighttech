import { Volume2, VolumeX, Pause, Play } from 'lucide-react'
import { useState, useRef, useCallback } from 'react'

interface Props {
  text: string
  label?: string
  className?: string
}

export default function ReadAloud({ text, label, className = '' }: Props) {
  const [speaking, setSpeaking] = useState(false)
  const [paused, setPaused] = useState(false)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  const stop = useCallback(() => {
    window.speechSynthesis.cancel()
    setSpeaking(false)
    setPaused(false)
  }, [])

  const toggle = useCallback(() => {
    if (speaking && paused) {
      window.speechSynthesis.resume()
      setPaused(false)
      return
    }
    if (speaking) {
      window.speechSynthesis.pause()
      setPaused(true)
      return
    }
    const lang = localStorage.getItem('lang') || 'en'
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = lang === 'zh' ? 'zh-CN' : lang === 'fa' ? 'fa-IR' : 'en-US'
    utterance.rate = 1.0
    utterance.pitch = 1.0
    utterance.volume = 0.7
    utterance.onend = () => { setSpeaking(false); setPaused(false) }
    utterance.onerror = () => { setSpeaking(false); setPaused(false) }
    utteranceRef.current = utterance
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utterance)
    setSpeaking(true)
    setPaused(false)
  }, [text, speaking, paused])

  return (
    <button
      onClick={toggle}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
        speaking
          ? 'bg-violet-100 text-violet-700 border border-violet-200'
          : 'bg-gray-100 text-gray-500 border border-gray-200 hover:bg-gray-200 hover:text-gray-700'
      } ${className}`}
      title={speaking ? (paused ? 'Resume' : 'Pause') : 'Read aloud'}
    >
      {speaking ? (
        paused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />
      ) : (
        <Volume2 className="w-3.5 h-3.5" />
      )}
      {label || (speaking ? (paused ? 'Resume' : 'Stop') : 'Listen')}
    </button>
  )
}
