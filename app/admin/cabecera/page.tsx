'use client'

import { useState, useRef, useEffect } from 'react'
import { ArrowLeft, Video, Play, Lock, ShieldCheck, Sparkles } from 'lucide-react'
import Link from 'next/link'

const SECRET_PIN = 'dame-marcha-punk-2026'

interface Particle {
  x: number
  y: number
  size: number
  speedY: number
  alpha: number
}

export default function GeneradorCabeceraPro() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [inputPin, setInputPin] = useState<string>('')
  const [errorPin, setErrorPin] = useState<boolean>(false)

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [images, setImages] = useState<HTMLImageElement[]>([])
  const [winnerIndex, setWinnerIndex] = useState<number>(1)
  const [albumTitle, setAlbumTitle] = useState<string>('SAMURAÏ — AMARRE')
  const [isRecording, setIsRecording] = useState<boolean>(false)

  const particlesRef = useRef<Particle[]>([])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputPin === SECRET_PIN) {
      setIsAuthenticated(true)
      setErrorPin(false)
    } else {
      setErrorPin(true)
    }
  }

  // Carga y adaptación automática de cualquier imagen a cuadrado perfecto
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const files = Array.from(e.target.files)
    const loaded: HTMLImageElement[] = []

    files.forEach((file) => {
      const img = new Image()
      img.src = URL.createObjectURL(file)
      img.onload = () => {
        // Creamos un canvas auxiliar para recortar la imagen en formato cuadrado exacto (Cover)
        const squareCanvas = document.createElement('canvas')
        const size = 800
        squareCanvas.width = size
        squareCanvas.height = size
        const sCtx = squareCanvas.getContext('2d')
        
        if (sCtx) {
          const minDim = Math.min(img.width, img.height)
          const sx = (img.width - minDim) / 2
          const sy = (img.height - minDim) / 2
          sCtx.drawImage(img, sx, sy, minDim, minDim, 0, 0, size, size)

          const squareImg = new Image()
          squareImg.src = squareCanvas.toDataURL('image/jpeg', 0.95)
          squareImg.onload = () => {
            loaded.push(squareImg)
            if (loaded.length === files.length) {
              setImages(loaded)
            }
          }
        }
      }
    })
  }

  const initParticles = () => {
    const parts: Particle[] = []
    for (let i = 0; i < 25; i++) {
      parts.push({
        x: Math.random() * 1080,
        y: Math.random() * 1920,
        size: Math.random() * 3 + 1,
        speedY: -(Math.random() * 0.8 + 0.2),
        alpha: Math.random() * 0.4 + 0.1,
      })
    }
    particlesRef.current = parts
  }

  // Fondo minimalista y elegante
  const drawBackground = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const bgGrad = ctx.createLinearGradient(0, 0, 0, height)
    bgGrad.addColorStop(0, '#09090b')
    bgGrad.addColorStop(0.5, '#18181b')
    bgGrad.addColorStop(1, '#09090b')
    ctx.fillStyle = bgGrad
    ctx.fillRect(0, 0, width, height)

    // Viñeteado cinematográfico suave
    const radGrad = ctx.createRadialGradient(540, 960, 400, 540, 960, 1200)
    radGrad.addColorStop(0, 'rgba(0, 0, 0, 0)')
    radGrad.addColorStop(1, 'rgba(0, 0, 0, 0.7)')
    ctx.fillStyle = radGrad
    ctx.fillRect(0, 0, width, height)

    // Partículas sutiles de fondo
    particlesRef.current.forEach((p) => {
      p.y += p.speedY
      if (p.y < -10) p.y = height + 10

      ctx.save()
      ctx.globalAlpha = p.alpha
      ctx.fillStyle = '#ffffff'
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    })
  }

  const renderFrame = (
    ctx: CanvasRenderingContext2D,
    offsetY: number,
    showWinner: boolean,
    winnerImg: HTMLImageElement | null,
    textProgress: number,
    speedFactor: number
  ) => {
    const width = 1080
    const height = 1920
    drawBackground(ctx, width, height)

    const itemSize = 620
    const gap = 100
    const centerY = 850
    const stride = itemSize + gap

    if (images.length > 0) {
      const totalLoopImages: HTMLImageElement[] = []
      for (let r = 0; r < 8; r++) {
        totalLoopImages.push(...images)
      }

      totalLoopImages.forEach((img, i) => {
        const rawY = centerY + i * stride - offsetY
        const distFromCenter = rawY - centerY

        if (Math.abs(distFromCenter) < 1200) {
          const normDist = distFromCenter / 900
          const scale = Math.max(0.6, 1 - Math.abs(normDist) * 0.35)
          const opacity = Math.max(0.2, 1 - Math.abs(normDist) * 0.75)

          ctx.save()
          ctx.translate(540, rawY)
          ctx.scale(scale, scale)

          const isWinner = img === winnerImg && showWinner

          if (isWinner) {
            // Estilo ganador limpio: sutil sombra cálida y marco fino blanco/amarillo
            ctx.shadowColor = 'rgba(255, 230, 0, 0.4)'
            ctx.shadowBlur = 50

            ctx.strokeStyle = '#FFE600'
            ctx.lineWidth = 6
            ctx.strokeRect(-itemSize / 2 - 4, -itemSize / 2 - 4, itemSize + 8, itemSize + 8)
          } else {
            ctx.filter = `grayscale(100%) brightness(${0.25 + opacity * 0.25})`
          }

          // Motion blur suave vertical en movimiento rápido
          if (speedFactor > 0.02 && !isWinner) {
            ctx.globalAlpha = 0.6
            const blurOffset = Math.min(speedFactor * 90, 20)
            ctx.drawImage(img, -itemSize / 2, -itemSize / 2 - blurOffset, itemSize, itemSize)
            ctx.globalAlpha = opacity
          }

          // Dibujar portada cuadrada perfecta con esquinas sutiles (Clip Path)
          ctx.beginPath()
          ctx.roundRect(-itemSize / 2, -itemSize / 2, itemSize, itemSize, 12)
          ctx.clip()
          ctx.drawImage(img, -itemSize / 2, -itemSize / 2, itemSize, itemSize)

          ctx.restore()
        }
      })
    }

    // Tipografía limpia, elegante y profesional
    if (textProgress > 0) {
      ctx.save()
      ctx.globalAlpha = Math.min(1, textProgress * 2)

      const scale = 0.9 + textProgress * 0.1
      ctx.translate(540, 1600)
      ctx.scale(scale, scale)

      // Caja tipográfica limpia mate
      ctx.fillStyle = '#09090b'
      ctx.shadowColor = 'rgba(0, 0, 0, 0.9)'
      ctx.shadowBlur = 25
      ctx.beginPath()
      ctx.roundRect(-440, -65, 880, 130, 8)
      ctx.fill()

      // Borde sutil minimalista
      ctx.strokeStyle = '#27272a'
      ctx.lineWidth = 2
      ctx.stroke()

      // Texto Principal Limpio
      ctx.fillStyle = '#ffffff'
      ctx.font = '700 48px system-ui, -apple-system, sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.letterSpacing = '4px'
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

    initParticles()

    const winnerIdx = Math.max(0, winnerIndex - 1) % images.length
    const winnerImg = images[winnerIdx]

    const itemSize = 620
    const gap = 100
    const stride = itemSize + gap

    // Parada en la quinta vuelta para mayor duración de giro fluido
    const targetGlobalIndex = images.length * 5 + winnerIdx
    const totalDistance = targetGlobalIndex * stride

    let startTime: number | null = null
    const duration = 6500 // 6.5 segundos de giro suave y profesional
    let prevOffsetY = 0

    // Curva suave tipo Ease-Out Cúbico con frenado orgánico
    const smoothEasing = (t: number): number => {
      if (t < 0.15) return 3 * t * t * 0.1 // Arranque sutil
      if (t < 0.9) {
        const subT = (t - 0.15) / 0.75
        return 0.05 + 0.9 * (1 - Math.pow(1 - subT, 3))
      }
      const subT = (t - 0.9) / 0.1
      const microBounce = Math.sin(subT * Math.PI) * 0.005 * (1 - subT)
      return 0.95 + subT * 0.05 + microBounce
    }

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime
      const progress = Math.min(elapsed / duration, 1)

      const easeProgress = smoothEasing(progress)
      const currentOffsetY = totalDistance * easeProgress
      const speedFactor = Math.abs(currentOffsetY - prevOffsetY)
      prevOffsetY = currentOffsetY

      const isFinished = progress >= 0.98
      const textProgress = progress >= 0.9 ? Math.min((elapsed - duration * 0.9) / 450, 1) : 0

      renderFrame(ctx, currentOffsetY, isFinished, winnerImg, textProgress, speedFactor)

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
      a.href = url
      a.download = `reel-cabecera-pro-${Date.now()}.mp4`
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
      if (ctx) {
        initParticles()
        drawBackground(ctx, 1080, 1920)
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
            Introduce la clave secreta para acceder al generador Ultra-Pro.
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
              <ShieldCheck className="size-3.5" /> 6.5s Smooth Edition
            </span>
          </div>

          <h1 className="font-display text-2xl uppercase text-punk-pink flex items-center gap-2">
            <Sparkles className="size-6 text-punk-yellow" /> Cabecera Pro Reels
          </h1>

          <div className="space-y-5 text-sm font-mono">
            <div>
              <label className="block mb-2 text-zinc-300">1. Portadas (Adaptación Automática):</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full bg-zinc-800 border border-zinc-700 p-2.5 rounded text-xs text-zinc-300 file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:bg-punk-pink file:text-white font-mono cursor-pointer"
              />
              <span className="text-xs text-punk-yellow mt-2 block font-semibold">
                ✓ {images.length} portadas cuadradas listas
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
                <Play className="size-4 text-punk-yellow" /> Probar Animación Smooth
              </button>

              <button
                onClick
