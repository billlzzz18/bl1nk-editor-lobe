import type { Node, NodeProps } from "@xyflow/react"

export type NodeType = "start" | "message" | "textInput"

export interface BaseNodeData {
  label?: string
}

export interface StartNodeData extends BaseNodeData {
  message: string
}

export interface MessageNodeData extends BaseNodeData {
  message: string
  delay?: number
}

export interface TextInputNodeData extends BaseNodeData {
  message: string
  placeholder?: string
  variableName: string
  required?: boolean
  minLength?: number
  maxLength?: number
}

export type NodeData = StartNodeData | MessageNodeData | TextInputNodeData

export interface CustomNode extends Node {
  type: NodeType
  data: NodeData
}

export type StartNodeProps = NodeProps<StartNodeData>
export type MessageNodeProps = NodeProps<MessageNodeData>
export type TextInputNodeProps = NodeProps<TextInputNodeData>
