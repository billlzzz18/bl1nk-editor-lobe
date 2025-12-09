"use client"

import { useEffect, useState } from "react"

export function useCanvasPanning() {
  const [panOnDrag, setPanOnDrag] = useState(false)
  const [isMiddlePanning, setIsMiddlePanning] = useState(false)
  const [origin, setOrigin] = useState<{ x: number; y: number } | null>(null)
  const [delta, setDelta] = useState<{ x: number; y: number }>({ x: 0, y: 0 })

  useEffect(() => {
    const pane = document.querySelector(".react-flow__pane") as HTMLElement | null
    if (pane) {
      pane.style.cursor = isMiddlePanning ? "grabbing" : ""
    }
    return () => {
      if (pane) pane.style.cursor = ""
    }
  }, [isMiddlePanning])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        setPanOnDrag(true)
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        setPanOnDrag(false)
      }
    }

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 1) {
        setIsMiddlePanning(true)
        setOrigin({ x: e.clientX, y: e.clientY })
        e.preventDefault()
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (isMiddlePanning && origin) {
        setDelta({
          x: e.clientX - origin.x,
          y: e.clientY - origin.y,
        })
        setOrigin({ x: e.clientX, y: e.clientY })
      }
    }

    const handleMouseUp = (e: MouseEvent) => {
      if (e.button === 1) {
        setIsMiddlePanning(false)
        setOrigin(null)
        setDelta({ x: 0, y: 0 })
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)
    window.addEventListener("mousedown", handleMouseDown)
    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", handleMouseUp)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
      window.removeEventListener("mousedown", handleMouseDown)
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isMiddlePanning, origin])

  return {
    panOnDrag,
    isMiddlePanning,
    delta,
  }
}
