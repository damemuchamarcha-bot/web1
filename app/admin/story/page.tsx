'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function StoryGenerator() {
  const [title, setTitle] = useState('TITULO DE MUESTRA PARA EL ARTÍCULO')
  const [category, setCategory] = useState('CINE')
  const [mediaSrc, setMediaSrc] = useState<string | null>(null)
  const [isVideo, setIsVideo] = useState(false)

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setIsVideo(file.type.startsWith('video/'))
      setMediaSrc(url)
    }
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
          <Link
            href="/"
            className="bg-punk-pink/10 px-4 py-2 font-display text-sm uppercase text-punk-pink hover:bg-punk-pink hover:text-punk-black"
          >
            ← Volver a la web
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Panel de Control (Controles) */}
          <div className="space-y-6 lg:col-span-5">
            <div className="border border-punk-cream/10 bg-black/40 p-6 backdrop-blur">
              <h2 className="mb-4 font-display text-xl uppercase text-punk-yellow">
                1. Contenido del artículo
              </h2>
              
              <div className="mb-4">
                <label className="mb-1 block font-sans text-xs uppercase tracking-wider text-punk-cream/80">
                  Categoría
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border border-punk-cream/20 bg-punk-black p-3 font-display uppercase text-punk-cream focus:border-punk-pink focus:outline-none"
                >
                  <option value="CINE">CINE</option>
                  <option value="MÚSICA">MÚSICA</option>
                  <option value="ENTREVISTA">ENTREVISTA</option>
                  <option value="CRÍTICA">CRÍTICA</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="mb-1 block font-sans text-xs uppercase tracking-wider text-punk-cream/80">
                  Titular del artículo
                </label>
                <textarea
                  rows={3}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
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
                  className="w-full cursor-pointer border border-punk-cream/20 bg-punk-black p-2 font-sans text-sm text-punk-cream text-punk-cream/60 file:mr-4 file:border-0 file:bg-punk-pink file:px-4 file:py-2 file:font-display file:text-xs file:uppercase file:text-punk-black"
                />
              </div>
            </div>

            <div className="border border-punk-cream/10 bg-black/40 p-6 backdrop-blur">
              <h2 className="mb-2 font-display text-xl uppercase text-punk-yellow">
                2. Instrucciones
              </h2>
              <p className="text-xs leading-relaxed text-punk-cream/70">
                • Los textos están colocados respetando las <strong>zonas seguras de Instagram</strong> (para que no los tape el avatar superior ni la barra de respuestas).<br />
                • Si subes una <strong>foto</strong>, haz una captura de pantalla del lienzo o guarda el frame.<br />
                • Si subes un <strong>vídeo MP4</strong>, se reproducirá en bucle con la capa neo-punk superpuesta.
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

              {/* Marca de agua / Cabecera (Respetando zona superior IG) */}
              <div className="absolute left-6 right-6 top-12 flex items-center justify-between">
                <span className="bg-punk-black/80 px-3 py-1 font-display text-xs uppercase tracking-widest text-punk-cream border border-punk-cream/20">
                  DAME MARCHA
                </span>
                <span className="bg-punk-pink px-3 py-1 font-display text-xs uppercase tracking-wider text-punk-black">
                  {category}
                </span>
              </div>

              {/* Bloque del Titular (Respetando zona central/inferior IG) */}
              <div className="absolute bottom-20 left-6 right-6 space-y-3">
                <div className="inline-block bg-punk-yellow px-2 py-0.5 font-display text-[10px] uppercase text-punk-black">
                  NUEVO ARTÍCULO
                </div>
                <h3 className="bg-punk-black/90 p-4 font-display text-2xl uppercase leading-none tracking-tight text-punk-cream border-l-4 border-punk-pink">
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
