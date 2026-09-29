import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de Cookies | Dame Marcha',
  description: 'Información sobre el uso de cookies en Dame Marcha.',
}

export default function PoliticaCookiesPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12 text-zinc-100">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-amber-400">Política de Cookies</h1>

      <div className="space-y-6 text-zinc-300 text-sm leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-white mb-2">1. ¿Qué son las Cookies?</h2>
          <p>
            Una cookie es un pequeño archivo de texto que se almacena en tu navegador cuando visitas casi cualquier página web. Su función principal es recordar la visita para adaptar y mejorar la experiencia de navegación.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">2. Tipos de Cookies Utilizadas</h2>
          <p>
            Este sitio web utiliza únicamente cookies técnicas estrictamente necesarias para el correcto funcionamiento del sitio y la navegación básica, así como cookies de terceros integradas al reproducir contenidos multimedia externos (como reproductores de Spotify o vídeos de YouTube) o interactuar con formularios.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">3. Desactivación o Eliminación de Cookies</h2>
          <p>
            En cualquier momento puedes ejercer tu derecho de desactivación o eliminación de cookies de este sitio web a través de las opciones de configuración de tu navegador.
          </p>
        </section>
      </div>
    </main>
  )
}
