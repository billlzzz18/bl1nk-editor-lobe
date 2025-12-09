"use client"

import { useFlowStore } from "@/contexts/flow-context"
import type { CustomNode } from "@/types/node.types"
import { useMemo } from "react"

/**
 * Performance-optimized hook to get node data by ID.
 * Only re-renders when the node's data changes, not when position or other properties change.
 *
 * @param nodeId - The ID of the node to get data for
 * @returns The node with only relevant properties, or undefined if not found
 */
export function useNodeDataById<T extends CustomNode = CustomNode>(nodeId: string | undefined): T | undefined {
  const nodes = useFlowStore((state) => state.nodes)

  return useMemo(() => {
    if (!nodeId) return undefined

    const node = nodes.find((n) => n.id === nodeId) as T | undefined
    if (!node) return undefined

    // Return a new object with only the properties that matter for the properties editor
    // This prevents re-renders when position, selected, etc. change
    return {
      id: node.id,
      type: node.type,
      data: node.data,
    } as T
  }, [nodeId, nodes])
}
