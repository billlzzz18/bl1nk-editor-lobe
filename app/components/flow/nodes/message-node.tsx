"use client"

import { memo } from "react"
import { Position } from "@xyflow/react"
import type { MessageNodeProps } from "@/types/node.types"
import { BaseNode, BaseNodeHeader, BaseNodeHeaderTitle, BaseNodeContent } from "@/components/flow/nodes/base-node"
import { BaseHandle } from "@/components/flow/handles/base-handle"
import { getNodeIcon } from "@/utils/node-utils"
import MessageEditor from "@/components/flow/nodes/properties/shared/message-editor"
import { useFlowStore } from "@/contexts/flow-context"
import { cn } from "@/lib/utils"
import { Clock } from "lucide-react"
import { NodeStatusIndicator } from "@/components/ui/node-status-indicator"
import { useSimulationStore } from "@/contexts/simulation-context"

const MessageNode = memo(function MessageNode({ id, data, selected }: MessageNodeProps) {
  const { message, delay } = data
  const setActiveSidebarPanel = useFlowStore((state) => state.setSidebarActivePanel)
  const currentSimulationNode = useSimulationStore((state) => state.currentNodeId)
  const simulationStatus = useSimulationStore((state) => state.status)

  // Only show loading if simulation is running AND this is the current node
  const isActiveInSimulation = simulationStatus !== "idle" && currentSimulationNode === id

  const Icon = getNodeIcon("message")
  const nodeTitle = "Message"

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

            {delay !== undefined && delay > 0 && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="size-3" />
                <span>Delay: {delay}ms</span>
              </div>
            )}
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

export default MessageNode
