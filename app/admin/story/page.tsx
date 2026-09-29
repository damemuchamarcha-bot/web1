'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Article {
  title: string
  category: string
  slug?: string
}

export default function StoryGenerator() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)

  // Artículos cargados desde la web
  const [articles, setArticles] = useState<Article[]>([])
  const [selectedArticleSlug, setSelectedArticleSlug] = useState<string>('custom')

  // Datos de la Story
  const [title, setTitle] = useState('TÍTULO DE MUESTRA PARA EL ARTÍCULO')
  const [category, setCategory] = useState('MÚSICA')
  const [mediaSrc, setMediaSrc] = useState<string | null>(null)
  const [isVideo, setIsVideo] = useState(false)

  // Cargar artículos al iniciar o desbloquear
  useEffect(() => {
    fetch('/api/articles')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setArticles(data)
        }
      })
      .catch(() => {
        // Manejo silencioso si no hay API aún
      })
  }, [])

  const handleSelectArticle = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value
    setSelectedArticleSlug(val)

    if (val === 'custom') {
      return
    }

    const found = articles.find((a) => a.slug === val || a.title === val)
    if (found) {
      setTitle(found.title)
      setCategory(found.category || 'MÚSICA')
    }
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    const secretKey = process.env.NEXT_PUBLIC_ADMIN_SECRET || 'damemarcha2026'
    
    if (password === secretKey) {
      setIsAuthenticated(true)
      setError(false)
    } else {
      setError(true)
    }
  }

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setIsVideo(file.type.startsWith('video/'))
      setMediaSrc(url)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-punk-black p-4 text-punk-cream">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-md border border-punk-pink/40 bg-black/80 p-8 shadow-2xl backdrop-blur"
        >
          <div className="mb-6 text-center">
            <span className="bg-punk-pink px-3 py-1 font-display text-xs uppercase tracking-widest text-punk-black">
              DAME MARCHA
            </span>
            <h1 className="mt-4 font-display text-2xl uppercase text-punk-pink">
              Acceso Restringido
            </h1>
            <p className="mt-1 text-xs text-punk-cream/60">
              Introduce la clave para acceder al generador de Stories.
            </p>
          </div>

          <div className="mb-4">
            <input
              type="password"
              placeholder="Contraseña de administrador"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-punk-cream/20 bg-punk-black p-3 font-mono text-sm text-punk-cream focus:border-punk-pink focus:outline-none"
            />
            {error && (
              <p className="mt-2 text-xs text-red-500">
                Contraseña incorrecta. Inténtalo de nuevo.
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-punk-pink p-3 font-display uppercase tracking-wider text-punk-black transition-colors hover:bg-punk-yellow"
          >
            Entrar
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-punk-black p-4 text-punk-cream sm:p-8">
      <div className="mx-auto max-w-6xl">
        {/* Cabecera del Panel */}
        <div className="mb-8 flex items-center justify-between border-b border-punk-pink/30 pb-4">
          <div>
            <h1 className="font-display text-3xl uppercase tracking-wider text-punk-pink">
              Generador de Stories
            </h1>
            <p className="text-sm text-punk-cream/70">
              Adapta tus entradas con fotos o vídeos para Instagram.
            </p>
          </div>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="bg-punk-pink/10 px-4 py-2 font-display text-sm uppercase text-punk-pink hover:bg-punk-pink hover:text-punk-black"
          >
            Cerrar Sesión
          </button>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Panel de Control */}
          <div className="space-y-6 lg:col-span-5">
            <div className="border border-punk-cream/10 bg-black/40 p-6 backdrop-blur">
              <h2 className="mb-4 font-display text-xl uppercase text-punk-yellow">
                1. Contenido del artículo
              </h2>

              {/* Selección de artículo publicado o personalizado */}
              <div className="mb-4">
                <label className="mb-1 block font-sans text-xs uppercase tracking-wider text-punk-cream/80">
                  Cargar desde la web
                </label>
                <select
                  value={selectedArticleSlug}
                  onChange={handleSelectArticle}
                  className="w-full border border-punk-pink/40 bg-punk-black p-3 font-sans text-sm text-punk-cream focus:border-punk-pink focus:outline-none"
                >
                  <option value="custom">✏️ Titular Personalizado (Escribir a mano)</option>
                  {articles.length > 0 ? (
                    articles.map((art, idx) => (
                      <option key={art.slug || idx} value={art.slug || art.title}>
                        📄 {art.title}
                      </option>
                    ))
                  ) : (
                    <option disabled value="">(Sin entradas detectadas o escribe abajo)</option>
                  )}
                </select>
              </div>

              {/* Categorías ajustadas de la revista */}
              <div className="mb-4">
                <label className="mb-1 block font-sans text-xs uppercase tracking-wider text-punk-cream/80">
                  Categoría
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border border-punk-cream/20 bg-punk-black p-3 font-display uppercase text-punk-cream focus:border-punk-pink focus:outline-none"
                >
                  <option value="MÚSICA">MÚSICA</option>
                  <option value="CINE">CINE</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="mb-1 block font-sans text-xs uppercase tracking-wider text-punk-cream/80">
                  Titular del artículo
                </label>
                <textarea
                  rows={3}
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value)
                    setSelectedArticleSlug('custom')
                  }}
                  className="w-full border border-punk-cream/20 bg-punk-black p-3 font-display uppercase tracking-wide text-punk-cream focus:border-punk-pink focus:outline-none"
                  placeholder="Escribe aquí el titular..."
                />
              </div>

              <div className="mb-4">
                <label className="mb-1 block font-sans text-xs uppercase tracking-wider text-punk-cream/80">
                  Foto o Vídeo Vertical (Fondo)
                </label>
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleMediaUpload}
                  className="w-full cursor-pointer border border-punk-cream/20 bg-punk-black p-2 font-sans text-sm text-punk-cream/60 file:mr-4 file:border-0 file:bg-punk-pink file:px-4 file:py-2 file:font-display file:text-xs file:uppercase file:text-punk-black"
                />
              </div>
            </div>

            <div className="border border-punk-cream/10 bg-black/40 p-6 backdrop-blur">
              <h2 className="mb-2 font-display text-xl uppercase text-punk-yellow">
                2. Instrucciones
              </h2>
              <p className="text-xs leading-relaxed text-punk-cream/70">
                • Selecciona un artículo publicado para autorrellenar el título o escribe uno manual.<br />
                • Los textos respetan las <strong>zonas seguras de Instagram</strong>.<br />
                • Sube una foto o vídeo MP4 y ajusta la vista previa 9:16.
              </p>
            </div>
          </div>

          {/* Canvas de previsualización 9:16 (Instagram Story) */}
          <div className="flex justify-center lg:col-span-7">
            <div
              id="story-canvas"
              className="relative aspect-[9/16] w-full max-w-[380px] overflow-hidden border-4 border-punk-pink bg-black shadow-2xl"
            >
              {/* Fondo (Foto o Vídeo) */}
              {mediaSrc ? (
                isVideo ? (
                  <video
                    src={mediaSrc}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <img
                    src={mediaSrc}
                    alt="Fondo Story"
                    className="h-full w-full object-cover"
                  />
                )
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-zinc-900 p-6 text-center">
                  <span className="font-display text-xs uppercase tracking-widest text-punk-cream/40">
                    Sube una foto o vídeo para previsualizar
                  </span>
                </div>
              )}

              {/* Degradado oscuro para lectura de texto */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/60" />

              {/* Marca de agua / Cabecera */}
              <div className="absolute left-6 right-6 top-12 flex items-center justify-between">
                <span className="border border-punk-cream/20 bg-punk-black/80 px-3 py-1 font-display text-xs uppercase tracking-widest text-punk-cream">
                  DAME MARCHA
                </span>
                <span className="bg-punk-pink px-3 py-1 font-display text-xs uppercase tracking-wider text-punk-black">
                  {category}
                </span>
              </div>

              {/* Bloque del Titular */}
              <div className="absolute bottom-20 left-6 right-6 space-y-3">
                <div className="inline-block bg-punk-yellow px-2 py-0.5 font-display text-[10px] uppercase text-punk-black">
                  NUEVO ARTÍCULO
                </div>
                <h3 className="border-l-4 border-punk-pink bg-punk-black/90 p-4 font-display text-2xl uppercase leading-none tracking-tight text-punk-cream">
                  {title}
                </h3>
                <div className="flex items-center justify-between bg-punk-pink p-2 text-punk-black">
                  <span className="font-display text-xs uppercase tracking-wide">
                    LEE MÁS EN LA WEB
                  </span>
                  <span className="font-display text-xs">→</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
