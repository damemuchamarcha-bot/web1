import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Prensa y Patrocinios',
  description: 'Información sobre notas de prensa, artículos patrocinados y colaboraciones con DAME MARCHA.',
}

export default function PrensaPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-heading text-4xl font-bold uppercase tracking-wider text-white sm:text-5xl">
        Prensa & Patrocinios
      </h1>
      <p className="mt-4 text-lg text-neutral-400">
        DAME MARCHA es una revista cultural neo-punk centrada en cine y música independiente, análisis sin filtros y novedades de la escena.
      </p>

      <div className="mt-10 space-y-8 text-neutral-300">
        <section className="rounded-lg border border-neutral-800 bg-neutral-900/50 p-6">
          <h2 className="text-xl font-bold text-white">1. Notas de prensa y lanzamientos</h2>
          <p className="mt-2 text-sm text-neutral-400">
            ¿Eres un sello discográfico, promotora o distribuidora de cine? Recibimos material de prensa, sencillos, álbumes y avances de próximos estrenos.
          </p>
        </section>

        <section className="rounded-lg border border-neutral-800 bg-neutral-900/50 p-6">
          <h2 className="text-xl font-bold text-white">2. Artículos patrocinados y reseñas</h2>
          <p className="mt-2 text-sm text-neutral-400">
            Publicamos contenido patrocinado, entrevistas y coberturas especiales siempre que encajen con la línea editorial de la revista.
          </p>
        </section>

        <section className="rounded-lg border border-neutral-800 bg-neutral-900/50 p-6">
          <h2 className="text-xl font-bold text-white">3. Contacto directo</h2>
          <p className="mt-2 text-sm text-neutral-400">
            Envía tu nota de prensa o solicita nuestra propuesta comercial a:
          </p>
          <a
            href="mailto:contacto@damemarcha.com"
            className="mt-4 inline-block font-mono text-lg font-semibold text-white underline hover:text-neutral-300"
          >
            contacto@damemarcha.com
          </a>
        </section>
      </div>
    </div>
  )
}
