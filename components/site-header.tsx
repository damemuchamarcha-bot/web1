'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, ChevronDown, Search } from 'lucide-react'
import { Article } from '@/lib/articles'

type NavChild = { label: string; href: string }
type NavItem = { label: string; href: string; children?: NavChild[] }

const NAV: NavItem[] = [
  { label: 'Home', href: '/' },
  {
    label: 'Cine',
    href: '/cine',
    children: [
      { label: 'Próximos Estrenos', href: '/categoria/proximos-estrenos' },
      { label: 'Análisis de Cine', href: '/categoria/analisis-de-cine' },
      { label: 'Crítica de Cine', href: '/categoria/critica-de-cine' },
    ],
  },
  {
    label: 'Música',
    href: '/musica',
    children: [
      { label: 'Análisis de Álbumes', href: '/categoria/analisis-de-albumes' },
      { label: 'Directos', href: '/categoria/directos' },
    ],
  },
  { label: 'Sobre Nosotras', href: '/sobre-nosotras' },
]

interface SiteHeaderProps {
  articles?: Article[]
}

export function SiteHeader({ articles = [] }: SiteHeaderProps) {
  const [open, setOpen] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)
  
  // Estado para la búsqueda
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')

  // Filtrado de artículos en tiempo real
  const filteredArticles = query.trim()
    ? articles.filter(
        (art) =>
          art.title.toLowerCase().includes(query.toLowerCase()) ||
          art.excerpt.toLowerCase().includes(query.toLowerCase()) ||
          art.categoryLabel.toLowerCase().includes(query.toLowerCase())
      )
    : []

  return (
    <header className="sticky top-0 z-50 border-b-2 border-punk-pink bg-punk-black">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        {/* BRAND LOGO */}
        <Link
          href="/"
          className="group flex items-baseline gap-1"
          onClick={() => {
            setOpen(false)
            setSearchOpen(false)
          }}
        >
          <span className="font-display text-2xl uppercase leading-none tracking-tight text-punk-cream sm:text-3xl">
            Dame
          </span>
          <span className="bg-punk-pink px-1.5 font-display text-2xl uppercase leading-none tracking-tight text-punk-black transition-colors group-hover:bg-punk-yellow sm:text-3xl">
            Marcha
          </span>
        </Link>

        {/* DESKTOP NAV + SEARCH TRIGGER */}
        <div className="flex items-center gap-4">
          <nav className="hidden items-center gap-1 md:flex">
            {NAV.map((item) => (
              <div key={item.label} className="group relative">
                <Link
                  href={item.href}
                  className="flex items-center gap-1 px-3 py-2 font-display text-sm uppercase tracking-wide text-punk-cream transition-colors hover:text-punk-pink"
                >
                  {item.label}
                  {item.children && <ChevronDown className="size-3.5" aria-hidden="true" />}
                </Link>
                {item.children && (
                  <div className="invisible absolute left-0 top-full min-w-56 border-2 border-punk-pink bg-punk-black opacity-0 transition-all group-hover:visible group-hover:opacity-100">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block border-b border-white/10 px-4 py-3 text-sm font-medium text-punk-cream transition-colors last:border-b-0 hover:bg-punk-pink hover:text-punk-black"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* BOTÓN LUPA PARA ABRIR BUSCADOR */}
          <button
            type="button"
            onClick={() => {
              setSearchOpen((v) => !v)
              setOpen(false)
            }}
            className="flex size-10 items-center justify-center border-2 border-punk-cream text-punk-cream transition-colors hover:border-punk-yellow hover:text-punk-yellow"
            aria-label={searchOpen ? 'Cerrar búsqueda' : 'Abrir búsqueda'}
          >
            {searchOpen ? <X className="size-5 text-punk-pink" /> : <Search className="size-5" />}
          </button>

          {/* TOGGLE MÓVIL */}
          <button
            type="button"
            onClick={() => {
              setOpen((v) => !v)
              setSearchOpen(false)
            }}
            className="flex size-10 items-center justify-center border-2 border-punk-cream text-punk-cream transition-colors hover:border-punk-pink hover:text-punk-pink md:hidden"
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={open}
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      {/* DESPLEGABLE DE BÚSQUEDA FLOTANTE */}
      {searchOpen && (
        <div className="border-t-2 border-punk-yellow bg-punk-charcoal px-4 py-6 shadow-2xl sm:px-6">
          <div className="mx-auto max-w-3xl">
            <div className="relative flex items-center">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="BUSCAR EN EL ARCHIVO (TÍTULO, ARTISTA, CATEGORÍA)..."
                className="w-full border-2 border-punk-yellow bg-punk-black px-4 py-3 font-display text-sm tracking-wider text-punk-cream placeholder:text-punk-cream/40 focus:border-punk-pink focus:outline-none"
                autoFocus
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-3 text-punk-cream/60 hover:text-punk-cream"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>

            {/* RESULTADOS DE LA BÚSQUEDA */}
            {query.trim() !== '' && (
              <div className="mt-4 max-h-80 overflow-y-auto border border-punk-yellow/30 bg-punk-black p-2">
                {filteredArticles.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    {filteredArticles.map((art) => (
                      <Link
                        key={art.slug}
                        href={`/articulos/${art.slug}`}
                        onClick={() => {
                          setSearchOpen(false)
                          setQuery('')
                        }}
                        className="flex items-center justify-between border border-transparent p-3 hover:border-punk-pink hover:bg-punk-charcoal transition-colors"
                      >
                        <div>
                          <span className="font-display text-xs uppercase text-punk-pink">{art.categoryLabel}</span>
                          <h4 className="font-display text-sm uppercase text-punk-cream">{art.title}</h4>
                        </div>
                        <span className="font-display text-xs text-punk-yellow">{art.date}</span>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="p-4 text-center font-display text-xs uppercase tracking-wider text-punk-cream/50">
                    No se encontraron artículos con &quot;{query}&quot;
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* MOBILE DRAWER NAV */}
      {open && (
        <nav className="border-t-2 border-punk-pink bg-punk-black md:hidden">
          {NAV.map((item) => (
            <div key={item.label} className="border-b border-white/10">
              {item.children ? (
                <>
                  <button
                    type="button"
                    onClick={() => setExpanded((e) => (e === item.label ? null : item.label))}
                    className="flex w-full items-center justify-between px-5 py-4 font-display text-lg uppercase tracking-wide text-punk-cream"
                    aria-expanded={expanded === item.label}
                  >
                    {item.label}
                    <ChevronDown
                      className={`size-5 transition-transform ${expanded === item.label ? 'rotate-180 text-punk-pink' : ''}`}
                      aria-hidden="true"
                    />
                  </button>
                  {expanded === item.label && (
                    <div className="bg-punk-charcoal pb-2">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => setOpen(false)}
                          className="block px-8 py-3 text-sm font-medium text-punk-cream/90 transition-colors hover:text-punk-yellow"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block px-5 py-4 font-display text-lg uppercase tracking-wide text-punk-cream transition-colors hover:text-punk-pink"
                >
                  {item.label}
                </Link>
              )}
            </div>
          ))}
        </nav>
      )}
    </header>
  )
}
