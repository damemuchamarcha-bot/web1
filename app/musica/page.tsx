import type { Metadata } from 'next'
import { getBySection } from '@/lib/articles'
import { ArticleListing } from '@/components/article-listing'

export const metadata: Metadata = {
  title: 'Música — Dame Marcha',
  description:
    'Análisis de álbumes y crónicas de directos.',
}

export default function MusicaPage() {
  return (
    <ArticleListing
      eyebrow="Sección"
      title="Música"
        articles={getBySection('musica')}
    />
  )
}
