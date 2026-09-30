import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  // Cambia 'https://damemarcha.com' por tu dominio definitivo cuando lo tengas
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://damemarcha.com'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/'], // Bloquea el panel de Decap CMS para los buscadores
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
