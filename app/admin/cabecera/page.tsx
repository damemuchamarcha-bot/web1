'use client'

import { useState, useRef, useEffect } from 'react'
import { ArrowLeft, Video, Play, Lock, ShieldCheck, Sparkles, Sliders } from 'lucide-react'
import Link from 'next/link'

const SECRET_PIN = 'dame-marcha-punk-2026'

interface Particle {
  x: number
  y: number
  size: number
  speedY: number
  alpha: number
  color: string
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

  // Inicializar partículas de fondo
  const initParticles = () => {
    const parts: Particle[] = []
    for (let i = 0; i < 40; i++) {
      parts.push({
        x: Math.random() * 1080,
        y: Math.random() * 1920,
        size: Math.random() * 4 + 2,
        speedY: -(Math.random() * 1.5 + 0.5),
        alpha: Math.random() * 0.6 + 0.2,
        color: Math.random() > 0.5 ? '#FFE600' : '#FF2E93',
      })
    }
    particlesRef.current = parts
  }

  // Renderizado del Fondo Cinematográfico
  const drawBackground = (ctx: CanvasRenderingContext2D, width: number, height: number, time: number) => {
    // Gradiente base Neo-Punk
    const bgGrad = ctx.createLinearGradient(0, 0, 0, height)
    bgGrad.addColorStop(0, '#0F0208')
    bgGrad.addColorStop(0.5, '#FF2E93')
    bgGrad.addColorStop(1, '#0A0004')
    ctx.fillStyle = bgGrad
    ctx.fillRect(0, 0, width, height)

    // Viñeteado de cámara / Estudio
    const radGrad = ctx.createRadialGradient(540, 960, 250, 540, 960, 1100)
    radGrad.addColorStop(0, 'rgba(0, 0, 0, 0.1)')
    radGrad.addColorStop(1, 'rgba(0, 0, 0, 0.75)')
    ctx.fillStyle = radGrad
    ctx.fillRect(0, 0, width, height)

    // Partículas flotantes de luz
    particlesRef.current.forEach((p) => {
      p.y += p.speedY
      if (p.y < -10) p.y = height + 10

      ctx.save()
      ctx.globalAlpha = p.alpha
      ctx.fillStyle = p.color
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    })
  }

  // Dibujar brillo especular circular tipo vinilo
  const drawVinylSpecular = (ctx: CanvasRenderingContext2D, size: number) => {
    ctx.save()
    const specGrad = ctx.createLinearGradient(-size / 2, -size / 2, size / 2, size / 2)
    specGrad.addColorStop(0, 'rgba(255, 255, 255, 0.25)')
    specGrad.addColorStop(0.3, 'rgba(255, 255, 255, 0.0)')
    specGrad.addColorStop(0.7, 'rgba(255, 255, 255, 0.0)')
    specGrad.addColorStop(1, 'rgba(255, 255, 255, 0.15)')

    ctx.fillStyle = specGrad
    ctx.fillRect(-size / 2, -size / 2, size, size)
    ctx.restore()
  }

  const renderFrame = (
    ctx: CanvasRenderingContext2D,
    offsetY: number,
    showWinnerGlow: boolean,
    winnerImg: HTMLImageElement | null,
    textProgress: number,
    speedFactor: number,
    time: number
  ) => {
    const width = 1080
    const height = 1920
    drawBackground(ctx, width, height, time)

    const itemSize = 600
    const gap = 120
    const centerY = 880
    const stride = itemSize + gap

    if (images.length > 0) {
      const totalLoopImages: HTMLImageElement[] = []
      for (let r = 0; r < 6; r++) {
        totalLoopImages.push(...images)
      }

      totalLoopImages.forEach((img, i) => {
        const rawY = centerY + i * stride - offsetY
        const distFromCenter = rawY - centerY

        // Renderizado 3D en perspectiva de cilindro
        if (Math.abs(distFromCenter) < 1100) {
          const normDist = distFromCenter / 900
          const scale = Math.max(0.65, 1 - Math.abs(normDist) * 0.3)
          const opacity = Math.max(0.3, 1 - Math.abs(normDist) * 0.6)
          const rotateX = normDist * 0.45 // Inclinación 3D

          ctx.save()
          ctx.translate(540, rawY)
          ctx.scale(scale, scale)

          const isWinner = img === winnerImg && showWinnerGlow

          if (isWinner) {
            // Halo de Luz Neón Multicapa (Doble Resplandor)
            ctx.shadowColor = '#FFE600'
            ctx.shadowBlur = 110 + Math.sin(time * 0.01) * 20
            
            // Marco Rosa/Amarillo encendido
            ctx.strokeStyle = '#FFE600'
            ctx.lineWidth = 14
            ctx.strokeRect(-itemSize / 2 - 8, -itemSize / 2 - 8, itemSize + 16, itemSize + 16)

            ctx.strokeStyle = '#FF2E93'
            ctx.lineWidth = 6
            ctx.strokeRect(-itemSize / 2 - 20, -itemSize / 2 - 20, itemSize + 40, itemSize + 40)
          } else {
            ctx.filter = `grayscale(100%) brightness(${0.3 + opacity * 0.2})`
          }

          // Motion Blur vertical durante la aceleración
          if (speedFactor > 0.01 && !isWinner) {
            ctx.globalAlpha = 0.7
            const blurOffset = Math.min(speedFactor * 140, 35)
            ctx.drawImage(img, -itemSize / 2, -itemSize / 2 - blurOffset, itemSize, itemSize)
            ctx.globalAlpha = opacity
          }

          // Dibujar Portada
          ctx.drawImage(img, -itemSize / 2, -itemSize / 2, itemSize, itemSize)

          // Reflejo Estilo Disco Vinilo
          drawVinylSpecular(ctx, itemSize)

          ctx.restore()
        }
      })
    }

    // Cartel Editorial con Título
    if (textProgress > 0) {
      ctx.save()
      ctx.globalAlpha = Math.min(1, textProgress * 1.5)

      const scale = 0.8 + textProgress * 0.2
      ctx.translate(540, 1580)
      ctx.scale(scale, scale)

      // Sombra proyectada del cartel
      ctx.fillStyle = 'rgba(0, 0, 0, 0.85)'
      ctx.shadowColor = '#FF2E93'
      ctx.shadowBlur = 40
      ctx.fillRect(-460, -80, 920, 140)

      // Borde Rosa Neón
      ctx.strokeStyle = '#FF2E93'
      ctx.lineWidth = 5
      ctx.strokeRect(-460, -80, 920, 140)

      // Borde Interior Amarillo
      ctx.strokeStyle = '#FFE600'
      ctx.lineWidth = 2
      ctx.strokeRect(-452, -72, 904, 124)

      // Texto Principal
      ctx.fillStyle = '#FFFFFF'
      ctx.font = '900 60px system-ui, sans-serif'
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
      alert('Sube al menos 3 o más portadas.')
      return
    }

    initParticles()

    const winnerIdx = Math.max(0, winnerIndex - 1) % images.length
    const winnerImg = images[winnerIdx]

    const itemSize = 600
    const gap = 120
    const stride = itemSize + gap

    // Parada exacta en la cuarta vuelta
    const targetGlobalIndex = images.length * 4 + winnerIdx
    const totalDistance = targetGlobalIndex * stride

    let startTime: number | null = null
    const duration = 4800 // 4.8 segundos cinematográficos
    let prevOffsetY = 0

    // Curva física con desaceleración y rebote elástico (Spring Effect)
    const cubicPhysicsEasing = (t: number): number => {
      if (t < 0.25) {
        // Aceleración suave
        return 2 * t * t * 0.2
      }
      if (t < 0.88) {
        // Giro principal a alta velocidad
        const subT = (t - 0.25) / 0.63
        return 0.12 + 0.85 * (1 - Math.pow(1 - subT, 3))
      }
      // Encaje elástico final (Spring overshoot)
      const subT = (t - 0.88) / 0.12
      const bounce = Math.sin(subT * Math.PI * 1.8) * Math.exp(-subT * 4.5) * 0.015
      return 0.97 + subT * 0.03 + bounce
    }

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime
      const progress = Math.min(elapsed / duration, 1)

      const easeProgress = cubicPhysicsEasing(progress)
      const currentOffsetY = totalDistance * easeProgress
      const speedFactor = Math.abs(currentOffsetY - prevOffsetY)
      prevOffsetY = currentOffsetY

      const isFinished = progress >= 0.98
      const textProgress = progress >= 0.93 ? Math.min((elapsed - duration * 0.93) / 400, 1) : 0

      renderFrame(ctx, currentOffsetY, isFinished, winnerImg, textProgress, speedFactor, elapsed)

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
      if (ctx) {
        initParticles()
        drawBackground(ctx, 1080, 1920, 0)
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
        {/* Panel de Control Pro */}
        <div className="lg:col-span-5 space-y-6 bg-zinc-900/90 p-6 rounded-xl border border-white/10 shadow-2xl">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-punk-yellow hover:text-punk-pink font-mono uppercase"
            >
              <ArrowLeft className="size-4" /> Salir
            </Link>
            <span className="flex items-center gap-1 text-xs text-emerald-400 font-mono bg-emerald-950/50 px-2.5 py-1 rounded border border-emerald-800">
              <ShieldCheck className="size-3.5" /> Modo Cinema 60FPS
            </span>
          </div>

          <h1 className="font-display text-2xl uppercase text-punk-pink flex items-center gap-2">
            <Sparkles className="size-6 text-punk-yellow" /> Cabecera Pro Reels
          </h1>

          <div className="space-y-5 text-sm font-mono">
            <div>
              <label className="block mb-2 text-zinc-300">1. Portadas de la Ruleta:</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full bg-zinc-800 border border-zinc-700 p-2.5 rounded text-xs text-zinc-300 file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:bg-punk-pink file:text-white font-mono cursor-pointer"
              />
              <span className="text-xs text-punk-yellow mt-2 block font-semibold">
                ✓ {images.length} portadas en cola
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
                <Play className="size-4 text-punk-yellow" /> Probar Animación 3D
              </button>

              <button
                onClick={handleRecordVideo}
                disabled={isRecording}
                className="w-full py-4 bg-punk-pink hover:bg-pink-600 font-bold uppercase rounded text-white flex items-center justify-center gap-2 shadow-xl text-base tracking-wide transition-all"
              >
                <Video className="size-5" />
                {isRecording ? 'Renderizando 60FPS MP4...' : 'Exportar Vídeo Cinema (.mp4)'}
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
