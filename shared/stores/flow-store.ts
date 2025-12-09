import { createStore } from "zustand/vanilla"
import { applyNodeChanges, applyEdgeChanges, addEdge } from "@xyflow/react"
import type { FlowStore, Flow } from "@/types/flow.types"
import type { CustomNode } from "@/types/node.types"

export const createFlowStore = (initialFlow?: Flow) => {
  return createStore<FlowStore>((set, get) => ({
    // Initial state
    flowId: initialFlow?.id || null,
    flowName: initialFlow?.name || "Untitled Flow",
    nodes: initialFlow?.nodes || [],
    edges: initialFlow?.edges || [],
    createdAt: initialFlow?.createdAt || new Date(),
    updatedAt: initialFlow?.updatedAt || new Date(),

    selectedNodeIds: new Set(initialFlow?.nodes?.filter((node) => node.selected)?.map((node) => node.id) || []),
    selectedEdgeIds: new Set(initialFlow?.edges?.filter((edge) => edge.selected)?.map((edge) => edge.id) || []),

    ui: {
      sidebar: {
        isVisible: true,
        activePanel: "available-nodes",
      },
    },

    isSaving: false,
    lastSavedAt: initialFlow?.updatedAt || null,

    // Node actions
    addNode: (node: CustomNode) => {
      set((state) => ({
        nodes: [...state.nodes, node],
      }))
    },

    updateNode: (nodeId: string, updates: Partial<CustomNode>) => {
      set((state) => ({
        nodes: state.nodes.map((node) => (node.id === nodeId ? { ...node, ...updates } : node)),
      }))
    },

    deleteNode: (nodeId: string) => {
      set((state) => ({
        nodes: state.nodes.filter((node) => node.id !== nodeId),
        edges: state.edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId),
        selectedNodeIds: new Set(Array.from(state.selectedNodeIds).filter((id) => id !== nodeId)),
      }))
    },

    // React Flow handlers
    onNodesChange: (changes) => {
      set((state) => {
        const updatedNodes = applyNodeChanges(changes, state.nodes)

        // Update selection state based on node changes
        const newSelectedNodeIds = new Set<string>()
        updatedNodes.forEach((node) => {
          if (node.selected) {
            newSelectedNodeIds.add(node.id)
          }
        })

        return {
          nodes: updatedNodes,
          selectedNodeIds: newSelectedNodeIds,
        }
      })
    },

    onEdgesChange: (changes) => {
      set((state) => {
        const updatedEdges = applyEdgeChanges(changes, state.edges)

        // Update selection state based on edge changes
        const newSelectedEdgeIds = new Set<string>()
        updatedEdges.forEach((edge) => {
          if (edge.selected) {
            newSelectedEdgeIds.add(edge.id)
          }
        })

        return {
          edges: updatedEdges,
          selectedEdgeIds: newSelectedEdgeIds,
        }
      })
    },

    onConnect: (connection) => {
      set((state) => ({
        edges: addEdge(connection, state.edges),
      }))
    },

    // Selection actions
    setSelectedNodes: (nodeIds: string[]) => {
      set((state) => ({
        selectedNodeIds: new Set(nodeIds),
        nodes: state.nodes.map((node) => ({
          ...node,
          selected: nodeIds.includes(node.id),
        })),
      }))
    },

    setSelectedEdges: (edgeIds: string[]) => {
      set((state) => ({
        selectedEdgeIds: new Set(edgeIds),
        edges: state.edges.map((edge) => ({
          ...edge,
          selected: edgeIds.includes(edge.id),
        })),
      }))
    },

    // UI actions
    setSidebarVisible: (visible: boolean) => {
      set((state) => ({
        ui: {
          ...state.ui,
          sidebar: {
            ...state.ui.sidebar,
            isVisible: visible,
          },
        },
      }))
    },

    setSidebarActivePanel: (panel) => {
      set((state) => ({
        ui: {
          ...state.ui,
          sidebar: {
            ...state.ui.sidebar,
            activePanel: panel,
            isVisible: true, // Auto-open sidebar when switching panels
          },
        },
      }))
    },

    // Save actions
    setSaving: (saving: boolean) => {
      set({ isSaving: saving })
    },

    setLastSavedAt: (date: Date) => {
      set({ lastSavedAt: date })
    },
  }))
}
