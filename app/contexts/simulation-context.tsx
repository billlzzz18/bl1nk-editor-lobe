"use client"

import { createContext, useContext, useRef, type ReactNode } from "react"
import { useStore } from "zustand"
import { createSimulationStore } from "@/stores/simulation-store"
import type { SimulationStore } from "@/types/simulation.types"
import { useFlowStore } from "./flow-context"

type SimulationStoreApi = ReturnType<typeof createSimulationStore>

const SimulationStoreContext = createContext<SimulationStoreApi | null>(null)

interface SimulationProviderProps {
  children: ReactNode
}

export function SimulationProvider({ children }: SimulationProviderProps) {
  const nodes = useFlowStore((state) => state.nodes)
  const edges = useFlowStore((state) => state.edges)
  const storeRef = useRef<SimulationStoreApi | undefined>(undefined)

  if (!storeRef.current) {
    storeRef.current = createSimulationStore(nodes, edges)
  }

  return <SimulationStoreContext.Provider value={storeRef.current}>{children}</SimulationStoreContext.Provider>
}

export function useSimulationStore<T>(selector: (store: SimulationStore) => T): T {
  const simulationStoreContext = useContext(SimulationStoreContext)

  if (!simulationStoreContext) {
    throw new Error("useSimulationStore must be used within a SimulationProvider")
  }

  return useStore(simulationStoreContext, selector)
}
