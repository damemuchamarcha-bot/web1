import { NextResponse } from 'next/server'

// Forzar a Next.js a tratar esta ruta como estática durante el build
export const dynamic = 'force-static'

export async function GET() {
  try {
    const articles = [
      { title: 'Última reseña publicada', category: 'MÚSICA', slug: 'resena-1' },
      { title: 'Estreno de cine semanal', category: 'CINE', slug: 'cine-1' }
    ]

    return NextResponse.json(articles)
  } catch (error) {
    return NextResponse.json([], { status: 500 })
  }
}
