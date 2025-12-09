"use client"

import { memo, useMemo } from "react"
import { useFlowStore } from "@/contexts/flow-context"
import { Badge } from "@/components/ui/badge"
import { Variable } from "lucide-react"
import type { TextInputNodeData } from "@/types/node.types"

const VariablesPanel = memo(function VariablesPanel() {
  const nodes = useFlowStore((state) => state.nodes)

  const variables = useMemo(() => {
    const vars: Array<{
      name: string
      nodeId: string
      nodeLabel: string
      required: boolean
    }> = []

    nodes.forEach((node) => {
      if (node.type === "textInput") {
        const data = node.data as TextInputNodeData
        if (data.variableName) {
          vars.push({
            name: data.variableName,
            nodeId: node.id,
            nodeLabel: data.label || `Text Input ${node.id.slice(-4)}`,
            required: data.required || false,
          })
        }
      }
    })

    return vars
  }, [nodes])

  if (variables.length === 0) {
    return (
      <div className="text-center py-8">
        <Variable className="size-12 mx-auto text-muted-foreground/50 mb-3" />
        <div className="text-sm text-muted-foreground">No variables defined yet</div>
        <div className="text-xs text-muted-foreground mt-1">Add Text Input nodes to create variables</div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">Variables collected from user inputs</div>

      <div className="space-y-3">
        {variables.map((variable) => (
          <div key={`${variable.nodeId}-${variable.name}`} className="p-3 border rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <code className="text-sm font-mono bg-muted px-2 py-1 rounded">{variable.name}</code>
              {variable.required && (
                <Badge variant="destructive" className="text-xs">
                  Required
                </Badge>
              )}
            </div>
            <div className="text-xs text-muted-foreground">From: {variable.nodeLabel}</div>
          </div>
        ))}
      </div>
    </div>
  )
})

export default VariablesPanel
