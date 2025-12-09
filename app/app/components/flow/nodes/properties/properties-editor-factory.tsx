"use client"

import { useNodeDataById } from "@/hooks/use-node-data-by-id"
import StartNodePropertiesEditor from "./start-node-properties-editor"
import MessageNodePropertiesEditor from "./message-node-properties-editor"
import TextInputNodePropertiesEditor from "./text-input-node-properties-editor"
import type { CustomNode } from "@/types/node.types"

interface PropertiesEditorFactoryProps {
  nodeId: string
  onUpdate: (updates: Partial<CustomNode>) => void
}

export default function PropertiesEditorFactory({ nodeId, onUpdate }: PropertiesEditorFactoryProps) {
  const node = useNodeDataById(nodeId)

  if (!node) {
    return <div className="text-muted-foreground text-sm">Node not found</div>
  }

  switch (node.type) {
    case "start":
      return <StartNodePropertiesEditor node={node} onUpdate={onUpdate} />
    case "message":
      return <MessageNodePropertiesEditor node={node} onUpdate={onUpdate} />
    case "textInput":
      return <TextInputNodePropertiesEditor node={node} onUpdate={onUpdate} />
    default:
      return <div className="text-muted-foreground text-sm">Unknown node type: {node.type}</div>
  }
}
