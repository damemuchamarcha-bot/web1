'use client'

import { useState, useRef, useEffect } from 'react'
import { ArrowLeft, Video, Play, Image as ImageIcon } from 'lucide-react'
import Link from 'next/link'

export default function GeneradorCabeceraPage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [images, setImages] = useState<HTMLImageElement[]>([])
  const [winnerIndex, setWinnerIndex] = useState<number>(1)
  const [albumTitle, setAlbumTitle] = useState<string>('AMARRE — SAMURAÏ')
  const [sectionTitle, setSectionTitle] = useState<string>('ANÁLISIS DE ÁLBUMES')
  const [isRecording, setIsRecording] = useState<boolean>(false)

  // Manejar la carga de archivos de imagen locales
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const files = Array.from(e.target.files)
    const loaded: HTMLImageElement[] = []

    files.forEach((file) => {
      const img = new Image()
      img.src = URL.createObjectURL(file)
      img.onload = () => {
        loaded.push(img)
        if (loaded.length === files.length) {
          setImages(loaded)
        }
      }
    })
  }

  const drawBackground = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Fondo Rosa Neón (#FF2E93)
    ctx.fillStyle = '#FF2E93'
    ctx.fillRect(0, 0, width, height)

    // Gradiente radial para profundidad
    const gradient = ctx.createRadialGradient(540, 960, 200, 540, 960, 1000)
    gradient.addColorStop(0, 'rgba(0,0,0,0)')
    gradient.addColorStop(1, 'rgba(0,0,0,0.45)')
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height)
  }

  const renderFrame = (
    ctx: CanvasRenderingContext2D,
    offsetY: number,
    showColor: boolean,
    winnerImg: HTMLImageElement | null,
    textProgress: number
  ) => {
    const width = 1080
    const height = 1920
    drawBackground(ctx, width, height)

    const itemSize = 520
    const gap = 80
    const centerY = 800

    if (images.length > 0) {
      images.forEach((img, i) => {
        const y = centerY + i * (itemSize + gap) - offsetY

        if (y > -itemSize && y < height + itemSize) {
          ctx.save()
          ctx.translate(540, y)

          const isWinner = img === winnerImg && showColor

          if (isWinner) {
            ctx.shadowColor = '#FFE600'
            ctx.shadowBlur = 70
          } else {
            ctx.filter = 'grayscale(100%) brightness(0.5)'
          }

          ctx.drawImage(img, -itemSize / 2, -itemSize / 2, itemSize, itemSize)
          ctx.restore()
        }
      })
    }

    if (textProgress > 0) {
      ctx.save()
      ctx.globalAlpha = textProgress

      // Subtítulo / Categoría
      ctx.fillStyle = '#FFE600'
      ctx.font = '900 46px system-ui, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(sectionTitle.toUpperCase(), 540, 1460)

      // Nombre Álbum / Artista
      ctx.fillStyle = '#FFFFFF'
      ctx.font = '900 70px system-ui, sans-serif'
      ctx.fillText(albumTitle.toUpperCase(), 540, 1560)

      ctx.restore()
    }
  }

  const runAnimation = (onComplete?: () => void) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    if (images.length === 0) {
      alert('Sube al menos 3 portadas para la ruleta.')
      return
    }

    const winnerIdx = Math.max(0, winnerIndex - 1) % images.length
    const winnerImg = images[winnerIdx]

    const itemSize = 520
    const gap = 80
    const totalDistance = (images.length * 3 + winnerIdx) * (itemSize + gap)

    let startTime: number | null = null
    const duration = 2400

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime
      const progress = Math.min(elapsed / duration, 1)

      const easeOut = 1 - Math.pow(1 - progress, 3)
      const currentOffsetY = totalDistance * easeOut

      const isFinished = progress >= 1
      const textProgress = isFinished ? Math.min((elapsed - duration) / 400, 1) : 0

      renderFrame(ctx, currentOffsetY, isFinished, winnerImg, textProgress)

      if (elapsed < duration + 1000) {
        requestAnimationFrame(step)
      } else if (onComplete) {
        onComplete()
      }
    }

    requestAnimationFrame(step)
  }

  const handleRecordVideo = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    setIsRecording(true)
    const stream = canvas.captureStream(60)
    const recorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9' })
    const chunks: Blob[] = []

    recorder.ondataavailable = (e) => chunks.push(e.data)
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/mp4' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url;
      a.download = `reel-cabecera-${Date.now()}.mp4`
      a.click()
      setIsRecording(false)
    }

    recorder.start()
    runAnimation(() => {
      setTimeout(() => recorder.stop(), 400)
    })
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')
      if (ctx) drawBackground(ctx, 1080, 1920)
    }
  }, [])

  return (
    <div className="min-h-screen bg-punk-black text-white p-6">
      <div className="max-w-6xl mx-auto grid gap-8 lg:grid-cols-12">
        {/* Controles */}
        <div className="lg:col-span-5 space-y-6 bg-zinc-900/80 p-6 rounded-xl border border-white/10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-punk-yellow hover:text-punk-pink font-mono uppercase"
          >
            <ArrowLeft className="size-4" /> Volver a la Web
          </Link>

          <h1 className="font-display text-2xl uppercase text-punk-pink">
            Generador de Cabeceras Reels
          </h1>

          <div className="space-y-4 text-sm font-mono">
            <div>
              <label className="block mb-2 text-zinc-400">1. Portadas de la Ruleta:</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full bg-zinc-800 border border-zinc-700 p-2 rounded text-xs"
              />
              <span className="text-xs text-zinc-500 mt-1 block">
                {images.length} portadas cargadas
              </span>
            </div>

            <div>
              <label className="block mb-2 text-zinc-400">2. Disco Ganador (Número):</label>
              <input
                type="number"
                min={1}
                max={Math.max(1, images.length)}
                value={winnerIndex}
                onChange={(e) => setWinnerIndex(Number(e.target.value))}
                className="w-full bg-zinc-800 border border-zinc-700 p-2.5 rounded text-white"
              />
            </div>

            <div>
              <label className="block mb-2 text-zinc-400">3. Nombre del Álbum / Artista:</label>
              <input
                type="text"
                value={albumTitle}
                onChange={(e) => setAlbumTitle(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 p-2.5 rounded text-white"
              />
            </div>

            <div>
              <label className="block mb-2 text-zinc-400">4. Sección / Categoría:</label>
              <input
                type="text"
                value={sectionTitle}
                onChange={(e) => setSectionTitle(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 p-2.5 rounded text-white"
              />
            </div>

            <div className="pt-4 flex flex-col gap-3">
              <button
                onClick={() => runAnimation()}
                disabled={isRecording}
                className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 font-bold uppercase rounded flex items-center justify-center gap-2 border border-white/10"
              >
                <Play className="size-4 text-punk-yellow" /> Probar Animación
              </button>

              <button
                onClick={handleRecordVideo}
                disabled={isRecording}
                className="w-full py-3.5 bg-punk-pink hover:bg-pink-600 font-bold uppercase rounded text-white flex items-center justify-center gap-2 shadow-lg"
              >
                <Video className="size-4" />
                {isRecording ? 'Generando Vídeo...' : 'Grabar y Descargar (.mp4)'}
              </button>
            </div>
          </div>
        </div>

        {/* Previsualización del lienzo 9:16 */}
        <div className="lg:col-span-7 flex items-center justify-center bg-zinc-950 p-6 rounded-xl border border-white/10">
          <canvas
            ref={canvasRef}
            width={1080}
            height={1920}
            className="h-[75vh] aspect-[9/16] rounded-lg shadow-2xl border border-white/10 object-contain"
          />
        </div>
      </div>
    </div>
  )
}
