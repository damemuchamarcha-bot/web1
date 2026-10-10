'use client'

import { useState, useRef, useEffect } from 'react'
import { ArrowLeft, Video, Play, Lock, ShieldCheck, Sparkles } from 'lucide-react'
import Link from 'next/link'

// Cambia tu contraseña privada aquí
const SECRET_PIN = 'dame-marcha-punk-2026'

export default function GeneradorCabeceraPrivado() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [inputPin, setInputPin] = useState<string>('')
  const [errorPin, setErrorPin] = useState<boolean>(false)

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [images, setImages] = useState<HTMLImageElement[]>([])
  const [winnerIndex, setWinnerIndex] = useState<number>(1)
  const [albumTitle, setAlbumTitle] = useState<string>('SAMURAÏ — AMARRE')
  const [isRecording, setIsRecording] = useState<boolean>(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputPin === SECRET_PIN) {
      setIsAuthenticated(true)
      setErrorPin(false)
    } else {
      setErrorPin(true)
    }
  }

  // Manejar la carga sin límite de portadas
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

  // Fondo Neo-Punk con viñeteado y textura profunda
  const drawBackground = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.fillStyle = '#FF2E93'
    ctx.fillRect(0, 0, width, height)

    // Gradiente radial para enfocar el centro
    const gradient = ctx.createRadialGradient(540, 850, 150, 540, 850, 1100)
    gradient.addColorStop(0, 'rgba(0,0,0,0.15)')
    gradient.addColorStop(1, 'rgba(0,0,0,0.65)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)
  }

  // Curva de aceleración, frenado elástico y rebote físico
  const customEaasing = (t: number): number => {
    // 0 -> 0.2: Aceleración
    if (t < 0.2) {
      const subT = t / 0.2
      return 0.5 * Math.pow(subT, 2) * 0.15
    }
    // 0.2 -> 0.85: Giro fluido y desaceleración
    if (t < 0.85) {
      const subT = (t - 0.2) / 0.65
      return 0.015 + 0.95 * (1 - Math.pow(1 - subT, 3))
    }
    // 0.85 -> 1.0: Frenado final con micro-rebote elástico
    const subT = (t - 0.85) / 0.15
    const elastic = Math.sin(subT * Math.PI * 1.5) * Math.exp(-subT * 4) * 0.02
    return 0.965 + subT * 0.035 + elastic
  }

  const renderFrame = (
    ctx: CanvasRenderingContext2D,
    offsetY: number,
    showColor: boolean,
    winnerImg: HTMLImageElement | null,
    textProgress: number,
    speedFactor: number
  ) => {
    const width = 1080
    const height = 1920
    drawBackground(ctx, width, height)

    const itemSize = 580
    const gap = 100
    const centerY = 850

    if (images.length > 0) {
      // Repetir la lista en bucle continuo para fluidez infinita
      const totalLoopImages: HTMLImageElement[] = []
      for (let r = 0; r < 5; r++) {
        totalLoopImages.push(...images)
      }

      totalLoopImages.forEach((img, i) => {
        const y = centerY + i * (itemSize + gap) - offsetY

        if (y > -itemSize && y < height + itemSize) {
          ctx.save()
          ctx.translate(540, y)

          const isWinner = img === winnerImg && showColor

          if (isWinner) {
            // Efecto Destello y Doble Resplandor Neón
            ctx.shadowColor = '#FFE600'
            ctx.shadowBlur = 90
            ctx.shadowOffsetX = 0
            ctx.shadowOffsetY = 0

            // Marco amarillo neón envolvente
            ctx.strokeStyle = '#FFE600'
            ctx.lineWidth = 12
            ctx.strokeRect(-itemSize / 2 - 6, -itemSize / 2 - 6, itemSize + 12, itemSize + 12)
          } else {
            // Blanco y negro con contraste para portadas inactivas
            ctx.filter = 'grayscale(100%) contrast(120%) brightness(0.45)'
          }

          // Simulador de desenfoque de movimiento (Motion Blur) al girar rápido
          if (speedFactor > 0.015 && !isWinner) {
            ctx.globalAlpha = 0.8
            const blurOffset = Math.min(speedFactor * 120, 25)
            ctx.drawImage(img, -itemSize / 2, -itemSize / 2 - blurOffset, itemSize, itemSize)
            ctx.globalAlpha = 1.0
          }

          ctx.drawImage(img, -itemSize / 2, -itemSize / 2, itemSize, itemSize)
          ctx.restore()
        }
      })
    }

    // Dibujar el título del disco / artista al finalizar la ruleta
    if (textProgress > 0) {
      ctx.save()
      ctx.globalAlpha = textProgress

      // Animación de aparición con escala
      const scale = 0.85 + textProgress * 0.15
      ctx.translate(540, 1580)
      ctx.scale(scale, scale)

      // Caja tipográfica de fondo
      ctx.fillStyle = '#0A0A0A'
      ctx.shadowColor = '#FF2E93'
      ctx.shadowBlur = 30
      ctx.fillRect(-450, -75, 900, 130)

      // Borde Rosa Neón
      ctx.strokeStyle = '#FF2E93'
      ctx.lineWidth = 4
      ctx.strokeRect(-450, -75, 900, 130)

      // Texto Principal
      ctx.fillStyle = '#FFFFFF'
      ctx.font = '900 64px system-ui, sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(albumTitle.toUpperCase(), 0, -5)

      ctx.restore()
    }
  }

  const runAnimation = (onComplete?: () => void) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    if (images.length === 0) {
      alert('Sube al menos 3 o más portadas para generar la ruleta.')
      return
    }

    const winnerIdx = Math.max(0, winnerIndex - 1) % images.length
    const winnerImg = images[winnerIdx]

    const itemSize = 580
    const gap = 100
    const stride = itemSize + gap

    // Calcular parada fija en la tercera ronda para aterrizaje exacto
    const targetGlobalIndex = images.length * 3 + winnerIdx
    const totalDistance = targetGlobalIndex * stride

    let startTime: number | null = null
    const duration = 4500 // Duración extendida de 4.5 segundos
    let prevOffsetY = 0

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime
      const progress = Math.min(elapsed / duration, 1)

      const easeProgress = customEaasing(progress)
      const currentOffsetY = totalDistance * easeProgress
      const speedFactor = Math.abs(currentOffsetY - prevOffsetY)
      prevOffsetY = currentOffsetY

      const isFinished = progress >= 0.98
      const textProgress = progress >= 0.95 ? Math.min((elapsed - duration * 0.95) / 450, 1) : 0

      renderFrame(ctx, currentOffsetY, isFinished, winnerImg, textProgress, speedFactor)

      if (elapsed < duration + 800) {
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
      a.href = url
      a.download = `reel-cabecera-${Date.now()}.mp4`
      a.click()
      setIsRecording(false)
    }

    recorder.start()
    runAnimation(() => {
      setTimeout(() => recorder.stop(), 500)
    })
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas && isAuthenticated) {
      const ctx = canvas.getContext('2d')
      if (ctx) drawBackground(ctx, 1080, 1920)
    }
  }, [isAuthenticated])

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-punk-black text-white flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-zinc-900 border border-white/10 p-8 rounded-xl max-w-md w-full space-y-6 shadow-2xl">
          <div className="flex items-center gap-3 text-punk-pink">
            <Lock className="size-6" />
            <h1 className="font-display text-xl uppercase tracking-wider">Acceso Restringido</h1>
          </div>
          <p className="text-sm text-zinc-400 font-mono">
            Introduce la clave secreta para abrir el generador privado.
          </p>
          <div>
            <input
              type="password"
              placeholder="Contraseña..."
              value={inputPin}
              onChange={(e) => setInputPin(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 p-3 rounded text-white font-mono text-sm focus:border-punk-pink outline-none"
              autoFocus
            />
            {errorPin && (
              <p className="text-red-500 text-xs font-mono mt-2">Clave incorrecta. Acceso denegado.</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-punk-pink hover:bg-pink-600 font-bold uppercase rounded text-white font-mono tracking-wide transition-colors"
          >
            Desbloquear Herramienta
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-punk-black text-white p-6">
      <div className="max-w-6xl mx-auto grid gap-8 lg:grid-cols-12">
        {/* Panel Simplificado de Control */}
        <div className="lg:col-span-5 space-y-6 bg-zinc-900/80 p-6 rounded-xl border border-white/10">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-punk-yellow hover:text-punk-pink font-mono uppercase"
            >
              <ArrowLeft className="size-4" /> Salir
            </Link>
            <span className="flex items-center gap-1 text-xs text-emerald-400 font-mono bg-emerald-950/50 px-2.5 py-1 rounded border border-emerald-800">
              <ShieldCheck className="size-3.5" /> Seguro
            </span>
          </div>

          <h1 className="font-display text-2xl uppercase text-punk-pink flex items-center gap-2">
            <Sparkles className="size-6 text-punk-yellow" /> Generador de Reels
          </h1>

          <div className="space-y-5 text-sm font-mono">
            <div>
              <label className="block mb-2 text-zinc-300">1. Subir Portadas (Sin Límite):</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full bg-zinc-800 border border-zinc-700 p-2.5 rounded text-xs text-zinc-300 file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:bg-punk-pink file:text-white font-mono cursor-pointer"
              />
              <span className="text-xs text-punk-yellow mt-2 block font-semibold">
                ✓ {images.length} portadas listas en la ruleta
              </span>
            </div>

            <div>
              <label className="block mb-2 text-zinc-300">2. Portada Ganadora (Nº de Orden):</label>
              <input
                type="number"
                min={1}
                max={Math.max(1, images.length)}
                value={winnerIndex}
                onChange={(e) => setWinnerIndex(Number(e.target.value))}
                className="w-full bg-zinc-800 border border-zinc-700 p-3 rounded text-white text-lg font-bold"
              />
            </div>

            <div>
              <label className="block mb-2 text-zinc-300">3. Título del Álbum / Artista:</label>
              <input
                type="text"
                value={albumTitle}
                onChange={(e) => setAlbumTitle(e.target.value)}
                placeholder="EJ: SAMURAÏ — AMARRE"
                className="w-full bg-zinc-800 border border-zinc-700 p-3 rounded text-white text-base font-bold uppercase tracking-wider"
              />
            </div>

            <div className="pt-4 flex flex-col gap-3">
              <button
                onClick={() => runAnimation()}
                disabled={isRecording}
                className="w-full py-3.5 bg-zinc-800 hover:bg-zinc-700 font-bold uppercase rounded flex items-center justify-center gap-2 border border-white/10 text-zinc-200 transition-colors"
              >
                <Play className="size-4 text-punk-yellow" /> Vista Previa
              </button>

              <button
                onClick={handleRecordVideo}
                disabled={isRecording}
                className="w-full py-4 bg-punk-pink hover:bg-pink-600 font-bold uppercase rounded text-white flex items-center justify-center gap-2 shadow-xl text-base tracking-wide transition-all"
              >
                <Video className="size-5" />
                {isRecording ? 'Renderizando Vídeo MP4...' : 'Exportar Vídeo HD (.mp4)'}
              </button>
            </div>
          </div>
        </div>

        {/* Lienzo Canvas 9:16 en alta resolución */}
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
