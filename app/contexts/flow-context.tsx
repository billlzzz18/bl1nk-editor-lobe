"use client"

import { createContext, useContext, useRef, useEffect, type ReactNode } from "react"
import { useStore } from "zustand"
import { createFlowStore } from "@/stores/flow-store"
import type { FlowStore, FlowStoreApi, Flow } from "@/types/flow.types"

interface FlowProviderProps {
  children: ReactNode
  initialFlow?: Flow
}

const FlowStoreContext = createContext<FlowStoreApi | null>(null)

export function FlowProvider({ children, initialFlow }: FlowProviderProps) {
  const storeRef = useRef<FlowStoreApi | undefined>(undefined)

  if (!storeRef.current) {
    storeRef.current = createFlowStore(initialFlow)
  }

  // Update store when initialFlow changes (e.g., when flow content is loaded)
  useEffect(() => {
    if (initialFlow && storeRef.current) {
      const currentState = storeRef.current.getState()
      // Only update if the flow data has actually changed
      if (
        initialFlow.nodes.length !== currentState.nodes.length ||
        initialFlow.edges.length !== currentState.edges.length ||
        initialFlow.id !== currentState.flowId ||
        initialFlow.name !== currentState.flowName
      ) {
        storeRef.current.setState({
          nodes: initialFlow.nodes,
          edges: initialFlow.edges,
          selectedNodeIds: new Set(initialFlow.nodes.filter((node) => node.selected).map((node) => node.id)),
          selectedEdgeIds: new Set(initialFlow.edges.filter((edge) => edge.selected).map((edge) => edge.id)),
          flowId: initialFlow.id,
          flowName: initialFlow.name,
          createdAt: initialFlow.createdAt,
          updatedAt: initialFlow.updatedAt,
        })
      }
    }
  }, [initialFlow])

  return <FlowStoreContext.Provider value={storeRef.current}>{children}</FlowStoreContext.Provider>
}

export function useFlowStore<T>(selector: (store: FlowStore) => T): T {
  const flowStoreContext = useContext(FlowStoreContext)

  if (!flowStoreContext) {
    throw new Error("useFlowStore must be used within a FlowProvider")
  }

  return useStore(flowStoreContext, selector)
}

export function useFlowStoreApi() {
  const flowStoreContext = useContext(FlowStoreContext)

  if (!flowStoreContext) {
    throw new Error("useFlowStoreApi must be used within a FlowProvider")
  }

  return flowStoreContext
}
