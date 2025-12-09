import { createStore } from "zustand/vanilla"
import type { SimulationStore } from "@/types/simulation.types"
import type { CustomNode } from "@/types/node.types"
import type { Edge } from "@xyflow/react"

export const createSimulationStore = (nodes: CustomNode[], edges: Edge[]) => {
  return createStore<SimulationStore>((set, get) => ({
    // State
    status: "idle",
    chatHistory: [],
    debugMessages: [],
    currentNodeId: null,
    error: null,
    variables: {},

    // Actions
    startSimulation: () => {
      set({
        status: "running",
        error: null,
        chatHistory: [],
        debugMessages: [],
        variables: {},
      })

      // Find the start node
      const startNode = nodes.find((node) => node.type === "start")
      if (!startNode) {
        set({
          status: "error",
          error: "No start node found in the flow",
        })
        return
      }

      // Set current node to start node
      set({ currentNodeId: startNode.id })

      // Add welcome message
      get().addChatMessage({
        type: "bot",
        content: startNode.data.message || "Welcome to the simulation!",
        nodeId: startNode.id,
      })

      get().addDebugMessage({
        level: "info",
        content: "Simulation started",
        nodeId: startNode.id,
      })

      // Continue from start node after a short delay
      setTimeout(() => {
        get().continueFromNode(startNode.id)
      }, 500)
    },

    stopSimulation: () => {
      set({
        status: "idle",
        currentNodeId: null,
        error: null,
        chatHistory: [],
        debugMessages: [],
        variables: {},
      })
    },

    submitInput: (input: string) => {
      const { currentNodeId } = get()
      if (!currentNodeId) return

      const currentNode = nodes.find((node) => node.id === currentNodeId)
      if (!currentNode || currentNode.type !== "textInput") return

      // Add user message
      get().addChatMessage({
        type: "user",
        content: input,
        nodeId: currentNodeId,
      })

      // Store the variable
      const variableName = currentNode.data.variableName || "input"
      set((state) => ({
        variables: {
          ...state.variables,
          [variableName]: input,
        },
      }))

      get().addDebugMessage({
        level: "info",
        content: `Variable "${variableName}" set to: ${input}`,
        nodeId: currentNodeId,
      })

      // Set status to running and continue
      set({ status: "running" })
      setTimeout(() => {
        get().continueFromNode(currentNodeId)
      }, 500)
    },

    continueFromNode: (nodeId: string) => {
      // Find all edges that start from this node
      const outgoingEdges = edges.filter((edge) => edge.source === nodeId)

      get().addDebugMessage({
        level: "info",
        content: `Looking for next nodes from ${nodeId}. Found ${outgoingEdges.length} outgoing edges.`,
        nodeId: nodeId,
      })

      if (outgoingEdges.length > 0) {
        // For now, take the first edge (in the future we could handle multiple paths)
        const nextEdge = outgoingEdges[0]
        const nextNode = nodes.find((node) => node.id === nextEdge.target)

        if (nextNode) {
          set({ currentNodeId: nextNode.id })

          get().addDebugMessage({
            level: "info",
            content: `Moving to next node: ${nextNode.id} (type: ${nextNode.type})`,
            nodeId: nextNode.id,
          })

          if (nextNode.type === "textInput") {
            // Show the question and wait for input
            get().addChatMessage({
              type: "bot",
              content: nextNode.data.message || "Please provide your input:",
              nodeId: nextNode.id,
            })
            set({
              status: "waiting-for-input",
            })
          } else if (nextNode.type === "message") {
            // Show the message and continue
            get().addChatMessage({
              type: "bot",
              content: nextNode.data.message || "Message",
              nodeId: nextNode.id,
            })
            // Continue to next node after a delay
            const delay = nextNode.data.delay || 1000
            setTimeout(() => {
              get().continueFromNode(nextNode.id)
            }, delay)
          } else if (nextNode.type === "start") {
            // Handle start node (shouldn't normally happen in flow, but just in case)
            get().addChatMessage({
              type: "bot",
              content: nextNode.data.message || "Welcome!",
              nodeId: nextNode.id,
            })
            setTimeout(() => {
              get().continueFromNode(nextNode.id)
            }, 500)
          }
        } else {
          get().addDebugMessage({
            level: "error",
            content: `Next node with ID ${nextEdge.target} not found`,
            nodeId: nodeId,
          })
          set({
            status: "error",
            error: `Next node with ID ${nextEdge.target} not found`,
          })
        }
      } else {
        // No more nodes, simulation complete
        get().addChatMessage({
          type: "system",
          content: "Simulation completed! Thank you for your responses.",
        })
        set({ status: "completed", currentNodeId: null })
        get().addDebugMessage({
          level: "info",
          content: "Simulation completed - no more outgoing edges found",
          nodeId: nodeId,
        })
      }
    },

    addChatMessage: (message) => {
      const newMessage = {
        ...message,
        id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
        timestamp: new Date(),
      }
      set((state) => ({
        chatHistory: [...state.chatHistory, newMessage],
      }))
    },

    addDebugMessage: (message) => {
      const newMessage = {
        ...message,
        id: `debug-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
        timestamp: new Date(),
      }
      set((state) => ({
        debugMessages: [...state.debugMessages, newMessage],
      }))
    },

    clearError: () => {
      set({ error: null })
    },
  }))
}
