"use client"

import { useMemo } from "react"
import { useFlowStore, useFlowStoreApi } from "@/contexts/flow-context"
import type { CustomNode } from "@/types/node.types"

/**
 * Performance-optimized hook to get selected nodes.
 * Only re-renders when the selection changes, not when nodes are dragged or modified.
 *
 * @returns Array of selected nodes
 */
export function useSelectedNodes(): CustomNode[] {
  const storeApi = useFlowStoreApi()
  const selectedNodeIds = useFlowStore((state) => state.selectedNodeIds)

  // Compute selected nodes when selectedNodeIds change
  const selectedNodes = useMemo(() => {
    if (selectedNodeIds.size === 0) return []

    // Get current nodes from store without subscribing
    const currentState = storeApi.getState()
    return Array.from(selectedNodeIds)
      .map((id) => currentState.nodes.find((node) => node.id === id))
      .filter((node): node is CustomNode => node !== undefined)
  }, [selectedNodeIds, storeApi])

  return selectedNodes
}

/**
 * Performance-optimized hook to get selected edges.
 * Only re-renders when the selection changes, not when edges are dragged or modified.
 *
 * @returns Array of selected edges
 */
export function useSelectedEdges() {
  const storeApi = useFlowStoreApi()
  const selectedEdgeIds = useFlowStore((state) => state.selectedEdgeIds)

  // Compute selected edges when selectedEdgeIds change
  const selectedEdges = useMemo(() => {
    if (selectedEdgeIds.size === 0) return []

    // Get current edges from store without subscribing
    const currentState = storeApi.getState()
    return Array.from(selectedEdgeIds)
      .map((id) => currentState.edges.find((edge) => edge.id === id))
      .filter((edge) => edge !== undefined)
  }, [selectedEdgeIds, storeApi])

  return selectedEdges
}
