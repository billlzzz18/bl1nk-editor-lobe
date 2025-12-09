"use client"

import { memo } from "react"
import { Position } from "@xyflow/react"
import type { StartNodeProps } from "@/types/node.types"
import { BaseNode, BaseNodeHeader, BaseNodeHeaderTitle, BaseNodeContent } from "@/components/flow/nodes/base-node"
import { BaseHandle } from "@/components/flow/handles/base-handle"
import { getNodeIcon } from "@/utils/node-utils"
import MessageEditor from "@/components/flow/nodes/properties/shared/message-editor"
import { useFlowStore } from "@/contexts/flow-context"
import { cn } from "@/lib/utils"
import { NodeStatusIndicator } from "@/components/ui/node-status-indicator"
import { useSimulationStore } from "@/contexts/simulation-context"

const StartNode = memo(function StartNode({ id, data, selected }: StartNodeProps) {
  const { message } = data
  const setActiveSidebarPanel = useFlowStore((state) => state.setSidebarActivePanel)
  const currentSimulationNode = useSimulationStore((state) => state.currentNodeId)
  const simulationStatus = useSimulationStore((state) => state.status)

  // Only show loading if simulation is running AND this is the current node
  const isActiveInSimulation = simulationStatus !== "idle" && currentSimulationNode === id

  const Icon = getNodeIcon("start")
  const nodeTitle = "Start"

  const handleDoubleClick = () => {
    setActiveSidebarPanel("node-properties")
  }

  return (
    <NodeStatusIndicator status={isActiveInSimulation ? "loading" : "initial"} variant="border">
      <BaseNode
        className="w-[300px] border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950"
        data-selected={selected}
        onDoubleClick={handleDoubleClick}
      >
        <BaseNodeHeader className="border-green-200 dark:border-green-800">
          <Icon className="size-4 text-green-600 dark:text-green-400" />
          <BaseNodeHeaderTitle className="text-green-800 dark:text-green-200">{nodeTitle}</BaseNodeHeaderTitle>
        </BaseNodeHeader>

        <BaseNodeContent>
          <div className="space-y-2">
            <div className="py-2 text-muted-foreground border-b border-dashed border-green-200 dark:border-green-800">
              <span className="font-medium text-sm">Welcome Message:</span>
              <div
                className={cn(
                  "py-1 px-2 rounded mt-1",
                  message ? "bg-green-100 dark:bg-green-900" : "bg-destructive/10",
                )}
              >
                {message ? (
                  <MessageEditor value={message} readOnly className="font-medium" />
                ) : (
                  <span className="text-destructive">Welcome message is required</span>
                )}
              </div>
            </div>
          </div>
        </BaseNodeContent>

        {/* Only output handle - start nodes don't have inputs */}
        <BaseHandle type="source" position={Position.Right} />
      </BaseNode>
    </NodeStatusIndicator>
  )
})

export default StartNode
