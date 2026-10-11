'use client'

import { useState, useRef, useEffect } from 'react'
import { ArrowLeft, Video, Play, Lock, ShieldCheck } from 'lucide-react'
import Link from 'next/link'

const SECRET_PIN = 'dame-marcha-punk-2026'

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

  // Carga de imágenes con recorte proporcional estricto 1:1
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const files = Array.from(e.target.files)
    const loaded: HTMLImageElement[] = []

    files.forEach((file) => {
      const objectUrl = URL.createObjectURL(file)
      const img = new Image()
      img.src = objectUrl
      img.onload = () => {
        const squareCanvas = document.createElement('canvas')
        const targetSize = 800
        squareCanvas.width = targetSize
        squareCanvas.height = targetSize
        const sCtx = squareCanvas.getContext('2d', { alpha: false })

        if (sCtx) {
          const minDim = Math.min(img.width, img.height)
          const sx = (img.width - minDim) / 2
          const sy = (img.height - minDim) / 2

          sCtx.fillStyle = '#0A0A0A'
          sCtx.fillRect(0, 0, targetSize, targetSize)
          sCtx.drawImage(img, sx, sy, minDim, minDim, 0, 0, targetSize, targetSize)

          const squareImg = new Image()
          squareImg.src = squareCanvas.toDataURL('image/jpeg', 0.98)
          squareImg.onload = () => {
            loaded.push(squareImg)
            URL.revokeObjectURL(objectUrl)
            if (loaded.length === files.length) {
              setImages(loaded)
            }
          }
        }
      }
    })
  }

  // Fondo Negro Mate con Profundidad y Resplandor Radial Tenue
  const drawBackground = (ctx: CanvasRenderingContext2D, width: number, height: number, glowAlpha: number) => {
    ctx.fillStyle = '#0A0A0A'
    ctx.fillRect(0, 0, width, height)

    if (glowAlpha > 0) {
      const radial = ctx.createRadialGradient(width / 2, 860, 50, width / 2, 860, 850)
      radial.addColorStop(0, `rgba(255, 46, 147, ${0.18 * glowAlpha})`)
      radial.addColorStop(0.6, `rgba(255, 255, 255, ${0.05 * glowAlpha})`)
      radial.addColorStop(1, 'rgba(0, 0, 0, 0)')
      ctx.fillStyle = radial
      ctx.fillRect(0, 0, width, height)
    }
  }

  // Franjas de corte superior e inferior (Capa Overlay)
  const drawTopOverlay = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.fillStyle = '#0A0A0A'
    ctx.fillRect(0, 0, width, 32)
    ctx.fillRect(0, height - 32, width, 32)

    ctx.fillStyle = '#FF2E93'
    ctx.fillRect(0, 32, width, 3)
    ctx.fillRect(0, height - 35, width, 3)
  }

  const renderFrame = (
    ctx: CanvasRenderingContext2D,
    offsetY: number,
    showWinner: boolean,
    winnerImg: HTMLImageElement | null,
    textProgress: number,
    glowAlpha: number,
    colorTransitionProgress: number
  ) => {
    const width = 1080
    const height = 1920

    drawBackground(ctx, width, height, glowAlpha)

    const itemSize = 640
    const gap = 90
    const centerY = 860
    const stride = itemSize + gap

    if (images.length > 0) {
      const totalLoopImages: HTMLImageElement[] = []
      for (let r = 0; r < 12; r++) {
        totalLoopImages.push(...images)
      }

      totalLoopImages.forEach((img, i) => {
        const rawY = centerY + i * stride - offsetY
        const distFromCenter = rawY - centerY

        if (rawY > -itemSize && rawY < height + itemSize) {
          const normDist = distFromCenter / 950
          const scale = Math.max(0.65, 1 - Math.abs(normDist) * 0.28)
          const opacity = Math.max(0.3, 1 - Math.abs(normDist) * 0.65)

          ctx.save()
          ctx.translate(540, rawY)
          ctx.scale(scale, scale)

          const isWinner = img === winnerImg && showWinner

          if (isWinner) {
            ctx.shadowColor = `rgba(0, 0, 0, ${0.6 * glowAlpha})`
            ctx.shadowBlur = 40

            ctx.fillStyle = '#FF2E93'
            ctx.fillRect(-itemSize / 2 - 10, -itemSize / 2 - 10, itemSize + 20, itemSize + 20)

            ctx.fillStyle = '#0A0A0A'
            ctx.fillRect(-itemSize / 2 - 3, -itemSize / 2 - 3, itemSize + 6, itemSize + 6)

            if (colorTransitionProgress < 1) {
              ctx.filter = `grayscale(${1 - colorTransitionProgress}) brightness(${0.35 + colorTransitionProgress * 0.65})`
            } else {
              ctx.filter = 'none'
            }
          } else {
            ctx.filter = `grayscale(100%) contrast(130%) brightness(${0.35 + opacity * 0.25})`
          }

          ctx.drawImage(img, -itemSize / 2, -itemSize / 2, itemSize, itemSize)

          if (isWinner && colorTransitionProgress > 0) {
            ctx.save()
            ctx.globalCompositeOperation = 'soft-light'
            ctx.fillStyle = `rgba(255, 255, 255, ${0.2 * colorTransitionProgress})`
            ctx.fillRect(-itemSize / 2, -itemSize / 2, itemSize, itemSize)
            ctx.restore()
          }

          ctx.restore()
        }
      })
    }

    drawTopOverlay(ctx, width, height)

    // El texto aparece progresivamente solo cuando textProgress > 0 (después del revelado de la foto)
    if (textProgress > 0) {
      ctx.save()
      ctx.globalAlpha = Math.min(1, textProgress * 2.2)

      const textScale = 0.95 + textProgress * 0.05
      ctx.translate(540, 1620)
      ctx.scale(textScale, textScale)

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

  const runAnimation = (): Promise<void> => {
    return new Promise((resolve) => {
      const canvas = canvasRef.current
      if (!canvas) {
        resolve()
        return
      }
      const ctx = canvas.getContext('2d', { alpha: false })
      if (!ctx) {
        resolve()
        return
      }

      if (images.length === 0) {
        alert('Sube al menos 3 portadas.')
        resolve()
        return
      }

      const winnerIdx = Math.max(0, winnerIndex - 1) % images.length
      const itemSize = 640
      const gap = 90
      const stride = itemSize + gap

      const targetLoopRound = 5
      const targetGlobalIndex = targetLoopRound * images.length + winnerIdx
      const totalDistance = targetGlobalIndex * stride

      const winnerImg = images[winnerIdx]

      let startTime: number | null = null
      const duration = 6000 // 6 segundos de rotación y frenado

      const ultraSmoothEasing = (t: number): number => {
        if (t < 0.5) {
          return 4 * t * t * t
        }
        const f = t - 1
        return 1 + 4 * f * f * f
      }

      const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp
        const elapsed = timestamp - startTime
        const progress = Math.min(elapsed / duration, 1)

        const easeProgress = ultraSmoothEasing(progress)
        const currentOffsetY = totalDistance * easeProgress

        // FASE 1: Se completa el movimiento de la ruleta (parada exacta)
        const isFinished = progress >= 0.985

        // FASE 2: Transición de color de la imagen ganadora (inmediatamente al parar)
        const colorTransitionProgress = isFinished ? Math.min((elapsed - duration * 0.985) / 400, 1) : 0
        const glowAlpha = isFinished ? Math.min((elapsed - duration * 0.985) / 400, 1) : 0

        // FASE 3: El texto aparece únicamente TRAS haberse revelado la foto (con un offset de tiempo)
        const textStartThreshold = duration + 350
        const textProgress = elapsed >= textStartThreshold ? Math.min((elapsed - textStartThreshold) / 450, 1) : 0

        renderFrame(ctx, currentOffsetY, isFinished, winnerImg, textProgress, glowAlpha, colorTransitionProgress)

        // Se mantiene la escena en pantalla hasta completar la secuencia completa del texto (+1.2s de remate)
        if (elapsed < duration + 1400) {
          requestAnimationFrame(step)
        } else {
          resolve()
        }
      }

      requestAnimationFrame(step)
    })
  }

  const handleRecordVideo = async () => {
    const canvas = canvasRef.current
    if (!canvas) return

    if (images.length === 0) {
      alert('Sube al menos 3 portadas.')
      return
    }

    setIsRecording(true)
    const stream = canvas.captureStream(60)

    const mimeTypesToTry = [
      'video/mp4;codecs=avc1.42E01E,mp4a.40.2',
      'video/mp4;codecs=avc1',
      'video/mp4',
      'video/webm;codecs=vp9',
      'video/webm'
    ]

    let selectedMimeType = ''
    for (const mime of mimeTypesToTry) {
      if (MediaRecorder.isTypeSupported(mime)) {
        selectedMimeType = mime
        break
      }
    }

    const options: MediaRecorderOptions = selectedMimeType ? { mimeType: selectedMimeType } : {}
    const recorder = new MediaRecorder(stream, options)
    const chunks: Blob[] = []

    recorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) {
        chunks.push(e.data)
      }
    }

    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: selectedMimeType || 'video/mp4' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `reel-cabecera-${Date.now()}.mp4`
      a.click()
      URL.revokeObjectURL(url)
      setIsRecording(false)
    }

    recorder.start(100)

    await runAnimation()

    setTimeout(() => {
      if (recorder.state !== 'inactive') {
        recorder.stop()
      }
    }, 1200)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas && isAuthenticated) {
      const ctx = canvas.getContext('2d', { alpha: false })
      if (ctx) {
        drawBackground(ctx, 1080, 1920, 0)
        drawTopOverlay(ctx, 1080, 1920)
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
              <ShieldCheck className="size-3.5" /> Ultra Smooth Pro
            </span>
          </div>

          <h1 className="font-display text-2xl uppercase text-punk-pink">
            Generador Cabecera Reels
          </h1>

          <div className="space-y-5 text-sm font-mono">
            <div>
              <label className="block mb-2 text-zinc-300">1. Portadas (Cuadradas 1:1 sin deformar):</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full bg-zinc-800 border border-zinc-700 p-2.5 rounded text-xs text-zinc-300 file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:bg-punk-pink file:text-white font-mono cursor-pointer"
              />
              <span className="text-xs text-punk-yellow mt-2 block font-semibold">
                ✓ {images.length} portadas listas y recortadas
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
                {isRecording ? 'Exportando Vídeo Completo...' : 'Exportar Vídeo HD (.mp4)'}
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
