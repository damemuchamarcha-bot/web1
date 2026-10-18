'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

const FRASES_PUNK = [
  "¡BEE-EE!",
  "¿Otra vez haciendo clic? Ponte a leer el artículo.",
  "Dame Marcha o dame lana.",
  "No duermas contando ovejas, lee críticas de cine.",
]

export function MascotaOveja() {
  const [frase, setFrase] = useState<string | null>(null)

  const manejarClic = () => {
    const fraseAleatoria = FRASES_PUNK[Math.floor(Math.random() * FRASES_PUNK.length)]
    setFrase(fraseAleatoria)
  }

  return (
    <aside aria-label="Mascota interactiva" className="fixed bottom-4 right-4 z-50 flex flex-col items-end pointer-events-none">
      {/* Bocadillo estilo Fanzine / Neo-punk */}
      {frase && (
        <div className="pointer-events-auto mb-2 relative max-w-[200px] border-2 border-punk-pink bg-punk-black p-3 font-mono text-xs text-punk-cream shadow-[4px_4px_0px_0px_rgba(255,0,128,1)] animate-in fade-in slide-in-from-bottom-2 duration-200">
          <button
            onClick={() => setFrase(null)}
            className="absolute top-1 right-1 text-punk-cream/60 hover:text-punk-pink transition-colors"
            title="Cerrar"
          >
            <X className="size-3" />
          </button>
          <p className="pr-3 leading-snug">{frase}</p>
          {/* Pico del bocadillo */}
          <div className="absolute -bottom-2 right-5 size-0 border-x-8 border-x-transparent border-t-8 border-t-punk-pink" />
        </div>
      )}

      {/* Botón con la Oveja Animada utilizando tus clases de calibración */}
      <button
        onClick={manejarClic}
        className="pointer-events-auto relative cursor-pointer focus:outline-none transition-transform hover:scale-110 active:scale-95 bg-punk-black border-2 border-punk-pink/40 p-2 shadow-[3px_3px_0px_0px_rgba(255,0,128,1)] hover:border-punk-pink"
        title="¡Hazme clic!"
      >
        <div className="animate-oveja-caminar" />
      </button>
    </aside>
  )
}
