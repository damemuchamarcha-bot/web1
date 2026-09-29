import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Lista de conexión directa con tus entradas
    const articles = [
      { title: 'Última reseña publicada', category: 'MÚSICA', slug: 'resena-1' },
      { title: 'Estreno de cine semanal', category: 'CINE', slug: 'cine-1' }
    ]

    return NextResponse.json(articles)
  } catch (error) {
    return NextResponse.json([], { status: 500 })
  }
}
