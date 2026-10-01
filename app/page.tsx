import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getFeatured, getRecent, articles } from '@/lib/articles'
import { HeroArticle } from '@/components/hero-article'
import { ArticleCard } from '@/components/article-card'
import { Marquee } from '@/components/marquee'
import { ArticleSearch } from '@/components/article-search'

export default function HomePage() {
  const featured = getFeatured()
  const recent = getRecent(featured ? featured.slug : '')
  const lead = recent[0]
  const rest = recent.slice(1, 3)

  if (!featured) return null

  return (
    <>
      {/* 1. Hero / Elegido desde Decap CMS (o el más reciente) */}
      <section className="mx-auto max-w-7xl px-4 pt-8 sm:px-6">
        <HeroArticle article={featured} />
      </section>

      <div className="mt-10">
        <Marquee />
      </div>

      {/* 2. Lo Último — Las 3 publicaciones más recientes (excluyendo la portada) */}
      <section className="mx-auto max-w-7xl px-4 pt-14 sm:px-6">
        <div className="mb-8 flex items-end justify-between border-b-2 border-punk-pink pb-4">
          <h2 className="font-display text-3xl uppercase leading-none tracking-tight text-punk-cream sm:text-4xl">
            Lo último <span className="text-punk-pink">/</span> Noticias y reseñas
          </h2>
          <span className="hidden font-display text-sm uppercase tracking-[0.2em] text-punk-yellow sm:block">
            Cine · Música
          </span>
        </div>

        {lead && (
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 lg:row-span-2">
              <ArticleCard article={lead} size="lg" />
            </div>
            {rest.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        )}
      </section>

      {/* 3. Buscador interactivo / Explora todo el archivo */}
      <section className="mx-auto max-w-7xl px-4 pt-16 sm:px-6">
        <div className="mb-8 border-b-2 border-punk-yellow pb-4">
          <h2 className="font-display text-3xl uppercase leading-none tracking-tight text-punk-cream sm:text-4xl">
            Buscador <span className="text-punk-yellow">/</span> Explora el archivo
          </h2>
        </div>

        <ArticleSearch articles={articles} />
      </section>

      {/* 4. Banner final CTA */}
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
