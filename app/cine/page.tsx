import type { Metadata } from 'next'
import { getBySection } from '@/lib/articles'
import { ArticleListing } from '@/components/article-listing'

export const metadata: Metadata = {
  title: 'Cine — Dame Marcha',
  description:
    'Próximos estrenos, análisis y crítica de cine sin concesiones.',
}

export default function CinePage() {
  return (
    <ArticleListing
      eyebrow="Sección"
      title="Cine"
      articles={getBySection('cine')}
    />
  )
}
