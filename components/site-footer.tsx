'use client'

import { useState } from 'react'
import Link from 'next/link'

// Componentes SVG nativos con los logos oficiales de las marcas
function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}

function SpotifyIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 0C5.376 0 0 5.376 0 12s5.376 12 12 12 12-5.376 12-12S18.624 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141 C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.18-.1.2-.2-.421-.18-.6.18-1.2.78-1.38 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  )
}

function YoutubeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  )
}

function LinkedinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
  )
}

const SOCIALS = [
  { label: 'Instagram', href: 'https://www.instagram.com/dame_marcha', Icon: InstagramIcon },
  { label: 'LinkedIn', href: 'https://linkedin.com', Icon: LinkedinIcon },
  { label: 'Spotify', href: 'https://open.spotify.com/user/314a5fgcdsgspbyhmemy24mwiare', Icon: SpotifyIcon },
  { label: 'YouTube', href: 'https://youtube.com', Icon: YoutubeIcon },
]

export function SiteFooter() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return

    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('EMAIL', email)

      await fetch(
        'https://3ad35904.sibforms.com/v2/serve/MUIFAK_mVzAB-q0gCVdkvzTIS7_SzgZO0qb0CY3Znkewv8XyMMka_F8tbbGsBpIqCL0Uo4YRP6RtGchlMRWCkurDHXBM04lOhkHf0sIkylM_Pk-yZEYTE_G_WE9zQKztypF4RDNKpaL2DuP_D-mryDpM44UCeztDgIBpzMsYQgfn1ynhgRN9dWCuv4U1miImK8Ea0kAmwbdcK3YlzA==',
        {
          method: 'POST',
          body: formData,
          mode: 'no-cors',
        }
      )

      setSent(true)
      setEmail('')
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
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
              Revista cultural sin filtros. Cine y música contadas con criterio y
              buena tipografía. Hecha desde el barrio para quien todavía cree que la cultura
              se defiende.
            </p>
          </div>

          {/* Social Icons */}
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
                name="EMAIL"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@correo.com"
                className="w-full border-2 border-punk-cream/30 bg-punk-black px-4 py-3 text-punk-cream placeholder:text-punk-cream/40 focus:border-punk-pink focus:outline-none"
              />
              <button
                type="submit"
                disabled={loading}
                className="shrink-0 bg-punk-pink px-6 py-3 font-display text-sm uppercase tracking-wide text-punk-black transition-colors hover:bg-punk-yellow disabled:opacity-50"
              >
                {loading ? 'Enviando...' : 'Apúntame'}
              </button>
            </div>
            
            {/* Disclaimer RGPD del formulario */}
            <p className="mt-3 text-[11px] leading-tight text-punk-cream/50">
              Al suscribirte aceptas nuestra{' '}
              <Link href="/politica-de-privacidad" className="underline hover:text-punk-pink">
                Política de Privacidad
              </Link>.
            </p>

            {sent && (
              <p className="mt-3 text-sm font-semibold text-punk-yellow" role="status">
                ¡Estás dentro! Nos vemos en la próxima.
              </p>
            )}
          </form>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-5 text-xs text-punk-cream/50 sm:flex-row sm:px-6">
          <p>© 2026 Dame Marcha. Todos los ruidos reservados.</p>

          {/* Enlaces Legales + Navegación Secundaria */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/sobre-nosotras" className="hover:text-punk-pink">
              Sobre Nosotras
            </Link>
            <Link href="/prensa" className="font-semibold text-punk-pink hover:underline">
              Prensa & Patrocinios
            </Link>
            <Link href="/aviso-legal" className="hover:text-punk-pink">
              Aviso Legal
            </Link>
            <Link href="/politica-de-privacidad" className="hover:text-punk-pink">
              Política de Privacidad
            </Link>
            <Link href="/politica-de-cookies" className="hover:text-punk-pink">
              Política de Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
