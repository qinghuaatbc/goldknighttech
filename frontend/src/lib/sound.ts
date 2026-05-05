export type SoundMode = 'click' | 'voice' | 'mute'

export function getSoundMode(): SoundMode {
  return (localStorage.getItem('sound') as SoundMode) || 'voice'
}

export function setSoundMode(mode: SoundMode) {
  localStorage.setItem('sound', mode)
}

export function isClickEnabled(): boolean {
  return getSoundMode() === 'click' || getSoundMode() === 'voice'
}

export function isVoiceEnabled(): boolean {
  return getSoundMode() === 'voice'
}

export function playClick() {
  if (!isClickEnabled()) return
  try {
    const ctx = new AudioContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.frequency.value = 800
    osc.type = 'sine'
    gain.gain.setValueAtTime(0.03, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.03)
  } catch {}
}

function playChime() {
  try {
    const ctx = new AudioContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = 'sine'
    osc.frequency.setValueAtTime(880, ctx.currentTime)
    osc.frequency.setValueAtTime(1100, ctx.currentTime + 0.06)
    gain.gain.setValueAtTime(0.06, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.15)
  } catch {}
}

let lastSpeech = 0

export function speak(text: string) {
  if (!isVoiceEnabled()) return
  const now = Date.now()
  if (now - lastSpeech < 400) return
  lastSpeech = now

  const lang = localStorage.getItem('lang') || 'en'
  const langBase = lang === 'zh' ? 'zh' : lang === 'fa' ? 'fa' : 'en'

  try {
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.volume = 0.85

    if (langBase === 'fa') {
      // For Farsi: check if native voice exists
      const voices = window.speechSynthesis.getVoices()
      const faVoice = voices.find(v => v.lang.startsWith('fa'))

      if (faVoice) {
        utterance.voice = faVoice
        utterance.lang = 'fa-IR'
        utterance.rate = 0.7
        utterance.pitch = 1.15
        window.speechSynthesis.speak(utterance)
      } else {
        // No Farsi voice available — play a gentle chime instead
        playChime()
      }
      return
    }

    // English
    if (langBase === 'en') {
      utterance.lang = 'en-US'
      utterance.rate = 0.9
      utterance.pitch = 1.05
      const voices = window.speechSynthesis.getVoices()
      const prefs = ['Samantha', 'Karen', 'Moira', 'Tessa', 'Fiona', 'Veena', 'Susan', 'Kate']
      for (const name of prefs) {
        const v = voices.find(v => v.name === name)
        if (v) { utterance.voice = v; break }
      }
      window.speechSynthesis.speak(utterance)
      return
    }

    // Chinese
    if (langBase === 'zh') {
      utterance.lang = 'zh-CN'
      utterance.rate = 0.82
      utterance.pitch = 1.1
      const voices = window.speechSynthesis.getVoices()
      const prefs = ['Tingting', 'Mei-Jia', 'Sin-Ji', 'Yu-Xi', 'Lili', 'Shu-Hui']
      for (const name of prefs) {
        const v = voices.find(v => v.name === name && v.lang.startsWith('zh'))
        if (v) { utterance.voice = v; break }
      }
      window.speechSynthesis.speak(utterance)
    }
  } catch {}
}
