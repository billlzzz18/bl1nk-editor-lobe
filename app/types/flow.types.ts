import type { Edge, Connection } from "@xyflow/react"
import type { CustomNode } from "./node.types"

export type ActivePanel = "available-nodes" | "node-properties" | "simulation" | "variables"

export interface Flow {
  id: string
  name: string
  nodes: CustomNode[]
  edges: Edge[]
  createdAt: Date
  updatedAt: Date
}

export interface FlowStore {
  // Flow data
  flowId: string | null
  flowName: string
  nodes: CustomNode[]
  edges: Edge[]
  createdAt: Date
  updatedAt: Date

  // Selection state
  selectedNodeIds: Set<string>
  selectedEdgeIds: Set<string>

  // UI state
  ui: {
    sidebar: {
      isVisible: boolean
      activePanel: ActivePanel
    }
  }

  // Save state
  isSaving: boolean
  lastSavedAt: Date | null

  // Actions
  addNode: (node: CustomNode) => void
  updateNode: (nodeId: string, updates: Partial<CustomNode>) => void
  deleteNode: (nodeId: string) => void
  onNodesChange: (changes: any[]) => void
  onEdgesChange: (changes: any[]) => void
  onConnect: (connection: Connection) => void

  // Selection actions
  setSelectedNodes: (nodeIds: string[]) => void
  setSelectedEdges: (edgeIds: string[]) => void

  // UI actions
  setSidebarVisible: (visible: boolean) => void
  setSidebarActivePanel: (panel: ActivePanel) => void

  // Save actions
  setSaving: (saving: boolean) => void
  setLastSavedAt: (date: Date) => void
}

export type FlowStoreApi = ReturnType<typeof import("../stores/flow-store").createFlowStore>
