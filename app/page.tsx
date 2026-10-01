import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getFeatured, articles } from '@/lib/articles'
import { HeroArticle } from '@/components/hero-article'
import { ArticleCard } from '@/components/article-card'
import { Marquee } from '@/components/marquee'

export default function HomePage() {
  const featured = getFeatured()

  // Ordenamos todos los artículos de más reciente a más antiguo por fecha
  const sortedArticles = [...articles].sort(
    (a, b) => new Date(b.rawDate).getTime() - new Date(a.rawDate).getTime()
  )

  if (!featured) return null

  return (
    <>
      {/* 1. Hero / Artículo destacado principal */}
      <section className="mx-auto max-w-7xl px-4 pt-8 sm:px-6">
        <HeroArticle article={featured} />
      </section>

      <div className="mt-10">
        <Marquee />
      </div>

      {/* 2. Lo Último / Todos los artículos por orden de antigüedad en cuadrícula uniforme */}
      <section className="mx-auto max-w-7xl px-4 pt-14 sm:px-6">
        <div className="mb-8 flex items-end justify-between border-b-2 border-punk-pink pb-4">
          <h2 className="font-display text-3xl uppercase leading-none tracking-tight text-punk-cream sm:text-4xl">
            Lo último <span className="text-punk-pink">/</span> Novedades
          </h2>
          <span className="hidden font-display text-sm uppercase tracking-[0.2em] text-punk-yellow sm:block">
            Cine · Música
          </span>
        </div>

        {/* Filas regulares (todas las tarjetas con el mismo tamaño estándar) */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sortedArticles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      </section>

      {/* 3. Banner CTA final */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="flex flex-col items-center justify-center gap-6 border-2 border-punk-yellow bg-punk-charcoal px-6 py-10 text-center">
          <h3 className="max-w-2xl text-balance font-display text-3xl uppercase leading-none tracking-tight text-punk-cream sm:text-4xl">
            ¿Te has quedado con ganas de más marcha?
          </h3>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/cine"
              className="flex items-center justify-center gap-2 bg-punk-pink px-6 py-3 font-display text-sm uppercase tracking-wide text-punk-black transition-colors hover:bg-punk-yellow"
            >
              Explorar Cine
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link
              href="/musica"
              className="flex items-center justify-center gap-2 border-2 border-punk-cream px-6 py-3 font-display text-sm uppercase tracking-wide text-punk-cream transition-colors hover:border-punk-yellow hover:text-punk-yellow"
            >
              Explorar Música
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
