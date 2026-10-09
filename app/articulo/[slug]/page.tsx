import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { ArrowLeft, Clock, Calendar } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import React from 'react'
import { articles, getArticle, getRecent } from '@/lib/articles'
import { CategoryTag } from '@/components/category-tag'
import { ArticleCard } from '@/components/article-card'
import { ReadingProgressBar, ShareButtons } from '@/components/share-and-progress'

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const article = getArticle(slug)
  if (!article) return { title: 'Artículo no encontrado — Dame Marcha' }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://damemarcha.com'

  return {
    title: `${article.title} — Dame Marcha`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      url: `${baseUrl}/articulo/${article.slug}`,
      siteName: 'Dame Marcha',
      images: [
        {
          url: article.image,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
      locale: 'es_ES',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
      images: [article.image],
    },
  }
}

// Renderizado de alternancia blanco/rosa con grosor de negrita bien marcado
function RenderBoldAlternatingWords({ text, isItalic }: { text: string; isItalic?: boolean }) {
  const tokens = text.split(/(\s+)/)
  let wordCounter = 0

  return (
    <strong className={`font-extrabold ${isItalic ? 'italic' : ''}`}>
      {tokens.map((token, idx) => {
        if (/^\s+$/.test(token)) {
          return <React.Fragment key={idx}>{token}</React.Fragment>
        }
        const isPink = wordCounter % 2 !== 0
        const colorClass = isPink ? 'text-punk-pink' : 'text-white'
        wordCounter++

        return (
          <span key={idx} className={`inline ${colorClass}`}>
            {token}
          </span>
        )
      })}
    </strong>
  )
}

// Helper para parsear Markdown (negritas con alternancia, cursivas sencillas y combinadas)
function parseMarkdownFormatting(text: string, keyPrefix: string): React.ReactNode[] {
  const regex = /(\*\*\*[\s\S]+?\*\*\*|\*\*[\s\S]+?\*\*|\*[\s\S]+?\*|___[\s\S]+?___|__[\s\S]+?__|_[s\S]+?_)/g
  const parts = text.split(regex)

  return parts.map((part, index) => {
    const key = `${keyPrefix}-fmt-${index}`

    // 1. Negrita + Cursiva combinadas: ***texto***
    if (/^(\*\*\*[\s\S]+\*\*\*|___[\s\S]+___)$/.test(part)) {
      const cleanText = part.slice(3, -3)
      return <RenderBoldAlternatingWords key={key} text={cleanText} isItalic />
    }

    // 2. Negrita solo: **texto**
    if (/^(\*\*[\s\S]+\*\*|__[\s\S]+__)$/.test(part)) {
      const cleanText = part.slice(2, -2)
      return <RenderBoldAlternatingWords key={key} text={cleanText} />
    }

    // 3. Cursiva solo: *texto*
    if (/^(\*[\s\S]+\*|_[\s\S]+_)$/.test(part)) {
      const cleanText = part.slice(1, -1)
      return (
        <em key={key} className="italic text-punk-cream">
          {cleanText}
        </em>
      )
    }

    // Texto plano normal
    return <React.Fragment key={key}>{part}</React.Fragment>
  })
}

function RenderParagraphWithMarkdown({ text }: { text: string }) {
  if (!text) return null
  return <>{parseMarkdownFormatting(text, 'p-main')}</>
}

// Renderizador de reproductores limpio (sin sombras pesadas)
function renderEmbeddedMedia(url: string) {
  if (!url) return null
  const cleanUrl = url.trim()

  // 1. Detectar Spotify
  const isSpotify = cleanUrl.includes('spotify.com') || cleanUrl.includes('spotify.link')
  if (isSpotify) {
    const spMatch = cleanUrl.match(/(track|album|playlist|episode|show)\/([a-zA-Z0-9]+)/)
    if (spMatch && spMatch[1] && spMatch[2]) {
      const type = spMatch[1]
      const id = spMatch[2]
      return (
        <div className="my-8 w-full clear-both">
          <div className="overflow-hidden rounded-lg border border-punk-pink/50 bg-punk-black">
            <iframe
              title="Reproductor de Spotify"
              src={`https://open.spotify.com/embed/${type}/${id}?utm_source=generator&theme=0`}
              width="100%"
              height={type === 'track' ? '152' : '352'}
              loading="lazy"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              className="block w-full border-0"
            />
          </div>
        </div>
      )
    }
  }

  // 2. Detectar YouTube
  const ytMatch = cleanUrl.match(
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  )
  if (ytMatch && ytMatch[1]) {
    return (
      <div className="my-8 w-full clear-both">
        <div className="relative aspect-video w-full overflow-hidden border border-white/10 bg-punk-black">
          <iframe
            title="Reproductor de YouTube"
            src={`https://www.youtube.com/embed/${ytMatch[1]}`}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 size-full border-0"
          />
        </div>
      </div>
    )
  }

  // 3. Detectar Instagram
  const igMatch = cleanUrl.match(
    /(?:https?:\/\/)?(?:www\.)?instagram\.com\/(?:p|reel)\/([a-zA-Z0-9_-]+)/
  )
  if (igMatch && igMatch[1]) {
    return (
      <div className="my-8 w-full clear-both">
        <div className="relative aspect-[4/5] mx-auto max-w-md overflow-hidden border border-white/10 bg-punk-black">
          <iframe
            title="Publicación de Instagram"
            src={`https://www.instagram.com/p/${igMatch[1]}/embed`}
            loading="lazy"
            allowFullScreen
            className="absolute inset-0 size-full border-0"
          />
        </div>
      </div>
    )
  }

  return null
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const article = getArticle(slug)
  if (!article) notFound()

  const related = getRecent(article.slug).slice(0, 3)

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://damemarcha.com'
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.excerpt,
    image: [article.image?.startsWith('http') ? article.image : `${baseUrl}${article.image}`],
    datePublished: article.date,
    author: [
      {
        '@type': 'Person',
        name: article.author || 'Dame Marcha',
      },
    ],
    publisher: {
      '@type': 'Organization',
      name: 'Dame Marcha',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/icon.png`,
      },
    },
  }

  return (
    <article lang="es">
      <ReadingProgressBar />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Portada */}
      <div className="relative aspect-[16/10] w-full sm:aspect-[21/9]">
        <Image
          src={article.image || '/placeholder.svg'}
          alt={article.title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
          unoptimized={article.image?.startsWith('/uploads')}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-punk-black via-punk-black/50 to-punk-black/20" />
      </div>

      <div className="relative z-10 mx-auto -mt-16 max-w-[680px] px-4 sm:px-6">
        <Link
          href={`/${article.section}`}
          className="mb-6 inline-flex items-center gap-2 font-display text-sm uppercase tracking-wide text-punk-yellow drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)] transition-colors hover:text-punk-pink"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Volver a {article.section === 'cine' ? 'Cine' : 'Música'}
        </Link>

        <div className="mb-4">
          <CategoryTag label={article.categoryLabel} section={article.section} />
        </div>

        <h1 className="text-balance font-display text-4xl uppercase leading-[0.92] tracking-tight text-punk-cream sm:text-6xl">
          {article.title}
        </h1>

        <p className="mt-5 text-pretty text-lg leading-relaxed text-punk-cream/80 font-light">
          {article.excerpt}
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-y-2 border-white/10 py-4 text-sm text-punk-cream/70">
          <span className="font-semibold uppercase tracking-wide text-punk-cream">
            Por {article.author}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="size-4" aria-hidden="true" />
            {article.date}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="size-4" aria-hidden="true" />
            {article.readingTime}
          </span>
        </div>

        <ShareButtons title={article.title} />

        {/* Cuerpo del artículo */}
        <div className="mt-10 flex flex-col gap-6">
          {article.body.map((para, i) => {
            const trimmed = para.trim()

            if (trimmed === '---' || trimmed === '***') {
              return (
                <div key={i} className="my-8 flex items-center justify-center gap-3 text-punk-pink/60 font-mono text-sm tracking-widest">
                  <span>///</span>
                </div>
              )
            }

            let alignmentClass = 'text-left'
            if (trimmed.startsWith('->') && trimmed.endsWith('<-')) {
              alignmentClass = 'text-center'
            } else if (trimmed.startsWith('->')) {
              alignmentClass = 'text-right'
            } else if (trimmed.startsWith('=')) {
              alignmentClass = 'text-justify'
            }

            const mediaEmbed = renderEmbeddedMedia(trimmed)
            if (mediaEmbed) {
              return <div key={i}>{mediaEmbed}</div>
            }

            const isHTML = trimmed.startsWith('<') && trimmed.endsWith('>')
            if (isHTML || trimmed.includes('<iframe')) {
              return (
                <div
                  key={i}
                  className={`my-4 text-pretty text-lg leading-[1.85] text-punk-cream/85 ${alignmentClass}`}
                  dangerouslySetInnerHTML={{ __html: para }}
                />
              )
            }

            return (
              <div
                key={i}
                className={`text-pretty text-lg leading-[1.85] text-punk-cream/85 ${alignmentClass} ${
                  i === 0
                    ? 'first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:font-display first-letter:text-6xl first-letter:leading-[0.8] first-letter:text-punk-pink'
                    : ''
                }`}
              >
                <ReactMarkdown
                  components={{
                    h1: ({ node, ...props }) => (
                      <h1 className="mt-10 mb-4 font-display text-3xl sm:text-4xl uppercase tracking-tight text-punk-cream border-b border-white/10 pb-2" {...props} />
                    ),
                    h2: ({ node, ...props }) => (
                      <h2 className="mt-9 mb-3 font-display text-2xl sm:text-3xl uppercase tracking-tight text-punk-yellow" {...props} />
                    ),
                    h3: ({ node, ...props }) => (
                      <h3 className="mt-8 mb-2 font-display text-xl sm:text-2xl uppercase tracking-tight text-punk-pink" {...props} />
                    ),

                    // Cita editorial limpia: con borde lateral rosa, fondo oscuro suave y texto en cursiva
                    blockquote: ({ node, ...props }) => (
                      <blockquote className="my-8 border-l-4 border-punk-pink bg-punk-black/40 px-6 py-4 italic text-punk-cream/90 rounded-r shadow-inner" {...props} />
                    ),

                    p: ({ node, children, ...props }) => {
                      if (typeof children === 'string') {
                        return (
                          <span className="m-0 inline" {...props}>
                            <RenderParagraphWithMarkdown text={children} />
                          </span>
                        )
                      }

                      const rawText = React.Children.toArray(children)
                        .map((child) => {
                          if (typeof child === 'string') return child
                          if (React.isValidElement(child) && (child as any).props.children) {
                            return typeof (child as any).props.children === 'string'
                              ? (child as any).props.children
                              : ''
                          }
                          return ''
                        })
                        .join('')

                      return (
                        <span className="m-0 inline" {...props}>
                          <RenderParagraphWithMarkdown text={rawText || (children as any)} />
                        </span>
                      )
                    },
                    a: ({ node, href, children, ...props }) => {
                      if (href) {
                        const isStandaloneUrl = typeof children === 'string' && children.trim() === href.trim()
                        if (isStandaloneUrl) {
                          const embed = renderEmbeddedMedia(href)
                          if (embed) return embed
                        }
                      }
                      return (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-punk-yellow underline underline-offset-4 decoration-punk-pink transition-colors hover:text-punk-pink"
                          {...props}
                        >
                          {children}
                        </a>
                      )
                    },
                    img: ({ node, src, alt, ...props }) => {
                      if (!src) return null
                      let finalSrc = src
                      if (finalSrc.startsWith('uploads/')) finalSrc = `/${finalSrc}`

                      return (
                        <span className="my-10 block w-full">
                          <span className="relative block aspect-[16/9] w-full overflow-hidden border border-white/10">
                            <Image
                              src={finalSrc}
                              alt={alt || 'Imagen del artículo'}
                              fill
                              sizes="(max-width: 768px) 100vw, 680px"
                              className="object-cover"
                              unoptimized={
                                finalSrc.startsWith('/uploads') ||
                                finalSrc.startsWith('uploads/')
                              }
                            />
                          </span>
                          {alt && (
                            <span className="mt-2.5 block text-center font-mono text-xs uppercase tracking-widest text-punk-cream/60">
                              / {alt}
                            </span>
                          )}
                        </span>
                      )
                    },
                  }}
                >
                  {para}
                </ReactMarkdown>
              </div>
            )
          })}
        </div>

        {/* Galería opcional */}
        {article.gallery && article.gallery.length > 0 && (
          <div className="mb-4 mt-14">
            <h2 className="mb-6 font-display text-2xl uppercase tracking-tight text-punk-cream border-b border-white/10 pb-2">
              Galería <span className="text-punk-yellow">/</span> Fotos
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {article.gallery.map((src, i) => (
                <div
                  key={i}
                  className="relative aspect-[4/3] overflow-hidden border border-white/10"
                >
                  <Image
                    src={src.startsWith('uploads/') ? `/${src}` : src}
                    alt={`${article.title} — imagen ${i + 1}`}
                    fill
                    sizes="(max-width: 640px) 100vw, 340px"
                    className="object-cover transition-transform duration-500 hover:scale-105"
                    unoptimized={
                      src.startsWith('/uploads') || src.startsWith('uploads/')
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Relacionados */}
      <section className="mx-auto mt-20 max-w-7xl px-4 py-14 sm:px-6">
        <div className="mb-8 border-b-2 border-punk-pink pb-4">
          <h2 className="font-display text-3xl uppercase leading-none tracking-tight text-punk-cream sm:text-4xl">
            Sigue la <span className="text-punk-pink">marcha</span>
          </h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((a) => (
            <ArticleCard key={a.slug} article={a} />
          ))}
        </div>
      </section>
    </article>
  )
}
