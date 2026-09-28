'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Camera, AtSign, Play, Music2 } from 'lucide-react'

const SOCIALS = [
  { label: 'Instagram', href: 'https://www.instagram.com/dame_marcha', Icon: Camera },
  { label: 'LinkedIn', href: 'https://linkedin.com', Icon: AtSign },
  { label: 'Spotify', href: 'https://open.spotify.com/user/314a5fgcdsgspbyhmemy24mwiare', Icon: Music2 },
  { label: 'YouTube', href: 'https://youtube.com', Icon: Play },
]

export function SiteFooter() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setSent(true)
    setEmail('')
  }

  return (
    <footer className="border-t-2 border-punk-pink bg-punk-black">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:gap-16">
        {/* Brand + mission */}
        <div className="flex flex-col justify-between gap-8">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="font-display text-4xl uppercase leading-none tracking-tight text-punk-cream sm:text-5xl">
                Dame
              </span>
              <span className="bg-punk-pink px-2 font-display text-4xl uppercase leading-none tracking-tight text-punk-black sm:text-5xl">
                Marcha
              </span>
            </div>
            <p className="mt-5 max-w-md text-pretty text-base leading-relaxed text-punk-cream/70">
              Revista cultural sin filtros. Cine y música contadas con rabia, criterio y
              buena tipografía. Hecha desde el barrio para quien todavía cree que la cultura
              se defiende.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {SOCIALS.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex size-11 items-center justify-center border-2 border-punk-cream/30 text-punk-cream transition-colors hover:border-punk-yellow hover:bg-punk-yellow hover:text-punk-black"
              >
                <Icon className="size-5" />
              </a>
            ))}
          </div>
        </div>

        {/* Newsletter as gig ticket */}
        <div className="relative border-2 border-punk-yellow bg-punk-charcoal">
          <div className="flex items-center justify-between border-b-2 border-dashed border-punk-yellow/50 px-6 py-3">
            <span className="font-display text-xs uppercase tracking-[0.3em] text-punk-yellow">
              Admit One
            </span>
            <span className="font-display text-xs uppercase tracking-[0.3em] text-punk-cream/60">
              Nº 2026
            </span>
          </div>
          <form onSubmit={handleSubmit} className="px-6 py-7">
            <h3 className="font-display text-3xl uppercase leading-none tracking-tight text-punk-cream">
              Únete a la <span className="text-punk-pink">marcha</span>
            </h3>
            <p className="mt-2 text-sm text-punk-cream/70">
              Recibe estrenos, críticas y directos en tu correo. Sin spam, solo cultura.
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <label htmlFor="newsletter-email" className="sr-only">
                Tu correo electrónico
              </label>
              <input
                id="newsletter-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@correo.com"
                className="w-full border-2 border-punk-cream/30 bg-punk-black px-4 py-3 text-punk-cream placeholder:text-punk-cream/40 focus:border-punk-pink focus:outline-none"
              />
              <button
                type="submit"
                className="shrink-0 bg-punk-pink px-6 py-3 font-display text-sm uppercase tracking-wide text-punk-black transition-colors hover:bg-punk-yellow"
              >
                Apúntame
              </button>
            </div>
            {sent && (
              <p className="mt-3 text-sm font-semibold text-punk-yellow" role="status">
                ¡Estás dentro! Nos vemos en la próxima.
              </p>
            )}
          </form>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-punk-cream/50 sm:flex-row sm:px-6">
          <p>© 2026 Dame Marcha. Todos los ruidos reservados.</p>
          <div className="flex gap-4">
            <Link href="/sobre-nosotras" className="hover:text-punk-pink">
              Sobre Nosotras
            </Link>
            <a href="#" className="hover:text-punk-pink">
              Contacto
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
