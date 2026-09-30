'use client'

import { useRef, useState } from 'react'

export default function AdminStoryPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [mediaSrc, setMediaSrc] = useState<string>('')
  const [category, setCategory] = useState<string>('MUSICA')
  const [title, setTitle] = useState<string>('TITULAR DE PRUEBA')
  const [isExporting, setIsExporting] = useState<boolean>(false)
  const [recordingProgress, setRecordingProgress] = useState<number>(0)

  // --- FUNCIÓN 2: GRABAR Y DESCARGAR VÍDEO (MP4 / WebM) NATIVO ---
  const downloadAsVideo = async () => {
    if (!videoRef.current || !mediaSrc) return

    setIsExporting(true)
    setRecordingProgress(0)

    try {
      const videoElement = videoRef.current

      // Prepara el vídeo
      videoElement.currentTime = 0
      await videoElement.play()

      // Canvas interno de alta resolución (1080x1920)
      const canvas = document.createElement('canvas')
      canvas.width = 1080
      canvas.height = 1920
      const ctx = canvas.getContext('2d')
      if (!ctx) throw new Error('No se pudo inicializar el canvas')

      // Configura el MediaRecorder desde el stream del canvas
      const stream = canvas.captureStream(30)
      const mimeType = MediaRecorder.isTypeSupported('video/mp4')
        ? 'video/mp4'
        : MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
        ? 'video/webm;codecs=vp9'
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
        URL.revokeObjectURL(url)
        setIsExporting(false)
        setRecordingProgress(0)
      }

      // Duración del vídeo a grabar (5 segundos)
      const DURATION_SECONDS = 5
      const startTime = performance.now()
      mediaRecorder.start()

      // Bucle de renderizado continuo a 60/30fps sin html2canvas
      const renderFrame = () => {
        const elapsedTime = (performance.now() - startTime) / 1000
        const progress = Math.min(Math.round((elapsedTime / DURATION_SECONDS) * 100), 100)
        setRecordingProgress(progress)

        // 1. Limpiar canvas / Fondo
        ctx.fillStyle = '#000000'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // 2. Dibujar frame actual del vídeo (object-fit cover)
        if (videoElement.readyState >= 2) {
          const vidRatio = videoElement.videoWidth / videoElement.videoHeight
          const canvasRatio = canvas.width / canvas.height
          let renderWidth = canvas.width
          let renderHeight = canvas.height
          let offsetX = 0
          let offsetY = 0

          if (vidRatio > canvasRatio) {
            renderWidth = canvas.height * vidRatio
            offsetX = (canvas.width - renderWidth) / 2
          } else {
            renderHeight = canvas.width / vidRatio
            offsetY = (canvas.height - renderHeight) / 2
          }

          ctx.drawImage(videoElement, offsetX, offsetY, renderWidth, renderHeight)
        }

        // 3. Gradiente superpuesto
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

        // Caja Categoría
        ctx.fillStyle = '#ff007f'
        ctx.fillRect(860, 80, 160, 50)

        ctx.fillStyle = '#000000'
        ctx.font = 'bold 20px sans-serif'
        ctx.fillText(category, 940, 112)

        // 5. Bloque Inferior
        // Etiqueta "NUEVO ARTÍCULO"
        ctx.fillStyle = '#ffee00'
        ctx.fillRect(60, 1380, 200, 35)

        ctx.fillStyle = '#000000'
        ctx.font = 'bold 16px sans-serif'
        ctx.textAlign = 'left'
        ctx.fillText('NUEVO ARTÍCULO', 75, 1403)

        // Cuadro principal con el titular
        const boxX = 60
        const boxY = 1430
        const boxW = 960
        const boxH = 260

        ctx.fillStyle = 'rgba(0, 0, 0, 0.9)'
        ctx.fillRect(boxX, boxY, boxW, boxH)

        // Borde rosa
        ctx.fillStyle = '#ff007f'
        ctx.fillRect(boxX, boxY, 16, boxH)

        // Titular multilínea
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

        // Banner inferior "LEE MÁS EN LA WEB"
        ctx.fillStyle = '#ff007f'
        ctx.fillRect(boxX, 1710, boxW, 60)

        ctx.fillStyle = '#000000'
        ctx.font = 'bold 22px sans-serif'
        ctx.fillText('LEE MÁS EN LA WEB', boxX + 30, 1747)
        ctx.textAlign = 'right'
        ctx.fillText('→', boxX + boxW - 30, 1747)

        // Control del tiempo de grabación
        if (elapsedTime < DURATION_SECONDS) {
          requestAnimationFrame(renderFrame)
        } else {
          mediaRecorder.stop()
        }
      }

      // Iniciar bucle
      requestAnimationFrame(renderFrame)
    } catch (err) {
      console.error('Error durante la grabación del vídeo:', err)
      alert('Hubo un problema al grabar el vídeo.')
      setIsExporting(false)
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Generador de Story</h1>
      
      {/* Elemento de Vídeo para la vista previa */}
      <video
        ref={videoRef}
        src={mediaSrc}
        crossOrigin="anonymous"
        className="hidden"
        playsInline
        muted
      />

      <button
        onClick={downloadAsVideo}
        disabled={isExporting}
        className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700 disabled:opacity-50"
      >
        {isExporting ? `Exportando vídeo... (${recordingProgress}%)` : 'Descargar Vídeo'}
      </button>
    </div>
  )
}
