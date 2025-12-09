"use client"

import type React from "react"

import { useCallback } from "react"
import { useReactFlow } from "@xyflow/react"
import { useFlowStore } from "@/contexts/flow-context"
import type { NodeType, CustomNode } from "@/types/node.types"
import { getDefaultNodeData } from "@/utils/node-utils"

export function useNodeDragDrop() {
  const reactFlowInstance = useReactFlow()
  const addNode = useFlowStore((state) => state.addNode)
  const nodes = useFlowStore((state) => state.nodes)

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = "move"
  }, [])

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()

      const nodeType = event.dataTransfer.getData("application/reactflow") as NodeType

      // Validate that we have a valid node type
      if (typeof nodeType !== "string" || !nodeType) {
        return
      }

      // Convert screen coordinates to flow coordinates
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      })

      // Add some spacing if there are existing nodes nearby
      const spacing = 50
      const finalPosition = { ...position }

      // Check if there's a node too close to the drop position
      const isPositionOccupied = nodes.some((node) => {
        const distance = Math.sqrt(
          Math.pow(node.position.x - position.x, 2) + Math.pow(node.position.y - position.y, 2),
        )
        return distance < 100 // If within 100px, consider it occupied
      })

      // If position is occupied, offset it
      if (isPositionOccupied) {
        finalPosition.x += spacing
        finalPosition.y += spacing
      }

      // Add the new node
      addNode({
        id: `${nodeType}_${Date.now()}`,
        type: nodeType,
        position: finalPosition,
        data: getDefaultNodeData(nodeType),
      } as CustomNode)
    },
    [reactFlowInstance, addNode, nodes],
  )

  return {
    onDragOver,
    onDrop,
  }
}
