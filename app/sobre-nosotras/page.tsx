import type { Metadata } from 'next'
import Image from 'next/image'
import { Megaphone, Flame, Heart } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Sobre Nosotras — Dame Marcha',
  description:
    'Quiénes somos y por qué hacemos Dame Marcha: una revista cultural de cine y música hecha desde el barrio.',
}

const VALUES = [
  {
    Icon: Megaphone,
    title: 'Actualidad',
    text: ' Enterate de las últimas novedades culturales',
  },
  {
    Icon: Flame,
    title: 'Desde el corazón',
    text: 'Crítica honesta y profesional.',
  },
  {
    Icon: Heart,
    title: 'De barrio',
    text: 'Desde salas pequeñas con artistas top',
  },
]

export default function SobreNosotrasPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
      <header className="border-b-2 border-punk-pink pb-8">
        <span className="font-display text-sm uppercase tracking-[0.3em] text-punk-yellow">
          Quiénes somos
        </span>
        <h1 className="mt-3 text-balance font-display text-5xl uppercase leading-[0.9] tracking-tight text-punk-cream sm:text-7xl">
          Sobre <span className="text-punk-pink">Nosotras</span>
        </h1>
      </header>

      <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:items-center">
        <div className="relative aspect-[4/3] overflow-hidden border-2 border-punk-yellow">
          <Image
            src="/images/sobre-nosotras.png"
            alt="El equipo editorial de Dame Marcha en su estudio"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <div className="flex flex-col gap-5 text-pretty text-lg leading-relaxed text-punk-cream/80">
          <p>
            <span className="font-display text-2xl uppercase text-punk-cream">Dame Marcha</span>{' '}
            nació de la ilusión de dos amigas que estudiaban comunicación audiovisual.
          </p>
          <p>
            Medio de comunicación dedicado a la divulgación de cultura musical y cinematográfica.
          </p>
          <p>
            Apostamos por el periodismo cultural independiente, con la intención de aportar frescura y calidad
            desde un punto de vista joven y actual.
          </p>
        </div>
      </div>

      <div className="mt-16 grid gap-6 sm:grid-cols-3">
        {VALUES.map(({ Icon, title, text }) => (
          <div
            key={title}
            className="flex flex-col gap-4 border-2 border-white/10 bg-card p-7 transition-colors hover:border-punk-pink"
          >
            <span className="flex size-12 items-center justify-center bg-punk-pink text-punk-black">
              <Icon className="size-6" aria-hidden="true" />
            </span>
            <h2 className="font-display text-2xl uppercase tracking-tight text-punk-cream">
              {title}
            </h2>
            <p className="text-sm leading-relaxed text-punk-cream/70">{text}</p>
          </div>
        ))}
      </div>

      <div className="mt-16 border-2 border-punk-yellow bg-punk-charcoal p-8 sm:p-12">
        <blockquote className="text-balance font-display text-3xl uppercase leading-tight tracking-tight text-punk-cream sm:text-5xl">
          {'"'}La cultura no es decoración. Es la <span className="text-punk-pink">marcha</span>{' '}
          que nos mantiene de pie.{'"'}
        </blockquote>
        <p className="mt-6 font-display text-sm uppercase tracking-[0.2em] text-punk-yellow">
          — El equipo de Dame Marcha
        </p>
      </div>
    </div>
  )
}
