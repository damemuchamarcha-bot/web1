'use client'

import { useState, useEffect } from 'react'
import { Share2, Check, Copy } from 'lucide-react'

export function ReadingProgressBar() {
  const [completion, setCompletion] = useState(0)

  useEffect(() => {
    const updateScrollCompletion = () => {
      const currentProgress = window.scrollY
      const scrollHeight = document.body.scrollHeight - window.innerHeight
      if (scrollHeight) {
        setCompletion(Number((currentProgress / scrollHeight).toFixed(2)) * 100)
      }
    }

    window.addEventListener('scroll', updateScrollCompletion)
    return () => window.removeEventListener('scroll', updateScrollCompletion)
  }, [])

  return (
    <div className="fixed top-0 left-0 z-50 h-1.5 w-full bg-punk-black/20">
      <div
        className="h-full bg-punk-pink transition-all duration-150 ease-out"
        style={{ width: `${completion}%` }}
      />
    </div>
  )
}

export function ShareButtons({ title }: { title: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (typeof window !== 'undefined') {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleShareTwitter = () => {
    if (typeof window !== 'undefined') {
      const url = encodeURIComponent(window.location.href)
      const text = encodeURIComponent(`Echa un ojo a "${title}" en @damemarcha`)
      window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank')
    }
  }

  const handleShareWhatsApp = () => {
    if (typeof window !== 'undefined') {
      const url = encodeURIComponent(window.location.href)
      const text = encodeURIComponent(`Mira esto de Dame Marcha: ${title}`)
      window.open(`https://api.whatsapp.com/send?text=${text}%20${url}`, '_blank')
    }
  }

  return (
    <div className="my-8 flex flex-wrap items-center gap-3 border-y border-white/10 py-4">
      <span className="font-display text-sm uppercase tracking-wider text-punk-cream/60">
        Compartir marcha:
      </span>
      <button
        onClick={handleShareWhatsApp}
        className="border border-white/20 bg-punk-black px-3 py-1.5 font-display text-xs uppercase text-punk-cream transition-colors hover:border-punk-yellow hover:text-punk-yellow"
      >
        WhatsApp
      </button>
      <button
        onClick={handleShareTwitter}
        className="border border-white/20 bg-punk-black px-3 py-1.5 font-display text-xs uppercase text-punk-cream transition-colors hover:border-punk-pink hover:text-punk-pink"
      >
        X / Twitter
      </button>
      <button
        onClick={handleCopy}
        className="inline-flex items-center gap-1.5 border border-white/20 bg-punk-black px-3 py-1.5 font-display text-xs uppercase text-punk-cream transition-colors hover:border-punk-cream hover:text-white"
      >
        {copied ? (
          <>
            <Check className="size-3.5 text-green-400" /> ¡Copiado!
          </>
        ) : (
          <>
            <Copy className="size-3.5" /> Copiar enlace
          </>
        )}
      </button>
    </div>
  )
}
