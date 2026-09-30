// DESCARGA EN FOTO (JPG)
  const downloadAsImage = async () => {
    if (typeof window === 'undefined') return
    setIsExporting(true)

    try {
      const canvas = document.createElement('canvas')
      canvas.width = 1080
      canvas.height = 1920
      const ctx = canvas.getContext('2d')
      if (!ctx) throw new Error('No se pudo inicializar canvas')

      ctx.fillStyle = '#000000'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

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

      drawOverlay(ctx, canvas.width, canvas.height)

      const dataUrl = canvas.toDataURL('image/jpeg', 0.95)
      const link = document.createElement('a')
      link.download = `story-${category.toLowerCase()}-${Date.now()}.jpg`
      link.href = dataUrl
      link.click()
    } catch (err) {
      console.error('Error generando foto:', err)
      alert('Hubo un error al generar la foto.')
    } finally {
      setIsExporting(false)
    }
  }

  // DESCARGA EN VÍDEO (WebM / MP4 unificado)
  const downloadAsVideo = async () => {
    if (typeof window === 'undefined' || !videoRef.current) return

    setIsExporting(true)
    setRecordingProgress(0)

    try {
      const video = videoRef.current
      const canvas = document.createElement('canvas')
      canvas.width = 1080
      canvas.height = 1920
      const ctx = canvas.getContext('2d')
      if (!ctx) throw new Error('No se pudo obtener el contexto del canvas')

      // Preparamos el vídeo para asegurarse de que reproduce sin ser bloqueado
      video.currentTime = 0
      video.muted = true

      try {
        await video.play()
      } catch (playErr) {
        console.warn('Iniciando reproducción para grabación:', playErr)
      }

      // Detectar formato compatible con el navegador
      let mimeType = 'video/webm'
      if (typeof MediaRecorder !== 'undefined') {
        if (MediaRecorder.isTypeSupported('video/mp4;codecs=h264')) {
          mimeType = 'video/mp4;codecs=h264'
        } else if (MediaRecorder.isTypeSupported('video/mp4')) {
          mimeType = 'video/mp4'
        } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
          mimeType = 'video/webm;codecs=vp9'
        }
      }

      const stream = canvas.captureStream(30) // 30 FPS
      const recorder = new MediaRecorder(stream, { mimeType })
      const chunks: Blob[] = []

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunks.push(e.data)
      }

      recorder.onstop = () => {
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

      recorder.start()

      const duration = video.duration && !isNaN(video.duration) && video.duration > 0 
        ? video.duration 
        : 5 // Si no detecta duración, graba 5 segundos por defecto
      
      const startTime = Date.now()

      const renderFrame = () => {
        const elapsed = (Date.now() - startTime) / 1000
        const progress = Math.min(Math.round((elapsed / duration) * 100), 100)
        setRecordingProgress(progress)

        // Limpiar fondo
        ctx.fillStyle = '#000000'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Dibujar frame actual del vídeo
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

        // Aplicar la plantilla/diseño encima
        drawOverlay(ctx, canvas.width, canvas.height)

        if (elapsed < duration && !video.ended) {
          requestAnimationFrame(renderFrame)
        } else {
          if (recorder.state !== 'inactive') {
            recorder.stop()
          }
        }
      }

      renderFrame()
    } catch (err) {
      console.error('Error procesando el vídeo:', err)
      alert('No se pudo descargar el vídeo. Comprueba que el formato de vídeo sea compatible.')
      setIsExporting(false)
    }
  }
