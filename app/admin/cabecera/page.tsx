'use client'

import { useState, useRef, useEffect } from 'react'
import { ArrowLeft, Video, Play, Lock, ShieldCheck } from 'lucide-react'
import Link from 'next/link'

const SECRET_PIN = '1234'

export default function GeneradorCabeceraPunkPro() {
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

  // Carga de imágenes sin deformación (Crop 1:1 proporcional)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const files = Array.from(e.target.files)
    const loaded: HTMLImageElement[] = []

    files.forEach((file) => {
      const img = new Image()
      img.src = URL.createObjectURL(file)
      img.onload = () => {
        const squareCanvas = document.createElement('canvas')
        const targetSize = 800
        squareCanvas.width = targetSize
        squareCanvas.height = targetSize
        const sCtx = squareCanvas.getContext('2d')

        if (sCtx) {
          const imgAspect = img.width / img.height
          let drawW = targetSize
          let drawH = targetSize
          let startX = 0
          let startY = 0

          if (imgAspect > 1) {
            drawW = targetSize * imgAspect
            startX = -(drawW - targetSize) / 2
          } else if (imgAspect < 1) {
            drawH = targetSize / imgAspect
            startY = -(drawH - targetSize) / 2
          }

          sCtx.fillStyle = '#0a0a0a'
          sCtx.fillRect(0, 0, targetSize, targetSize)
          sCtx.drawImage(img, startX, startY, drawW, drawH)

          const croppedImg = new Image()
          croppedImg.src = squareCanvas.toDataURL('image/jpeg', 0.95)
          croppedImg.onload = () => {
            loaded.push(croppedImg)
            if (loaded.length === files.length) {
              setImages(loaded)
            }
          }
        }
      }
    })
  }

  const drawBackground = (ctx: CanvasRenderingContext2D, width: number, height: number, showGlow: boolean) => {
    // Fondo negro mate profundo
    ctx.fillStyle = '#0A0A0A'
    ctx.fillRect(0, 0, width, height)

    // Degradado radial tenue en el centro cuando se selecciona el álbum
    if (showGlow) {
      const radial = ctx.createRadialGradient(width / 2, height / 2, 100, width / 2, height / 2, 900)
      radial.addColorStop(0, 'rgba(255, 46, 147, 0.18)')
      radial.addColorStop(0.5, 'rgba(255, 230, 0, 0.08)')
      radial.addColorStop(1, 'rgba(0, 0, 0, 0)')
      ctx.fillStyle = radial
      ctx.fillRect(0, 0, width, height)
    }

    // Franjas decorativas superior e inferior (Las fotos pasan por debajo)
    ctx.fillStyle = '#FF2E93'
    ctx.fillRect(0, 0, width, 24)
    ctx.fillRect(0, height - 24, width, 24)
  }

  const renderFrame = (
    ctx: CanvasRenderingContext2D,
    offsetY: number,
    showWinner: boolean,
    winnerImg: HTMLImageElement | null,
    textProgress: number
  ) => {
    const width = 1080
    const height = 1920

    // Dibujar fondo y habilitar glow central si hay ganador
    drawBackground(ctx, width, height, showWinner)

    const itemSize = 640
    const gap = 90
    const centerY = 860
    const stride = itemSize + gap

    if (images.length > 0) {
      const totalLoopImages: HTMLImageElement[] = []
      for (let r = 0; r < 8; r++) {
        totalLoopImages.push(...images)
      }

      totalLoopImages.forEach((img, i) => {
        const rawY = centerY + i * stride - offsetY
        const distFromCenter = rawY - centerY

        // Renderizamos con margen amplio para que crucen con naturalidad por las franjas
        if (rawY > -itemSize && rawY < height + itemSize) {
          const normDist = distFromCenter / 950
          const scale = Math.max(0.65, 1 - Math.abs(normDist) * 0.28)
          const opacity = Math.max(0.3, 1 - Math.abs(normDist) * 0.65)

          ctx.save()
          ctx.translate(540, rawY)
          ctx.scale(scale, scale)

          const isWinner = img === winnerImg && showWinner

          if (isWinner) {
            // Iluminación profesional y marco elegante al ser elegido
            ctx.shadowColor = 'rgba(255, 230, 0, 0.5)'
            ctx.shadowBlur = 45

            ctx.fillStyle = '#FF2E93'
            ctx.fillRect(-itemSize / 2 - 12, -itemSize / 2 - 12, itemSize + 24, itemSize + 24)

            ctx.fillStyle = '#0A0A0A'
            ctx.fillRect(-itemSize / 2 - 4, -itemSize / 2 - 4, itemSize + 8, itemSize + 8)
          } else {
            // Escala de grises elegante para el resto
            ctx.filter = `grayscale(100%) contrast(140%) brightness(${0.3 + opacity * 0.3})`
          }

          ctx.drawImage(img, -itemSize / 2, -itemSize / 2, itemSize, itemSize)
          ctx.restore()
        }
      })
    }

    if (textProgress > 0) {
      ctx.save()
      ctx.globalAlpha = Math.min(1, textProgress * 2.5)

      ctx.translate(540, 1620)

      ctx.fillStyle = '#FF2E93'
      ctx.fillRect(-450, -68, 900, 120)

      ctx.fillStyle = '#0A0A0A'
      ctx.fillRect(-444, -62, 888, 108)

      ctx.fillStyle = '#FFFFFF'
      ctx.font = '900 48px system-ui, -apple-system, sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(albumTitle.toUpperCase(), 0, 0)

      ctx.restore()
    }
  }

  const runAnimation = (onComplete?: () => void) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    if (images.length === 0) {
      alert('Sube al menos 3 portadas.')
      return
    }

    const winnerIdx = Math.max(0, winnerIndex - 1) % images.length
    const winnerImg = images[winnerIdx]

    const itemSize = 640
    const gap = 90
    const stride = itemSize + gap

    // Cálculo exacto para que caiga milimétricamente en la ganadora de la ronda 5
    const targetGlobalIndex = images.length * 5 + winnerIdx
    const totalDistance = targetGlobalIndex * stride

    let startTime: number | null = null
    const duration = 6500

    const editorialEasing = (t: number): number => {
      if (t < 0.15) return 2.2 * t * t
      if (t < 0.88) {
        const subT = (t - 0.15) / 0.73
        return 0.05 + 0.88 * (1 - Math.pow(1 - subT, 3))
      }
      const subT = (t - 0.88) / 0.12
      return 0.93 + subT * 0.07
    }

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime
      const progress = Math.min(elapsed / duration, 1)

      const easeProgress = editorialEasing(progress)
      const currentOffsetY = totalDistance * easeProgress

      const isFinished = progress >= 0.985
      const textProgress = progress >= 0.92 ? Math.min((elapsed - duration * 0.92) / 400, 1) : 0

      renderFrame(ctx, currentOffsetY, isFinished, winnerImg, textProgress)

      if (elapsed < duration + 900) {
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
      a.download = `reel-cabecera-punk-${Date.now()}.mp4`
      a.click()
      setIsRecording(false)
    }

    recorder.start()
    runAnimation(() => {
      setTimeout(() => recorder.stop(), 450)
    })
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas && isAuthenticated) {
      const ctx = canvas.getContext('2d')
      if (ctx) {
        drawBackground(ctx, 1080, 1920, false)
      }
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
            Introduce la clave secreta para acceder a la herramienta.
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
        {/* Panel de Control */}
        <div className="lg:col-span-5 space-y-6 bg-zinc-900/90 p-6 rounded-xl border border-white/10 shadow-2xl">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-punk-yellow hover:text-punk-pink font-mono uppercase"
            >
              <ArrowLeft className="size-4" /> Salir
            </Link>
            <span className="flex items-center gap-1 text-xs text-emerald-400 font-mono bg-emerald-950/50 px-2.5 py-1 rounded border border-emerald-800">
              <ShieldCheck className="size-3.5" /> Editorial Pro
            </span>
          </div>

          <h1 className="font-display text-2xl uppercase text-punk-pink">
            Generador Cabecera Reels
          </h1>

          <div className="space-y-5 text-sm font-mono">
            <div>
              <label className="block mb-2 text-zinc-300">1. Portadas (Recorte Proporcional):</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full bg-zinc-800 border border-zinc-700 p-2.5 rounded text-xs text-zinc-300 file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:bg-punk-pink file:text-white font-mono cursor-pointer"
              />
              <span className="text-xs text-punk-yellow mt-2 block font-semibold">
                ✓ {images.length} portadas listas
              </span>
            </div>

            <div>
              <label className="block mb-2 text-zinc-300">2. Portada Ganadora (Nº Orden):</label>
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
                <Play className="size-4 text-punk-yellow" /> Vista Previa (6.5s)
              </button>

              <button
                onClick={handleRecordVideo}
                disabled={isRecording}
                className="w-full py-4 bg-punk-pink hover:bg-pink-600 font-bold uppercase rounded text-white flex items-center justify-center gap-2 shadow-xl text-base tracking-wide transition-all"
              >
                <Video className="size-5" />
                {isRecording ? 'Renderizando MP4...' : 'Exportar Vídeo (.mp4)'}
              </button>
            </div>
          </div>
        </div>

        {/* Lienzo Canvas 9:16 HD */}
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
