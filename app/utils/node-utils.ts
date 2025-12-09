import { MessageSquare, Play, Type, type LucideIcon } from "lucide-react"
import type { NodeType, NodeData, StartNodeData, MessageNodeData, TextInputNodeData } from "@/types/node.types"

export function getNodeIcon(nodeType: NodeType): LucideIcon {
  switch (nodeType) {
    case "start":
      return Play
    case "message":
      return MessageSquare
    case "textInput":
      return Type
    default:
      return MessageSquare
  }
}

export function getNodeTitle(nodeType: NodeType): string {
  switch (nodeType) {
    case "start":
      return "nodes.start.title"
    case "message":
      return "nodes.message.title"
    case "textInput":
      return "nodes.textInput.title"
    default:
      return "Unknown Node"
  }
}

export function getDefaultNodeData(nodeType: NodeType): NodeData {
  switch (nodeType) {
    case "start":
      return {
        message: "Welcome! Let's get started.",
      } as StartNodeData
    case "message":
      return {
        message: "Hello! This is a message.",
        delay: 1000,
      } as MessageNodeData
    case "textInput":
      return {
        message: "Please enter your response:",
        placeholder: "Type your answer here...",
        variableName: `input_${Date.now()}`,
        required: true,
      } as TextInputNodeData
    default:
      return { message: "" } as MessageNodeData
  }
}

export function validateNodeData(nodeType: NodeType, data: NodeData): string[] {
  const errors: string[] = []

  switch (nodeType) {
    case "start":
    case "message":
      if (!data.message?.trim()) {
        errors.push("Message is required")
      }
      break
    case "textInput":
      const textInputData = data as TextInputNodeData
      if (!textInputData.message?.trim()) {
        errors.push("Message is required")
      }
      if (!textInputData.variableName?.trim()) {
        errors.push("Variable name is required")
      }
      if (textInputData.minLength !== undefined && textInputData.minLength < 0) {
        errors.push("Minimum length cannot be negative")
      }
      if (textInputData.maxLength !== undefined && textInputData.maxLength < 0) {
        errors.push("Maximum length cannot be negative")
      }
      if (
        textInputData.minLength !== undefined &&
        textInputData.maxLength !== undefined &&
        textInputData.minLength > textInputData.maxLength
      ) {
        errors.push("Minimum length cannot be greater than maximum length")
      }
      break
  }

  return errors
}
