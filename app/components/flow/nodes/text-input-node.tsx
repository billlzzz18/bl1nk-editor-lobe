"use client"

import { memo } from "react"
import { Position } from "@xyflow/react"
import type { TextInputNodeProps } from "@/types/node.types"
import { BaseNode, BaseNodeHeader, BaseNodeHeaderTitle, BaseNodeContent } from "@/components/flow/nodes/base-node"
import { BaseHandle } from "@/components/flow/handles/base-handle"
import { getNodeIcon } from "@/utils/node-utils"
import MessageEditor from "@/components/flow/nodes/properties/shared/message-editor"
import { useFlowStore } from "@/contexts/flow-context"
import { cn } from "@/lib/utils"
import { NodeStatusIndicator } from "@/components/ui/node-status-indicator"
import { useSimulationStore } from "@/contexts/simulation-context"

const TextInputNode = memo(function TextInputNode({ id, data, selected }: TextInputNodeProps) {
  const { message, placeholder, variableName, required, minLength, maxLength } = data
  const setActiveSidebarPanel = useFlowStore((state) => state.setSidebarActivePanel)
  const currentSimulationNode = useSimulationStore((state) => state.currentNodeId)
  const simulationStatus = useSimulationStore((state) => state.status)

  // Only show loading if simulation is running AND this is the current node
  const isActiveInSimulation = simulationStatus !== "idle" && currentSimulationNode === id

  const Icon = getNodeIcon("textInput")
  const nodeTitle = "Text Input"

  const handleDoubleClick = () => {
    setActiveSidebarPanel("node-properties")
  }

  return (
    <NodeStatusIndicator status={isActiveInSimulation ? "loading" : "initial"} variant="border">
      <BaseNode className="w-[300px]" data-selected={selected} onDoubleClick={handleDoubleClick}>
        <BaseNodeHeader>
          <Icon className="size-4" />
          <BaseNodeHeaderTitle>{nodeTitle}</BaseNodeHeaderTitle>
        </BaseNodeHeader>

        <BaseNodeContent>
          <div className="space-y-2">
            <div className="py-2 text-muted-foreground border-b border-dashed">
              <span className="font-medium text-sm">Message:</span>
              <div className={cn("bg-accent py-1 px-2 rounded mt-1", message ? "bg-accent" : "bg-destructive/10")}>
                {message ? (
                  <MessageEditor value={message} readOnly className="font-medium" />
                ) : (
                  <span className="text-destructive">Message is required</span>
                )}
              </div>
            </div>

            {placeholder && (
              <div className="flex items-center justify-between text-sm text-muted-foreground pb-2 border-b border-dashed">
                <span className="font-medium text-sm">Placeholder:</span>
                <span className="text-xs">{placeholder}</span>
              </div>
            )}

            <div className="flex items-center justify-between text-sm pb-2 border-b border-dashed">
              <span className="text-muted-foreground text-sm">Variable:</span>
              <code className="rounded bg-muted px-2 py-0.5 text-xs font-mono">{variableName}</code>
            </div>

            <div className="flex flex-wrap gap-2">
              {required && (
                <span className="inline-flex items-center rounded-md bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive">
                  Required
                </span>
              )}
              {minLength !== undefined && (
                <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                  Min: {minLength}
                </span>
              )}
              {maxLength !== undefined && (
                <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                  Max: {maxLength}
                </span>
              )}
            </div>
          </div>
        </BaseNodeContent>

        {/* Input handle - where data flows into this node */}
        <BaseHandle type="target" position={Position.Left} />
        {/* Output handle - where data flows to the next node */}
        <BaseHandle type="source" position={Position.Right} />
      </BaseNode>
    </NodeStatusIndicator>
  )
})

export default TextInputNode
