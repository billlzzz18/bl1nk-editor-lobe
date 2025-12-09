"use client"

import type React from "react"

import { memo } from "react"
import { MessageSquare, Play, Type } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { NodeType } from "@/types/node.types"

interface NodeTypeItem {
  type: NodeType
  label: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  color: string
}

const nodeTypes: NodeTypeItem[] = [
  {
    type: "start",
    label: "Start",
    description: "Begin the conversation",
    icon: Play,
    color: "text-green-600 dark:text-green-400",
  },
  {
    type: "message",
    label: "Message",
    description: "Send a message to the user",
    icon: MessageSquare,
    color: "text-blue-600 dark:text-blue-400",
  },
  {
    type: "textInput",
    label: "Text Input",
    description: "Collect text input from user",
    icon: Type,
    color: "text-purple-600 dark:text-purple-400",
  },
]

const AvailableNodesPanel = memo(function AvailableNodesPanel() {
  const handleDragStart = (event: React.DragEvent, nodeType: NodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType)
    event.dataTransfer.effectAllowed = "move"
  }

  return (
    <div className="space-y-3">
      <div className="text-sm text-muted-foreground">Drag nodes onto the canvas to add them to your flow</div>

      <div className="space-y-2">
        {nodeTypes.map((nodeType) => {
          const Icon = nodeType.icon

          return (
            <Button
              key={nodeType.type}
              variant="outline"
              className="w-full h-auto p-3 justify-start cursor-grab active:cursor-grabbing bg-transparent"
              draggable
              onDragStart={(e) => handleDragStart(e, nodeType.type)}
            >
              <div className="flex items-start gap-3 w-full">
                <Icon className={cn("size-5 mt-0.5 shrink-0", nodeType.color)} />
                <div className="text-left">
                  <div className="font-medium text-sm">{nodeType.label}</div>
                  <div className="text-xs text-muted-foreground">{nodeType.description}</div>
                </div>
              </div>
            </Button>
          )
        })}
      </div>
    </div>
  )
})

export default AvailableNodesPanel
