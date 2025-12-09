"use client"

import { useFlowStore } from "@/contexts/flow-context"
import { useEffect } from "react"

export function useSidebarShortcuts() {
  const setActivePanel = useFlowStore((state) => state.setSidebarActivePanel)
  const isVisible = useFlowStore((state) => state.ui.sidebar.isVisible)
  const setIsVisible = useFlowStore((state) => state.setSidebarVisible)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check if cmd/ctrl key is pressed
      if (!(event.metaKey || event.ctrlKey)) return

      // Don't trigger shortcuts when user is typing in inputs, textareas, or contenteditable elements
      const target = event.target as HTMLElement
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.contentEditable === "true" ||
        target.closest('[contenteditable="true"]') ||
        target.closest('[role="textbox"]')
      ) {
        return
      }

      switch (event.key) {
        case "1":
          event.preventDefault()
          setActivePanel("available-nodes")
          break
        case "2":
          event.preventDefault()
          setActivePanel("node-properties")
          break
        case "3":
          event.preventDefault()
          setActivePanel("simulation")
          break
        case "4":
          event.preventDefault()
          setActivePanel("variables")
          break
        case "b":
        case "B":
          event.preventDefault()
          setIsVisible(!isVisible)
          break
        case "Escape":
          event.preventDefault()
          window.location.reload()
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isVisible, setActivePanel, setIsVisible])
}
