"use client"

import { memo, useState } from "react"
import { ChevronDown, Save, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useFlowStore } from "@/contexts/flow-context"

interface FlowSwitcherProps {
  currentFlowName: string
  isSaving: boolean
  formattedLastSaved: string | null
}

const mockFlows = [
  { id: "1", name: "Sample Chat Flow" },
  { id: "2", name: "Customer Support Flow" },
  { id: "3", name: "Lead Generation Flow" },
  { id: "4", name: "Product Demo Flow" },
]

export const FlowSwitcher = memo(function FlowSwitcher({
  currentFlowName,
  isSaving,
  formattedLastSaved,
}: FlowSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false)
  const flowId = useFlowStore((state) => state.flowId)

  const handleFlowSelect = (selectedFlow: { id: string; name: string }) => {
    // In a real app, this would navigate to the selected flow
    console.log("Switching to flow:", selectedFlow)
    // For now, just reload the page with the new flow ID
    if (selectedFlow.id !== flowId) {
      window.location.href = `/flow/${selectedFlow.id}`
    }
    setIsOpen(false)
  }

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 px-2 gap-1">
            <span className="font-medium">{currentFlowName}</span>
            <ChevronDown className="size-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          {mockFlows.map((flow) => (
            <DropdownMenuItem
              key={flow.id}
              onClick={() => handleFlowSelect(flow)}
              className="flex items-center justify-between cursor-pointer"
            >
              <span>{flow.name}</span>
              {flow.id === flowId && <Check className="size-4" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        {isSaving ? (
          <div className="flex items-center gap-1">
            <Save className="size-3 animate-pulse" />
            <span>Saving...</span>
          </div>
        ) : formattedLastSaved ? (
          <span>Saved {formattedLastSaved}</span>
        ) : null}
      </div>
    </div>
  )
})
