'use client'

import { useState, useEffect, useRef } from 'react'

interface Article {
  title: string
  category: string
  slug?: string
}

export default function StoryGenerator() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)

  // Lista de artículos cargados
  const [articles, setArticles] = useState<Article[]>([])
  const [selectedArticleSlug, setSelectedArticleSlug] = useState<string>('custom')

  // Estado de la Story
  const [title, setTitle] = useState('TÍTULO DE MUESTRA PARA EL ARTÍCULO')
  const [category, setCategory] = useState<'MÚSICA' | 'CINE'>('MÚSICA')
  const [mediaSrc, setMediaSrc] = useState<string | null>(null)
  const [isVideo, setIsVideo] = useState(false)

  // Estados de exportación
  const [isExporting, setIsExporting] = useState(false)
  const [recordingProgress, setRecordingProgress] = useState(0)

  // Referencias a elementos del DOM
  const storyRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Intentar cargar artículos desde los feeds o rutas de la web al entrar
  useEffect(() => {
    async function loadArticles() {
      try {
        const res = await fetch('/api/articles')
        if (res.ok) {
          const data = await res.json()
          if (Array.isArray(data)) setArticles(data)
        }
      } catch (err) {
        console.log('No se pudieron cargar artículos automáticamente:', err)
      }
    }
    loadArticles()
  }, [])

  const handleSelectArticle = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value
    setSelectedArticleSlug(val)

    if (val === 'custom') return

    const found = articles.find((a) => a.slug === val || a.title === val)
    if (found) {
      setTitle(found.title)
      const catUpper = (found.category || '').toUpperCase()
      if (catUpper.includes('CINE')) {
        setCategory('CINE')
      } else {
        setCategory('MÚSICA')
      }
    }
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    const secretKey = process.env.NEXT_PUBLIC_ADMIN_SECRET || 'damemarcha2026'

    if (password === secretKey) {
      setIsAuthenticated(true)
      setError(false)
    } else {
      setError(true)
    }
  }

  // Carga de archivo usando FileReader en formato Base64 nativo
  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const isVid = file.type.startsWith('video/')
      setIsVideo(isVid)

      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setMediaSrc(event.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  // --- FUNCIÓN 1: DESCARGAR FOTO (JPG) USANDO CANVAS NATIVO ---
  const downloadAsImage = async () => {
    setIsExporting(true)

    try {
      const canvas = document.createElement('canvas')
      canvas.width = 1080
      canvas.height = 1920
      const ctx = canvas.getContext('2d')

      if (!ctx) throw new Error('No se pudo inicializar el canvas')

      // 1. Fondo negro por defecto
      ctx.fillStyle = '#000000'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // 2. Dibujar la imagen seleccionada con Object-Fit Cover
      if (mediaSrc) {
        const img = new Image()
        img.crossOrigin = 'anonymous'
        await new Promise((resolve, reject) => {
          img.onload = resolve
          img.onerror = reject
          img.src = mediaSrc
        })

        const imgRatio = img.width / img.height
        const canvasRatio = canvas.width / canvas.height
        let renderWidth = canvas.width
        let renderHeight = canvas.height
        let offsetX = 0
        let offsetY = 0

        if (imgRatio > canvasRatio) {
          renderWidth = canvas.height * imgRatio
          offsetX = (canvas.width - renderWidth) / 2
        } else {
          renderHeight = canvas.width / imgRatio
          offsetY = (canvas.height - renderHeight) / 2
        }

        ctx.drawImage(img, offsetX, offsetY, renderWidth, renderHeight)
      }

      // 3. Gradiente superpuesto (oscurecer fondo)
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      gradient.addColorStop(0, 'rgba(0, 0, 0, 0.6)')
      gradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.2)')
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0.9)')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // 4. Cabecera (Top Bar)
      // Caja "DAME MARCHA"
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)'
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'
      ctx.lineWidth = 2
      ctx.fillRect(60, 80, 220, 50)
      ctx.strokeRect(60, 80, 220, 50)

      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 20px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('DAME MARCHA', 170, 112)

      // Caja Categoría ("MÚSICA" / "CINE")
      ctx.fillStyle = '#ff007f' // punk-pink
      ctx.fillRect(860, 80, 160, 50)

      ctx.fillStyle = '#000000'
      ctx.font = 'bold 20px sans-serif'
      ctx.fillText(category, 940, 112)

      // 5. Bloque Inferior (Titular y Call to Action)
      // Etiqueta "NUEVO ARTÍCULO"
      ctx.fillStyle = '#ffee00' // punk-yellow
      ctx.fillRect(60, 1380, 200, 35)

      ctx.fillStyle = '#000000'
      ctx.font = 'bold 16px sans-serif'
      ctx.textAlign = 'left'
      ctx.fillText('NUEVO ARTÍCULO', 75, 1403)

      // Cuadro principal con el titular del artículo
      const boxX = 60
      const boxY = 1430
      const boxW = 960
      const boxH = 260

      ctx.fillStyle = 'rgba(0, 0, 0, 0.9)'
      ctx.fillRect(boxX, boxY, boxW, boxH)

      // Borde rosa a la izquierda
      ctx.fillStyle = '#ff007f'
      ctx.fillRect(boxX, boxY, 16, boxH)

      // Texto del Titular (multilínea automático)
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 42px sans-serif'
      ctx.textAlign = 'left'

      const words = title.toUpperCase().split(' ')
      let line = ''
      let lineY = boxY + 70
      const maxLineWidth = boxW - 60

      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' '
        const metrics = ctx.measureText(testLine)
        if (metrics.width > maxLineWidth && n > 0) {
          ctx.fillText(line, boxX + 40, lineY)
          line = words[n] + ' '
          lineY += 55
          if (lineY > boxY + boxH - 30) break
        } else {
          line = testLine
        }
      }
      if (lineY <= boxY + boxH - 20) {
        ctx.fillText(line, boxX + 40, lineY)
      }

      // Banner inferior "LEE MÁS EN LA WEB ->"
      ctx.fillStyle = '#ff007f'
      ctx.fillRect(boxX, 1710, boxW, 60)

      ctx.fillStyle = '#000000'
      ctx.font = 'bold 22px sans-serif'
      ctx.fillText('LEE MÁS EN LA WEB', boxX + 30, 1747)
      ctx.textAlign = 'right'
      ctx.fillText('→', boxX + boxW - 30, 1747)

      // 6. Descargar la imagen
      const dataUrl = canvas.toDataURL('image/jpeg', 0.95)
      const link = document.createElement('a')
      link.download = `story-${category.toLowerCase()}-${Date.now()}.jpg`
      link.href = dataUrl
      link.click()
    } catch (err) {
      console.error('Error exportando imagen:', err)
      alert('Hubo un error al generar la imagen.')
    } finally {
      setIsExporting(false)
    }
  }

  // --- FUNCIÓN 2: GRABAR Y DESCARGAR VÍDEO (MP4 / WebM) ---
  const downloadAsVideo = async () => {
    if (!storyRef.current || !videoRef.current) return

    setIsExporting(true)
    setRecordingProgress(0)

    try {
      const html2canvas = (await import('html2canvas')).default
      const container = storyRef.current
      const videoElement = videoRef.current

      videoElement.currentTime = 0
      await videoElement.play()

      const canvas = document.createElement('canvas')
      canvas.width = 1080
      canvas.height = 1920
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const stream = canvas.captureStream(30)
      const mimeType = MediaRecorder.isTypeSupported('video/mp4')
        ? 'video/mp4'
        : 'video/webm'

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType,
        videoBitsPerSecond: 8000000,
      })

      const chunks: Blob[] = []
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data)
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: mimeType })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `story-${category.toLowerCase()}-${Date.now()}.${
          mimeType.includes('mp4') ? 'mp4' : 'webm'
        }`
        a.click()
        setIsExporting(false)
        setRecordingProgress(0)
      }

      mediaRecorder.start()

      const DURATION = 5
      const fps = 30
      const totalFrames = DURATION * fps
      let currentFrame = 0

      const interval = setInterval(async () => {
        currentFrame++
        setRecordingProgress(Math.round((currentFrame / totalFrames) * 100))

        const frameCanvas = await html2canvas(container, {
          scale: 2,
          useCORS: true,
          logging: false,
        })
        ctx.drawImage(frameCanvas, 0, 0, canvas.width, canvas.height)

        if (currentFrame >= totalFrames) {
          clearInterval(interval)
          mediaRecorder.stop()
        }
      }, 1000 / fps)
    } catch (err) {
      console.error('Error durante la grabación del vídeo:', err)
      alert('Hubo un problema al grabar el vídeo.')
      setIsExporting(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-punk-black p-4 text-punk-cream">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-md border border-punk-pink/40 bg-black/80 p-8 shadow-2xl backdrop-blur"
        >
          <div className="mb-6 text-center">
            <span className="bg-punk-pink px-3 py-1 font-display text-xs uppercase tracking-widest text-punk-black">
              DAME MARCHA
            </span>
            <h1 className="mt-4 font-display text-2xl uppercase text-punk-pink">
              Acceso Restringido
            </h1>
            <p className="mt-1 text-xs text-punk-cream/60">
              Introduce la clave para acceder al generador de Stories.
            </p>
          </div>

          <div className="mb-4">
            <input
              type="password"
              placeholder="Contraseña de administrador"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-punk-cream/20 bg-punk-black p-3 font-mono text-sm text-punk-cream focus:border-punk-pink focus:outline-none"
            />
            {error && (
              <p className="mt-2 text-xs text-red-500">
                Contraseña incorrecta. Inténtalo de nuevo.
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-punk-pink p-3 font-display uppercase tracking-wider text-punk-black transition-colors hover:bg-punk-yellow"
          >
            Entrar
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-punk-black p-4 text-punk-cream sm:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between border-b border-punk-pink/30 pb-4">
          <div>
            <h1 className="font-display text-3xl uppercase tracking-wider text-punk-pink">
              Generador de Stories
            </h1>
            <p className="text-sm text-punk-cream/70">
              Adapta tus entradas con fotos o vídeos para Instagram.
            </p>
          </div>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="bg-punk-pink/10 px-4 py-2 font-display text-sm uppercase text-punk-pink hover:bg-punk-pink hover:text-punk-black"
          >
            Cerrar Sesión
          </button>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Panel de Control */}
          <div className="space-y-6 lg:col-span-5">
            <div className="border border-punk-cream/10 bg-black/40 p-6 backdrop-blur">
              <h2 className="mb-4 font-display text-xl uppercase text-punk-yellow">
                1. Contenido del artículo
              </h2>

              <div className="mb-4">
                <label className="mb-1 block font-sans text-xs uppercase tracking-wider text-punk-cream/80">
                  Cargar desde la web
                </label>
                <select
                  value={selectedArticleSlug}
                  onChange={handleSelectArticle}
                  className="w-full border border-punk-pink/40 bg-punk-black p-3 font-sans text-sm text-punk-cream focus:border-punk-pink focus:outline-none"
                >
                  <option value="custom">✏ Titular Personalizado (Escribir a mano)</option>
                  {articles.length > 0 ? (
                    articles.map((art, idx) => (
                      <option key={art.slug || idx} value={art.slug || art.title}>
                        📄 {art.title}
                      </option>
                    ))
                  ) : (
                    <option disabled value="">(Sin entradas detectadas automáticas)</option>
                  )}
                </select>
              </div>

              <div className="mb-4">
                <label className="mb-1 block font-sans text-xs uppercase tracking-wider text-punk-cream/80">
                  Categoría
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as 'MÚSICA' | 'CINE')}
                  className="w-full border border-punk-cream/20 bg-punk-black p-3 font-display uppercase text-punk-cream focus:border-punk-pink focus:outline-none"
                >
                  <option value="MÚSICA">MÚSICA</option>
                  <option value="CINE">CINE</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="mb-1 block font-sans text-xs uppercase tracking-wider text-punk-cream/80">
                  Titular del artículo
                </label>
                <textarea
                  rows={3}
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value)
                    setSelectedArticleSlug('custom')
                  }}
                  className="w-full border border-punk-cream/20 bg-punk-black p-3 font-display uppercase tracking-wide text-punk-cream focus:border-punk-pink focus:outline-none"
                  placeholder="Escribe aquí el titular..."
                />
              </div>

              <div className="mb-4">
                <label className="mb-1 block font-sans text-xs uppercase tracking-wider text-punk-cream/80">
                  Foto o Vídeo Vertical (Fondo)
                </label>
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleMediaUpload}
                  className="w-full cursor-pointer border border-punk-cream/20 bg-punk-black p-2 font-sans text-sm text-punk-cream/60 file:mr-4 file:border-0 file:bg-punk-pink file:px-4 file:py-2 file:font-display file:text-xs file:uppercase file:text-punk-black"
                />
              </div>

              {/* BOTÓN DE DESCARGA DINÁMICO */}
              <div className="mt-6 border-t border-punk-cream/10 pt-4">
                {isVideo ? (
                  <button
                    onClick={downloadAsVideo}
                    disabled={isExporting}
                    className="w-full bg-punk-yellow py-3 font-display text-sm uppercase tracking-wider text-punk-black transition-all hover:bg-punk-pink disabled:opacity-50"
                  >
                    {isExporting
                      ? `🎬 Grabando Vídeo... (${recordingProgress}%)`
                      : '🎥 Descargar Story en VÍDEO (MP4)'}
                  </button>
                ) : (
                  <button
                    onClick={downloadAsImage}
                    disabled={isExporting}
                    className="w-full bg-punk-pink py-3 font-display text-sm uppercase tracking-wider text-punk-black transition-all hover:bg-punk-yellow disabled:opacity-50"
                  >
                    {isExporting ? 'Generando Imagen...' : '🖼️ Descargar Story en FOTO (JPG)'}
                  </button>
                )}
              </div>
            </div>

            <div className="border border-punk-cream/10 bg-black/40 p-6 backdrop-blur">
              <h2 className="mb-2 font-display text-xl uppercase text-punk-yellow">
                2. Instrucciones
              </h2>
              <p className="text-xs leading-relaxed text-punk-cream/70">
                • Selecciona un artículo o introduce el texto manualmente.<br />
                • Categorías disponibles: <strong>MÚSICA</strong> y <strong>CINE</strong>.<br />
                • Elige foto o vídeo vertical y presiona el botón de descarga.
              </p>
            </div>
          </div>

          {/* Canvas de previsualización 9:16 */}
          <div className="flex justify-center lg:col-span-7">
            <div
              ref={storyRef}
              id="story-canvas"
              className="relative aspect-[9/16] w-full max-w-[380px] overflow-hidden border-4 border-punk-pink bg-black shadow-2xl"
            >
              {mediaSrc ? (
                isVideo ? (
                  <video
                    ref={videoRef}
                    src={mediaSrc}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <img
                    src={mediaSrc}
                    alt="Fondo Story"
                    className="h-full w-full object-cover"
                  />
                )
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-zinc-900 p-6 text-center">
                  <span className="font-display text-xs uppercase tracking-widest text-punk-cream/40">
                    Sube una foto o vídeo para previsualizar
                  </span>
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/60" />

              <div className="absolute left-6 right-6 top-12 flex items-center justify-between">
                <span className="border border-punk-cream/20 bg-punk-black/80 px-3 py-1 font-display text-xs uppercase tracking-widest text-punk-cream">
                  DAME MARCHA
                </span>
                <span className="bg-punk-pink px-3 py-1 font-display text-xs uppercase tracking-wider text-punk-black">
                  {category}
                </span>
              </div>

              <div className="absolute bottom-20 left-6 right-6 space-y-3">
                <div className="inline-block bg-punk-yellow px-2 py-0.5 font-display text-[10px] uppercase text-punk-black">
                  NUEVO ARTÍCULO
                </div>
                <h3 className="border-l-4 border-punk-pink bg-punk-black/90 p-4 font-display text-2xl uppercase leading-none tracking-tight text-punk-cream">
                  {title}
                </h3>
                <div className="flex items-center justify-between bg-punk-pink p-2 text-punk-black">
                  <span className="font-display text-xs uppercase tracking-wide">
                    LEE MÁS EN LA WEB
                  </span>
                  <span className="font-display text-xs">→</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
