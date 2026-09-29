import { articles } from '@/lib/articles'

export async function GET() {
  const baseUrl = 'https://web1-eight-swart.vercel.app/' // Cambia esto por tu dominio final si lo tienes

  const feedItemsXml = articles
    .map((article) => {
      const articleUrl = `${baseUrl}/articulo/${article.slug}`
      return `
    <item>
      <title><![CDATA[${article.title}]]></title>
      <link>${articleUrl}</link>
      <guid isPermaLink="true">${articleUrl}</guid>
      <pubDate>${new Date(article.date).toUTCString()}</pubDate>
      <description><![CDATA[${article.excerpt}]]></description>
      <content:encoded><![CDATA[${article.excerpt}]]></content:encoded>
    </item>`
    })
    .join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Dame Marcha</title>
    <link>${baseUrl}</link>
    <description>Revista cultural sin filtros. Cine y música contadas con criterio y buena tipografía.</description>
    <language>es</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    ${feedItemsXml}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  })
}
