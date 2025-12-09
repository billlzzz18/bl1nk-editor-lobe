export type SimulationStatus = "idle" | "running" | "waiting-for-input" | "completed" | "error"

export interface ChatMessage {
  id: string
  type: "user" | "bot" | "system" | "error"
  content: string
  nodeId?: string
  timestamp: Date
}

export interface DebugMessage {
  id: string
  level: "info" | "warning" | "error"
  content: string
  nodeId?: string
  timestamp: Date
  metadata?: Record<string, unknown>
}

export interface SimulationState {
  status: SimulationStatus
  chatHistory: ChatMessage[]
  debugMessages: DebugMessage[]
  currentNodeId: string | null
  error: string | null
  variables: Record<string, unknown>
}

export interface SimulationActions {
  startSimulation: () => void
  stopSimulation: () => void
  submitInput: (input: string) => void
  addChatMessage: (message: Omit<ChatMessage, "id" | "timestamp">) => void
  addDebugMessage: (message: Omit<DebugMessage, "id" | "timestamp">) => void
  clearError: () => void
}

export type SimulationStore = SimulationState & SimulationActions
