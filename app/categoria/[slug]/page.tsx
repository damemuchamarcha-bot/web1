import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import {
  CATEGORY_LABELS,
  getByCategory,
  type CategorySlug,
} from '@/lib/articles'
import { ArticleListing } from '@/components/article-listing'

const DESCRIPTIONS: Record<CategorySlug, string> = {
  'proximos-estrenos':
    'Guía sin spoilers de los estrenos que darán que hablar.',
  'analisis-de-cine':
    'Todo lo que se esconde entre planos.',
  'critica-de-cine':
    'Reseñas directas y al grano de los últimos títulos.',
  'analisis-de-albumes':
    'Escucha atenta y análisis de los lanzamientos musicales.',
  'directos':
    'Crónicas, fotos y ruido directo desde las salas.',
}

export function generateStaticParams() {
  return (Object.keys(CATEGORY_LABELS) as CategorySlug[]).map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const label = CATEGORY_LABELS[slug as CategorySlug]
  if (!label) return { title: 'Categoría no encontrada — Dame Marcha' }
  return {
    title: `${label} — Dame Marcha`,
    description: DESCRIPTIONS[slug as CategorySlug],
  }
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const category = slug as CategorySlug
  const label = CATEGORY_LABELS[category]

  if (!label) notFound()

  // Filtramos los artículos pertenecientes de forma estricta a esta subcategoría
  const filteredArticles = getByCategory(category)

  return (
    <ArticleListing
      eyebrow="Categoría"
      title={label}
      description={DESCRIPTIONS[category]}
      articles={filteredArticles}
    />
  )
}
