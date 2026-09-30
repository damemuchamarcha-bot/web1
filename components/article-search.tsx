'use client'

import { useState, useMemo } from 'react'
import { Search, X } from 'lucide-react'
import { ArticleCard } from '@/components/article-card'

type Article = {
  slug: string
  title: string
  excerpt: string
  image: string
  section: string
  categoryLabel: string
  author: string
  date: string
  readingTime: string
}

export function ArticleSearch({ articles }: { articles: Article[] }) {
  const [query, setQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  // Extraer categorías únicas
  const categories = useMemo(() => {
    const set = new Set<string>()
    articles.forEach((a) => {
      if (a.categoryLabel) set.add(a.categoryLabel)
    })
    return Array.from(set)
  }, [articles])

  // Filtrado reactivo
  const filteredArticles = useMemo(() => {
    return articles.filter((a) => {
      const matchesQuery =
        !query ||
        a.title.toLowerCase().includes(query.toLowerCase()) ||
        a.excerpt.toLowerCase().includes(query.toLowerCase())
      const matchesCategory =
        !selectedCategory || a.categoryLabel === selectedCategory

      return matchesQuery && matchesCategory
    })
  }, [articles, query, selectedCategory])

  return (
    <div className="w-full">
      {/* Barra de Búsqueda y Filtros */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b-2 border-white/10 pb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-punk-cream/50" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por título o tema..."
            className="w-full border-2 border-white/20 bg-punk-black py-2 pl-9 pr-8 font-sans text-sm text-punk-cream placeholder:text-punk-cream/40 focus:border-punk-pink focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-punk-cream/60 hover:text-white"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        {/* Filtros de Categoría */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`border px-3 py-1 font-display text-xs uppercase tracking-wider transition-colors ${
              selectedCategory === null
                ? 'border-punk-pink bg-punk-pink text-black'
                : 'border-white/20 bg-punk-black text-punk-cream hover:border-punk-pink'
            }`}
          >
            Todos
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() =>
                setSelectedCategory(selectedCategory === cat ? null : cat)
              }
              className={`border px-3 py-1 font-display text-xs uppercase tracking-wider transition-colors ${
                selectedCategory === cat
                  ? 'border-punk-yellow bg-punk-yellow text-black'
                  : 'border-white/20 bg-punk-black text-punk-cream hover:border-punk-yellow'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Resultados */}
      {filteredArticles.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredArticles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      ) : (
        <div className="my-12 text-center py-12 border-2 border-dashed border-white/10">
          <p className="font-display text-lg uppercase text-punk-cream/60">
            No encontramos ningún artículo que coincida con tu búsqueda
          </p>
          <button
            onClick={() => {
              setQuery('')
              setSelectedCategory(null)
            }}
            className="mt-4 text-xs font-display uppercase text-punk-pink underline hover:text-punk-yellow"
          >
            Limpiar filtros
          </button>
        </div>
      )}
    </div>
  )
}
