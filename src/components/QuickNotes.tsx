'use client'

import { useEffect, useRef, useState } from 'react'

interface Point {
  x: number
  y: number
}

export default function QuickNotes() {
  const [isDrawing, setIsDrawing] = useState(false)
  const [notes, setNotes] = useState('')
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const contextRef = useRef<CanvasRenderingContext2D | null>(null)
  const [mode, setMode] = useState<'text' | 'draw'>('text')

  // 初始化 Canvas 和加载保存的数据
  useEffect(() => {
    const savedNotes = localStorage.getItem('quickNotes')
    if (savedNotes) setNotes(savedNotes)

    const canvas = canvasRef.current
    if (!canvas) return

    // 设置 Canvas 尺寸
    canvas.width = canvas.offsetWidth * 2
    canvas.height = canvas.offsetHeight * 2
    canvas.style.width = `${canvas.offsetWidth}px`
    canvas.style.height = `${canvas.offsetHeight}px`

    const context = canvas.getContext('2d')
    if (!context) return

    context.scale(2, 2)
    context.lineCap = 'round'
    context.strokeStyle = '#000'
    context.lineWidth = 2
    contextRef.current = context

    // 加载保存的画布数据
    const savedDrawing = localStorage.getItem('canvasDrawing')
    if (savedDrawing) {
      const img = new Image()
      img.onload = () => {
        context.drawImage(img, 0, 0)
      }
      img.src = savedDrawing
    }
  }, [])

  // 保存笔记
  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newNotes = e.target.value
    setNotes(newNotes)
    localStorage.setItem('quickNotes', newNotes)
  }

  // 画图相关函数
  const startDrawing = ({ nativeEvent }: React.MouseEvent) => {
    if (mode !== 'draw') return
    const { offsetX, offsetY } = nativeEvent
    contextRef.current?.beginPath()
    contextRef.current?.moveTo(offsetX, offsetY)
    setIsDrawing(true)
  }

  const draw = ({ nativeEvent }: React.MouseEvent) => {
    if (!isDrawing || mode !== 'draw') return
    const { offsetX, offsetY } = nativeEvent
    contextRef.current?.lineTo(offsetX, offsetY)
    contextRef.current?.stroke()
  }

  const stopDrawing = () => {
    if (!isDrawing) return
    contextRef.current?.closePath()
    setIsDrawing(false)
    // 保存画布数据
    const canvas = canvasRef.current
    if (canvas) {
      localStorage.setItem('canvasDrawing', canvas.toDataURL())
    }
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    const context = contextRef.current
    if (!canvas || !context) return
    context.clearRect(0, 0, canvas.width, canvas.height)
    localStorage.removeItem('canvasDrawing')
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Quick Notes</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setMode('text')}
            className={`px-3 py-1 rounded ${
              mode === 'text' ? 'bg-black text-white' : 'bg-white/50'
            }`}
          >
            Text
          </button>
          <button
            onClick={() => setMode('draw')}
            className={`px-3 py-1 rounded ${
              mode === 'draw' ? 'bg-black text-white' : 'bg-white/50'
            }`}
          >
            Draw
          </button>
          {mode === 'draw' && (
            <button
              onClick={clearCanvas}
              className="px-3 py-1 rounded bg-red-500 text-white"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="relative flex-1 bg-white/30 rounded-lg overflow-hidden">
        {mode === 'text' ? (
          <textarea
            value={notes}
            onChange={handleNotesChange}
            className="w-full h-full p-4 bg-transparent resize-none focus:outline-none"
            placeholder="Type your notes here..."
          />
        ) : (
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            className="absolute inset-0 w-full h-full cursor-crosshair"
          />
        )}
      </div>
    </div>
  )
}