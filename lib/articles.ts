import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const articlesDirectory = path.join(process.cwd(), 'content/articles')

// Helper para convertir automáticamente URLs de ucarecdn.net a ucarecdn.com
function sanitizeImageUrl(url?: string): string {
  if (!url) return ''
  return url.replace(/ucarecdn\.net/g, 'ucarecdn.com')
}

// Subcategorías válidas
export type CategorySlug =
  | 'analisis-de-cine'
  | 'critica-de-cine'
  | 'proximos-estrenos'
  | 'analisis-de-albumes'
  | 'directos'

// Secciones principales (Sección Madre)
export type SectionSlug = 'cine' | 'musica'

export const CATEGORY_LABELS: Record<CategorySlug, string> = {
  'analisis-de-cine': 'Análisis de Cine',
  'critica-de-cine': 'Crítica de Cine',
  'proximos-estrenos': 'Próximos Estrenos',
  'analisis-de-albumes': 'Análisis de Álbumes',
  'directos': 'Directos',
}

// Mapeo automático de Subcategoría -> Sección Principal
export const CATEGORY_TO_SECTION: Record<CategorySlug, SectionSlug> = {
  'analisis-de-cine': 'cine',
  'critica-de-cine': 'cine',
  'proximos-estrenos': 'cine',
  'analisis-de-albumes': 'musica',
  'directos': 'musica',
}

export interface Article {
  slug: string
  title: string
  excerpt: string
  section: SectionSlug | string
  category: CategorySlug | string
  categoryLabel: string
  author: string
  date: string
  rawDate: string
  timeAgo: string
  readingTime: string
  image: string
  featured: boolean
  spotify?: string
  youtube?: string
  gallery?: string[]
  body: string[]
}

export function getAllArticles(): Article[] {
  if (!fs.existsSync(articlesDirectory)) {
    return []
  }

  const fileNames = fs.readdirSync(articlesDirectory)
  const allArticlesData = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '')
      const fullPath = path.join(articlesDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const matterResult = matter(fileContents)

      const data = matterResult.data
      const content = matterResult.content || ''

      if (!data.title) {
        return null
      }

      // --- IMAGEN GLOBAL ---
      let rawImage = data.image || data.thumbnail || data.portada || data.photo || '/placeholder.svg'
      if (typeof rawImage === 'string' && rawImage.trim() !== '') {
        rawImage = sanitizeImageUrl(rawImage)
        if (rawImage.startsWith('uploads/')) {
          rawImage = `/${rawImage}`
        } else if (!rawImage.startsWith('http') && !rawImage.startsWith('/')) {
          rawImage = `/${rawImage}`
        }
      } else {
        rawImage = '/placeholder.svg'
      }

      // --- YOUTUBE GLOBAL ---
      let rawYoutube = data.youtube || data.video || data.yt || ''
      if (!rawYoutube) {
        const ytRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
        const matchContent = content.match(ytRegex)
        if (matchContent && matchContent[1]) {
          rawYoutube = `https://www.youtube.com/embed/${matchContent[1]}`
        }
      } else {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
        const match = rawYoutube.match(regExp)
        if (match && match[2].length === 11) {
          rawYoutube = `https://www.youtube.com/embed/${match[2]}`
        }
      }

      // --- SPOTIFY GLOBAL ---
      let rawSpotify = data.spotify || data.audio || data.spo || ''
      if (!rawSpotify) {
        const spRegex = /(?:https?:\/\/)?(?:open\.)?spotify\.com\/(?:track|album|playlist)\/([a-zA-Z0-9]+)/
        const matchSp = content.match(spRegex)
        if (matchSp && matchSp[1]) {
          const type = content.includes('/album/') ? 'album' : 'track'
          rawSpotify = `https://open.spotify.com/embed/${type}/${matchSp[1]}`
        }
      } else if (typeof rawSpotify === 'string' && rawSpotify.trim() !== '') {
        if (!rawSpotify.includes('/embed/')) {
          rawSpotify = rawSpotify.replace('open.spotify.com/', 'open.spotify.com/embed/')
        }
      }

      // --- GALERÍA GLOBAL ---
      const rawGallery = data.gallery || data.images || data.fotos || []
      const formattedGallery = Array.isArray(rawGallery) 
        ? rawGallery.map((img: string) => {
            if (typeof img === 'string') {
              const cleanImg = sanitizeImageUrl(img)
              if (cleanImg.startsWith('uploads/')) return `/${cleanImg}`
              return cleanImg.startsWith('http') || cleanImg.startsWith('/') ? cleanImg : `/${cleanImg}`
            }
            return ''
          }).filter(Boolean)
        : []

      // --- CUERPO DEL ARTÍCULO Y SANEAMIENTO DE IMÁGENES EMBEDDED ---
      const rawBody = content
        ? content.split('\n\n').map((p) => sanitizeImageUrl(p.trim())).filter(Boolean)
        : ['Contenido próximamente...']

      const category = (data.category || 'analisis-de-albumes') as CategorySlug
      
      // Asigna la sección automáticamente según la subcategoría si no viene definida en el archivo markdown
      const section = data.section || CATEGORY_TO_SECTION[category] || 'cine'

      // Guardar fecha ISO limpia para ordenación precisa
      const isoDate = data.date ? new Date(data.date).toISOString() : new Date().toISOString()

      return {
        slug,
        title: data.title,
        excerpt: data.excerpt || '',
        section,
        category,
        categoryLabel: data.categoryLabel || CATEGORY_LABELS[category] || 'Artículo',
        author: data.author || 'Redacción',
        rawDate: isoDate,
        date: data.date
          ? new Date(data.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()
          : '21 SEPT 2026',
        timeAgo: data.timeAgo || 'Reciente',
        readingTime: data.readingTime || '5 min de lectura',
        image: rawImage,
        featured: Boolean(data.featured),
        spotify: rawSpotify || undefined,
        youtube: rawYoutube || undefined,
        gallery: formattedGallery,
        body: rawBody,
      } as Article
    })
    .filter((article): article is Article => article !== null)

  // ORDEN CRÍTICO: Ordena estrictamente del más reciente al más antiguo según su fecha real
  return allArticlesData.sort((a, b) => new Date(b.rawDate).getTime() - new Date(a.rawDate).getTime())
}

export const articles = getAllArticles()

export function getArticle(slug: string): Article | undefined {
  return articles.find((article) => article.slug === slug)
}

export function getRecent(currentSlug: string): Article[] {
  // Excluimos la entrada marcada en el Hero y devolvemos exactamente las 3 últimas
  return articles.filter((article) => article.slug !== currentSlug).slice(0, 3)
}

export function getFeatured(): Article | undefined {
  return articles.find((article) => article.featured) || articles[0]
}

export function getBySection(section: string): Article[] {
  return articles.filter((article) => article.section.toLowerCase() === section.toLowerCase())
}

export function getByCategory(category: string): Article[] {
  return articles.filter((article) => article.category.toLowerCase() === category.toLowerCase())
}
