// --- FUNCIÓN 2: GRABAR Y DESCARGAR VÍDEO (NATIVO SIN HTML2CANVAS) ---
  const downloadAsVideo = async () => {
    if (!videoRef.current) {
      alert('Debes seleccionar un archivo de vídeo.')
      return
    }

    setIsExporting(true)
    setRecordingProgress(0)

    try {
      const video = videoRef.current
      const canvas = document.createElement('canvas')
      canvas.width = 1080
      canvas.height = 1920
      const ctx = canvas.getContext('2d')

      if (!ctx) throw new Error('No se pudo inicializar el canvas')

      // Configurar el vídeo desde el segundo 0
      video.pause()
      video.currentTime = 0

      // Esperar a que el vídeo esté listo para reproducir
      await new Promise((resolve) => {
        if (video.readyState >= 2) resolve(true)
        else video.oncanplay = () => resolve(true)
      })

      // Determinar códec soportado
      let mimeType = 'video/webm;codecs=vp9'
      if (MediaRecorder.isTypeSupported('video/mp4')) {
        mimeType = 'video/mp4'
      } else if (MediaRecorder.isTypeSupported('video/webm')) {
        mimeType = 'video/webm'
      }

      const stream = canvas.captureStream(30)
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType,
        videoBitsPerSecond: 8000000,
      })

      const chunks: Blob[] = []
      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunks.push(e.data)
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: mimeType })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        const ext = mimeType.includes('mp4') ? 'mp4' : 'webm'
        a.download = `story-${category.toLowerCase()}-${Date.now()}.${ext}`
        a.click()
        URL.revokeObjectURL(url)
        setIsExporting(false)
        setRecordingProgress(0)
      }

      // Función encargada de dibujar cada frame en el canvas
      const drawFrame = () => {
        // 1. Limpiar canvas
        ctx.fillStyle = '#000000'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // 2. Renderizar fotograma del vídeo (Object-fit Cover)
        if (video.videoWidth > 0 && video.videoHeight > 0) {
          const vRatio = video.videoWidth / video.videoHeight
          const cRatio = canvas.width / canvas.height
          let renderW = canvas.width
          let renderH = canvas.height
          let offsetX = 0
          let offsetY = 0

          if (vRatio > cRatio) {
            renderW = canvas.height * vRatio
            offsetX = (canvas.width - renderW) / 2
          } else {
            renderH = canvas.width / vRatio
            offsetY = (canvas.height - renderH) / 2
          }

          ctx.drawImage(video, offsetX, offsetY, renderW, renderH)
        }

        // 3. Superponer degradado oscuro
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0.6)')
        gradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.2)')
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.9)')
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // 4. Dibujar caja "DAME MARCHA"
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)'
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'
        ctx.lineWidth = 2
        ctx.fillRect(60, 80, 220, 50)
        ctx.strokeRect(60, 80, 220, 50)

        ctx.fillStyle = '#ffffff'
        ctx.font = 'bold 20px sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText('DAME MARCHA', 170, 112)

        // Dibujar Categoría
        ctx.fillStyle = '#ff007f'
        ctx.fillRect(860, 80, 160, 50)

        ctx.fillStyle = '#000000'
        ctx.font = 'bold 20px sans-serif'
        ctx.fillText(category, 940, 112)

        // 5. Dibujar Titular e Inferiores
        ctx.fillStyle = '#ffee00'
        ctx.fillRect(60, 1380, 200, 35)

        ctx.fillStyle = '#000000'
        ctx.font = 'bold 16px sans-serif'
        ctx.textAlign = 'left'
        ctx.fillText('NUEVO ARTÍCULO', 75, 1403)

        const boxX = 60
        const boxY = 1430
        const boxW = 960
        const boxH = 260

        ctx.fillStyle = 'rgba(0, 0, 0, 0.9)'
        ctx.fillRect(boxX, boxY, boxW, boxH)

        ctx.fillStyle = '#ff007f'
        ctx.fillRect(boxX, boxY, 16, boxH)

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

        // Banner "LEE MÁS EN LA WEB"
        ctx.fillStyle = '#ff007f'
        ctx.fillRect(boxX, 1710, boxW, 60)

        ctx.fillStyle = '#000000'
        ctx.font = 'bold 22px sans-serif'
        ctx.fillText('LEE MÁS EN LA WEB', boxX + 30, 1747)
        ctx.textAlign = 'right'
        ctx.fillText('→', boxX + boxW - 30, 1747)
      }

      // Iniciar grabación
      mediaRecorder.start()
      await video.play()

      const duration = video.duration || 5
      const startTime = Date.now()

      const renderLoop = () => {
        const elapsed = (Date.now() - startTime) / 1000
        const progress = Math.min(Math.round((elapsed / duration) * 100), 100)
        setRecordingProgress(progress)

        drawFrame()

        if (elapsed < duration && !video.ended) {
          requestAnimationFrame(renderLoop)
        } else {
          video.pause()
          mediaRecorder.stop()
        }
      }

      requestAnimationFrame(renderLoop)
    } catch (err) {
      console.error('Error procesando el vídeo:', err)
      alert('Hubo un problema al procesar el vídeo.')
      setIsExporting(false)
    }
  }
