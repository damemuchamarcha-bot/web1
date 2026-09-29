import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Página no encontrada',
  description: 'La página que buscas no existe o ha sido movida.',
}

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-16 text-center">
      <span className="font-display text-8xl uppercase tracking-widest text-punk-pink sm:text-9xl">
        404
      </span>
      <h1 className="mt-4 font-display text-3xl uppercase tracking-tight text-punk-cream sm:text-5xl">
        Te has salido del acople
      </h1>
      <p className="mt-4 max-w-md text-base leading-relaxed text-punk-cream/70">
        Esta página se ha evaporado o nunca existió. Rebobina la cinta y vuelve al escenario principal.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block bg-punk-pink px-8 py-3 font-display text-base uppercase tracking-wide text-punk-black transition-colors hover:bg-punk-yellow"
      >
        Volver al inicio
      </Link>
    </div>
  )
}
